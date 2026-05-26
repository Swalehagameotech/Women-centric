const eleganceImages = [
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/Untitled_500_x_400_px_1_khw6uz.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710948/2_mi01qx.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/4_kzgtqj.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/3_ycsbrj.png',
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1779710818/5_mtynxn.png',
];

const featureItems = [
  {
    title: 'Premium Quality',
    description: 'Handpicked. Trusted. Loved.',
    icon: 'diamond',
  },
  {
    title: 'Easy Returns',
    description: 'Hassle-free returns within 7 days.',
    icon: 'box',
  },
  {
    title: 'Free Shipping',
    description: 'On orders above ₹1499.',
    icon: 'truck',
  },
  {
    title: 'Secure Payments',
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
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-rose-200 text-rose-800">
        <FeatureIcon type={icon} />
      </span>
      <div>
        <p className="text-sm font-semibold text-stone-900">{title}</p>
        <p className="mt-1 text-xs leading-5 text-stone-600 sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

function ExploreEleganceSection() {
  return (
    <section className="mx-auto max-w-[1600px] px-4 pb-8 pt-8  sm:px-6 sm:pt-14 md:px-8">
      <div className="mb-6 ">
        <h2 className="font-serif text-3xl text-center font-medium text-rose-950 sm:text-4xl">Explore Elegance</h2>
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

      <div className="mt-4 overflow-hidden rounded-[22px] border border-rose-100 bg-gradient-to-r from-[#fff7f4] to-[#fffdfc] shadow-[0_10px_30px_rgba(109,53,65,0.06)]">
        <div className="grid md:grid-cols-4">
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
