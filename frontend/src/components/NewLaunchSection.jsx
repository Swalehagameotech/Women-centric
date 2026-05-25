const newLaunchProducts = [
  {
    name: 'Rose Satin Dress',
    price: '₹2,499',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Classic Handbag',
    price: '₹1,899',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Elegant Heels',
    price: '₹1,599',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pearl Detail Kurti',
    price: '₹1,749',
    image:
      'https://images.unsplash.com/photo-1618244972963-dbad68f59fcb?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Minimal Gold Watch',
    price: '₹2,199',
    image:
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Luxury Perfume',
    price: '₹1,999',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80',
  },
];

function NewLaunchSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-10 pt-4 sm:px-6 sm:pb-12 sm:pt-6 md:px-8">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-medium text-rose-950 sm:text-4xl">New Launch</h2>
      </div>

      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 px-4 py-6 sm:px-5 sm:py-7">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex min-w-max gap-5 sm:gap-6">
            {newLaunchProducts.map((product) => (
              <article
                key={product.name}
                className="w-[245px] shrink-0 overflow-hidden border border-rose-100 bg-white shadow-sm sm:w-[270px] md:w-[290px]"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-[270px] w-full object-cover sm:h-[290px] md:h-[310px]"
                  loading="lazy"
                />
                <div className="px-4 py-4">
                  <h3 className="text-base font-semibold text-rose-950 sm:text-lg">{product.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">Fresh picks for your wardrobe and style.</p>
                  <p className="mt-3 text-sm font-semibold text-rose-700">{product.price}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewLaunchSection;
