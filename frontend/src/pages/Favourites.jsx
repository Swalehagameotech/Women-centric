import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useWishlist } from '../context/WishlistContext';

function Favourites() {
  const { items } = useWishlist();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-left font-serif text-3xl text-black sm:text-4xl">Favourites</h1>
      <p className="mt-2 text-sm text-black/70">
        {items.length === 0
          ? 'Save items you love by tapping the heart on any product.'
          : `${items.length} saved ${items.length === 1 ? 'item' : 'items'}`}
      </p>

      {items.length === 0 ? (
        <div className="mt-12 text-center">
          <Link to="/" className="btn-solid inline-block">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 justify-items-center gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} compact />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favourites;
