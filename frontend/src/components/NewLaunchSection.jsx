const featuredProduct = {
 
  image:
    'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779793668/Untitled_1920_x_200_px_1920_x_150_px_1850_x_650_px_1850_x_400_px_1080_x_650_px_640_x_650_px_690_x_650_px_talxpq.png',
};

const launchCards = [
  {
    name: 'Classic Handbag',
    price: '₹1,899',
    description: 'Timeless design, modern charm.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Elegant Heels',
    price: '₹1,599',
    description: 'Step into elegance and comfort.',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pearl Detail Kurti',
    price: '₹1,749',
    description: 'Subtle details, exquisite you.',
    image:
      'https://images.unsplash.com/photo-1618244972963-dbad68f59fcb?auto=format&fit=crop&w=900&q=80',
  },
];

const styleEditCards = [
  {
    title: 'Festive Glow',
    text: 'Shine in timeless traditions.',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Office Luxe',
    text: 'Power dressing made effortless.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Weekend Vibes',
    text: 'Comfort meets chic.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Accessorize',
    text: 'The finishing touch.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
];

const shopCategories = [
  {
    label: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Kurtis',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Handbags',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Footwear',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Sunglasses',
    image:
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Watches',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Perfume',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80',
  },
  {
    label: 'Jewellery',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=300&q=80',
  },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
    </svg>
  );
}

function ArrowCircle() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-300 bg-white text-2xl leading-none text-rose-700">
      +
    </span>
  );
}

function NewLaunchSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-6 md:px-8">
      <div className="px-1 py-4 sm:px-0 sm:py-6">
        <div className="mb-8 flex justify-center text-center text-rose-900">
          <h2 className="font-serif text-3xl font-medium text-rose-950 sm:text-4xl">New Launch</h2>
        </div>

        <div className="relative">
          <button
            type="button"
            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl text-rose-800 shadow-md lg:flex"
            aria-label="Previous new launch"
          >
            ←
          </button>

          <button
            type="button"
            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-xl text-rose-800 shadow-md lg:flex"
            aria-label="Next new launch"
          >
            →
          </button>

          <div className="overflow-x-auto pb-2 scrollbar-hide">
            <div className="grid min-w-max grid-flow-col items-center gap-4 lg:min-w-0 lg:grid-cols-[1.95fr_1.28fr_1.28fr_1.28fr] lg:grid-flow-row">
              <article className="relative w-[600px] overflow-hidden rounded-xl lg:w-auto">
                <img
                  src={featuredProduct.image}
                  alt={featuredProduct.name}
                 className="h-[400px] w-full object-cover"
                  loading="lazy"
                />
               
              </article>

              {launchCards.map((product) => (
                <article
                  key={product.name}
                  className="relative h-[320px] w-[300px] self-center overflow-hidden lg:w-auto"
                >
                  <button
                    type="button"
                    className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-white/95 text-rose-700 shadow-sm"
                    aria-label={`Favourite ${product.name}`}
                  >
                    <HeartIcon />
                  </button>

                  <img
                    src={product.image}
                    alt={product.name}
                    className="block h-full w-full object-cover object-center"
                    loading="lazy"
                  />

                  <div className="absolute inset-x-2 bottom-2 rounded-[20px] bg-white px-4 py-3 shadow-[0_12px_30px_rgba(109,53,65,0.12)] ">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="text-[1.05rem] font-medium text-stone-900">{product.name}</h3>
                      
                        <p className="mt-1 text-[1.05rem] font-semibold text-rose-800">{product.price}</p>
                      </div>
                      <ArrowCircle />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default NewLaunchSection;
