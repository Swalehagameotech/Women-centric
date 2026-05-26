const bestsellerProducts = [
  {
    name: "Rose Edit Dress",
    category: "Women's Wear",
    price: '₹2,499',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Ivory Festive Kurti',
    category: "Women's Wear",
    price: '₹1,849',
    image:
      'https://images.unsplash.com/photo-1618244972963-dbad68f59fcb?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pearl Luxe Set',
    category: 'Luxury Accessories',
    price: '₹2,199',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Golden Charm Edit',
    category: 'Luxury Accessories',
    price: '₹1,999',
    image:
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Classic Handbag',
    category: 'Bags',
    price: '₹1,899',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Blush Tote Bag',
    category: 'Bags',
    price: '₹2,099',
    image:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Elegant Heels',
    category: 'Footwear',
    price: '₹1,599',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Glow Ritual',
    category: 'Luxury Essentials',
    price: '₹1,299',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
  },
];

const bestsellerBadgeImage =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779714263/sc-3_bu9enf.webp';

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
    </svg>
  );
}

function BestsellerCategoriesSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-10 pt-2 sm:px-6 sm:pb-12 md:px-8">
      <div className="text-center">
      <h2 className="font-serif text-3xl text-center font-medium text-rose-950 sm:text-4xl">Bestseller</h2>

      </div>

      <div className="mt-8 grid justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bestsellerProducts.map((product) => (
          <article
            key={product.name}
            className="relative h-[320px] w-[280px] overflow-hidden border border-rose-100 bg-white shadow-[0_12px_28px_rgba(109,53,65,0.08)]"
          >
            <img
              src={bestsellerBadgeImage}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-10 w-[88px] -translate-x-3 -translate-y-1 -rotate-20 object-contain"
            />

            <button
              type="button"
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-rose-700 shadow-sm"
              aria-label={`Add ${product.name} to wishlist`}
            >
              <HeartIcon />
            </button>

            <img
              src={product.image}
              alt={product.name}
              className="block h-full w-full object-cover"
              loading="lazy"
            />

            <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
              <button
                type="button"
                className="inline-flex h-10 min-w-[150px] items-center justify-center rounded-full border border-rose-200 bg-white/95 px-5 text-sm font-semibold text-rose-900 shadow-sm backdrop-blur-sm transition hover:border-rose-300 hover:bg-white"
              >
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-rose-900 px-8 py-3 text-sm font-medium text-white shadow-[0_12px_24px_rgba(136,43,78,0.2)] transition hover:bg-rose-800"
        >
          View All Categories
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

export default BestsellerCategoriesSection;
