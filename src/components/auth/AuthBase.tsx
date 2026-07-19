import { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import OtpVerification from './OtpVerification';
import { getSession, logout, requestOtp, verifyOtp } from '../../lib/api/auth.api';
import { DASHBOARD_URL } from '../../lib/api/api.config';
import { dashboardRedirectUrl } from '../../lib/auth/dashboardRedirect';

interface AuthBaseProps {
  supportUrl?: string;
}

/**
 * Same login flow as pixel-desk-web AuthBase:
 * session check → request OTP → verify OTP → hard redirect to dashboard.
 * UI uses the pixel-desk-landing auth shell styles.
 */
export default function AuthBase({
  supportUrl = '/resources/knowledge-base',
}: AuthBaseProps) {
  const [session, setSession] = useState<unknown | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getSession();
        if (!cancelled) setSession(data);
      } catch {
        // Mirror pixel-desk-web: auth failures → no session.
        // Also treat proxy/API downtime as logged-out so the form can render.
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
    if (!sessionLoading && session) {
      window.location.replace(dashboardRedirectUrl(DASHBOARD_URL));
    }
  }, [session, sessionLoading]);

  const handleRequestOtp = async (value: string, rememberChoice: boolean) => {
    try {
      setLoading(true);
      setError(undefined);
      await requestOtp(value);
      setEmail(value);
      setRememberMe(rememberChoice);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
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
      await verifyOtp(email, otp, rememberMe);
      // cookies are set by backend; hard-navigate into dashboard
      window.location.replace(dashboardRedirectUrl(DASHBOARD_URL));
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
    return (
      <p className="text-center text-sm text-[#666666]">Checking session…</p>
    );
  }

  if (session) {
    return (
      <div className="text-center">
        <p className="text-sm text-[#666666]">Redirecting to dashboard…</p>
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-lg border border-[#D6D6D6] px-4 text-sm font-medium text-[#333] transition-colors hover:bg-[#FAFAFA] disabled:opacity-50"
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    );
  }

  if (!email) {
    return (
      <LoginForm
        onContinue={handleRequestOtp}
        loading={loading}
        error={error}
        supportUrl={supportUrl}
      />
    );
  }

  return (
    <OtpVerification
      email={email}
      onVerify={handleVerifyOtp}
      onResendOtp={handleResendOtp}
      onChangeEmail={() => {
        setEmail(null);
        setError(undefined);
      }}
      loading={loading}
      error={error}
    />
  );
}
