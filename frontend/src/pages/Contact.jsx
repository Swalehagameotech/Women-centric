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
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-600">Contact</p>
        <h1 className="mt-4 font-serif text-4xl text-rose-950">We&apos;d love to hear from you</h1>
        <p className="mt-4 text-stone-600">
          Questions about orders, products, or partnerships? Send us a message and we&apos;ll get back
          to you within 24–48 hours.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-800">Email</h2>
            <p className="mt-2 text-stone-700">hello@lumiere.com</p>
            <p className="text-sm text-stone-500">support@lumiere.com</p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-800">Phone</h2>
            <p className="mt-2 text-stone-700">+91 98765 43210</p>
            <p className="text-sm text-stone-500">Mon – Sat, 10 AM – 7 PM IST</p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-rose-800">Address</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-700">
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
          className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm lg:col-span-3 lg:p-8"
        >
          {submitted && (
            <p className="mb-6 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-800">
              Thank you! Your message has been received. We will respond soon.
            </p>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-stone-700">Name</span>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                placeholder="Your name"
              />
            </label>

            <label className="block text-sm">
              <span className="font-medium text-stone-700">Email</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                placeholder="you@email.com"
              />
            </label>
          </div>

          <label className="mt-5 block text-sm">
            <span className="font-medium text-stone-700">Subject</span>
            <input
              type="text"
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              placeholder="Order inquiry, product question..."
            />
          </label>

          <label className="mt-5 block text-sm">
            <span className="font-medium text-stone-700">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full resize-none rounded-lg border border-stone-200 px-3 py-2.5 text-stone-800 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              placeholder="How can we help you?"
            />
          </label>

          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-rose-700 py-3 text-sm font-medium text-white transition hover:bg-rose-800 sm:w-auto sm:px-8"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
