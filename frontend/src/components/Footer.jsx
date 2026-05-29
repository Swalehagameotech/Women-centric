import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-auto bg-primary pb-[calc(4rem+env(safe-area-inset-bottom))] text-white md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <p className="font-serif text-lg font-semibold text-white">Lumière</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Curated fashion, beauty, and lifestyle essentials designed for the modern woman.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Quick links</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link to="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/basket" className="hover:text-white">
                Basket
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Policies</p>
          <ul className="mt-3 space-y-2 text-sm text-white/85">
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-white">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/shipping-and-returns" className="hover:text-white">
                Shipping &amp; Returns
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white">Stay in touch</p>
          <p className="mt-3 text-sm text-white/85">hello@lumiere.com</p>
          <p className="text-sm text-white/85">+91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-white/20 py-4 text-center text-xs text-white/75">
        © {new Date().getFullYear()} Lumière Women&apos;s Collection. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
