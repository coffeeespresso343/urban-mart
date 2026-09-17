import { useEffect, useState, type ReactNode } from "react";
import { fetchDashboardMetrics, type DashboardMetrics } from "../../lib/admin";
import { Skeleton } from "../../components/ui/Skeleton";
import { formatPrice } from "../../utils/currency";
import {
  ArrowRight,
  Boxes,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Crown,
  Star,
  TrendingDown,
  TrendingUp,
  Users2,
  Wallet,
} from "lucide-react";

import ImageWithFallback from "../../components/ui/ImageWithFallback";
import DonutChart from "../../components/admin/DonutChart";
import RingBadge from "../../components/admin/RingBadge";
import RecentOrdersTable from "../../components/admin/RecentOrdersTable";
import ActivityChart from "../../components/admin/ActivityChart";
import RevenueChart from "../../components/admin/RevenueChart";
import LowStockTable from "../../components/admin/LowStockTable";
import { fetchProducts } from "../../lib/products";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${className} rounded-2xl border border-admin-border bg-admin-card p-4 shadow-sm`}
    >
      {children}
    </div>
  );
}

function IconTile({ icon: Icon, tint }: { icon: typeof Wallet; tint: string }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-xl"
      style={{
        backgroundColor: tint,
      }}
    >
      <Icon className="h-4 w-4" style={{ color: "#667085" }} />
    </span>
  );
}

function Delta({ pct }: { pct: number | null }) {
  if (pct === null) {
    return <span className="text-xs text-admin-gray-light">No prior data</span>;
  }

  const positive = pct >= 0;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium ${
        positive ? "text-admin-green" : "text-admin-pink"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {Math.abs(pct)}%<span>vs last period</span>
    </span>
  );
}

function StatCard({
  icon,
  tint,
  label,
  value,
  footer,
}: {
  icon: typeof Wallet;
  tint: string;
  label: string;
  value: string;
  footer?: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-admin-gray">{label}</p>
        <IconTile icon={icon} tint={tint} />
      </div>
      <p className="font-mono tabular-nums mt-4 text-3xl font-bold">{value}</p>
      {footer ? <div className="mt-2">{footer}</div> : null}
    </Card>
  );
}

const AdminOverview = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  // const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [metricsData, products] = await Promise.all([
        fetchDashboardMetrics(),
        fetchProducts(),
      ]);

      setMetrics(metricsData);
      setLowStockProducts(products);
    };

    load();
  }, []);

  // const handleRefresh = async () => {
  //   setIsRefreshing(true);

  //   try {
  //     const data = await fetchDashboardMetrics();
  //     setMetrics(data);
  //   } finally {
  //     setIsRefreshing(false);
  //   }
  // };

  if (!metrics) {
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
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard
          icon={ClipboardList}
          tint="var(--color-admin-blue-light)"
          label="Orders"
          value={String(metrics.orderCount)}
          footer={<Delta pct={metrics.orderCountDeltaPct} />}
        />
        <StatCard
          icon={CheckCircle2}
          tint="var(--color-admin-green-light)"
          label="Delivered"
          value={String(metrics.deliveredCount)}
          footer={
            <span className="text-xs text-admin-gray-light">
              {metrics.fulfillmentRatePct}% fulfillment rate
            </span>
          }
        />
        <Card>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-admin-gray">Users</p>
            <IconTile icon={Users2} tint="var(--color-admin-gold-light)" />
          </div>
          <p className="font-mono tabular-nums mt-4 text-3xl font-bold">
            {metrics.userCount}
          </p>
          <div className="mt-3">
            <DonutChart slices={metrics.userSegments} size={64} />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-admin-gray">Stock Health</p>
            <IconTile icon={Boxes} tint="var(--color-admin-purple-light)" />
          </div>
          <p className="font-mono tabular-nums mt-4 text-3xl font-bold">
            {metrics.stockHealth.find((s) => s.label === "Low Stock")!.value +
              metrics.stockHealth.find((s) => s.label === "Out of Stock")!
                .value}
            <span className="ml-1.5 text-xs font-normal text-admin-gray-light">
              need attention
            </span>
          </p>
          <div className="mt-3">
            <DonutChart slices={metrics.stockHealth} size={64} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[220px_1fr_180px]">
        <div className="flex flex-col gap-5">
          <StatCard
            icon={Calendar}
            tint="var(--color-admin-purple-light)"
            label="This Month"
            value={formatPrice(metrics.currentMonthRevenue)}
          />
          <StatCard
            icon={Wallet}
            tint="var(--color-admin-green-light)"
            label="Total Revenue"
            value={formatPrice(metrics.totalRevenue)}
            footer={<Delta pct={metrics.revenueDeltaPct} />}
          />
        </div>

        <RevenueChart metrics={metrics} />

        <div className="flex flex-row sm:flex-col gap-5">
          <Card className="flex flex-col w-full items-center gap-3 text-center lg:w-auto">
            <RingBadge
              percent={metrics.fulfillmentRatePct}
              color="#7a5af8"
              size={56}
            />
            <div>
              <p className="text-xs font-medium text-admin-gray">Fulfillment</p>
              <p className="font-mono tabular-nums text-lg mt-1 font-bold">
                {metrics.deliveredCount} orders
              </p>
            </div>
          </Card>
          <Card className="flex flex-col w-full items-center gap-3 text-center lg:w-auto">
            <RingBadge
              percent={Math.min(100, Math.abs(metrics.revenueDeltaPct ?? 0))}
              color={(metrics.revenueDeltaPct ?? 0) ? "#12b76a" : "#f04438"}
              size={56}
            />
            <div>
              <p className="text-xs font-medium text-admin-gray">
                Revenue Growth
              </p>
              <p className="font-mono tabular-nums text-lg mt-1 font-bold">
                {formatPrice(metrics.totalRevenue)}
              </p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-col-1 gap-5 lg:grid-cols-3">
        <ActivityChart signups={metrics.signupsByDay} />
        <RecentOrdersTable orders={metrics.recentOrders} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-1.5 text-xs text-admin-gray font-semibold">
              <TrendingUp className="h-3.5 w-3.5 text-admin-green" />
              Top Products by Revenue
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-semibold text-admin-gray hover:underline
          flex items-center gap-1"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {metrics.topProducts.length === 0 ? (
            <p className="text-sm mt-6 text-admin-gray">
              No orders yet - top products will show up here once sales come in.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-admin-border border-t border-admin-border">
              {metrics.topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between py-3 gap-2 text-sm last:pb-0 hover:bg-admin-bg"
                >
                  <span className="mr-2 shrink-0 text-xs font-bold text-admin-gray">
                    {index + 1}
                  </span>
                  <div className="relative h-10 w-10">
                    {index <= 2 ? (
                      <span className="absolute -right-1 -top-1 h-3.5 w-3.5 bg-admin-active flex items-center justify-center rounded-full">
                        {index === 0 ? (
                          <Crown
                            className="h-2.5 w-2.5 text-admin-gold"
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Star
                            className="h-2.5 w-2.5  text-admin-gold"
                            strokeWidth={2.5}
                          />
                        )}
                      </span>
                    ) : null}
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="min-w-0 ml-2 flex-1">
                    <p className="font-semibold text-admin-ink">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-xs text-admin-gray-light">
                      {product.unitsSold}{" "}
                      {product.unitsSold === 1 ? "unit" : "units"} sold
                    </p>
                  </div>

                  <div className="text-right font-mono text-xs text-admin-gray">
                    <p className="text-sm font-semibold">
                      {formatPrice(product.revenue)}
                    </p>
                    <p className=" mt-0.5">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        <LowStockTable products={lowStockProducts} />
      </div>
    </div>
  );
};

export default AdminOverview;
