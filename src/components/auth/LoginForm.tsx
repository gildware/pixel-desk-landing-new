import { useState, type FormEvent } from 'react';

interface LoginFormProps {
  onContinue: (email: string, rememberMe: boolean) => Promise<void> | void;
  loading: boolean;
  error?: string;
  supportUrl?: string;
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 23 23" fill="none" aria-hidden>
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
    <svg width="18" height="18" viewBox="0 0 21 21" fill="none" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#F25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
      <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
      <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
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
    <div className="flex flex-col items-stretch text-left">
      <div className="mb-8 text-center sm:mb-10">
        <h1 className="text-[2rem] font-light leading-tight tracking-tight text-[#3D3D3D] sm:text-[2.5rem]">
          Welcome!
        </h1>
        <p className="mt-1 text-lg font-semibold text-purple sm:text-xl">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-[#666666]">
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
            className={`h-12 w-full rounded-lg border bg-white px-4 text-sm text-[#222] outline-none transition-colors placeholder:text-[#A0A0A0] focus:border-purple focus:ring-2 focus:ring-purple/15 ${
              showEmailError || error ? 'border-red-500' : 'border-[#D6D6D6]'
            }`}
          />
          {showEmailError && (
            <p className="mt-1.5 text-xs text-red-600">
              Please enter a valid email address
            </p>
          )}
          {error && (
            <p className="mt-1.5 text-xs text-red-600">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isValidEmail || loading}
          className="h-12 w-full rounded-lg bg-purple text-base font-semibold tracking-wide text-white shadow-sm transition-colors hover:bg-purple-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send login code'}
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="rememberMe"
            className="inline-flex cursor-pointer select-none items-center gap-2"
          >
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-[#C8C8C8] text-purple focus:ring-purple/30"
            />
            <span className="text-sm text-[#666666]">Remember Me</span>
          </label>

          <p className="text-xs text-[#666666] sm:text-sm">
            Can&apos;t log in?{' '}
            <a
              href={supportUrl}
              className="underline underline-offset-2 transition-colors hover:text-purple"
            >
              Visit our Support Page
            </a>
          </p>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-[#E6E6E6]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-[#888888]">Or Sign in with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setSsoMessage('Google sign-in — coming soon')}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-[#D6D6D6] bg-white text-sm font-medium text-[#333333] transition-colors hover:bg-[#FAFAFA]"
        >
          <GoogleIcon />
          Google
        </button>
        <button
          type="button"
          onClick={() => setSsoMessage('Microsoft sign-in — coming soon')}
          className="inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-[#D6D6D6] bg-white text-sm font-medium text-[#333333] transition-colors hover:bg-[#FAFAFA]"
        >
          <MicrosoftIcon />
          Microsoft
        </button>
      </div>

      {ssoMessage && (
        <p className="mt-3 text-center text-xs text-[#666666]">{ssoMessage}</p>
      )}
    </div>
  );
}
