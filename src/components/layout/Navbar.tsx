import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useUIStore } from "../../hooks/uiStore";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import AccountMenu from "./AccountMenu";
import Logo from "../../assets/Logo.png";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "New Arrivals", to: "/shop?sort=newest" },
  { label: "Best Sellers", to: "/shop?filter=best-sellers" },
  { label: "Deals", to: "/shop?filter=deals" },
  { label: "About", to: "/about" },
  { label: "Checkout", to: "/checkout" },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const openSearch = useUIStore((s) => s.openSearch);
  const openCart = useUIStore((s) => s.openCart);
  const openMobileMenu = useUIStore((s) => s.openMobileMenu);

  const { totals } = useCart();
  const { productIds } = useWishlist();

  const isActiveLink = (to: string) => {
    const url = new URL(to, window.location.origin);

    if (location.pathname !== url.pathname) return false;

    const linkParams = new URLSearchParams(url.search);
    const currentParams = new URLSearchParams(location.search);

    // if ([...linkParams.keys()].length === 0) return true;

    if (url.search) {
      return [...linkParams.entries()].every(
        ([key, value]) => currentParams.get(key) === value,
      );
    }

    if (to === "/shop") {
      return !currentParams.has("sort") && !currentParams.has("filter");
    }

    return true;
  };

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
          className="text-ink lg:hidden active:scale-[0.97]"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <Link to="/" className="flex items-center h-full w-30 lg:w-34">
          <img
            src={Logo}
            alt="Urban-Mart-Logo"
            className="h-auto w-full object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link.to);

            return (
              <NavLink
                key={link.label}
                to={link.to}
                className={`label-tag font-medium transition-colors hover:text-orange ${
                  active ? "text-orange" : "text-ink"
                }`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <button
            onClick={openSearch}
            aria-label="Search"
            className="text-ink transition-colors hover:text-orange active:scale-[0.98]"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>
          <Link
            to="/wishlist"
            className="relative text-ink transition-colors hover:text-orange sm:block active:scale-[0.97]"
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
            className="relative text-ink transition-colors hover:text-orange sm:block active:scale-[0.97]"
          >
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
            {totals.itemCount > 0 ? (
              <span className="absolute -right-2 -top-2 h-4 w-4 flex items-center justify-center rounded-full bg-orange text-[10px] font-semibold text-paper">
                {totals.itemCount}
              </span>
            ) : null}
          </button>
          <AccountMenu />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
