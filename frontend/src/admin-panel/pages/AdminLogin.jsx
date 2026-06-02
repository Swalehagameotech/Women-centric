import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { getApiBaseUrl } from '../../config/env';
import { useAuth } from '../../context/AuthContext';
import { clearAuth, saveAuth } from '../../utils/auth';

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loggedIn, user, refreshUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (loggedIn && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${getApiBaseUrl()}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || 'Admin login failed');
      }

      if (result?.data?.role !== 'admin') {
        clearAuth();
        throw new Error('This account is not an admin account.');
      }

      saveAuth(result.token, result.data);
      await refreshUser();

      const destination = location.state?.from?.pathname || '/admin';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  const denyMessage =
    location.state?.reason === 'not-admin'
      ? 'Only admin users can access the admin panel.'
      : '';

  return (
    <div className="min-h-screen bg-[#f3eef1] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-primary/10 bg-white p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Admin Panel</p>
        <h1 className="mt-2 font-serif text-3xl text-[#1f1419]">Admin Login</h1>
        <p className="mt-2 text-sm text-black/65">Sign in with an admin account to continue.</p>

        {(denyMessage || error) && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error || denyMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-black">Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, email: e.target.value }));
                setError('');
              }}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="admin@email.com"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-black">Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, password: e.target.value }));
                setError('');
              }}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Your password"
            />
          </label>

          <button type="submit" disabled={loading} className="btn-solid w-full disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in to Admin'}
          </button>
        </form>

        <Link to="/" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}

export default AdminLogin;
