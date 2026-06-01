import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageEmptyState, { PageTitle } from '../components/PageEmptyState';
import { authFetch } from '../utils/api';
import { formatPrice } from '../utils/products';
import {
  canUserCancelOrder,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  orderStatusBadgeClass,
  paymentStatusBadgeClass,
} from '../utils/orders';

function formatOrderDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [actionError, setActionError] = useState('');

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

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;

    setCancellingId(orderId);
    setActionError('');

    try {
      const result = await authFetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
      });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? result.data : o)),
      );
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-shell mx-auto max-w-4xl text-center text-black/70">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell mx-auto max-w-4xl text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] bg-stone-50/80">
      <div className="page-shell mx-auto max-w-4xl">
        <PageTitle align="center">Orders</PageTitle>

        {actionError && (
          <p className="mt-6 text-center text-sm text-red-600">{actionError}</p>
        )}

        {orders.length === 0 ? (
          <PageEmptyState
            message="You don't have any orders yet."
            hint="When you place an order, it will show up here with status and details."
          >
            <Link to="/" className="btn-solid inline-block">
              Start shopping
            </Link>
          </PageEmptyState>
        ) : (
          <ul className="mt-10 space-y-6">
            {orders.map((order) => {
              const firstItem = order.items[0];
              const cancellable = canUserCancelOrder(order.status);

              return (
                <li key={order._id}>
                  <article className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:px-5">
                    {/* Header: order id | date + price + badges */}
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold tracking-tight text-gray-900 sm:text-base">
                        #{order.orderNumber}
                      </p>
                      <div className="min-w-0 text-right">
                        <p className="text-xs text-gray-500">
                          {formatOrderDate(order.createdAt)}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center justify-end gap-1.5">
                          <p className="text-base font-bold text-gray-900 sm:text-lg">
                            {formatPrice(order.total)}
                          </p>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold sm:text-xs ${orderStatusBadgeClass(order.status)}`}
                          >
                            {getOrderStatusLabel(order.status)}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold sm:text-xs ${paymentStatusBadgeClass(order.paymentStatus)}`}
                          >
                            {getPaymentStatusLabel(order.paymentStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product preview */}
                    {firstItem && (
                      <div className="mt-2.5 flex items-center gap-3">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50 sm:h-16 sm:w-16">
                          {firstItem.image ? (
                            <img
                              src={firstItem.image}
                              alt={firstItem.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-gray-400">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {firstItem.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Qty: {firstItem.quantity}
                            {order.items.length > 1 &&
                              ` (+${order.items.length - 1} more item${order.items.length > 2 ? 's' : ''})`}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Actions — bottom right */}
                    <div className="mt-2.5 flex flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      {cancellable && (
                        <button
                          type="button"
                          onClick={() => handleCancel(order._id)}
                          disabled={cancellingId === order._id}
                          className="rounded-lg border border-red-400 bg-white px-4 py-1.5 text-sm font-medium text-red-600 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          {cancellingId === order._id ? 'Cancelling…' : 'Cancel Order'}
                        </button>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Orders;
