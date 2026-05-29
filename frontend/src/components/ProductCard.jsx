import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/products';

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
    </svg>
  );
}

function ProductCard({
  product,
  showBestsellerBadge = false,
  bestsellerBadgeImage,
  compact = false,
}) {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const isFavourite = isInWishlist(product._id);
  const image = product.images?.[0];
  const hasDiscount =
    product.discount_percent > 0 && product.original_price > product.discounted_price;
  const discountLabel = hasDiscount ? `${Math.round(product.discount_percent)}% OFF` : null;

  const displayBrand = product.brand?.trim() || product.name;

  const handleAddToCart = () => {
    requireAuth(() => {
      addItem(product);
      navigate('/basket');
    });
  };

  const handleWishlistClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleItem(product);
  };

  return (
    <article
      className={`flex flex-col bg-white ${compact ? 'w-full min-w-0' : 'w-[240px]'}`}
    >
      <Link
        to={`/product/${product._id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-stone-100"
      >
        {showBestsellerBadge && bestsellerBadgeImage && (
          <img
            src={bestsellerBadgeImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-10 w-[88px] -translate-x-3 -translate-y-1 -rotate-20 object-contain"
          />
        )}

        <button
          type="button"
          onClick={handleWishlistClick}
          className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm transition ${
            isFavourite ? 'text-primary' : 'text-primary/70 hover:text-primary'
          }`}
          aria-label={isFavourite ? `Remove ${product.name} from favourites` : `Add ${product.name} to favourites`}
          aria-pressed={isFavourite}
        >
          <HeartIcon filled={isFavourite} />
        </button>

        <img src={image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </Link>

      <div className="flex flex-col px-1 pb-1 pt-2 text-center">
        <Link
          to={`/product/${product._id}`}
          className={`line-clamp-2 font-normal leading-tight text-black hover:underline ${
            compact ? 'text-[11px] sm:text-xs' : 'text-sm'
          }`}
        >
          {displayBrand}
        </Link>

        <div
          className={`mt-1 flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5 ${
            compact ? 'text-[10px] sm:text-xs' : 'text-sm'
          }`}
        >
          <span className="font-semibold text-black">{formatPrice(product.discounted_price)}</span>
          {hasDiscount && (
            <>
              <span className="text-black/45 line-through">{formatPrice(product.original_price)}</span>
              {discountLabel && (
                <span className="bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {discountLabel}
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`mt-2 w-full border border-black/80 bg-white font-normal text-black transition hover:bg-black/5 ${
            compact ? 'py-1.5 text-[10px] sm:py-2 sm:text-xs' : 'py-2 text-sm'
          }`}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
