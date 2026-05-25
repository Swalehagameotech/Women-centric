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
      <section className="bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">About us</p>
          <h1 className="mt-4 font-serif text-4xl text-rose-950">Built for women, with heart</h1>
          <p className="mt-5 text-base leading-relaxed text-stone-600">
            Lumière Women&apos;s Collection was founded with a simple mission: make premium women&apos;s
            products accessible, beautiful, and easy to shop. We are more than a store — we are a
            community that champions style, self-care, and self-expression.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-rose-900">Our story</h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              What started as a small boutique idea has grown into a trusted destination for women
              seeking fashion, beauty, and lifestyle essentials. We partner with ethical makers and
              emerging designers who share our commitment to craftsmanship and care.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              Today, we serve customers across India with curated collections that blend timeless
              elegance with modern trends — because you deserve products that work as hard as you
              do.
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
            <h2 className="font-serif text-2xl text-rose-900">Our mission</h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-600">
              To create a shopping experience where women feel understood, respected, and delighted —
              from the first browse to the moment your package arrives at your door.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-stone-700">
              <li className="flex gap-2">
                <span className="text-rose-600">•</span>
                Curate products that meet real needs, not fleeting trends
              </li>
              <li className="flex gap-2">
                <span className="text-rose-600">•</span>
                Support sustainable and women-led brands wherever possible
              </li>
              <li className="flex gap-2">
                <span className="text-rose-600">•</span>
                Listen to feedback and grow with our community
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center font-serif text-3xl text-rose-950">What we stand for</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-rose-100 bg-white p-6 text-center shadow-sm"
              >
                <h3 className="font-semibold text-rose-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
