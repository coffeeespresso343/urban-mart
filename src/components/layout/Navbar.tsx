import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Shop", to: "/shop" },
  { label: "Categorries", to: "/shop#categories" },
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Best Sellers", to: "/shop?filter=best-seller" },
  { label: "Deals", to: "/shop?filter=deals" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const productIds: number[] = [1, 2, 4];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line-light bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <div className="container-edge flex h-16 items-center justify-between sm:h-20">
        <button aria-label="Open menu" className="text-ink lg:hidden">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          to="/"
          className="font-display text-lg font-black uppercase tracking-tight sm:text-xl"
        >
          Urban<span className="text-copper">-</span>Mart
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `label-tag font-medium transition-colors hover:text-copper ${
                  isActive ? "text-copper" : "text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            className="text-ink transition-colors hover:text-copper"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            to="/wishlist"
            className="relative text-ink transition-colors hover:text-copper sm:block"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {productIds.length > 0 ? (
              <span className="absolute -right-2 -top-2 h-4 w-4 flex items-center justify-center rounded-full bg-copper text-[10px] font-semibold text-paper">
                {productIds.length}
              </span>
            ) : null}
          </Link>
          <button className="relative text-ink transition-colors hover:text-copper sm:block">
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {productIds.length > 0 ? (
              <span className="absolute -right-2 -top-2 h-4 w-4 flex items-center justify-center rounded-full bg-copper text-[10px] font-semibold text-paper">
                {productIds.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
