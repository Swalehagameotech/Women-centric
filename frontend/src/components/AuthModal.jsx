import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../config/env';
import { saveAuth } from '../utils/auth';

const validateNameClient = (name) => {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  const words = trimmed.split(' ').filter(Boolean);

  if (words.length < 1 || words.length > 3) {
    return 'Name must be 1 to 3 words only';
  }

  for (const word of words) {
    if (word.length < 3) {
      return 'Each word must have at least 3 letters';
    }
    if (word.length > 30) {
      return 'Each word can have at most 30 letters';
    }
    if (!/^[a-zA-Z]+$/.test(word)) {
      return 'Name can only contain letters';
    }
  }

  return null;
};

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      saveAuth(result.token, result.data);
      onSuccess(result.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const nameError = validateNameClient(signupForm.name);
    if (nameError) {
      setError(nameError);
      setLoading(false);
      return;
    }

    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Signup failed');
      }

      saveAuth(result.token, result.data);
      onSuccess(result.data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative z-10 w-full max-w-sm rounded-2xl border border-primary/15 bg-white p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-black/60 transition hover:bg-black/5 hover:text-black"
          aria-label="Close dialog"
        >
          <CloseIcon />
        </button>

        {mode === 'login' && (
          <div className="text-center pr-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Welcome back</p>
            <h2 id="auth-modal-title" className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
              Sign in
            </h2>
            <p className="mt-1 text-sm text-black/70">Access your Style By Her account</p>
          </div>
        )}

        <div className="mt-6 flex rounded-full border border-primary/20 bg-black/[0.03] p-1">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              mode === 'login' ? 'bg-primary text-white' : 'text-black/70 hover:text-black'
            }`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition ${
              mode === 'signup' ? 'bg-primary text-white' : 'text-black/70 hover:text-black'
            }`}
          >
            Sign up
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="mt-5">
            <label className="block text-sm">
              <span className="font-medium text-black">Email</span>
              <input
                type="email"
                name="email"
                required
                value={loginForm.email}
                onChange={(e) => {
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }));
                  setError('');
                }}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@email.com"
              />
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-medium text-black">Password</span>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={loginForm.password}
                onChange={(e) => {
                  setLoginForm((prev) => ({ ...prev, password: e.target.value }));
                  setError('');
                }}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your password"
              />
            </label>

            <button type="submit" disabled={loading} className="btn-solid mt-6 w-full disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="mt-5">
            <label className="block text-sm">
              <span className="font-medium text-black">Full name</span>
              <input
                type="text"
                name="name"
                required
                value={signupForm.name}
                onChange={(e) => {
                  setSignupForm((prev) => ({ ...prev, name: e.target.value }));
                  setError('');
                }}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="e.g. Priya Sharma"
              />
            </label>

            <label className="mt-4 block text-sm">
              <span className="font-medium text-black">Email</span>
              <input
                type="email"
                name="email"
                required
                value={signupForm.email}
                onChange={(e) => {
                  setSignupForm((prev) => ({ ...prev, email: e.target.value }));
                  setError('');
                }}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@email.com"
              />
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="font-medium text-black">Password</span>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={signupForm.password}
                  onChange={(e) => {
                    setSignupForm((prev) => ({ ...prev, password: e.target.value }));
                    setError('');
                  }}
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Min. 6 characters"
                />
              </label>

              <label className="block text-sm">
                <span className="font-medium text-black">Confirm password</span>
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  minLength={6}
                  value={signupForm.confirmPassword}
                  onChange={(e) => {
                    setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }));
                    setError('');
                  }}
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="Repeat password"
                />
              </label>
            </div>

            <button type="submit" disabled={loading} className="btn-solid mt-6 w-full disabled:opacity-60">
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
