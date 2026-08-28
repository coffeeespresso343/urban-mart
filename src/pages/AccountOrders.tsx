import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Order, OrderStatus } from "../types/Order";
import { fetchOrdersForUsers } from "../lib/Orders";
import { OrderGridSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { ArrowRight, Clock, Package } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import Badge from "../components/ui/Badge";
import { formatPrice } from "../utils/currency";

const STATUS_TONE: Record<OrderStatus, "ink" | "orange" | "good" | "warn"> = {
  processing: "orange",
  shipped: "ink",
  delivered: "good",
  cancelled: "warn",
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const AccountOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    fetchOrdersForUsers(user.id).then((data) => {
      if (!cancelled) setOrders(data);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="container-edge py-10 sm:py-14">
      <h1 className="font-display flex items-center gap-2 text-2xl font-black text-stone sm:text-3xl">
        <Clock className="h-6 w-6" strokeWidth={2.5} /> Order History
      </h1>
      {orders === null ? (
        <div className="mt-10 py-6">
          <OrderGridSkeleton count={4} />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={Package}
            title="No orders yet"
            message="Orders you place while signed in will show up here."
            action={
              <Button onClick={() => navigate("/shop")} variant="outline">
                Start Shopping <ArrowRight className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-10 flex flex-col divide-y divide-line-light border-y border-line-light">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/account/orders/${order.orderNumber}`}
              className="flex flex-wrap items-center justify-between gap-4 py-6 transition-all duration-200 hover:bg-paper-dim active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-8">
                  {order.items.slice(0, 3).map((item) => (
                    <div
                      key={item.product.id}
                      className="h-14 w-14 shrink-0 overflow-hidden border-2 rounded-lg border-paper bg-paper-dim"
                    >
                      <ImageWithFallback
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <p className="label-tag text-orange">#{order.orderNumber}</p>
                  <p className="mt-1 text-[12px] text-stone">
                    {new Date(order.placedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-[13px] text-stone">
                    {order.totals.itemCount} item
                    {order.totals.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <Badge tone={STATUS_TONE[order.status]}>
                {STATUS_LABEL[order.status]}
              </Badge>

              <span className="price text-sm font-semibold">
                {formatPrice(order.totals.total)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountOrders;
