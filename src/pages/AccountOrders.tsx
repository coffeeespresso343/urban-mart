import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Clock, Package } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import type { Order, OrderStatus } from "../types/Order";
import { fetchOrdersForUsers } from "../lib/Orders";

import { OrderGridSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui/Button";
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
    <div className="container-edge py-10 sm:py-14 lg:py-16">
      <header className="flex flex-col gap-3 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="label-tag text-orange">Your account</p>

          <h1 className="mt-4 flex items-center gap-3 font-display text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-light bg-paper-dim sm:h-11 sm:w-11">
              <Clock
                className="h-5 w-5 text-orange sm:h-6 sm:w-6"
                strokeWidth={2}
              />
            </span>
            Order History
          </h1>

          <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone">
            View your previous purchases, order status, and order details.
          </p>
        </div>
      </header>

      {orders === null ? (
        <div className="mt-5 py-4 sm:mt-10">
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
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            }
          />
        </div>
      ) : (
        <div className="mt-4 sm:mt-10">
          <div className="space-y-5">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.orderNumber}`}
                className="
                  group relative block overflow-hidden
                  rounded-2xl 
                  bg-paper border border-line-light
                  p-4
                  shadow-[0_1px_0_rgba(0,0,0,0.02)]
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:border-orange/30
                  hover:bg-paper-dim
                  hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]
                  active:translate-y-0
                  sm:p-5
                  lg:p-6
                "
              >
                <span
                  className="
                    absolute right-4 top-4
                    flex h-6 w-6 items-center justify-center
                    rounded-full 
                    bg-paper-dim text-stone
                    backdrop-blur-sm
                    transition-all duration-200
                    
                    group-hover:bg-orange
                    group-hover:text-paper
                    group-hover:rotate-45
                    sm:right-5 sm:top-5
                  "
                >
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </span>

                <div className="flex flex-col gap-5 pr-8 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-center gap-4 sm:gap-5">
                    <div className="flex shrink-0 items-center pl-1">
                      {order.items.slice(0, 3).map((item, index) => (
                        <div
                          key={item.product.id}
                          className="
                            relative h-14 w-14 overflow-hidden
                            rounded-xl border-2 border-paper
                            bg-paper-dim
                            shadow-sm
                            sm:h-16 sm:w-16
                          "
                          style={{
                            marginLeft: index === 0 ? 0 : "-18px",
                            zIndex: 3 - index,
                          }}
                        >
                          <ImageWithFallback
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}

                      {order.items.length > 3 && (
                        <div
                          className="
                            relative -ml-3 flex h-14 w-14 shrink-0
                            items-center justify-center
                            rounded-xl border-2 border-paper
                            bg-paper-dim
                            text-[11px] font-bold text-stone
                            sm:h-16 sm:w-16
                          "
                        >
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="label-tag text-orange">
                        #{order.orderNumber}
                      </p>

                      <p className="mt-1.5 text-sm font-semibold text-ink sm:text-[15px]">
                        {new Date(order.placedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>

                      <p className="mt-0.5 text-xs text-stone">
                        {order.totals.itemCount} item
                        {order.totals.itemCount === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex items-center justify-between gap-5
                      border-t border-line-light pt-4
                      sm:gap-8
                      lg:border-t-0 lg:pt-0
                    "
                  >
                    <div className="flex flex-col gap-1">
                      <span className="label-tag text-stone">Total</span>

                      <span className="price text-sm font-bold text-ink sm:text-base">
                        {formatPrice(order.totals.total)}
                      </span>
                    </div>

                    <Badge
                      tone={STATUS_TONE[order.status]}
                      className="
                        flex items-center justify-center
                        rounded-full px-3 py-1.5
                        text-[10px] font-bold uppercase tracking-[0.08em]
                      "
                    >
                      {STATUS_LABEL[order.status]}
                    </Badge>
                  </div>
                </div>

                <span
                  className="
                    absolute bottom-0 left-0 h-px w-0
                    bg-orange
                    transition-all duration-500
                    group-hover:w-full
                  "
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountOrders;
