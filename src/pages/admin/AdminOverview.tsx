import { useEffect, useState } from "react";
import { fetchDashboardMetrics, type DashboardMetrics } from "../../lib/Admin";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatPrice } from "../../utils/currency";
import { DollarSign, ShoppingCart, TrendingUp, Users2 } from "lucide-react";

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
    <div className="border border-line-light p-5">
      <Icon className="h-5 w-5 text-orange" />
      <p className="label-tag mt-4 text-stone">{label}</p>
      <p className="price mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

const AdminOverview = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDashboardMetrics().then((data) => {
      if (!cancelled) setMetrics(data);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!metrics) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Overview</h2>
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
      <div className="mt-10">
        <h3 className="label-tag mb-4 font-semibold text-stone">
          Top Projucts by Revenue
        </h3>
        {metrics.topProducts.length === 0 ? (
          <p className="text-sm text-stone">
            No orders yet - top products will show up here once sales come in.
          </p>
        ) : (
          <div className="divide-y divide-line-light border-y border-line-light">
            {metrics.topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between py-3.5 text-sm"
              >
                <span className="font-medium">{product.name}</span>
                <div className="flex items-center gap-6 text-stone">
                  <span>{product.unitsSold} sold</span>
                  <span className="price font-semibold text-ink">
                    {formatPrice(product.revenue)}
                  </span>
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
