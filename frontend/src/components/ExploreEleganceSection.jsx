import { Link } from 'react-router-dom';
import { SectionTitle } from './PageEmptyState';

const eleganceSlides = [
  {
    image:
      'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780315690/7_wn5gxi.png',
    to: '/category/indian-wear',
    label: 'Indian Wear',
  },
  
  {
    image:
      'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780315690/8_giptin.png',
    to: '/category/womens-wear',
    label: 'Womens Wear',
  },
  {
    image: 'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710948/2_mi01qx.png',
    to: '/category/luxury-accessories',
    label: 'Luxury Accessories',
  },
  {
    image: 'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/4_kzgtqj.png',
    to: '/category/bags',
    label: 'Bags',
  },
  {
    image: 'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/3_ycsbrj.png',
    to: '/category/footwear',
    label: 'Footwear',
  },
  {
    image: 'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780139161/Untitled_500_x_400_px_3_rgsob1.png',
    to: '/category/luxury-essentials',
    label: 'Luxury Essentials',
  },
];

const featureItems = [
  {
    title: 'Premium Quality',
    shortLabel: 'Premium',
    mobileHint: 'Handpicked',
    description: 'Handpicked. Trusted. Loved.',
    icon: 'diamond',
  },
  {
    title: 'Easy Returns',
    shortLabel: 'Returns',
    mobileHint: '7-day returns',
    description: 'Hassle-free returns within 7 days.',
    icon: 'box',
  },
  {
    title: 'Free Shipping',
    shortLabel: 'Shipping',
    mobileHint: 'Above ₹1499',
    description: 'On orders above ₹1499.',
    icon: 'truck',
  },
  {
    title: 'Secure Payments',
    shortLabel: 'Secure',
    mobileHint: 'Safe checkout',
    description: '100% safe & secured checkout.',
    icon: 'shield',
  },
];

function FeatureIcon({ type }) {
  const commonProps = {
    className: 'h-5 w-5',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  if (type === 'diamond') {
    return (
      <svg {...commonProps}>
        <path d="M3 9.5 7.5 4h9L21 9.5 12 20 3 9.5Z" />
        <path d="M7.5 4 12 20 16.5 4" />
        <path d="M3 9.5h18" />
      </svg>
    );
  }

  if (type === 'box') {
    return (
      <svg {...commonProps}>
        <path d="M12 3 4.5 7 12 11l7.5-4L12 3Z" />
        <path d="M4.5 7v10L12 21l7.5-4V7" />
        <path d="M12 11v10" />
      </svg>
    );
  }

  if (type === 'truck') {
    return (
      <svg {...commonProps}>
        <path d="M3 6h10v9H3Z" />
        <path d="M13 9h4l3 3v3h-7Z" />
        <circle cx="8" cy="18" r="2" />
        <circle cx="18" cy="18" r="2" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M12 3 5 6v5c0 5 3.4 8.7 7 10 3.6-1.3 7-5 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.6 1.6 3.4-3.6" />
    </svg>
  );
}

function FeatureItem({ title, description, icon }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary">
        <FeatureIcon type={icon} />
      </span>
      <div>
        <p className="text-sm font-semibold text-black">{title}</p>
        <p className="mt-1 text-xs leading-5 text-black/70 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

function FeatureItemMobile({ shortLabel, mobileHint, icon }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center px-0.5 py-2.5 text-center">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/30 text-primary [&_svg]:h-3.5 [&_svg]:w-3.5">
        <FeatureIcon type={icon} />
      </span>
      <p className="mt-1 text-[9px] font-semibold leading-tight text-black">{shortLabel}</p>
      <p className="mt-0.5 text-[8px] leading-tight text-black/65">{mobileHint}</p>
    </div>
  );
}

function ExploreEleganceSection() {
  return (
    <section className="mx-auto w-full max-w-[1600px] overflow-x-hidden px-4 sm:px-6 md:px-8">
      <div className="mb-6 ">
        <SectionTitle>Explore Elegance</SectionTitle>
      </div>

      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex min-w-max gap-5 sm:gap-6">
          {eleganceSlides.map((slide) => (
            <Link
              key={slide.to}
              to={slide.to}
              className="w-[260px] shrink-0 overflow-hidden bg-white transition hover:opacity-95 sm:w-[320px] lg:w-[430px]"
            >
              <img
                src={slide.image}
                alt={slide.label}
                className="block h-auto w-full object-cover"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 w-full overflow-hidden rounded-[22px] border border-primary/15 bg-white shadow-[0_10px_30px_rgba(94,48,62,0.06)]">
        <div className="flex w-full divide-x divide-primary/10 md:hidden">
          {featureItems.map((item) => (
            <FeatureItemMobile
              key={item.title}
              shortLabel={item.shortLabel}
              mobileHint={item.mobileHint}
              icon={item.icon}
            />
          ))}
        </div>

        <div className="hidden md:grid md:grid-cols-4">
          {featureItems.map((item) => (
            <FeatureItem
              key={item.title}
              title={item.title}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExploreEleganceSection;
