import { Fragment, useEffect, useState } from 'react';
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

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
              '',
            ]}
          >
            {orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-black/50">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const customer = order.user;
                const isOpen = expandedId === order._id;
                return (
                  <Fragment key={order._id}>
                    <tr className="text-black/80">
                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                        {order.orderNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium">
                          {customer?.name || order.shippingAddress?.fullName || '—'}
                        </div>
                        <div className="text-xs text-black/50">
                          {customer?.email || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">{order.items?.length ?? 0}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium">
                        {formatPrice(order.total)}
                      </td>
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
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isOpen ? null : order._id)
                          }
                          className="text-xs font-medium text-[#7c3aed] hover:underline"
                        >
                          {isOpen ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr>
                        <td colSpan={8} className="bg-[#f8f9fb] px-4 py-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold uppercase text-black/45">
                                Shipping address
                              </p>
                              <p className="mt-1 text-sm">
                                {order.shippingAddress?.fullName}
                                <br />
                                {order.shippingAddress?.landmark}
                                <br />
                                {order.shippingAddress?.city},{' '}
                                {order.shippingAddress?.state}{' '}
                                {order.shippingAddress?.postalCode}
                                <br />
                                Phone: {order.shippingAddress?.phone}
                              </p>
                              <p className="mt-2 text-sm text-black/65">
                                Subtotal: {formatPrice(order.subtotal)} · Delivery:{' '}
                                {formatPrice(order.deliveryCharges || 0)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold uppercase text-black/45">
                                Items
                              </p>
                              <ul className="mt-2 space-y-2">
                                {(order.items || []).map((item, idx) => (
                                  <li
                                    key={`${item.product}-${idx}`}
                                    className="flex gap-3 text-sm"
                                  >
                                    {item.image && (
                                      <img
                                        src={item.image}
                                        alt=""
                                        className="h-12 w-10 rounded object-cover"
                                      />
                                    )}
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-xs text-black/55">
                                        Qty {item.quantity} ×{' '}
                                        {formatPrice(item.discounted_price)} ={' '}
                                        {formatPrice(item.line_total)}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
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
