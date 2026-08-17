import { Compass, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { siFacebook, siGithub, siInstagram, siTelegram } from "simple-icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "New Arrivals", to: "/shop" },
      { label: "Best Sellers", to: "/shop?sort=newest" },
      { label: "Deals", to: "/shop?filter=deals" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Bag", to: "/cart" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping", to: "/about#shipping" },
      { label: "Returns", to: "/about#returns" },
      { label: "Contact", to: "/about#contact" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/linnkhant404",
    icon: siFacebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lynnmrattswe",
    icon: siInstagram,
  },
  {
    label: "Telegram",
    href: "https://t.me/linnkhant343",
    icon: siTelegram,
  },
  {
    label: "GitHub",
    href: "https://github.com/coffeeespresso343",
    icon: siGithub,
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-line-light bg-ink text-paper">
      <div className="container-edge grid grid-cols-2 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
          <Link
            to="/"
            className="flex items-center gap-0.5 font-body text-xl font-black tracking-tight"
          >
            Urban <span className="text-orange">Mart</span>
            <ShoppingCart className="h-5 w-5 text-orange" strokeWidth={2.5} />
          </Link>
          <p className="max-w-xs text-sm text-stone-light">
            Functional essentials designed for the way you move, work, travel
            and live.
          </p>

          <div className="mt-4 bg-orange/10 border border-orange/20 rounded-md p-3 flex flex-col items-center justify-center gap-2">
            <p className="max-w-xs text-stone text-[12px] text-center">
              Built with Heart and too much Coffee by Linn Khant
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://linnkhant.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange/10 border border-orange/20 rounded-md h-7 w-7 flex items-center justify-center"
              >
                <Compass className="h-5 w-5 text-stone-light transition-colors duration-200 hover:text-orange/90" />
              </a>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange/10 border border-orange/20 rounded-md h-7 w-7 flex items-center justify-center"
                >
                  <span className="">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-5 w-5 text-stone-light transition-colors duration-200 hover:text-orange/90"
                    >
                      <path d={link.icon.path} />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="label-tag mb-4 font-semibold text-orange">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-3">
              {col.links.map((link) => (
                <li
                  key={link.label}
                  className="text-sm text-stone-light hover:text-paper"
                >
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-edge flex flex-col items-center justify-between gap-3 border-t border-white/ py-6 text-xs text-stone ">
        <p>&copy; {new Date().getFullYear()} UrbanMart. All Rights Reserved.</p>
        <p>Built for city life.</p>
        <p>
          Developed by{" "}
          <a
            href="https://linnkhant.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/60"
          >
            Linn Khant
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
