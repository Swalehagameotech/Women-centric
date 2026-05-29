import BannerSliderTrack from './BannerSliderTrack';

const desktopSliderImages = [
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779544471/6_wnahva.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779544472/2_ibuziz.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779544471/1_nvytlj.png',
];

const mobileSliderImages = [
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780050813/ChatGPT_Image_May_29_2026_03_41_14_PM_ix8rmc.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780050814/ChatGPT_Image_May_29_2026_04_02_44_PM_xgvcbq.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780050813/ChatGPT_Image_May_29_2026_04_02_50_PM_xmbr1o.png',
];

function AutoBannerSlider() {
  return (
    <section className="relative z-0 pt-0">
      <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="md:hidden">
          <BannerSliderTrack
            images={mobileSliderImages}
            imageClassName="block aspect-square w-full shrink-0 object-cover"
          />
        </div>

        <div className="hidden md:block">
          <BannerSliderTrack
            images={desktopSliderImages}
            imageClassName="block w-full shrink-0 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default AutoBannerSlider;
