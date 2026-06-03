import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AutoBannerSlider from '../components/AutoBannerSlider';
import BestsellerCategoriesSection from '../components/BestsellerCategoriesSection';
import DiscountDealsSection from '../components/DiscountDealsSection';
import ExploreEleganceSection from '../components/ExploreEleganceSection';
import NewLaunchSection from '../components/NewLaunchSection';
import { SectionTitle } from '../components/PageEmptyState';

const heroPromoMessage = '50% off on Luxury Bags grab the opportunity';
const heroPromoVideo =
  'https://res.cloudinary.com/dsafvwkrf/video/upload/v1779802589/Firefly_Luxury_fashion_ad_cinematic_aesthetic._Scene_1-_elegant_Indian_woman_walking_in_pastel_sare_1_n1pebp.mp4';

const categories = [
  {
    title: 'Fashion',
    description: 'Dresses, ethnic wear, and everyday staples tailored for you.',
    emoji: '👗',
  },
  {
    title: 'Beauty',
    description: 'Skincare, makeup, and wellness picks from trusted brands.',
    emoji: '✨',
  },
  {
    title: 'Accessories',
    description: 'Bags, jewelry, and finishing touches for every occasion.',
    emoji: '💍',
  },
];

const promiseItems = [
  { title: 'Curated Collections', icon: 'sparkles' },
  { title: 'Inclusive Sizing', icon: 'size' },
  { title: 'Secure Checkout', icon: 'shield' },
  { title: '100+ Happy Clients', icon: 'users' },
  { title: 'Easy Returns', icon: 'refresh' },
  { title: 'Personal Styling', icon: 'heart' },
  { title: 'Quality Checked', icon: 'badge' },
  { title: 'Transparent Prices', icon: 'eye' },
  { title: 'Women-First Support', icon: 'sparkles' },
];

function PromiseIcon({ type }) {
  const commonProps = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (type === 'sparkles') {
    return (
      <svg {...commonProps}>
        <path d="m12 3 1.1 3.4L16.5 7l-3.4 1.1L12 11.5l-1.1-3.4L7.5 7l3.4-1.1L12 3Z" />
        <path d="m18.5 13 0.7 2.1 2.1 0.7-2.1 0.7-0.7 2.1-0.7-2.1-2.1-0.7 2.1-0.7 0.7-2.1Z" />
        <path d="m5.5 14 0.8 2.2 2.2 0.8-2.2 0.8-0.8 2.2-0.8-2.2-2.2-0.8 2.2-0.8 0.8-2.2Z" />
      </svg>
    );
  }

  if (type === 'size') {
    return (
      <svg {...commonProps}>
        <path d="M4 7h16" />
        <path d="M4 17h16" />
        <path d="M7 4v16" />
        <path d="M17 4v16" />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg {...commonProps}>
        <path d="M12 3 5 6v5c0 5 3.4 8.7 7 10 3.6-1.3 7-5 7-10V6l-7-3Z" />
        <path d="m9.5 12 1.6 1.6 3.4-3.6" />
      </svg>
    );
  }

  if (type === 'truck') {
    return (
      <svg {...commonProps}>
        <path d="M3 7h11v8H3Z" />
        <path d="M14 10h3l3 3v2h-6Z" />
        <circle cx="8" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    );
  }

  if (type === 'refresh') {
    return (
      <svg {...commonProps}>
        <path d="M20 6v6h-6" />
        <path d="M4 18v-6h6" />
        <path d="M7 17a7 7 0 0 0 11-3" />
        <path d="M17 7A7 7 0 0 0 6 10" />
      </svg>
    );
  }

  if (type === 'heart') {
    return (
      <svg {...commonProps}>
        <path d="m12 20-1.2-1.1C5.2 13.9 2 11 2 7.5 2 5 4 3 6.5 3c1.7 0 3.4.8 4.5 2.1C12.1 3.8 13.8 3 15.5 3 18 3 20 5 20 7.5c0 3.5-3.2 6.4-8.8 11.4Z" />
      </svg>
    );
  }

  if (type === 'badge') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="9" r="4" />
        <path d="m9 13-1 8 4-2 4 2-1-8" />
      </svg>
    );
  }

  if (type === 'eye') {
    return (
      <svg {...commonProps}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function Home() {
  const promiseSectionRef = useRef(null);
  const [showPromiseSection, setShowPromiseSection] = useState(false);

  useEffect(() => {
    const section = promiseSectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowPromiseSection(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-clip">
      <section className="pt-2 sm:pt-3">
        <div className="w-full">
          <div className="promo-strip text-center">
            <p className="relative z-10 text-sm font-bold tracking-[0.2px] text-white">{heroPromoMessage}</p>
          </div>

          <div className="mt-5 overflow-hidden">
            <video
              className="block h-[300px] w-full object-cover sm:h-[420px] lg:h-[520px]"
              src={heroPromoVideo}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      <div className="home-sections mt-10 pb-10">
        <ExploreEleganceSection />
        <AutoBannerSlider />
        <NewLaunchSection />
        <div className="-mt-4">
          <BestsellerCategoriesSection />
        </div>

        <DiscountDealsSection />

        <section ref={promiseSectionRef} className="overflow-hidden bg-white">
        <div
          className={`mx-auto max-w-7xl px-4 transition-all duration-700 ease-out sm:px-6 ${
            showPromiseSection
              ? 'translate-x-0 opacity-100'
              : 'opacity-0 md:translate-x-24'
          }`}
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
            <div className="lg:pr-4">
              <div className="hidden items-center gap-5 lg:flex">
                <SectionTitle align="left" size="xl" className="hidden lg:block">
                  Why Women
                  <br />
                  Choose Style By Her
                </SectionTitle>
                <span className="h-px flex-1 bg-primary/30" />
              </div>

              <div className="lg:hidden">
                <SectionTitle align="left">Why Women Choose Style By Her</SectionTitle>
              </div>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-black/70">
                We believe shopping should feel personal, empowering, and effortless. From product
                selection to customer care, every detail is built around you.
              </p>
            </div>

            <div className="rounded-[28px] border border-primary/20 bg-white px-3 py-4 shadow-[0_12px_36px_rgba(94,48,62,0.08)] sm:px-6 sm:py-6">
              <div className="grid grid-cols-3 gap-x-2 gap-y-5 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-6">
                {promiseItems.map((item) => (
                  <div key={item.title} className="flex flex-col items-center text-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white sm:h-14 sm:w-14">
                      <PromiseIcon type={item.icon} />
                    </span>
                    <p className="mt-2 text-[10px] font-medium leading-tight text-black sm:mt-3 sm:text-sm sm:leading-6">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden">
          <img
            className="h-[340px] w-full object-cover sm:h-[420px]"
            src="https://res.cloudinary.com/dsafvwkrf/image/upload/v1780321343/ChatGPT_Image_Jun_1_2026_07_11_45_PM_nbgu9y.png"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 flex items-center justify-center px-6 text-center sm:px-12">
            <div>
              <h2 className="font-serif text-2xl text-white sm:text-3xl">Ready to refresh your wardrobe?</h2>
              <p className="mx-auto mt-3 max-w-lg text-white/90">
                Join thousands of women who shop with confidence. Have questions? Our team is here to
                help.
              </p>
              <Link
                to="/contact"
                className="btn-solid mt-6 inline-block"
              >
                Contact us today
              </Link>
            </div>
          </div>
        </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
