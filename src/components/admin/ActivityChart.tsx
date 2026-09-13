import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardMetrics } from "../../lib/admin";
import { Card } from "../../pages/admin/AdminOverview";

const CHART_TOOLTIP_STYLE = {
  border: "1px solid var(--color-admin-border)",
  borderRadius: 12,
  fontSize: 13,
  fontFamily: "Inter, sans-serif",
  color: "var(--color-admin-gray-light)",
};

const ActivityChart = ({
  signups,
}: {
  signups: DashboardMetrics["signupsByDay"];
}) => {
  const hasSignups = signups.some((point) => point.count > 0);

  return (
    <Card className="flex flex-col lg:col-span-2">
      <div>
        <h3 className="text-xs text-admin-gray font-semibold">
          Overall User Activity
        </h3>
        <p className="mt-1 text-xs text-admin-gray-light">
          New signups, last 14 days
        </p>

        {!hasSignups ? (
          <p className="flex flex-1 items-center justify-center py-16 text-center text-sm text-admin-gray-light">
            No signups in this window yet.
          </p>
        ) : (
          <div className="mt-4 h-56 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={signups}
                margin={{
                  top: 4,
                  right: 4,
                  left: -10,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="signupsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#7a5af8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7a5af8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-admin-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#98a2b3" }}
                  axisLine={{ stroke: "var(--color-admin-border)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#98a2b3" }}
                  axisLine={false}
                  tickLine={false}
                  width={32}
                  allowDecimals={false}
                />
                <Tooltip
                  formatter={(value) => [String(value), "New signups"]}
                  contentStyle={CHART_TOOLTIP_STYLE}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#7a5af8"
                  strokeWidth={2}
                  fill="url(#signupsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityChart;
