import {
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Settings,
  ShoppingCart,
  Sun,
  Users2,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "../ui/Toast";
import { useAuth } from "../../hooks/useAuth";
import { useAdminTheme } from "../../hooks/useAdminTheme";
import Logo from "../../assets/Logo.png";
import LogoLight from "../../assets/logo-light.png";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", end: true, Icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", end: false, Icon: Users2 },
  { label: "Orders", to: "/admin/orders", end: false, Icon: ShoppingCart },
  { label: "Products", to: "/admin/products", end: false, Icon: Package },
];

const AdminLayout = () => {
  const { theme, toggleTheme } = useAdminTheme();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={`${theme === "dark" ? "admin-dark" : ""} flex min-h-screen bg-admin-bg text-admin-ink`}
    >
      <aside className="hidden w-55 shrink-0 rounded-b-2xl flex-col bg-admin-card px-4 py-6 lg:sticky lg:self-start top-0 lg:flex">
        <div className="flex items-center gap-2 px-2">
          <Link to="/" className="flex items-center h-full w-30 lg:w-34">
            <img
              src={`${theme === "dark" ? LogoLight : Logo}`}
              alt="Urban-Mart-Logo"
              className="h-auto w-full object-contain"
            />
          </Link>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-97 ${
                  isActive
                    ? "bg-admin-active text-admin-ink"
                    : "text-admin-gray hover:bg-admin-active/60"
                }`
              }
            >
              <item.Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-admin-border pt-4">
          <button
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-admin-gray
          transition-all duration-200 active:scale-97 hover:bg-admin-active/60"
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-admin-gray
          transition-all duration-200 active:scale-97 hover:bg-admin-active/60"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>
      <nav className="fixed inset-x-0 z-40 bottom-0 border-t border-admin-border bg-admin-card/95 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-3 text-[11px] font-medium transition-colors active:scale-97 ${
                  isActive
                    ? "bg-admin-active text-admin-ink"
                    : "text-admin-gray"
                }`
              }
            >
              <item.Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-admin-border bg-admin-bg/95 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-34 sm:w-34 lg:hidden">
              <img
                src={`${theme === "dark" ? LogoLight : Logo}`}
                alt="Urban-Mart-Logo"
                className="h-auto w-full object-contain"
              />
            </Link>

            <h1 className="hidden lg:block font-display text-2xl font-bold">
              Analytics
            </h1>
          </div>
          <div className="flex items-center overflow-hidden rounded-full border border-admin-border bg-admin-card">
            <button
              onClick={() => theme === "dark" && toggleTheme()}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                theme === "light"
                  ? "bg-admin-gold text-white"
                  : "text-admin-gray-light"
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => theme === "light" && toggleTheme()}
              className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                theme === "dark"
                  ? "bg-admin-gray text-white"
                  : "text-admin-gray-light"
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-6">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
