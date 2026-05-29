import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authFetch } from '../utils/api';
import { formatAddressDisplay } from '../utils/address';
import { formatPrice } from '../utils/products';

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function Orders() {
  const location = useLocation();
  const highlightOrderId = location.state?.highlightOrderId;
  const highlightedRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await authFetch('/api/orders', { signal: controller.signal });
        setOrders(result.data || []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    loadOrders();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!highlightOrderId || loading) return;

    const timer = window.setTimeout(() => {
      highlightedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [highlightOrderId, loading, orders]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-black/70 sm:px-6">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">My account</p>
      <h1 className="mt-2 font-serif text-3xl text-black sm:text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-black/70">All purchases placed with your account.</p>

      {highlightOrderId && orders.some((order) => order._id === highlightOrderId) && (
        <p className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
          Your latest order is highlighted below.
        </p>
      )}

      {orders.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-black/10 bg-white p-10 text-center">
          <p className="text-black/70">You have not placed any orders yet.</p>
          <Link to="/" className="btn-solid mt-6 inline-block">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-6">
          {orders.map((order) => {
            const ship = formatAddressDisplay(order.shippingAddress);
            const isHighlighted = highlightOrderId === order._id;

            return (
              <li
                key={order._id}
                ref={isHighlighted ? highlightedRef : null}
                id={`order-${order._id}`}
              >
                <article
                  className={`rounded-2xl border bg-white p-5 sm:p-6 ${
                    isHighlighted
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-black/10'
                  }`}
                >
                  {isHighlighted && (
                    <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
                      Just placed
                    </p>
                  )}

                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-4">
                    <div>
                      <p className="text-sm font-semibold text-black">{order.orderNumber}</p>
                      <p className="mt-1 text-xs text-black/60">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold capitalize text-primary">
                        {statusLabels[order.status] || order.status}
                      </span>
                      <p className="mt-2 text-lg font-bold text-black">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <ul className="mt-4 space-y-4">
                    {order.items.map((item) => (
                      <li key={`${order._id}-${item.product}`} className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden bg-stone-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-black/40">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-black">{item.brand || item.name}</p>
                          <p className="text-sm text-black/60">
                            Qty {item.quantity} · {formatPrice(item.discounted_price)} each
                          </p>
                          <p className="text-sm font-semibold text-black">
                            {formatPrice(item.line_total)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 rounded-xl bg-black/[0.03] p-4 text-sm text-black/80">
                    <p className="font-medium text-black">Deliver to</p>
                    <p className="mt-1">
                      {ship.name} · {ship.phone}
                    </p>
                    <p className="mt-1 leading-relaxed">
                      {ship.landmark}
                      <br />
                      {ship.city}, {ship.state} — {ship.pincode}
                    </p>
                  </div>

                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-black/60">Subtotal</dt>
                      <dd className="font-medium text-black">{formatPrice(order.subtotal)}</dd>
                    </div>
                    <div>
                      <dt className="text-black/60">Delivery</dt>
                      <dd className="font-medium text-black">
                        {order.deliveryCharges === 0
                          ? 'Free'
                          : formatPrice(order.deliveryCharges)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-black/60">Payment</dt>
                      <dd className="font-medium capitalize text-black">
                        {order.paymentMethod} · {order.paymentStatus}
                      </dd>
                    </div>
                  </dl>
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Orders;
