import { useEffect, useState } from 'react';
import AdminPageShell from '../components/AdminPageShell';
import AdminTable from '../components/AdminTable';
import { fetchAdminUsers } from '../utils/adminApi';

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

  useEffect(() => {
    fetchAdminUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(err.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

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
              <tr key={user._id}>
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
    </AdminPageShell>
  );
}

export default AdminUsers;
