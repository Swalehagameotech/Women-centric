import { useEffect } from 'react';

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-10 w-10 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function OrderSuccessModal({ order, onViewOrders, onGoHome }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-success-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-primary/15 bg-white p-6 text-center shadow-2xl sm:p-8"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckIcon />
        </div>

        <h2 id="order-success-title" className="mt-5 font-serif text-2xl text-black sm:text-3xl">
          Order placed successfully!
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Thank you for shopping with us. Your order has been received and will be processed soon.
        </p>

        {order?.orderNumber && (
          <p className="mt-4 rounded-lg bg-black/5 px-4 py-2 text-sm font-medium text-black">
            Order ID: <span className="text-primary">{order.orderNumber}</span>
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={onViewOrders} className="btn-solid min-w-[160px]">
            View my orders
          </button>
          <button type="button" onClick={onGoHome} className="btn-outline min-w-[160px]">
            Go to home
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessModal;
