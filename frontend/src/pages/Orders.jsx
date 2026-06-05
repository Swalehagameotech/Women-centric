import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageEmptyState, { PageTitle } from '../components/PageEmptyState';
import { authFetch } from '../utils/api';
import { formatPrice } from '../utils/products';
import {
  getOrderStatusLabel,
  orderStatusBadgeClass,
} from '../utils/orders';

function formatOrderDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function Orders() {
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

              return (
                <li key={order._id}>
                  <Link
                    to={`/orders/${order._id}`}
                    className="block overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:border-gray-300 hover:shadow-md sm:px-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="shrink-0 text-xs font-bold tracking-tight text-gray-900 sm:text-base">
                        #{order.orderNumber}
                      </p>

                      <div className="flex min-w-0 flex-nowrap items-center justify-end gap-x-2 gap-y-1 text-xs text-gray-600 sm:flex-wrap sm:text-sm">
                        <span className="hidden whitespace-nowrap sm:inline">
                          {formatOrderDate(order.createdAt)}
                        </span>
                        <span className="hidden text-gray-300 sm:inline" aria-hidden>
                          ·
                        </span>
                        <span className="whitespace-nowrap font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </span>
                        <span className="text-gray-300" aria-hidden>
                          ·
                        </span>
                        <span
                          className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold sm:text-xs ${orderStatusBadgeClass(order.status)}`}
                        >
                          {getOrderStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

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
                          <p className="text-sm font-semibold text-gray-900">{firstItem.name}</p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Qty: {firstItem.quantity}
                            {order.items.length > 1 &&
                              ` (+${order.items.length - 1} more item${order.items.length > 2 ? 's' : ''})`}
                          </p>
                        </div>
                      </div>
                    )}
                  </Link>
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
