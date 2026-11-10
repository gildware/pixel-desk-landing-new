interface CheckEmailNoticeProps {
  email: string;
  onResend: () => Promise<void> | void;
  onBack: () => void;
  loading: boolean;
  error?: string;
}

export default function CheckEmailNotice({
  email,
  onResend,
  onBack,
  loading,
  error,
}: CheckEmailNoticeProps) {
  return (
    <div>
      <div className="auth-heading">
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-subtitle">
          We sent a password reset link to {email}
        </p>
      </div>

      <p className="auth-sso-note">
        Open the link in that email to set your password. It expires in 1 hour.
      </p>

      {error && <p className="auth-error">{error}</p>}

      <button
        type="button"
        className="auth-btn-primary"
        onClick={onResend}
        disabled={loading}
      >
        {loading ? 'Sending…' : 'Resend link'}
      </button>

      <button
        type="button"
        className="auth-text-link auth-text-link--center"
        onClick={onBack}
        disabled={loading}
      >
        Back to sign in
      </button>
    </div>
  );
}
