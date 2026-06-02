import { useEffect, useState } from 'react';
import AdminPageShell from '../components/AdminPageShell';
import AdminTable from '../components/AdminTable';
import { fetchAdminUsers, updateAdminUserPassword } from '../utils/adminApi';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchAdminUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const openAdminModal = (user) => {
    if (user.role !== 'admin') return;
    setSelectedAdmin(user);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordMessage('');
    setPasswordError('');
  };

  const closeAdminModal = () => {
    setSelectedAdmin(null);
    setSavingPassword(false);
    setPasswordForm({ newPassword: '', confirmPassword: '' });
    setPasswordMessage('');
    setPasswordError('');
  };

  const handleAdminPasswordUpdate = async (event) => {
    event.preventDefault();
    if (!selectedAdmin) return;

    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setSavingPassword(true);
    try {
      const result = await updateAdminUserPassword(selectedAdmin._id, {
        newPassword: passwordForm.newPassword,
      });
      setPasswordMessage(result.message || 'Password updated successfully.');
      setPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminPageShell
      title="Users"
      description={`${users.length} registered account(s)`}
    >
      {loading && <p className="text-sm text-black/55">Loading users…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <AdminTable columns={['Name', 'Email', 'Phone', 'Joined']}>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-black/50">
                No users yet.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user._id}
                onClick={() => openAdminModal(user)}
                className={user.role === 'admin' ? 'cursor-pointer transition hover:bg-primary/5' : ''}
              >
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phone || '—'}</td>
                <td className="whitespace-nowrap px-4 py-3 text-black/65">
                  {formatDate(user.createdAt)}
                </td>
              </tr>
            ))
          )}
        </AdminTable>
      )}

      {selectedAdmin && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <button
            type="button"
            onClick={closeAdminModal}
            className="absolute inset-0 bg-black/40"
            aria-label="Close admin credential modal"
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-primary/15 bg-white p-5 shadow-2xl">
            <h3 className="text-lg font-semibold text-[#1f1419]">Admin Credentials</h3>
            <p className="mt-1 text-sm text-black/65">
              Email: <span className="font-medium text-black">{selectedAdmin.email}</span>
            </p>
            <p className="mt-1 text-sm text-black/60">
              Password cannot be shown for security. You can set a new password below.
            </p>

            {passwordMessage && (
              <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {passwordMessage}
              </p>
            )}
            {passwordError && (
              <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {passwordError}
              </p>
            )}

            <form onSubmit={handleAdminPasswordUpdate} className="mt-4 space-y-3">
              <label className="block text-sm">
                <span className="font-medium text-black">New password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-black">Confirm new password</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={closeAdminModal} className="btn-outline">
                  Close
                </button>
                <button type="submit" disabled={savingPassword} className="btn-solid disabled:opacity-60">
                  {savingPassword ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminUsers;
