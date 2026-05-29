import { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Contact</p>
        <h1 className="mt-4 font-serif text-4xl text-black">We&apos;d love to hear from you</h1>
        <p className="mt-4 text-black/70">
          Questions about orders, products, or partnerships? Send us a message and we&apos;ll get back
          to you within 24–48 hours.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Email</h2>
            <p className="mt-2 text-black">hello@lumiere.com</p>
            <p className="text-sm text-black/60">support@lumiere.com</p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Phone</h2>
            <p className="mt-2 text-black">+91 98765 43210</p>
            <p className="text-sm text-black/60">Mon – Sat, 10 AM – 7 PM IST</p>
          </div>

          <div className="rounded-2xl border border-primary/15 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Address</h2>
            <p className="mt-2 text-sm leading-relaxed text-black">
              42 Fashion Street, Bandra West
              <br />
              Mumbai, Maharashtra 400050
              <br />
              India
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-primary/15 bg-white p-6 shadow-sm lg:col-span-3 lg:p-8"
        >
          {submitted && (
            <p className="mb-6 rounded-lg bg-black/5 px-4 py-3 text-sm text-primary">
              Thank you! Your message has been received. We will respond soon.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-black">Name</span>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="Your name"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-black">Email</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@email.com"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm">
            <span className="font-medium text-black">Subject</span>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Order inquiry, product question..."
            />
          </label>

          <label className="mt-5 block text-sm">
            <span className="font-medium text-black">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full resize-none rounded-lg border border-black/15 px-3 py-2.5 text-black outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="How can we help you?"
            />
          </label>

          <button type="submit" className="btn-solid mt-6 w-full sm:w-auto">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
