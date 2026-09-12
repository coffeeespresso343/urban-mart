import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShieldUser,
  ShoppingCart,
  Users2,
} from "lucide-react";
import { useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import MobileNavigation from "./MobileNavigation";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "../cart/CartDrawer";
import { ToastContainer } from "../ui/Toast";
import { useAuth } from "../../hooks/useAuth";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", end: true, Icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", end: false, Icon: Users2 },
  { label: "Orders", to: "/admin/orders", end: false, Icon: ShoppingCart },
  { label: "Products", to: "/admin/products", end: false, Icon: Package },
];

const AdminLayout = () => {
  const location = useLocation();

  const { user, profile } = useAuth();

  useEffect(() => {
    const activeItem = NAV_ITEMS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    );

    if (!activeItem) return;

    const element = document.querySelector(`a[href="${activeItem.to}"]`);
    element?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="container-edge grid grid-cols-1 gap-8 py-5 sm:py-10 lg:grid-cols-[220px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex items-start gap-2 bg-paper-dim w-fit pr-5 lg:pr-0 py-4 px-2 rounded-lg lg:w-auto">
              <div className="relative">
                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-paper ring-2 ring-orange/30">
                  <ShieldUser className="h-5 w-5 text-orange" />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium flex items-center gap-1.5">
                  {profile?.firstName} {profile?.lastName}
                  <ShieldCheck className="h-3 w-3 text-good" strokeWidth={2} />
                </p>
                <p className="text-stone text-xs">{user?.email}</p>
              </div>
            </div>

            <nav className="mt-6">
              <ul className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-col lg:overflow-visible lg:gap-3">
                {NAV_ITEMS.map((item) => (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `label-tag flex shrink-0 border rounded-lg items-center gap-2 px-3 py-2.5 font-semibold transition-all duration-200 active:scale-97 ${
                          isActive
                            ? "bg-ink/90 text-orange border-white"
                            : "text-ink bg-paper-dim/50 border-paper/5 hover:bg-paper-dim hover:text-orange"
                        }`
                      }
                    >
                      <item.Icon className="h-4 w-4" />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </main>
      <MobileNavigation />
      <SearchOverlay />
      <CartDrawer />
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
