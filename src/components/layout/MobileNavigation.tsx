import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../../hooks/uiStore";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowUpRight,
  Flame,
  Heart,
  Home,
  Info,
  PercentDiamond,
  ShoppingCart,
  Sparkle,
  X,
} from "lucide-react";
import { useEffect } from "react";

const LINKS = [
  { Icon: Home, label: "Home", to: "/" },
  { Icon: ShoppingCart, label: "Shop", to: "/shop" },
  { Icon: Sparkle, label: "New Arrivals", to: "/shop?sort=newest" },
  { Icon: Flame, label: "Best Sellers", to: "/shop?filter=best-sellers" },
  { Icon: PercentDiamond, label: "Deals", to: "/shop?filter=deals" },
  { Icon: Heart, label: "Wishlist", to: "/wishlist" },
  { Icon: Info, label: "About", to: "/about" },
];

const MobileNavigation = () => {
  const mobileMenuOpen = useUIStore((s) => s.mobileMenuOpen);
  const closeMobileMenu = useUIStore((s) => s.closeMobileMenu);

  const isActiveLink = (to: string) => {
    const url = new URL(to, window.location.href);

    return (
      location.pathname === url.pathname &&
      location.search === url.search &&
      location.hash === url.hash
    );
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
            className="absolute left-0 top-0 flex h-[calc(100%-5rem)]  w-[calc(100%-5rem)] max-w-sm  flex-col overflow-hidden rounded-xl border border-white/30 bg-paper/85
            shadow-[0_25px_80px_rgba(23,22,20,0.22)] backdrop-blur-2xl supports-[backdrop-filter]:bg-paper/65"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white/35 to-transparent" />
            <div className="pointer-events-none absolute -right-20 top-20 h-48 w-48 rounded-full bg-orange/10 blur-3xl" />
            <div className="relative flex items-center justify-between border-b border-line-light/80 px-5 py-5">
              <Link
                to="/"
                className="flex items-center gap-0.5 font-body text-lg font-black tracking-tight sm:text-xl"
              >
                Urban <span className="text-orange">Mart</span>
                <ShoppingCart
                  className="h-5 w-5 text-orange"
                  strokeWidth={2.5}
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
            <ul className="flex flex-col gap-1 px-4 py-4">
              {LINKS.map((link) => {
                const isActive = isActiveLink(link.to);

                return (
                  <li key={link.label}>
                    <NavLink
                      onClick={closeMobileMenu}
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
                          <span>{<link.Icon className="h-5 w-5" />}</span>{" "}
                          {link.label}
                        </div>
                        <ArrowUpRight
                          className={`relative z-10 h-5 w-5 transition-all duration-300 ${
                            isActive
                              ? "translate-x-0 opacity-100"
                              : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
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
          </motion.nav>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileNavigation;
