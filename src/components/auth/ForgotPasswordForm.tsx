import { useState, type FormEvent } from 'react';

interface ForgotPasswordFormProps {
  initialEmail?: string;
  onSubmit: (email: string) => Promise<void> | void;
  onBack: () => void;
  loading: boolean;
  error?: string;
}

export default function ForgotPasswordForm({
  initialEmail = '',
  onSubmit,
  onBack,
  loading,
  error,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [touched, setTouched] = useState(false);

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showEmailError = touched && !isValidEmail;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail) return;
    await onSubmit(email.trim().toLowerCase());
  };

  return (
    <div>
      <div className="auth-heading">
        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-subtitle">
          We&apos;ll email you a link to set a new password
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="auth-field">
          <label htmlFor="forgot-email" className="auth-label">
            Your email address
          </label>
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            className={`auth-input${showEmailError || error ? ' auth-input--error' : ''}`}
          />
          {showEmailError && (
            <p className="auth-error">Please enter a valid email address</p>
          )}
          {error && !showEmailError && <p className="auth-error">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValidEmail || loading}
          className="auth-btn-primary"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>

        <button
          type="button"
          className="auth-text-link auth-text-link--center"
          onClick={onBack}
          disabled={loading}
        >
          Back to sign in
        </button>
      </form>
    </div>
  );
}
