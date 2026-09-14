import { Link } from "react-router-dom";
import { Card } from "../../pages/admin/AdminOverview";
import { formatPrice } from "../../utils/currency";
import { ArrowRight, Clock } from "lucide-react";
import type { DashboardMetrics } from "../../lib/admin";

const STATUS_PILL: Record<string, string> = {
  processing: "bg-admin-blue-light text-admin-blue",
  shipped: "bg-admin-purple-light text-admin-purple",
  delivered: "bg-admin-green-light text-admin-green",
  cancelled: "bg-admin-pink-light text-admin-pink",
};

const RecentOrdersTable = ({
  orders,
}: {
  orders: DashboardMetrics["recentOrders"];
}) => {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-xs text-admin-gray font-semibold">
          <Clock className="h-3.5 w-3.5 text-admin-gray" />
          Recent Orders
        </h3>

        <Link
          to="/admin/orders"
          className="text-xs font-semibold text-admin-gray hover:underline
          flex items-center gap-1"
        >
          View All
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-admin-gray-light">No orders yet.</p>
      ) : (
        <div className="mt-4 flex flex-col border-t border-admin-border divide-y divide-admin-border">
          {orders.map((order) => (
            <Link
              key={order.id}
              to="/admin/orders"
              className="flex items-center justify-between gap-3 py-3 transition duration-200 hover:bg-admin-bg active:scale-99"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">
                  {order.shippingAddress.fullName}
                </p>
                <p className="truncate text-xs text-admin-gray-light">
                  {order.shippingAddress.email}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
                  STATUS_PILL[order.status] ?? ""
                }`}
              >
                {order.status}
              </span>
              <span className="font-mono tabular-nums shrink-0 text-xs text-admin-gray font-semibold">
                {formatPrice(order.totals.total)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentOrdersTable;
