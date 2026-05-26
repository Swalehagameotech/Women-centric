const discountBanner =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779790733/Untitled_1920_x_200_px_1920_x_150_px_1850_x_650_px_1850_x_350_px_xfc0ng.png';

const discountProducts = [
  {
    name: 'Signature Leather Tote',
    price: '₹2,499',
    originalPrice: '₹4,998',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Rose Satin Dress',
    price: '₹1,899',
    originalPrice: '₹3,798',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pearl Glow Heels',
    price: '₹1,499',
    originalPrice: '₹2,998',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Luxury Charm Set',
    price: '₹1,699',
    originalPrice: '₹3,398',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Ivory Festive Kurti',
    price: '₹1,299',
    originalPrice: '₹2,598',
    image:
      'https://images.unsplash.com/photo-1618244972963-dbad68f59fcb?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Velvet Bloom Perfume',
    price: '₹999',
    originalPrice: '₹1,998',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Golden Accent Bag',
    price: '₹2,099',
    originalPrice: '₹4,198',
    image:
      'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Chic Shade Edit',
    price: '₹1,199',
    originalPrice: '₹2,398',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80',
  },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
    </svg>
  );
}

function DiscountDealsSection() {
  return (
    <section className="pb-10 pt-2 sm:pb-12">
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <img
          src={discountBanner}
          alt="Special 50% discount on luxury bags"
          className="block w-full"
        />
      </div>

      <div className="mx-auto mt-8 max-w-[1600px] px-4 sm:px-6 md:px-8">
        <div className="grid justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-4">
          {discountProducts.map((product) => (
            <article
              key={product.name}
              className="relative h-[320px] w-[280px] overflow-hidden border border-rose-100 bg-white shadow-[0_12px_28px_rgba(109,53,65,0.08)]"
            >
              <span className="absolute left-1 top-3 z-10 bg-rose-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                50% Off
              </span>

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
      </div>
    </section>
  );
}

export default DiscountDealsSection;
