import { Link } from 'react-router-dom';

const siteLogo =
  'https://res.cloudinary.com/dsafvwkrf/image/upload/v1780062681/S_5_cnc086.png';

function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 bg-[#f7f3ef] pb-[calc(4rem+env(safe-area-inset-bottom))] text-black/80 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
        <div>
          <Link to="/" className="inline-block">
            <img
              src={siteLogo}
              alt="Style By Her logo"
              className="h-12 w-auto max-w-[180px] object-contain sm:h-14"
            />
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-black/65">
            Curated fashion, beauty, and lifestyle essentials designed for the modern woman.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
            Quick links
          </p>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>
              <Link to="/" className="transition hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/basket" className="transition hover:text-primary">
                Basket
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
            Policies
          </p>
          <ul className="mt-3 space-y-2 text-sm text-black/70">
            <li>
              <Link to="/privacy-policy" className="transition hover:text-primary">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="transition hover:text-primary">
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link to="/shipping-and-returns" className="transition hover:text-primary">
                Shipping &amp; Returns
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-black/50">
            Stay in touch
          </p>
          <p className="mt-3 text-sm text-black/70">hello@stylebyher.com</p>
          <p className="text-sm text-black/70">+91 98765 43210</p>
        </div>
      </div>

      <div className="border-t border-black/10 py-4 text-center text-xs text-black/55">
        © {new Date().getFullYear()} Style By Her. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
