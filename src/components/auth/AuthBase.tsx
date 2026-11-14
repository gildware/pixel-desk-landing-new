import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import OtpVerification from './OtpVerification';
import PasswordLoginForm from './PasswordLoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import CheckEmailNotice from './CheckEmailNotice';
import {
  forgotPassword,
  getSession,
  loginWithPassword,
  logout,
  requestOtp,
  verifyOtp,
} from '../../lib/api/auth.api';
import { DASHBOARD_URL, SUPER_ADMIN_URL } from '../../lib/api/api.config';
import { dashboardRedirectUrl } from '../../lib/auth/dashboardRedirect';
import { isGlobalSuperAdminSession } from '../../lib/auth/superAdminSession';
import { getCsrfTokenFromCookie } from '../../lib/csrf';

type AuthStep = 'email' | 'password' | 'otp' | 'forgot' | 'check-email';

type AuthSuccessResponse = {
  data?: { csrfToken?: string };
};

interface AuthBaseProps {
  supportUrl?: string;
}

export default function AuthBase({
  supportUrl = '/resources/knowledge-base',
}: AuthBaseProps) {
  const [session, setSession] = useState<unknown | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState<string | null>(null);
  const [requireConsent, setRequireConsent] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const forceLogout = params.get('logout') === '1';

      if (forceLogout) {
        try {
          await logout();
        } catch {
          /* ignore */
        }
        params.delete('logout');
        const next = params.toString();
        const cleanUrl = `${window.location.pathname}${next ? `?${next}` : ''}${window.location.hash}`;
        window.history.replaceState({}, '', cleanUrl);
        if (!cancelled) {
          setSession(null);
          setSessionLoading(false);
        }
        return;
      }

      try {
        const data = await getSession();
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setSessionLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (sessionLoading || !session) return;
    if (isGlobalSuperAdminSession(session)) return;
    window.location.replace(
      dashboardRedirectUrl(DASHBOARD_URL, {
        csrfToken: getCsrfTokenFromCookie(),
      }),
    );
  }, [session, sessionLoading]);

  const redirectAfterLogin = (result: AuthSuccessResponse) => {
    if (isGlobalSuperAdminSession(result)) {
      setSession(result);
      setError(
        'You are logged in as a super admin and cannot log in to the company dashboard.',
      );
      return;
    }
    const csrfToken =
      result?.data?.csrfToken || getCsrfTokenFromCookie() || undefined;
    window.location.replace(
      dashboardRedirectUrl(DASHBOARD_URL, { csrfToken }),
    );
  };

  const resetToEmail = () => {
    setStep('email');
    setEmail(null);
    setRequireConsent(true);
    setError(undefined);
  };

  const handlePasswordChoice = (value: string, rememberChoice: boolean) => {
    setError(undefined);
    setEmail(value);
    setRememberMe(rememberChoice);
    setStep('password');
  };

  const isOtpAlreadySentError = (message: string) =>
    /please wait .* before requesting a new otp/i.test(message) ||
    /too many resend attempts/i.test(message);

  const handleRequestOtp = async (value: string, rememberChoice: boolean) => {
    try {
      setLoading(true);
      setError(undefined);
      const result = (await requestOtp(value)) as {
        data?: { requiresConsent?: boolean };
        requiresConsent?: boolean;
      };
      const needsConsent =
        result?.data?.requiresConsent ?? result?.requiresConsent;
      setRequireConsent(needsConsent !== false);
      setEmail(value);
      setRememberMe(rememberChoice);
      setStep('otp');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      // Cooldown / resend-block means a code was already issued — still show OTP entry.
      if (isOtpAlreadySentError(message)) {
        setEmail(value);
        setRememberMe(rememberChoice);
        setError(message);
        setStep('otp');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  /** From password screen: always open OTP UI, then try to send/resend. */
  const handleSwitchToOtp = async (rememberChoice: boolean) => {
    if (!email) return;
    setRememberMe(rememberChoice);
    setError(undefined);
    setStep('otp');
    try {
      // Do not toggle shared `loading` — that labels the verify button "Verifying…".
      const result = (await requestOtp(email)) as {
        data?: { requiresConsent?: boolean };
        requiresConsent?: boolean;
      };
      const needsConsent =
        result?.data?.requiresConsent ?? result?.requiresConsent;
      setRequireConsent(needsConsent !== false);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong';
      // Keep OTP screen; show wait/resend message if a code was already sent.
      setError(message);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    try {
      await requestOtp(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!email) return;
    try {
      setLoading(true);
      setError(undefined);
      const result = (await verifyOtp(
        email,
        otp,
        rememberMe,
      )) as AuthSuccessResponse;
      redirectAfterLogin(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (
    password: string,
    rememberChoice: boolean,
  ) => {
    if (!email) return;
    try {
      setLoading(true);
      setError(undefined);
      setRememberMe(rememberChoice);
      const result = (await loginWithPassword(
        email,
        password,
        rememberChoice,
      )) as AuthSuccessResponse;
      redirectAfterLogin(result);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (value: string) => {
    try {
      setLoading(true);
      setError(undefined);
      await forgotPassword(value);
      setEmail(value);
      setStep('check-email');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      window.location.href = '/login';
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

  if (sessionLoading) {
    return <p className="auth-sso-note">Checking session…</p>;
  }

  if (session) {
    if (isGlobalSuperAdminSession(session)) {
      return (
        <div className="auth-status">
          <p className="auth-blocked-title">Super admin account</p>
          <p className="auth-blocked-message">
            You are logged in as a super admin and cannot log in to the company
            dashboard. Sign out first if you need to use a company account.
          </p>
          <div className="auth-blocked-actions">
            <button
              type="button"
              onClick={() => {
                window.location.assign(SUPER_ADMIN_URL);
              }}
              className="auth-btn-primary"
            >
              Go to Super Admin
            </button>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="auth-btn-secondary"
            >
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="auth-status">
        <p className="auth-support">Redirecting to dashboard…</p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="auth-btn-primary"
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    );
  }

  if (step === 'forgot') {
    return (
      <ForgotPasswordForm
        initialEmail={email || ''}
        onSubmit={handleForgotSubmit}
        onBack={() => {
          setError(undefined);
          setStep(email ? 'password' : 'email');
        }}
        loading={loading}
        error={error}
      />
    );
  }

  if (step === 'check-email' && email) {
    return (
      <CheckEmailNotice
        email={email}
        loading={loading}
        error={error}
        onResend={() => handleForgotSubmit(email)}
        onBack={resetToEmail}
      />
    );
  }

  if (step === 'password' && email) {
    return (
      <PasswordLoginForm
        email={email}
        initialRememberMe={rememberMe}
        loading={loading}
        error={error}
        onSubmit={handlePasswordLogin}
        onForgotPassword={() => {
          setError(undefined);
          setStep('forgot');
        }}
        onUseOtp={(rememberChoice) => handleSwitchToOtp(rememberChoice)}
        onChangeEmail={resetToEmail}
      />
    );
  }

  if (step === 'otp' && email) {
    return (
      <OtpVerification
        email={email}
        onVerify={handleVerifyOtp}
        onResendOtp={handleResendOtp}
        onChangeEmail={resetToEmail}
        loading={loading}
        error={error}
        requireConsent={requireConsent}
      />
    );
  }

  return (
    <LoginForm
      onPassword={handlePasswordChoice}
      onOtp={handleRequestOtp}
      loading={loading}
      error={error}
      supportUrl={supportUrl}
    />
  );
}
