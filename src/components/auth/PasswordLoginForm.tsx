import { useState, type FormEvent } from 'react';

interface PasswordLoginFormProps {
  email: string;
  initialRememberMe?: boolean;
  onSubmit: (password: string, rememberMe: boolean) => Promise<void> | void;
  onForgotPassword: () => void;
  onUseOtp: () => Promise<void> | void;
  onChangeEmail: () => void;
  loading: boolean;
  error?: string;
}

export default function PasswordLoginForm({
  email,
  initialRememberMe = false,
  onSubmit,
  onForgotPassword,
  onUseOtp,
  onChangeEmail,
  loading,
  error,
}: PasswordLoginFormProps) {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(initialRememberMe);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;
    await onSubmit(password, rememberMe);
  };

  return (
    <div>
      <div className="auth-heading">
        <h1 className="auth-title">Welcome!</h1>
        <p className="auth-subtitle">Sign in with password</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="email" className="auth-label">
            Your email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="auth-input"
          />
          <button
            type="button"
            className="auth-text-link"
            onClick={onChangeEmail}
          >
            Use a different email
          </button>
        </div>

        <div className="auth-field">
          <label htmlFor="password" className="auth-label">
            Password
          </label>
          <div className="auth-input-wrap">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`auth-input${error ? ' auth-input--error' : ''}`}
            />
            <button
              type="button"
              className="auth-input-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="auth-field-meta">
            <button
              type="button"
              className="auth-text-link"
              onClick={onForgotPassword}
            >
              Forgot password?
            </button>
          </div>
          {error && <p className="auth-error">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={!password || loading}
          className="auth-btn-primary"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="auth-row">
          <label htmlFor="rememberMePassword" className="auth-remember">
            <input
              id="rememberMePassword"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
            />
            Remember Me
          </label>
        </div>

        <button
          type="button"
          className="auth-text-link auth-text-link--center"
          onClick={onUseOtp}
          disabled={loading}
        >
          Use a one-time code instead
        </button>
      </form>
    </div>
  );
}
