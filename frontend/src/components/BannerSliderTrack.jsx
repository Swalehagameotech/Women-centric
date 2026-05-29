import { useEffect, useState } from 'react';

function BannerSliderTrack({ images, imageClassName = 'block w-full shrink-0 object-cover' }) {
  const [activeSlide, setActiveSlide] = useState(0);

  const showPreviousSlide = () => {
    setActiveSlide((currentSlide) =>
      currentSlide === 0 ? images.length - 1 : currentSlide - 1,
    );
  };

  const showNextSlide = () => {
    setActiveSlide((currentSlide) => (currentSlide + 1) % images.length);
  };

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % images.length);
    }, 3500);

    return () => window.clearInterval(sliderTimer);
  }, [images.length]);

  if (!images.length) {
    return null;
  }

  return (
    <div className="relative mx-auto max-w-[1600px] overflow-hidden bg-white shadow-sm">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <img
            key={image}
            src={image}
            alt={`Collection slide ${index + 1}`}
            className={imageClassName}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPreviousSlide}
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-primary shadow-md transition hover:bg-white sm:left-3 sm:h-10 sm:w-10"
            aria-label="Previous slide"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={showNextSlide}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-primary shadow-md transition hover:bg-white sm:right-3 sm:h-10 sm:w-10"
            aria-label="Next slide"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}

export default BannerSliderTrack;
