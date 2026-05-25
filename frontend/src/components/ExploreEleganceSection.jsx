const eleganceImages = [
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/Untitled_500_x_400_px_1_khw6uz.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710948/2_mi01qx.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/4_kzgtqj.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/3_ycsbrj.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/5_mtynxn.png',
];

function ExploreEleganceSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-8  sm:px-6 sm:pt-14 md:px-8">
      <div className="mb-6 ">
        <h2 className="font-serif text-3xl font-medium text-rose-950 sm:text-4xl">Explore Elegance</h2>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex min-w-max gap-5 sm:gap-6">
          {eleganceImages.map((image, index) => (
            <div
              key={image}
              className="w-[320px] shrink-0 overflow-hidden  bg-white lg:w-[430px]"
            >
              <img
                src={image}
                alt={`Explore Elegance collection ${index + 1}`}
                className="block h-auto w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreEleganceSection;
