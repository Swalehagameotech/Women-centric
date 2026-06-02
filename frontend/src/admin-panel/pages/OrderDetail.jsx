import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AdminPageShell from '../components/AdminPageShell';
import { fetchAdminOrder, updateAdminOrder } from '../utils/adminApi';
import { formatPrice } from '../../utils/products';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('placed');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const orderStatusOptions = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded'];
  const normalizedStatus =
    order?.status === 'pending'
      ? 'placed'
      : order?.status === 'confirmed'
        ? 'processing'
        : order?.status;

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchAdminOrder(id)
      .then((res) => {
        const next = res.data || null;
        setOrder(next);
        setStatus(next?.status || 'placed');
        setPaymentStatus(next?.paymentStatus || 'pending');
      })
      .catch((err) => setError(err.message || 'Failed to load order'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!order) return;
    setSaving(true);
    setSaveMessage('');
    try {
      const result = await updateAdminOrder(order._id, { status, paymentStatus });
      const next = result.data;
      setOrder(next);
      setStatus(next.status || 'placed');
      setPaymentStatus(next.paymentStatus || 'pending');
      setSaveMessage('Order status updated.');
    } catch (err) {
      setSaveMessage(err.message || 'Failed to update order.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <AdminPageShell title="Order Detail">Loading order…</AdminPageShell>;
  }

  if (error || !order) {
    return (
      <AdminPageShell title="Order Detail">
        <p className="text-sm text-red-600">{error || 'Order not found'}</p>
        <Link to="/admin/orders" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to orders
        </Link>
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell title={`Order #${order.orderNumber}`}>
      <div className="space-y-4 rounded-2xl border border-black/10 bg-white p-4 sm:p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/50">Customer</p>
            <p className="mt-1 text-sm font-medium text-black">{order.user?.name || '—'}</p>
            <p className="text-sm text-black/65">{order.user?.email || '—'}</p>
            <p className="text-sm text-black/65">{order.user?.phone || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-black/50">Order info</p>
            <p className="mt-1 text-sm text-black/80">Status: <span className="font-medium capitalize">{normalizedStatus}</span></p>
            <p className="text-sm text-black/80">
              Payment: <span className="font-medium capitalize">{order.paymentMethod}</span> ·{' '}
              <span className="font-medium capitalize">{order.paymentStatus}</span>
            </p>
            <p className="text-sm text-black/60">Created: {formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="grid gap-4 rounded-xl border border-black/10 bg-stone-50 p-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-black/50">Order status</span>
            <select
              value={status}
              onChange={(e) => {
                const next = e.target.value;
                setStatus(next);
                if (next === 'delivered') {
                  setPaymentStatus('paid');
                }
              }}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm capitalize"
            >
              {orderStatusOptions.map((option) => (
                <option key={option} value={option} className="capitalize">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-black/50">Payment status</span>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              disabled={status === 'delivered'}
              className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm capitalize disabled:bg-black/5 disabled:text-black/50"
            >
              {paymentStatusOptions.map((option) => (
                <option key={option} value={option} className="capitalize">
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-solid h-10 px-5 text-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Update order'}
          </button>
        </div>
        {saveMessage && (
          <p className={`text-sm ${saveMessage.includes('updated') ? 'text-emerald-700' : 'text-red-600'}`}>
            {saveMessage}
          </p>
        )}

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/50">Shipping address</p>
          <p className="mt-1 text-sm leading-relaxed text-black/80">
            {order.shippingAddress?.fullName}
            <br />
            {order.shippingAddress?.landmark}
            <br />
            {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}
            <br />
            Phone: {order.shippingAddress?.phone}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-black/50">Items</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase tracking-wide text-black/50">
                  <th className="px-2 py-2">Item</th>
                  <th className="px-2 py-2 text-center">Qty</th>
                  <th className="px-2 py-2 text-right">Unit</th>
                  <th className="px-2 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).map((item, idx) => (
                  <tr key={`${item.product}-${idx}`} className="border-b border-black/5">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt="" className="h-12 w-10 rounded object-cover" />
                        ) : null}
                        <div>
                          <p className="font-medium text-black">{item.name}</p>
                          <p className="text-xs text-black/55">{item.brand || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-center">{item.quantity}</td>
                    <td className="px-2 py-3 text-right">{formatPrice(item.discounted_price)}</td>
                    <td className="px-2 py-3 text-right font-medium">{formatPrice(item.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid gap-2 border-t border-black/10 pt-3 text-sm sm:max-w-sm sm:ml-auto">
          <div className="flex items-center justify-between">
            <span className="text-black/65">Subtotal</span>
            <span className="font-medium">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-black/65">Delivery</span>
            <span className="font-medium">{formatPrice(order.deliveryCharges || 0)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-black/10 pt-2 text-base">
            <span className="font-semibold">Total</span>
            <span className="font-bold">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </AdminPageShell>
  );
}

export default AdminOrderDetail;
