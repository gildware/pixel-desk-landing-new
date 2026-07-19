import { useEffect, useState, type ClipboardEvent, type KeyboardEvent } from 'react';

const RESEND_COOLDOWN_SECONDS = 60;

interface OtpVerificationProps {
  email: string;
  onVerify?: (otp: string) => Promise<void> | void;
  onResendOtp?: () => Promise<void> | void;
  onChangeEmail?: () => void;
  loading: boolean;
  error?: string;
}

export default function OtpVerification({
  email,
  onVerify,
  onResendOtp,
  onChangeEmail,
  loading,
  error,
}: OtpVerificationProps) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [agreeOffers, setAgreeOffers] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resendLoading || !onResendOtp) return;
    try {
      setResendLoading(true);
      await onResendOtp();
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setResendLoading(false);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    if (!pasted) return;

    const digits = pasted.replace(/\D/g, '').slice(0, otp.length);
    if (!digits) return;

    const nextOtp = [...otp];
    for (let i = 0; i < digits.length && index + i < nextOtp.length; i++) {
      nextOtp[index + i] = digits[i];
    }
    setOtp(nextOtp);

    const filledUntil = Math.min(index + digits.length - 1, nextOtp.length - 1);
    const nextIndex =
      filledUntil < nextOtp.length - 1 ? filledUntil + 1 : filledUntil;
    document.getElementById(`otp-${nextIndex}`)?.focus();
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const otpValue = otp.join('');
  const isOtpComplete = otp.every((d) => d.length === 1);
  const canSubmit = isOtpComplete && agreeOffers && agreeTerms && !loading;

  const submitOtp = async () => {
    if (!canSubmit) return;
    await onVerify?.(otpValue);
  };

  return (
    <div className="flex flex-col items-stretch text-left">
      <div className="mb-8 text-center sm:mb-10">
        <h1 className="text-[2rem] font-light leading-tight tracking-tight text-[#3D3D3D] sm:text-[2.5rem]">
          Check your inbox
        </h1>
        <p className="mt-2 text-lg font-semibold text-purple sm:text-xl">
          Enter the login code
        </p>
        <p className="mt-3 text-sm text-[#666666]">
          We sent a code to <span className="font-medium text-[#333333]">{email}</span>
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <label className="mb-3 block text-center text-sm text-[#666666]">
            Login code
          </label>
          <div className="flex justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                value={digit}
                maxLength={1}
                inputMode="numeric"
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                className={`mx-1 h-12 w-10 rounded-lg border text-center text-lg text-[#222] outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/15 sm:mx-1.5 sm:w-11 md:h-14 md:w-12 md:text-xl ${
                  error ? 'border-red-500' : 'border-[#D6D6D6]'
                }`}
              />
            ))}
          </div>
          {error && (
            <p className="mt-2 text-center text-xs text-red-600">{error}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="inline-flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={agreeOffers}
              onChange={(e) => setAgreeOffers(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#C8C8C8] text-purple focus:ring-purple/30"
            />
            <span className="text-xs leading-snug text-[#666666] sm:text-sm">
              I agree to receive offers, tips and product updates sent by
              Pixeldesk. Unsubscribe anytime.
            </span>
          </label>

          <label className="inline-flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#C8C8C8] text-purple focus:ring-purple/30"
            />
            <span className="text-xs leading-snug text-[#666666] sm:text-sm">
              I agree to Pixeldesk&apos;s Terms of Service &amp; Privacy Policy.
            </span>
          </label>
        </div>

        <button
          type="button"
          onClick={submitOtp}
          disabled={!canSubmit}
          className="h-12 w-full rounded-lg bg-purple text-base font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-purple-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Verify OTP'}
        </button>

        <div className="text-center text-sm text-[#666666]">
          {onResendOtp && (
            <p>
              {resendCooldown > 0 ? (
                <>
                  Resend code in{' '}
                  <span className="font-medium text-purple">
                    00:{String(resendCooldown).padStart(2, '0')}s
                  </span>
                </>
              ) : (
                <>
                  Didn&apos;t get the code?{' '}
                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendOtp}
                    className="font-medium text-purple underline underline-offset-2 disabled:opacity-50"
                  >
                    {resendLoading ? 'Sending…' : 'Resend OTP'}
                  </button>
                </>
              )}
            </p>
          )}

          {onChangeEmail && (
            <button
              type="button"
              onClick={onChangeEmail}
              className="mt-4 inline-block text-sm text-[#888] underline underline-offset-2 transition-colors hover:text-purple"
            >
              Use a different email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
