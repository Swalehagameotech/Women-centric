import { useEffect, useState } from 'react';
import { authFetch } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { updateStoredUser } from '../../utils/auth';
import AdminPageShell from '../components/AdminPageShell';

const inputClass =
  'mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20';

function AdminAccountSettings() {
  const { user, setUser, refreshUser } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
  });
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      currentPassword: '',
      newPassword: '',
    }));
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const profileResult = await authFetch('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });
      setUser(profileResult.data);
      updateStoredUser(profileResult.data);
      await refreshUser();

      if (changePassword) {
        if (form.newPassword.length < 6) {
          throw new Error('New password must be at least 6 characters');
        }
        if (!form.currentPassword) {
          throw new Error('Current password is required');
        }
        await authFetch('/api/auth/password', {
          method: 'PATCH',
          body: JSON.stringify({
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
          }),
        });
      }

      setForm((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
      }));
      setMessage(changePassword ? 'Profile and password updated successfully.' : 'Profile updated successfully.');
    } catch (err) {
      setError(err.message || 'Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageShell title="Admin Account Settings" description="Manage your admin profile and password">
      <section className="rounded-xl border border-black/10 bg-white p-5">
        {message && (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>
        )}
        {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm">
            <span className="font-medium text-black">Admin Name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-black">Admin Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className={inputClass}
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-black">Password</span>
            <input type="text" value="********" readOnly className={inputClass} />
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-medium text-black">
            <input
              type="checkbox"
              checked={changePassword}
              onChange={(e) => {
                const checked = e.target.checked;
                setChangePassword(checked);
                if (!checked) {
                  setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
                }
              }}
              className="h-4 w-4 rounded border-black/20 text-primary focus:ring-primary"
            />
            Change Password
          </label>

          {changePassword && (
            <div className="space-y-4 rounded-lg border border-black/10 bg-stone-50 p-4">
              <label className="block text-sm">
                <span className="font-medium text-black">Old password</span>
                <input
                  type="password"
                  required={changePassword}
                  value={form.currentPassword}
                  onChange={(e) => setForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                  className={inputClass}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-black">New password</span>
                <input
                  type="password"
                  required={changePassword}
                  minLength={6}
                  value={form.newPassword}
                  onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                  className={inputClass}
                />
              </label>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-solid disabled:opacity-60">
            {loading ? 'Updating…' : 'Save Changes'}
          </button>
        </form>
      </section>
    </AdminPageShell>
  );
}

export default AdminAccountSettings;
