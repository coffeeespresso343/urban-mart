import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../../hooks/uiStore";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Flame,
  Heart,
  Home,
  Info,
  Package,
  PercentDiamond,
  ShoppingCart,
  Sparkle,
  User2,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect } from "react";
import { useWishlist } from "../../hooks/useWishlist";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../assets/Logo.png";

interface NavLinkItem {
  Icon: LucideIcon;
  label: string;
  to: string;
}

const LINKS: NavLinkItem[] = [
  { Icon: Home, label: "Home", to: "/" },
  { Icon: ShoppingCart, label: "Shop", to: "/shop" },
  { Icon: Sparkle, label: "New Arrivals", to: "/shop?sort=newest" },
  { Icon: Flame, label: "Best Sellers", to: "/shop?filter=best-sellers" },
  { Icon: PercentDiamond, label: "Deals", to: "/shop?filter=deals" },
  { Icon: Info, label: "About", to: "/about" },
];

const YOU_LINKS: NavLinkItem[] = [
  { Icon: Heart, label: "Wishlist", to: "/wishlist" },
  { Icon: ShoppingCart, label: "Checkout", to: "/checkout" },
  { Icon: Package, label: "Orders", to: "/account/orders" },
];

function NavGroup({
  label,
  links,
  onNavigate,
  isActiveLink,
  wishlistCount,
  cartCount,
}: {
  label: string;
  links: NavLinkItem[];
  onNavigate: () => void;
  isActiveLink: (to: string) => boolean;
  wishlistCount: number;
  cartCount: number;
}) {
  return (
    <div className="px-4 py-4">
      <span className="label-tag mb-2 block px-2 text-stone">{label}</span>
      <ul className="flex flex-col gap-1">
        {links.map((link) => {
          const isActive = isActiveLink(link.to);
          const wishlistDot = wishlistCount > 0 && link.label === "Wishlist";
          const cartDot = cartCount > 0 && link.label === "Checkout";

          return (
            <li key={link.label}>
              <NavLink
                onClick={onNavigate}
                to={link.to}
                className={`group relative flex items-center justify-between overflow-hidden rounded-md px-4 py-3.5 font-display text-[14px]
                  font-bold tracking-tight transition-all duration-300 ${
                    isActive
                      ? "bg-white/45 text-orange shadow-lg shadow-ink/10"
                      : "text-ink hover:bg-white/45 hover:text-orange"
                  }`}
              >
                <>
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="relative">
                      <link.Icon className="h-5 w-5" aria-hidden="true" />
                      {wishlistDot || cartDot ? (
                        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-orange" />
                      ) : null}
                    </span>
                    {link.label}
                  </div>
                  <ArrowUpRight
                    className={`relative z-10 h-5 w-5 transition-all duration-300 ${
                      isActive
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    }`}
                    aria-hidden="true"
                  />
                  {!isActive && (
                    <span className="absolute inset-0 -z-0 translate-x-[-101%] bg-orange-light/70 transition-transform duration-500 ease-out group-hover:translate-x-0" />
                  )}
                </>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
const MobileNavigation = () => {
  const { user, profile, isConfigured } = useAuth();
  const { productIds } = useWishlist();
  const { totals } = useCart();
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!mobileMenuOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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

  const signedIn = isConfigured && Boolean(user);
  const initial = (
    profile?.firstName?.[0] ??
    user?.email?.[0] ??
    "U"
  ).toUpperCase();
  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName ?? ""}`.trim()
    : "Account";

  const goToAccount = () => {
    closeMobileMenu();
    navigate(signedIn ? "/account" : "/login");
  };

  return (
    <AnimatePresence>
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[95] lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeMobileMenu}
            aria-hidden="true"
            className="absolute inset-0 bg-ink/35 backdrop-blur-md"
          />
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Mobile"
            className="absolute left-0 top-0 flex h-[calc(100%-3rem)]  w-[calc(100%-5rem)] max-w-sm  flex-col overflow-hidden rounded-xl border border-white/30 bg-paper/85
            shadow-[0_25px_80px_rgba(23,22,20,0.22)] backdrop-blur-2xl supports-[backdrop-filter]:bg-paper/65"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/35 to-transparent" />
            <div className="pointer-events-none absolute -right-20 top-20 h-48 w-48 rounded-full bg-orange/10 blur-3xl" />
            <div className="relative flex items-center justify-between border-b border-line-light/80 px-5 py-5">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center h-full w-30 lg:w-34"
              >
                <img
                  src={Logo}
                  alt="Urban-Mart-Logo"
                  className="h-auto w-full object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={closeMobileMenu}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-line-light bg-white/30
              text-ink backdrop-blur-md transition-all duration-300 hover:border-orange/40 hover:bg-orange-light hover:text-orange active:scale-95"
              >
                <X
                  className="h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-90"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="flex-1 divide-y divide-line-light overflow-y-auto">
              <NavGroup
                label="Shop"
                links={LINKS}
                onNavigate={closeMobileMenu}
                isActiveLink={isActiveLink}
                wishlistCount={productIds.length}
                cartCount={totals.itemCount}
              />
              <NavGroup
                label="You"
                links={YOU_LINKS}
                onNavigate={closeMobileMenu}
                isActiveLink={isActiveLink}
                wishlistCount={productIds.length}
                cartCount={totals.itemCount}
              />
            </div>

            <div className="border-t border-line px-4 py-4">
              <span className="label-tag mb-2 block px-2 text-stone">
                Account
              </span>
              <button
                type="button"
                onClick={goToAccount}
                className="flex w-full items-center gap-3 rounded-md px-4 py-3.5 text-left transition-colors duration-300 bg-white/20 hover:bg-white/10"
              >
                {signedIn ? (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-orange">
                      {initial}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-ink">
                        {displayName}
                      </span>
                      <span className="block truncate text-xs text-stone">
                        {user?.email}
                      </span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-orange">
                      <User2 className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-ink">
                      Sign In
                    </span>
                  </>
                )}
              </button>
            </div>
          </motion.nav>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileNavigation;
