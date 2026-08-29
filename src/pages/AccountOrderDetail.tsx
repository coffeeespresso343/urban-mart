import { ChevronLeft, MapPin, Package, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import type { Order, OrderStatus } from "../types/Order";
import { fetchOrderByNumber } from "../lib/Orders";
import { OrderDetailsGridSkeleton } from "../components/ui/Skeleton";
import Badge from "../components/ui/Badge";
import ImageWithFallback from "../components/ui/ImageWithFallback";
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

const STATUS_STEPS: OrderStatus[] = ["processing", "shipped", "delivered"];

const AccountOrderDetail = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    if (!orderNumber) return;
    let cancelled = false;

    fetchOrderByNumber(orderNumber).then((data) => {
      if (!cancelled) setOrder(data);
    });

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (order === undefined) {
    return (
      <div className="container-edge py-10 sm:py-14">
        <OrderDetailsGridSkeleton count={4} />
      </div>
    );
  }

  if (order === null) return <Navigate to="/account/orders" replace />;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container-edge py-10 sm:py-14">
      <Link
        to="/account/orders"
        className="text-sm flex items-center gap-0.5 text-stone hover:text-ink"
      >
        <ChevronLeft className="h-5 w-5" />
        Order History
      </Link>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight sm:text-3xl">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-stone">
            Placed{" - "}
            {new Date(order.placedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <Badge tone={STATUS_TONE[order.status]}>
          {STATUS_LABEL[order.status]}
        </Badge>
      </div>

      {order.status !== "cancelled" ? (
        <ol className="mt-8 flex items-center gap-2 sm:gap-4">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;

            return (
              <li
                key={step}
                className="flex flex-1 items-center gap-2 sm:gap-4"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                      isCompleted
                        ? "bg-orange text-paper"
                        : "bg-line-light text-stone"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`label-tag font-medium hidden sm:inline ${isCompleted ? "text-orange" : "text-stone"}`}
                  >
                    {STATUS_LABEL[step]}
                  </span>
                </div>

                {index < STATUS_STEPS.length - 1 ? (
                  <div
                    className={`h-px flex-1 ${index < currentStepIndex ? "bg-ink" : "bg-line-light"}`}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
        <div className="divide-y divide-line-light border-y border-line-light">
          {order.items.map((item) => (
            <div
              key={`${item.product.id}-${item.color ?? ""}`}
              className="flex items-center gap-4 py-5"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden bg-paper-dim rounded-lg">
                <ImageWithFallback
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product.name}</p>
                <p className="label-tag mt-1 text-stone">Qty {item.quantity}</p>
              </div>
              <span className="price text-sm font-semibold">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <div className="border border-ink/10 bg-ink/5 rounded-xl text-sm p-4">
            <div className="flex items-center justify-between text-stone">
              <span>Subtotal</span>
              <span className="text-ink font-mono">
                {formatPrice(order.totals.subtotal)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-stone">
              <span>Shipping</span>
              <span className="text-ink font-mono">
                {order.totals.shipping === 0
                  ? "Free"
                  : formatPrice(order.totals.shipping)}
              </span>
            </div>
            {order.totals.discount > 0 ? (
              <div className="mt-2 flex items-center justify-between text-good">
                <span>Discount</span>
                <span className="font-mono">
                  {formatPrice(order.totals.discount)}
                </span>
              </div>
            ) : null}

            <div className="mt-3 flex items-center justify-between border-t border-line-light pt-3 text-base font-semibold">
              <span className="label-tag">Total</span>
              <span>{formatPrice(order.totals.total)}</span>
            </div>
          </div>

          <div className="mt-2 flex items-start gap-3 rounded-xl bg-paper-dim/50 p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stone" />
            <div>
              <p className="label-tag text-stone">Shipping Address</p>
              <p className="mt-1 text-sm">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}{" "}
                <br />
                {order.shippingAddress.country}
                <br />
                {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-paper-dim/50 p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-stone" />
            <div>
              <p className="label-tag text-stone">Delivery</p>
              <p className="mt-1 text-sm">{order.shippingMethod}</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-stone">
                <Package className="h-3.5 w-3.5" />
                Estimated{" "}
                {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOrderDetail;
