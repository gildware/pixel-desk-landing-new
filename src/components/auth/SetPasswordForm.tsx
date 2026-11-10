import { useMemo, useState, type FormEvent } from 'react';
import {
  getPasswordRequirementStatus,
  isPasswordPolicySatisfied,
  PASSWORD_REQUIREMENT_LABELS,
  type PasswordRequirementKey,
} from '../../lib/auth/passwordPolicy';

interface SetPasswordFormProps {
  email: string;
  onSubmit: (
    password: string,
    confirmPassword: string,
    rememberMe: boolean,
  ) => Promise<void> | void;
  loading: boolean;
  error?: string;
}

const REQUIREMENT_ORDER: PasswordRequirementKey[] = [
  'minLength',
  'uppercase',
  'lowercase',
  'digit',
  'special',
];

export default function SetPasswordForm({
  email,
  onSubmit,
  loading,
  error,
}: SetPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const requirements = useMemo(
    () => getPasswordRequirementStatus(password),
    [password],
  );
  const policyOk = isPasswordPolicySatisfied(password);
  const passwordsMatch = password === confirmPassword;
  const canSubmit = policyOk && passwordsMatch && confirmPassword.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    await onSubmit(password, confirmPassword, rememberMe);
  };

  return (
    <div>
      <div className="auth-heading">
        <h1 className="auth-title">Set your password</h1>
        <p className="auth-subtitle">Choose a password for {email}</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="new-password" className="auth-label">
            New password
          </label>
          <div className="auth-input-wrap">
            <input
              id="new-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
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
        </div>

        <div className="auth-field">
          <label htmlFor="confirm-password" className="auth-label">
            Confirm password
          </label>
          <input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`auth-input${touched && !passwordsMatch ? ' auth-input--error' : ''}`}
          />
          {touched && !passwordsMatch && (
            <p className="auth-error">Passwords do not match</p>
          )}
        </div>

        <ul className="auth-password-checklist">
          {REQUIREMENT_ORDER.map((key) => (
            <li
              key={key}
              className={
                requirements[key]
                  ? 'auth-password-checklist__item is-met'
                  : 'auth-password-checklist__item'
              }
            >
              {PASSWORD_REQUIREMENT_LABELS[key]}
            </li>
          ))}
        </ul>

        {error && <p className="auth-error">{error}</p>}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="auth-btn-primary"
        >
          {loading ? 'Saving…' : 'Save password'}
        </button>

        <div className="auth-row">
          <label htmlFor="rememberMeSet" className="auth-remember">
            <input
              id="rememberMeSet"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
            />
            Remember Me
          </label>
        </div>
      </form>
    </div>
  );
}
