import { useEffect, useState } from 'react';
import SetPasswordForm from './SetPasswordForm';
import {
  resetPassword,
  validateResetToken,
} from '../../lib/api/auth.api';
import { DASHBOARD_URL, SUPER_ADMIN_URL } from '../../lib/api/api.config';
import { dashboardRedirectUrl } from '../../lib/auth/dashboardRedirect';
import { isGlobalSuperAdminSession } from '../../lib/auth/superAdminSession';
import { getCsrfTokenFromCookie } from '../../lib/csrf';

type AuthSuccessResponse = {
  data?: { csrfToken?: string };
};

export default function SetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const rawToken = params.get('token');
      if (!rawToken) {
        if (!cancelled) {
          setError('This reset link is missing a token.');
          setBootstrapping(false);
        }
        return;
      }

      try {
        const result = (await validateResetToken(rawToken)) as {
          data?: { email?: string };
          email?: string;
        };
        const resolvedEmail = result?.data?.email ?? result?.email;
        if (!resolvedEmail) {
          throw new Error('Invalid or expired reset link.');
        }
        if (!cancelled) {
          setToken(rawToken);
          setEmail(resolvedEmail);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Invalid or expired reset link.',
          );
        }
      } finally {
        if (!cancelled) setBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (
    password: string,
    confirmPassword: string,
    rememberMe: boolean,
  ) => {
    if (!token) return;
    try {
      setLoading(true);
      setError(undefined);
      const result = (await resetPassword(
        token,
        password,
        confirmPassword,
        rememberMe,
      )) as AuthSuccessResponse;

      if (isGlobalSuperAdminSession(result)) {
        window.location.replace(SUPER_ADMIN_URL);
        return;
      }

      const csrfToken =
        result?.data?.csrfToken || getCsrfTokenFromCookie() || undefined;
      window.location.replace(
        dashboardRedirectUrl(DASHBOARD_URL, { csrfToken }),
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save password');
    } finally {
      setLoading(false);
    }
  };

  if (bootstrapping) {
    return <p className="auth-sso-note">Checking reset link…</p>;
  }

  if (!token || !email) {
    return (
      <div className="auth-status">
        <p className="auth-blocked-title">Link unavailable</p>
        <p className="auth-blocked-message">
          {error || 'This password reset link is invalid or has expired.'}
        </p>
        <div className="auth-blocked-actions">
          <a href="/login" className="auth-btn-primary">
            Back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <SetPasswordForm
      email={email}
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
