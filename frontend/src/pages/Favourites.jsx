import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import ProductCard from '../components/ProductCard';
import ProductsEmptyState from '../components/ProductsEmptyState';
import { useWishlist } from '../context/WishlistContext';

function Favourites() {
  const { items } = useWishlist();

  return (
    <PageLayout
      title="Favourites"
      description={
        items.length === 0
          ? undefined
          : `${items.length} saved ${items.length === 1 ? 'item' : 'items'}`
      }
    >
      {items.length === 0 ? (
        <div className="mt-4 text-center">
          <ProductsEmptyState className="py-6" />
          <Link to="/" className="btn-solid mt-2 inline-block">
            Discover products
          </Link>
        </div>
      ) : (
        <div className="product-grid mt-8">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} compact />
          ))}
        </div>
      )}
    </PageLayout>
  );
}

export default Favourites;
