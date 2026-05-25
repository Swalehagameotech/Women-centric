import { Link } from 'react-router-dom';
import AutoBannerSlider from '../components/AutoBannerSlider';
import ExploreEleganceSection from '../components/ExploreEleganceSection';
import NewLaunchSection from '../components/NewLaunchSection';

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

const highlights = [
  'Handpicked collections for every season',
  'Inclusive sizing and thoughtful fits',
  'Secure checkout and fast delivery',
  'Dedicated support for women, by women',
];

function Home() {
  return (
    <div>
      <AutoBannerSlider />
      <ExploreEleganceSection />
      <NewLaunchSection />

      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">
              Women-centric shopping
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight text-rose-950 sm:text-5xl">
              Celebrate your style, every single day
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-stone-600">
              Discover fashion, beauty, and lifestyle products crafted with women in mind — quality
              you can trust, designs you will love.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="rounded-full bg-rose-700 px-6 py-3 text-sm font-medium text-white shadow-md transition hover:bg-rose-800"
              >
                Explore our story
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-medium text-rose-800 transition hover:border-rose-300"
              >
                Get in touch
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="aspect-[4/5] rounded-3xl bg-gradient-to-tl from-rose-200 via-rose-50 to-amber-100 p-8 shadow-xl">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/60 bg-white/40 p-6 backdrop-blur-sm">
                <p className="font-serif text-2xl text-rose-900">New arrivals</p>
                <ul className="space-y-3 text-sm text-stone-700">
                  <li className="flex justify-between border-b border-rose-100 pb-2">
                    <span>Silk evening dress</span>
                    <span className="font-medium text-rose-700">₹2,499</span>
                  </li>
                  <li className="flex justify-between border-b border-rose-100 pb-2">
                    <span>Rose glow serum</span>
                    <span className="font-medium text-rose-700">₹899</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Pearl drop earrings</span>
                    <span className="font-medium text-rose-700">₹649</span>
                  </li>
                </ul>
                <p className="text-xs text-stone-500">Free shipping on orders above ₹999</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-rose-950">Shop by category</h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-600">
            Everything you need in one place — thoughtfully curated for women who value quality
            and comfort.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {categories.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {item.emoji}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-rose-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="font-serif text-3xl text-rose-950">Why women choose Lumière</h2>
              <p className="mt-4 text-stone-600">
                We believe shopping should feel personal, empowering, and effortless. From product
                selection to customer care, every detail is built around you.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {highlights.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl bg-rose-50/80 px-4 py-3 text-sm text-stone-700"
                >
                  <span className="mt-0.5 text-rose-600">♥</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6">
        <div className="rounded-3xl border border-stone-200 bg-white px-6 py-12 text-center shadow-sm sm:px-12">
          <h2 className="font-serif text-2xl text-rose-950 sm:text-3xl">Ready to refresh your wardrobe?</h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-600">
            Join thousands of women who shop with confidence. Have questions? Our team is here to
            help.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-rose-800 transition hover:bg-rose-50"
          >
            Contact us today
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
