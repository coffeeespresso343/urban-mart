import { LayoutDashboard, Package, ShoppingCart, Users2 } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", end: true, Icon: LayoutDashboard },
  { label: "Users", to: "/admin/users", end: false, Icon: Users2 },
  { label: "Orders", to: "/admin/orders", end: false, Icon: ShoppingCart },
  { label: "Products", to: "/admin/products", end: false, Icon: Package },
];

const AdminLayout = () => {
  return (
    <div className="container-edge grid grid-cols-1 gap-8 py-10 sm:py-14 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight">
          Admin
        </h1>
        <nav className="mt-6">
          <ul className="flex gap-2 overflow-x-auto scrollbar-none lg:flex-col lg:overflow-visible lg:gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `label-tag flex shrink-0 border rounded-full lg:rounded-lg items-center gap-2 px-3 py-2.5 font-semibold transition-all duration-200 active:scale-97 ${
                      isActive
                        ? "bg-ink text-orange border-white"
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
  );
};

export default AdminLayout;
