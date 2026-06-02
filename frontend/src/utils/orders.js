export const ORDER_STATUS_LABELS = {
  placed: 'Placed',
  pending: 'Placed',
  processing: 'Processing',
  confirmed: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const PAYMENT_STATUS_LABELS = {
  pending: 'Unpaid',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export function getOrderStatusLabel(status) {
  return ORDER_STATUS_LABELS[status] || status;
}

export function getPaymentStatusLabel(status) {
  return PAYMENT_STATUS_LABELS[status] || status;
}

/** User may cancel only before shipment */
export function canUserCancelOrder(status) {
  return ['placed', 'pending'].includes(status);
}

export function orderStatusBadgeClass(status) {
  const map = {
    placed: 'bg-sky-100 text-sky-700',
    pending: 'bg-sky-100 text-sky-700',
    processing: 'bg-sky-100 text-sky-700',
    confirmed: 'bg-sky-100 text-sky-700',
    shipped: 'bg-indigo-100 text-indigo-700',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
}

export function paymentStatusBadgeClass(status) {
  if (status === 'paid') return 'bg-amber-100 text-amber-800';
  return 'bg-yellow-100 text-yellow-800';
}

export const ORDER_PROGRESS_STEPS = [
  { key: 'placed', label: 'Placed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function normalizeOrderStatus(status) {
  if (status === 'pending') return 'placed';
  if (status === 'confirmed') return 'processing';
  return status;
}

/** @returns {'completed' | 'active' | 'upcoming'} */
export function getOrderProgressStepState(orderStatus, stepKey) {
  const status = normalizeOrderStatus(orderStatus);

  if (status === 'cancelled') {
    return stepKey === 'cancelled' ? 'active' : 'upcoming';
  }

  if (stepKey === 'cancelled') return 'upcoming';

  const flow = ['placed', 'processing', 'shipped', 'delivered'];
  const currentIndex = flow.indexOf(status);
  const stepIndex = flow.indexOf(stepKey);

  if (stepIndex < 0) return 'upcoming';
  if (currentIndex < 0) return 'upcoming';
  if (stepIndex < currentIndex) return 'completed';
  if (stepIndex === currentIndex) return 'active';
  return 'upcoming';
}

export function formatPaymentMethod(method) {
  const value = (method || 'cod').toLowerCase();
  if (value === 'cod') return 'Cash on delivery';
  return value.replace(/_/g, ' ');
}
