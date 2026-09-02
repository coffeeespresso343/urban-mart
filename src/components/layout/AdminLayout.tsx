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
      <aside>
        <h1 className="font-display text-2xl font-black uppercase tracking-tight">
          Admin
        </h1>
        <nav className="mt-6">
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `label-tag flex shrink-0 items-center gap-2.5 px-3 py-2.5 font-semibold transition-colors ${
                      isActive
                        ? "bg-ink text-paper"
                        : "text-ink hover:bg-paper-dim"
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
