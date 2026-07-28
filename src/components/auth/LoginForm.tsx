import { useState, type FormEvent } from 'react';

interface LoginFormProps {
  onContinue: (email: string, rememberMe: boolean) => Promise<void> | void;
  loading: boolean;
  error?: string;
  supportUrl?: string;
}

function GoogleIcon() {
  return (
    <svg
      width="18.34"
      height="18.72"
      viewBox="0 0 23 23"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M21.5642 11.7235C21.5642 10.8961 21.4957 10.2924 21.3474 9.66626H11.707V13.4005H17.3657C17.2517 14.3285 16.6356 15.7261 15.2665 16.6652L15.2473 16.7902L18.2954 19.1044L18.5066 19.125C20.4461 17.3696 21.5642 14.7869 21.5642 11.7235"
        fill="#4285F4"
      />
      <path
        d="M11.7039 21.5625C14.4761 21.5625 16.8035 20.668 18.5034 19.1251L15.2633 16.6653C14.3963 17.2579 13.2326 17.6716 11.7039 17.6716C8.98861 17.6716 6.68407 15.9163 5.86257 13.4901L5.74215 13.5001L2.5727 15.9039L2.53125 16.0168C4.21972 19.3039 7.68797 21.5625 11.7039 21.5625Z"
        fill="#34A853"
      />
      <path
        d="M5.86404 13.4901C5.64728 12.864 5.52183 12.1931 5.52183 11.5C5.52183 10.8067 5.64728 10.1359 5.85263 9.50984L5.84689 9.37649L2.63771 6.93405L2.53271 6.983C1.83681 8.34704 1.4375 9.87881 1.4375 11.5C1.4375 13.1212 1.83681 14.6528 2.53271 16.0169L5.86404 13.4901"
        fill="#FBBC05"
      />
      <path
        d="M11.7039 5.32831C13.632 5.32831 14.9325 6.14448 15.6741 6.82654L18.5719 4.05375C16.7922 2.43257 14.4762 1.4375 11.7039 1.4375C7.688 1.4375 4.21973 3.69595 2.53125 6.98301L5.85118 9.50985C6.6841 7.08367 8.98865 5.32831 11.7039 5.32831"
        fill="#EB4335"
      />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="84" height="18" viewBox="0 0 84 18" fill="none" aria-hidden>
      <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022" />
      <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00" />
      <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF" />
      <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900" />
      <text
        x="22"
        y="13.5"
        fill="#737373"
        fontFamily="Segoe UI, sans-serif"
        fontSize="13"
        fontWeight="300"
      >
        Microsoft
      </text>
    </svg>
  );
}

export default function LoginForm({
  onContinue,
  loading,
  error,
  supportUrl = '/resources/knowledge-base',
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [touched, setTouched] = useState(false);
  const [ssoMessage, setSsoMessage] = useState<string | null>(null);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = touched && !isValidEmail;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail) return;
    await onContinue(email.trim().toLowerCase(), rememberMe);
  };

  return (
    <div>
      <div className="auth-heading">
        <h1 className="auth-title">Welcome!</h1>
        <p className="auth-subtitle">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">
            Your email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            required
            className={`auth-input${showEmailError || error ? ' auth-input--error' : ''}`}
          />
          {showEmailError && (
            <p className="auth-error">Please enter a valid email address</p>
          )}
          {error && !showEmailError && <p className="auth-error">{error}</p>}
        </div>

        <button type="submit" disabled={!isValidEmail || loading} className="auth-btn-primary">
          {loading ? 'Sending…' : 'Send login code'}
        </button>

        <div className="auth-row">
          <label htmlFor="rememberMe" className="auth-remember">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
            />
            Remember Me
          </label>

          <p className="auth-support">
            Can&apos;t log in?{' '}
            <a href={supportUrl}>Visit our Support Page</a>
          </p>
        </div>
      </form>

      <div className="auth-divider">
        <span>Or Sign in with</span>
      </div>

      <div className="auth-sso-row">
        <button
          type="button"
          onClick={() => setSsoMessage('Google sign-in — coming soon')}
          className="auth-sso-btn"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => setSsoMessage('Microsoft sign-in — coming soon')}
          className="auth-sso-btn auth-sso-btn--logo-only"
          aria-label="Sign in with Microsoft"
        >
          <MicrosoftIcon />
        </button>
      </div>

      {ssoMessage && <p className="auth-sso-note">{ssoMessage}</p>}
    </div>
  );
}
