import { Heart, Menu, Search, ShoppingBag, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUIStore } from "../../hooks/uiStore";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/shop#categories" },
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Best Sellers", to: "/shop?filter=best-seller" },
  { label: "Deals", to: "/shop?filter=deals" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const openMobileMenu = useUIStore((s) => s.openMobileMenu);

  const { totals } = useCart();
  const { productIds } = useWishlist();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-line-light bg-paper/90 backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <div className="container-edge flex h-16 items-center justify-between sm:h-20">
        <button
          onClick={openMobileMenu}
          aria-label="Open menu"
          className="text-ink lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link
          to="/"
          className="flex items-center gap-0.5 font-body text-lg font-black tracking-tight sm:text-xl"
        >
          Urban <span className="text-orange">Mart</span>
          <ShoppingCart className="h-5 w-5 text-orange" strokeWidth={2.5} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `label-tag font-medium transition-colors hover:text-orange ${
                  isActive ? "text-orange" : "text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={openSearch}
            aria-label="Search"
            className="text-ink transition-colors hover:text-orange"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            to="/wishlist"
            className="relative text-ink transition-colors hover:text-orange sm:block"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {productIds.length > 0 ? (
              <span className="absolute -right-2 -top-2 h-4 w-4 flex items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-paper">
                {productIds.length}
              </span>
            ) : null}
          </Link>
          <button
            onClick={openCart}
            className="relative text-ink transition-colors hover:text-orange sm:block"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {totals.itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 h-4 w-4 flex items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-paper">
                {totals.itemCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
