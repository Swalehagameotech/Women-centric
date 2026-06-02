import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPageShell from '../components/AdminPageShell';
import AdminTable from '../components/AdminTable';
import { fetchAdminOrders } from '../utils/adminApi';
import { formatPrice } from '../../utils/products';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const statusClass = {
  placed: 'bg-sky-100 text-sky-800',
  pending: 'bg-sky-100 text-sky-800',
  processing: 'bg-violet-100 text-violet-800',
  confirmed: 'bg-violet-100 text-violet-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

function AdminOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminOrders()
      .then((res) => setOrders(res.data || []))
      .catch((err) => setError(err.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminPageShell title="Orders" description={`${orders.length} order(s) total`}>
      {loading && <p className="text-sm text-black/55">Loading orders…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-4">
          <AdminTable
            columns={[
              'Order #',
              'Customer',
              'Items',
              'Total',
              'Status',
              'Payment',
              'Date',
            ]}
          >
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-black/50">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const customer = order.user;
                return (
                  <tr
                    key={order._id}
                    className="cursor-pointer text-black/80 transition hover:bg-black/[0.03]"
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">
                        {customer?.name || order.shippingAddress?.fullName || '—'}
                      </div>
                      <div className="text-xs text-black/50">
                        {customer?.email || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">{order.items?.length ?? 0}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          statusClass[order.status] || 'bg-black/10'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs capitalize">
                      {order.paymentMethod} · {order.paymentStatus}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-black/65">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                );
              })
            )}
          </AdminTable>
        </div>
      )}
    </AdminPageShell>
  );
}

export default AdminOrders;
