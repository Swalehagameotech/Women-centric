import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, formatPrice } from '../utils/products';

const PRODUCT_SLOT_COUNT = 16;

const TEXT_TILES = {
  promo: (
    <>
      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-black/50 sm:text-[10px]">
        Handpicked
      </p>
      <p className="mt-1 font-serif text-lg leading-snug text-black sm:text-xl">For every</p>
      <p className="font-serif text-base text-primary sm:text-lg">occasion</p>
    </>
  ),
  about: (
    <>
      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-black/45 sm:text-[10px]">
        Bestseller
      </p>
      <p className="mt-1 font-serif text-base leading-snug text-black sm:text-lg">Most loved picks</p>
      <p className="mt-2 text-[10px] leading-relaxed text-black/55 sm:text-xs">
        Bags, eyewear &amp; luxury accessories — our customers&apos; favourites.
      </p>
    </>
  ),
  curated: (
    <>
      <p className="font-serif text-base leading-snug text-black sm:text-lg">Accessories</p>
      <p className="mt-1 text-[10px] text-black/55 sm:text-xs">Editor&apos;s choice</p>
    </>
  ),
  shop: (
    <>
      <p className="text-[9px] uppercase tracking-[0.15em] text-black/45">Style By Her</p>
      <p className="mt-1 font-serif text-base text-black sm:text-lg">Shop bestsellers</p>
      <Link
        to="/category/bestseller"
        className="mt-2 inline-block text-[10px] font-medium text-primary underline-offset-2 hover:underline sm:text-xs"
      >
        View all →
      </Link>
    </>
  ),
  spotlight: (
    <>
      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-black/45">Quality</p>
      <p className="mt-1 font-serif text-sm leading-snug text-black sm:text-base">Made for you</p>
      <p className="mt-1 text-[9px] leading-relaxed text-black/55 sm:text-[10px]">
        Timeless pieces, lasting style
      </p>
    </>
  ),
};

/**
 * Fixed 7×3 grid — same layout on all breakpoints.
 * Mobile: horizontal scroll so columns stay large enough to read.
 */
const GRID_CELLS = [
  { kind: 'blank', key: 'promo', row: 1, col: 1 },
  { kind: 'product', row: 1, col: 2 },
  { kind: 'product', row: 1, col: 3 },
  { kind: 'product', row: 1, col: 4 },
  { kind: 'blank', key: 'about', row: 1, col: 5 },
  { kind: 'product', row: 1, col: 6 },
  { kind: 'product', row: 1, col: 7 },
  { kind: 'product', row: 2, col: 1 },
  { kind: 'product', row: 2, col: 2 },
  { kind: 'blank', key: 'curated', row: 2, col: 3 },
  { kind: 'product', row: 2, col: 4 },
  { kind: 'product', row: 2, col: 5 },
  { kind: 'product', row: 2, col: 6 },
  { kind: 'product', row: 2, col: 7 },
  { kind: 'blank', key: 'shop', row: 3, col: 1 },
  { kind: 'product', row: 3, col: 2 },
  { kind: 'product', row: 3, col: 3 },
  { kind: 'product', row: 3, col: 4 },
  { kind: 'blank', key: 'spotlight', row: 3, col: 5 },
  { kind: 'product', row: 3, col: 6 },
  { kind: 'product', row: 3, col: 7 },
];

function mergeProductLists(...lists) {
  const merged = [];
  const seen = new Set();
  for (const list of lists) {
    for (const product of list) {
      if (!seen.has(product._id)) {
        merged.push(product);
        seen.add(product._id);
      }
    }
  }
  return merged;
}

function cellStyle(row, col) {
  return { gridRow: row, gridColumn: col };
}

function BestsellerProductTile({ product }) {
  const image = product.images?.[0];

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative block h-full min-h-0 overflow-hidden bg-[#ebe6e1] transition hover:opacity-95"
    >
      {image ? (
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
          loading="lazy"
        />
      ) : (
        <div className="h-full bg-[#f0ebe6]" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1.5 pb-1.5 pt-6 sm:px-3 sm:pb-2.5 sm:pt-8">
        <p className="line-clamp-1 text-[9px] font-medium text-white sm:text-xs lg:text-sm">
          {product.brand?.trim() || product.name}
        </p>
        <p className="text-[9px] font-semibold text-white sm:text-xs lg:text-sm">
          {formatPrice(product.discounted_price)}
        </p>
      </div>
    </Link>
  );
}

function BlankBox({ children }) {
  return (
    <div className="box-border flex h-full min-h-0 items-center justify-center bg-[#e8e2db] p-1.5 sm:p-2.5 lg:p-3">
      <div className="flex h-full w-full flex-col items-center justify-center border border-black/25 bg-[#f3efe9] p-1.5 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] sm:p-3 lg:p-4">
        {children}
      </div>
    </div>
  );
}

function BestsellerMosaicGrid({ products }) {
  const gridProducts = products.slice(0, PRODUCT_SLOT_COUNT);
  let productIndex = 0;

  return (
    <div className="mt-6 w-full sm:mt-8">
      {/* Phone: swipe to see full desktop-style mosaic */}
      <div className="-mx-3 overflow-x-auto overscroll-x-contain px-3 pb-1 md:mx-0 md:overflow-hidden md:px-0">
        <div
          className="grid h-[320px] w-[min(100%,728px)] min-w-[728px] gap-1.5 sm:h-[420px] sm:min-w-[840px] sm:gap-2 md:h-[580px] md:w-full md:min-w-0 md:gap-2.5 lg:h-[680px] lg:gap-3 xl:h-[740px]"
          style={{
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gridTemplateRows: 'repeat(3, minmax(0, 1fr))',
          }}
        >
          {GRID_CELLS.map((cell) => {
            const style = cellStyle(cell.row, cell.col);

            if (cell.kind === 'blank') {
              return (
                <div key={cell.key} style={style}>
                  <BlankBox>{TEXT_TILES[cell.key]}</BlankBox>
                </div>
              );
            }

            const product = gridProducts[productIndex];
            productIndex += 1;

            if (!product) {
              return (
                <div key={`empty-${cell.row}-${cell.col}`} style={style} className="bg-[#f0ebe6]" />
              );
            }

            return (
              <div key={product._id} style={style}>
                <BestsellerProductTile product={product} />
              </div>
            );
          })}
        </div>
      </div>
      <p className="mt-2 text-center text-[10px] text-black/45 md:hidden">
        Swipe sideways to see the full layout
      </p>
    </div>
  );
}

function BestsellerCategoriesSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadProducts = async () => {
      try {
        const [bestseller, luxuryAccessories, bags] = await Promise.all([
          fetchProducts({ category: 'Bestseller', signal }),
          fetchProducts({ category: 'Luxury Accessories', signal }),
          fetchProducts({ category: 'Bags', signal }),
        ]);
        setProducts(mergeProductLists(bestseller, luxuryAccessories, bags));
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to load bestseller products:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  const hasMore = products.length > PRODUCT_SLOT_COUNT;

  return (
    <section className="w-full px-3 pb-12 pt-2 sm:px-4 md:px-5 lg:px-6">
      <div className="text-center">
        <h2 className="font-serif text-3xl font-medium text-black sm:text-4xl">Bestseller</h2>
      </div>

      {loading ? (
        <p className="mt-8 text-center text-black/70">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="mt-8 text-center text-black/70">No products yet.</p>
      ) : (
        <BestsellerMosaicGrid products={products} />
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <Link
            to="/category/bestseller"
            className="btn-solid inline-flex items-center gap-2 shadow-[0_12px_24px_rgba(94,48,62,0.2)]"
          >
            View all bestsellers
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </section>
  );
}

export default BestsellerCategoriesSection;
