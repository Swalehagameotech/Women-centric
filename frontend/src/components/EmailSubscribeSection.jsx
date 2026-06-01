import { useState } from 'react';

function EmailSubscribeSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      return;
    }

    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="mt-12 sm:mt-14">
      <div className="mx-auto max-w-xl rounded-2xl border border-primary/15 bg-[#f7f3ef] px-6 py-10 text-center sm:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Stay in the loop</p>
        <h2 className="mt-3 font-serif text-2xl font-medium text-black sm:text-3xl">
          Subscribe to our emails
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          Send us your email and we&apos;ll send you our latest offers, new arrivals, and style picks.
        </p>

        {submitted ? (
          <p className="mt-6 text-sm font-medium text-primary" role="status">
            Thank you! You&apos;re subscribed — watch your inbox for the latest from Style By Her.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <label htmlFor="subscribe-email" className="sr-only">
              Email address
            </label>
            <input
              id="subscribe-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@email.com"
              required
              autoComplete="email"
              className="min-w-0 flex-1 rounded-full border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-primary/40"
            />
            <button type="submit" className="btn-solid shrink-0 px-8 py-3 sm:px-10">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default EmailSubscribeSection;
