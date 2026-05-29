import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/products';

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function Basket() {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { items, updateQuantity, removeItem } = useCart();

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.discounted_price * item.quantity,
    0,
  );
  const deliveryCharges = 0;
  const orderTotal = subtotal + deliveryCharges;

  const handleBuyNow = () => {
    requireAuth(() => navigate('/checkout'));
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-left font-serif text-3xl text-black sm:text-4xl">Shopping Cart</h1>
        <div className="mt-12 text-center">
          <p className="text-sm text-black/70">Your basket is empty.</p>
          <Link to="/" className="btn-solid mt-8 inline-block">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-left font-serif text-3xl text-black sm:text-4xl">Your Basket</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:items-start">
        <ul className="space-y-4">
          {items.map((item) => {
            const lineSubtotal = item.discounted_price * item.quantity;

            return (
              <li key={item._id}>
                <article className="flex gap-4 rounded-xl border border-black/10 bg-white p-4 sm:gap-5 sm:p-5">
                  <div className="h-24 w-24 shrink-0 overflow-hidden bg-stone-100 sm:h-28 sm:w-28">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-black/40">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-base font-medium text-black">
                      {item.brand?.trim() || item.name}
                    </p>
                    <p className="mt-1 text-sm text-black/70">{formatPrice(item.discounted_price)}</p>

                    <div className="mt-4 inline-flex w-fit items-center border border-black/20">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1.5 text-base text-black hover:bg-black/5"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] border-x border-black/20 px-3 py-1.5 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1.5 text-base text-black hover:bg-black/5"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <p className="mt-3 text-sm text-black">
                      <span className="text-black/70">Subtotal: </span>
                      <span className="font-semibold">{formatPrice(lineSubtotal)}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="shrink-0 self-start rounded-lg p-2 text-black/50 transition hover:bg-black/5 hover:text-black"
                    aria-label={`Remove ${item.name} from basket`}
                  >
                    <TrashIcon />
                  </button>
                </article>
              </li>
            );
          })}
        </ul>

        <aside className="rounded-xl border border-black/10 bg-white p-6 lg:sticky lg:top-[calc(var(--site-header-height)+var(--category-nav-height)+1rem)]">
          <h2 className="text-lg font-semibold text-black">Order Summary</h2>

          <dl className="mt-6 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-black/70">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </dt>
              <dd className="font-medium text-black">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-black/70">Delivery Charges</dt>
              <dd className="font-medium text-black">
                {deliveryCharges === 0 ? 'Free' : formatPrice(deliveryCharges)}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-black/10 pt-6">
            <span className="text-base font-semibold text-black">Total</span>
            <span className="text-xl font-bold text-black">{formatPrice(orderTotal)}</span>
          </div>

          <button type="button" onClick={handleBuyNow} className="btn-solid mt-6 w-full">
            Buy now
          </button>

          <p className="mt-3 text-center text-xs text-black/60">
            Sign in required. You will review address and payment on checkout.
          </p>

          <Link
            to="/"
            className="mt-4 block text-center text-sm text-primary hover:underline"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Basket;
