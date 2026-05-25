import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-serif text-lg font-semibold text-rose-900">Lumière</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Curated fashion, beauty, and lifestyle essentials designed for the modern woman.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-stone-600">
            <li>
              <Link to="/" className="hover:text-rose-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-rose-600">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-rose-600">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-rose-800">Stay in touch</p>
          <p className="mt-3 text-sm text-stone-600">hello@lumiere.com</p>
          <p className="text-sm text-stone-600">+91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-rose-100 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Lumière Women&apos;s Collection. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
