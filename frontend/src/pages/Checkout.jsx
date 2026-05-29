import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { authFetch } from '../utils/api';
import { toCartItem } from '../utils/cart';
import AddressFormFields from '../components/AddressFormFields';
import OrderSuccessModal from '../components/OrderSuccessModal';
import { placeOrderWithAddress, syncCartToServer } from '../utils/checkout';
import { emptyAddressForm, formatAddressDisplay } from '../utils/address';
import { formatPrice } from '../utils/products';

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();

  const buyNow = location.state?.buyNow;
  const isBuyNow = Boolean(buyNow?.product);

  const checkoutItems = useMemo(() => {
    if (buyNow?.product) {
      return [{ ...toCartItem(buyNow.product), quantity: Math.max(1, buyNow.quantity || 1) }];
    }
    return cartItems;
  }, [buyNow, cartItems]);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddressForm);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');

  const deliveryCharges = 0;
  const subtotal = checkoutItems.reduce(
    (total, item) => total + item.discounted_price * item.quantity,
    0,
  );
  const total = subtotal + deliveryCharges;
  const itemCount = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate('/basket', { replace: true });
    }
  }, [checkoutItems.length, navigate]);

  useEffect(() => {
    const loadAddresses = async () => {
      setLoadingAddresses(true);

      try {
        const result = await authFetch('/api/addresses');
        const list = result.data || [];
        setAddresses(list);

        const defaultAddress = list.find((item) => item.isDefault) || list[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setUseNewAddress(false);
        } else {
          setUseNewAddress(true);
          if (user?.name) {
            setAddressForm((prev) => ({
              ...prev,
              fullName: user.name,
              phone: user.phone || prev.phone,
            }));
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, [user]);

  const resolveAddressId = async () => {
    if (!useNewAddress && selectedAddressId) {
      return selectedAddressId;
    }

    const { fullName, phone, landmark, city, state, postalCode } = addressForm;

    if (!fullName || !phone || !landmark || !city || !state || !postalCode) {
      throw new Error('Please fill name, number, landmark, city, state, and pincode.');
    }

    const result = await authFetch('/api/addresses', {
      method: 'POST',
      body: JSON.stringify(addressForm),
    });

    return result.data._id;
  };

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setError('');

    try {
      const addressId = await resolveAddressId();

      await syncCartToServer(checkoutItems);
      const result = await placeOrderWithAddress(addressId, deliveryCharges);

      if (!isBuyNow) {
        clearCart();
      }

      setPlacedOrder(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleViewOrders = () => {
    navigate('/orders', {
      state: { highlightOrderId: placedOrder?._id },
    });
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (checkoutItems.length === 0) {
    return null;
  }

  return (
    <>
      {placedOrder && (
        <OrderSuccessModal
          order={placedOrder}
          onViewOrders={handleViewOrders}
          onGoHome={handleGoHome}
        />
      )}

    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-left font-serif text-3xl text-black sm:text-4xl">Checkout</h1>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start">
        <div className="space-y-6">
          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-black">Payment</h2>
            <label className="mt-4 flex cursor-default items-start gap-3 rounded-xl border border-primary bg-primary/5 p-4">
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <span className="block text-sm font-semibold text-black">Cash on Delivery</span>
                <span className="mt-0.5 block text-xs text-black/60">
                  Pay when your order arrives at your doorstep.
                </span>
              </span>
            </label>
          </section>

          <section className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-black">Delivery address</h2>
            <p className="mt-1 text-sm text-black/60">Where should we deliver your order?</p>

            {loadingAddresses ? (
              <p className="mt-4 text-sm text-black/60">Loading addresses...</p>
            ) : (
              <div className="mt-5 space-y-4">
                {addresses.length > 0 && (
                  <ul className="space-y-3">
                    {addresses.map((address) => {
                      const display = formatAddressDisplay(address);

                      return (
                        <li key={address._id}>
                          <label
                            className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                              !useNewAddress && selectedAddressId === address._id
                                ? 'border-primary bg-primary/5'
                                : 'border-black/10 hover:border-primary/30'
                            }`}
                          >
                            <input
                              type="radio"
                              name="checkout-address"
                              className="mt-1 h-4 w-4 shrink-0 accent-primary"
                              checked={!useNewAddress && selectedAddressId === address._id}
                              onChange={() => {
                                setUseNewAddress(false);
                                setSelectedAddressId(address._id);
                              }}
                            />
                            <span className="min-w-0 text-sm text-black/80">
                              <span className="font-semibold text-black">{display.name}</span>
                              {address.isDefault && (
                                <span className="ml-2 text-xs font-medium text-primary">
                                  Default
                                </span>
                              )}
                              <span className="mt-1 block leading-relaxed">
                                {display.landmark}
                                <br />
                                {display.city}, {display.state} — {display.pincode}
                                <br />
                                {display.phone}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <label
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                    useNewAddress
                      ? 'border-primary bg-primary/5'
                      : 'border-black/10 hover:border-primary/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="checkout-address"
                    className="mt-1 h-4 w-4 shrink-0 accent-primary"
                    checked={useNewAddress}
                    onChange={() => setUseNewAddress(true)}
                  />
                  <span className="text-sm font-medium text-black">Add a new address</span>
                </label>

                {useNewAddress && (
                  <form
                    className="border-t border-black/10 pt-5"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <AddressFormFields form={addressForm} onChange={setAddressForm} />
                  </form>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6 lg:sticky lg:top-[calc(var(--site-header-height)+var(--category-nav-height)+1rem)]">
          <h2 className="text-lg font-semibold text-black">Order summary</h2>

          <ul className="mt-5 max-h-64 space-y-4 overflow-y-auto">
            {checkoutItems.map((item) => (
              <li key={item._id} className="flex gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden bg-stone-100">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-black/40">
                      No image
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-medium text-black line-clamp-2">
                    {item.brand?.trim() || item.name}
                  </p>
                  <p className="text-black/60">Qty {item.quantity}</p>
                  <p className="font-semibold text-black">
                    {formatPrice(item.discounted_price * item.quantity)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-black/10 pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-black/70">
                Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </dt>
              <dd className="font-medium text-black">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-black/70">Delivery</dt>
              <dd className="font-medium text-black">
                {deliveryCharges === 0 ? 'Free' : formatPrice(deliveryCharges)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-black/10 pt-3 text-base">
              <dt className="font-semibold text-black">Total</dt>
              <dd className="font-bold text-black">{formatPrice(total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={placingOrder || loadingAddresses}
            className="btn-solid mt-6 w-full disabled:opacity-60"
          >
            {placingOrder ? 'Placing order...' : 'Place order'}
          </button>

          <Link
            to={isBuyNow ? `/product/${checkoutItems[0]._id}` : '/basket'}
            className="mt-4 block text-center text-sm text-primary hover:underline"
          >
            {isBuyNow ? 'Back to product' : 'Back to basket'}
          </Link>
        </aside>
      </div>
    </div>
    </>
  );
}

export default Checkout;
