import { useState } from "react";
import type { DashboardMetrics } from "../../lib/admin";
import { Card } from "../../pages/admin/AdminOverview";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice } from "../../utils/currency";

const CHART_TOOTIP_STYLE = {
  border: "1px solid var(--color-admin-border)",
  borderRadius: 12,
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  color: "var(--color-admin-gray-light)",
};

const RevenueChart = ({ metrics }: { metrics: DashboardMetrics }) => {
  const [range, setRange] = useState<"14d" | "monthly">("14d");
  const data = range === "14d" ? metrics.revenueByDay : metrics.revenueByMonth;
  const hasRevenue = data.some((point) => point.revenue > 0);

  return (
    <Card className="flex flex-col">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Sales Dynamic</h3>
          <div className="flex overflow-hidden rounded-full border border-admin-border text-xs">
            <button
              onClick={() => setRange("14d")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                range === "14d" ? "bg-admin-active" : "text-admin-gray"
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setRange("monthly")}
              className={`px-3 py-1.5 font-medium transition-colors ${
                range === "monthly" ? "bg-admin-active" : "text-admin-gray"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {!hasRevenue ? (
          <p className="mt-8 py-8 text-center text-sm text-admin-gray-light">
            No orders in this window yet - the chart will fill in as sales come
            through.
          </p>
        ) : (
          <div className="mt-4 h-64 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 4, right: 4, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-admin-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{
                    fontSize: 11,
                    fill: "#98a2b3",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                  axisLine={{ stroke: "var(--color-admin-border)" }}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#98a2b3",
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
                  contentStyle={CHART_TOOTIP_STYLE}
                  cursor={{ fill: "var(--color-admin-active)" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RevenueChart;
