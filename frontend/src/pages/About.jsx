import { PageTitle } from '../components/PageEmptyState';

const values = [
  {
    title: 'Empowerment',
    text: 'We celebrate women at every stage of life through products that inspire confidence.',
  },
  {
    title: 'Quality',
    text: 'Every item is selected for durability, comfort, and lasting style — never compromise.',
  },
  {
    title: 'Inclusivity',
    text: 'Diverse sizes, styles, and price points so every woman feels seen and valued.',
  },
  {
    title: 'Trust',
    text: 'Transparent pricing, honest descriptions, and responsive support you can rely on.',
  },
];

function About() {
  return (
    <div>
      <section className="page-shell mx-auto max-w-3xl bg-white text-center">
          <PageTitle align="center">Built for women, with heart</PageTitle>
          <p className="mt-5 text-base leading-relaxed text-black/70">
            Style By Her was founded with a simple mission: make premium women&apos;s
            products accessible, beautiful, and easy to shop. We are more than a store — we are a
            community that champions style, self-care, and self-expression.
          </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-primary/15 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-black">Our story</h2>
            <p className="mt-4 text-sm leading-relaxed text-black/70">
              What started as a small boutique idea has grown into a trusted destination for women
              seeking fashion, beauty, and lifestyle essentials. We partner with ethical makers and
              emerging designers who share our commitment to craftsmanship and care.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-black/70">
              Today, we serve customers across India with curated collections that blend timeless
              elegance with modern trends — because you deserve products that work as hard as you
              do.
            </p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-black">Our mission</h2>
            <p className="mt-4 text-sm leading-relaxed text-black/70">
              To create a shopping experience where women feel understood, respected, and delighted —
              from the first browse to the moment your package arrives at your door.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-black">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Curate products that meet real needs, not fleeting trends
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Support sustainable and women-led brands wherever possible
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                Listen to feedback and grow with our community
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-black">What we stand for</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-primary/15 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="font-semibold text-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
