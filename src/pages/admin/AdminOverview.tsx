import { useEffect, useState } from "react";
import { fetchDashboardMetrics, type DashboardMetrics } from "../../lib/Admin";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatPrice } from "../../utils/currency";
import {
  ArrowRight,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
  Users2,
} from "lucide-react";

import type { Product } from "../../types/Product";
import { fetchProducts, getLowStockProducts } from "../../lib/Products";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import Badge from "../../components/ui/Badge";

function MertricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) {
  return (
    <div className="group rounded-2xl border border-ink/10 bg-paper p-5 transition-colors duration-200 hover:bg-paper-dim hover:border-ink/20">
      <Icon className="h-6 w-6 text-orange" />
      <p className="label-tag mt-5 text-stone">{label}</p>
      <p className="mt-1 price text-2xl font-semibold tracking-tight text-ink">
        {value}
      </p>
    </div>
  );
}

function RevenueChart({ data }: { data: DashboardMetrics["revenueByDay"] }) {
  const hasRevenue = data.some((point) => point.revenue > 0);

  return (
    <div className="border border-line-light rounded-xl p-5">
      <h3 className="label-tag font-semibold text-stone">
        Revenue - Last 14 Days
      </h3>

      {!hasRevenue ? (
        <p className="mt-8 py-8 text-center text-sm text-stone">
          No orders in this window yet - the chart will fill in as sales come
          through.
        </p>
      ) : (
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 4, right: 4, left: -5, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#d5d8d5"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{
                  fontSize: 11,
                  fill: "#777b79",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                axisLine={{ stroke: "#d5d8d5" }}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#777b79",
                  fontFamily: "JetBrains Mono, monospace",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => formatPrice(value)}
                width={64}
              />
              <Tooltip
                formatter={(value) => [
                  formatPrice(Number(value ?? 0)),
                  "Revenue",
                ]}
                contentStyle={{
                  border: "1px solid #d5d8d5",
                  borderRadius: 10,
                  fontSize: 13,
                  fontFamily: "Inter, sans-serif",
                }}
                cursor={{ fill: "#e7e8e5" }}
              />
              <Bar
                dataKey="revenue"
                fill="#D06A3A"
                radius={[2, 2, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function RecentOrderPanel({
  orders,
}: {
  orders: DashboardMetrics["recentOrders"];
}) {
  return (
    <div className="border border-line-light rounded-xl p-5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="label-tag font-semibold text-stone">Recent Orders</h3>
        <Link
          to="/admin/orders"
          className="label-tag font-semibold text-orange hover:underline
          flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-6 text-sm text-stone">No orders yet.</p>
      ) : (
        <div className="mt-4 flex flex-col border-t border-line-light divide-y divide-line-light">
          {orders.map((order) => (
            <Link
              key={order.id}
              to="/admin/orders"
              className="flex items-center justify-between gap-3 py-3 transition duration-200 hover:bg-paper-dim/20 active:scale-99"
            >
              <div className="min-w-0">
                <p className="label-tag truncate font-semibold text-orange">
                  #{order.orderNumber}
                </p>
                <p className="mt-0.5 truncate text-xs text-stone">
                  {order.shippingAddress.email}
                </p>
              </div>
              <span className="price shrink-0 text-sm font-semibold">
                {formatPrice(order.totals.total)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function LowStockPanel({ products }: { products: Product[] }) {
  const lowStock = getLowStockProducts(products, 5);

  return (
    <div className="border border-line-light rounded-xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-1.5 text-stone label-tag font-semibold">
          <TriangleAlert className="h-3.5 w-3.5 text-warn" />
          Low Stock
        </h3>
        <Link
          to="/admin/products"
          className="label-tag font-semibold text-orange hover:underline
          flex items-center gap-1"
        >
          Manage
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {lowStock.length === 0 ? (
        <p className="mt-6 text-sm text-good ">
          Everything's well stocked - nothing at or below 5 units
        </p>
      ) : (
        <div className="mt-4 border-t border-line-light divide-y divide-line-light flex flex-col">
          {lowStock.slice(0, 6).map((product) => (
            <Link
              key={product.id}
              to="/admin/products"
              className="flex items-center justify-between gap-3 py-3 transition duration-200 hover:bg-paper-dim/20 active:scale-99"
            >
              <div className="min-w-0">
                <p className="label-tag truncate font-medium">{product.name}</p>
                <p className="label-tag mt-0.5 text-stone">{product.sku}</p>
              </div>
              <Badge
                tone={product.stock === 0 ? "error" : "warn"}
                className="text-[9px]"
              >
                {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const AdminOverview = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [produts, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDashboardMetrics().then((data) => {
      if (!cancelled) setMetrics(data);
    });

    fetchProducts().then((data) => {
      if (!cancelled) setProducts(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!metrics || !produts) {
    return (
      <div className="flex flex-col gap-5">
        <Skeleton className="h-4 w-20 rounded-md" />
        <Skeleton className="h-4 w-50 rounded-md" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-30 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="w-full h-60 rounded-xl" />
        <Skeleton className="w-full h-60 rounded-xl" />
      </div>
    );
  }
  return (
    <div>
      <div>
        <h2 className="font-display text-xl font-bold">Overview</h2>
        <p className="mt-1 text-sm text-stone">
          Monitor store performace, orders, and inventory
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MertricCard
          icon={DollarSign}
          label="Total Revenue"
          value={formatPrice(metrics.totalRevenue)}
        />
        <MertricCard
          icon={ShoppingCart}
          label="Orders"
          value={String(metrics.orderCount)}
        />
        <MertricCard
          icon={Users2}
          label="Users"
          value={String(metrics.userCount)}
        />
        <MertricCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={formatPrice(metrics.averageOrderValue)}
        />
      </div>

      <div className="mt-6">
        <RevenueChart data={metrics.revenueByDay} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentOrderPanel orders={metrics.recentOrders} />
        <LowStockPanel products={produts} />
      </div>

      <div className="mt-10">
        <h3 className="label-tag mb-4 font-semibold text-orange">
          Top Products by Revenue
        </h3>
        {metrics.topProducts.length === 0 ? (
          <p className="text-sm text-stone">
            No orders yet - top products will show up here once sales come in.
          </p>
        ) : (
          <div className="divide-y divide-line-light border-y border-line-light">
            {metrics.topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-4 transition-colors hover:bg-paper-dim/40 sm:px-5 py-3"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-paper-dim text-xs font-bold text-stone">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-xs text-stone">
                    {product.unitsSold}{" "}
                    {product.unitsSold === 1 ? "unit" : "units"}
                  </p>
                </div>

                <div className="text-right">
                  <p className="price text-sm font-semibold">
                    {formatPrice(product.revenue)}
                  </p>
                  <p className="label-tag mt-0.5 text-stone">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOverview;
