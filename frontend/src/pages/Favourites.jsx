import { Link } from 'react-router-dom';
import PageEmptyState from '../components/PageEmptyState';
import PageLayout from '../components/PageLayout';
import ProductCard from '../components/ProductCard';
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
        <PageEmptyState
          message="You don't have any products in your favourites yet."
          hint="Tap the heart on any product to save it here for later."
          showExploreLinks={false}
        >
          <Link to="/" className="btn-solid inline-block">
            Discover products
          </Link>
        </PageEmptyState>
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
