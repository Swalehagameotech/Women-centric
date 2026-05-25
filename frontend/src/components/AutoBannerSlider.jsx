import { useEffect, useState } from 'react';

const topPromoBanner =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779547034/Untitled_1920_x_600_px_1920_x_650_px_1920_x_100_px_1920_x_50_px_hann6x.png';

const sliderImages = [
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779544471/6_wnahva.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779544472/2_ibuziz.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779544471/1_nvytlj.png',
];

function AutoBannerSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? sliderImages.length - 1 : currentSlide - 1,
    );
  };

  const showNextSlide = () => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % sliderImages.length);
  };

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % sliderImages.length);
    }, 3500);

    return () => window.clearInterval(sliderTimer);
  }, []);

  return (
    <section className="relative z-0 pt-2 sm:pt-3">
      <div className="w-full">
        <div className="overflow-hidden bg-white shadow-sm">
          <img
            src={topPromoBanner}
            alt="Women's collection banner"
            className="block h-auto w-full object-cover"
          />
        </div>

        <div className="mt-5 px-4 sm:mt-6 sm:px-6 md:px-8">
          <div className="relative mx-auto max-w-[1600px] overflow-hidden bg-white shadow-sm">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${activeSlide * 100}%)` }}
            >
              {sliderImages.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`Women's collection slide ${index + 1}`}
                  className="block w-full shrink-0 object-cover"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={showPreviousSlide}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-stone-700 shadow-md transition hover:bg-white"
              aria-label="Previous slide"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={showNextSlide}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-stone-700 shadow-md transition hover:bg-white"
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AutoBannerSlider;
