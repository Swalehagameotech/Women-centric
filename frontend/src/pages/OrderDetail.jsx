import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authFetch } from '../utils/api';
import { formatAddressDisplay } from '../utils/address';
import { formatPrice } from '../utils/products';
import {
  ORDER_PROGRESS_STEPS,
  canUserCancelOrder,
  formatPaymentMethod,
  getOrderProgressStepState,
  getOrderStatusLabel,
  getPaymentStatusLabel,
  normalizeOrderStatus,
} from '../utils/orders';

function formatOrderDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatOrderDateTime(value) {
  return new Date(value).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function SectionCard({ children, className = '' }) {
  return (
    <section
      className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
      {children}
    </h2>
  );
}

function ProgressStep({ step, index, state, timestamp }) {
  const isLast = index === ORDER_PROGRESS_STEPS.length - 1;
  const isCancelledStep = step.key === 'cancelled' && state === 'active';

  return (
    <div className="flex min-w-0 flex-1 items-start">
      <div className="flex w-full min-w-0 flex-col items-center">
        <div className="flex w-full items-center">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold sm:h-10 sm:w-10 ${
              isCancelledStep
                ? 'bg-red-500 text-white'
                : state === 'completed' || state === 'active'
                  ? 'bg-emerald-500 text-white'
                  : 'border-2 border-gray-300 bg-white text-gray-500'
            }`}
          >
            {state === 'completed' || state === 'active' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              index + 1
            )}
          </div>
          {!isLast && (
            <div
              className={`mx-1 h-0.5 min-w-[12px] flex-1 sm:mx-2 ${
                state === 'completed' ? 'bg-emerald-400' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
        <p
          className={`mt-2 text-center text-[11px] font-medium sm:text-xs ${
            state === 'active' || state === 'completed' ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {step.label}
        </p>
        {timestamp && (state === 'active' || state === 'completed') && (
          <p className="mt-0.5 hidden text-center text-[10px] text-gray-500 sm:block">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await authFetch(`/api/orders/${id}`, {
          signal: controller.signal,
        });
        setOrder(result.data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;

    setCancelling(true);
    setActionError('');

    try {
      const result = await authFetch(`/api/orders/${id}/cancel`, {
        method: 'PATCH',
      });
      setOrder(result.data);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-black/70 sm:px-6">
        Loading order…
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
        <p className="text-red-600">{error || 'Order not found'}</p>
        <Link to="/orders" className="btn-solid mt-6 inline-block">
          Back to orders
        </Link>
      </div>
    );
  }

  const ship = formatAddressDisplay(order.shippingAddress);
  const cancellable = canUserCancelOrder(order.status);
  const normalizedStatus = normalizeOrderStatus(order.status);
  const placedAt = formatOrderDateTime(order.createdAt);
  const statusLabel = getOrderStatusLabel(order.status);
  const paymentLabel = getPaymentStatusLabel(order.paymentStatus).toLowerCase();

  return (
    <div className="min-h-[50vh] bg-stone-50/60 pb-16 pt-6 sm:pt-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm transition hover:bg-gray-50"
          >
            ← My Orders
          </button>
          <div className="text-left sm:text-right">
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">Order Details</h1>
            <p className="mt-0.5 text-sm text-gray-600">#{order.orderNumber}</p>
          </div>
        </div>

        {actionError && (
          <p className="mt-4 text-sm text-red-600">{actionError}</p>
        )}

        {/* Status */}
        <SectionCard className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <SectionLabel>Status</SectionLabel>
              <p className="mt-2 text-lg font-semibold capitalize text-gray-900">
                {statusLabel}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                Payment: {formatPaymentMethod(order.paymentMethod)} · {paymentLabel}
              </p>
            </div>
            {cancellable && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={cancelling}
                className="btn-solid shrink-0 px-6 py-2.5 text-sm disabled:opacity-50"
              >
                {cancelling ? 'Cancelling…' : 'Cancel Order'}
              </button>
            )}
          </div>
        </SectionCard>

        {/* Progress stepper */}
        <SectionCard className="mt-4 overflow-x-auto">
          <div className="flex min-w-[520px] items-start px-1 sm:min-w-0">
            {ORDER_PROGRESS_STEPS.map((step, index) => {
              const state = getOrderProgressStepState(order.status, step.key);
              const showTime =
                step.key === 'placed' &&
                (state === 'active' || state === 'completed') &&
                normalizedStatus !== 'cancelled';

              return (
                <ProgressStep
                  key={step.key}
                  step={step}
                  index={index}
                  state={state}
                  timestamp={showTime ? placedAt : null}
                />
              );
            })}
          </div>
        </SectionCard>

        {/* Address + Billing */}
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <SectionCard>
            <SectionLabel>Address</SectionLabel>
            <p className="mt-3 text-sm leading-relaxed text-gray-800">
              {ship.line}
            </p>
            <p className="mt-2 text-sm text-gray-600">{ship.phone}</p>
            <p className="mt-1 text-sm font-medium text-gray-800">{ship.name}</p>
          </SectionCard>

          <SectionCard>
            <SectionLabel>Billing Summary</SectionLabel>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">GST</dt>
                <dd className="text-gray-600">Included</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gray-600">Delivery</dt>
                <dd
                  className={`font-medium ${
                    order.deliveryCharges === 0 ? 'text-emerald-600' : 'text-gray-900'
                  }`}
                >
                  {order.deliveryCharges === 0 ? 'Free' : formatPrice(order.deliveryCharges)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-100 pt-3">
                <dt className="text-base font-semibold text-gray-900">Total</dt>
                <dd className="text-base font-bold text-gray-900">
                  {formatPrice(order.total)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-gray-500">
              Order Date: {formatOrderDate(order.createdAt)}
            </p>
          </SectionCard>
        </div>

        {/* Order items table */}
        <SectionCard className="mt-4 overflow-x-auto">
          <SectionLabel>Order Items</SectionLabel>
          <table className="mt-4 w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4 font-semibold">Item</th>
                <th className="pb-3 pr-4 text-center font-semibold">Qty</th>
                <th className="pb-3 pr-4 text-right font-semibold">Unit Price</th>
                <th className="pb-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={`${item.product}-${item.name}`}>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-gray-100 bg-stone-100">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                            —
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.brand && (
                          <p className="text-xs text-gray-500">{item.brand}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 pr-4 text-right text-gray-700">
                    {formatPrice(item.discounted_price)}
                  </td>
                  <td className="py-4 text-right font-semibold text-gray-900">
                    {formatPrice(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>
    </div>
  );
}

export default OrderDetail;
