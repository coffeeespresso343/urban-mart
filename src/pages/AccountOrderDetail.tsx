import { Check, ChevronLeft, MapPin, Package, Truck } from "lucide-react";
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
      <div className="container-edge py-14 sm:py-20">
        <OrderDetailsGridSkeleton count={4} />
      </div>
    );
  }

  if (order === null) return <Navigate to="/account/orders" replace />;

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  const formattedPlacedDate = new Date(order.placedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const formattedDeliveryDate = new Date(
    order.estimatedDelivery,
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container-edge py-10 sm:py-14">
      <Link
        to="/account/orders"
        className="group inline-flex text-sm items-center gap-1.5 font-medium text-stone transition-colors duration-200 hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        Order History
      </Link>

      <header className="mt-6 border-b border-line-light pb-7 sm:mt-7 sm:pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="label-tag text-orange">Order details</p>
            <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-ink sm:text-3xl lg:text-4xl">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-2 text-sm text-stone">
              Placed {formattedPlacedDate}
            </p>
          </div>
          <Badge
            tone={STATUS_TONE[order.status]}
            className="w-fit px-3.5 py-1.5 text-[10px] font-bold"
          >
            {STATUS_LABEL[order.status]}
          </Badge>
        </div>
      </header>

      {order.status !== "cancelled" ? (
        <section className="mt-8 rounded-2xl border border-line-light bg-paper-dim/40 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <p className="label-tag text-stone">Order progress</p>
            <span className="text-xs font-medium text-stone">
              {currentStepIndex >= 0
                ? `${currentStepIndex + 1} of ${STATUS_STEPS.length}`
                : ""}
            </span>
          </div>

          <ol className="flex items-start">
            {STATUS_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === STATUS_STEPS.length - 1;

              return (
                <li key={step} className="flex flex-1 items-start">
                  <div className="flex min-w-0 flex-col items-center">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-all duration-200 ${
                        isCompleted
                          ? "bg-orange border-orange text-paper"
                          : "bg-paper border-line-light text-stone"
                      } ${isCurrent ? "ring-4 ring-orange/10" : ""}`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span
                      className={`mt-2 label-tag font-medium hidden sm:inline ${isCompleted ? "text-orange" : "text-stone"}`}
                    >
                      {STATUS_LABEL[step]}
                    </span>
                  </div>

                  {!isLast && (
                    <div
                      className={`mt-3 mx-2 h-px flex-1 ${index < currentStepIndex ? "bg-orange" : "bg-line-light"}`}
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:gap-12 lg:grid-cols-[1fr_400px]">
        <section>
          <div className="mb-4 flex items-end justify-between">
            <p className="label-tag text-orange">Your items</p>
            <h2 className="mt-1 font-display text-sm font-bold text-stone ">
              {order.totals.itemCount}
              {order.totals.itemCount === 1 ? "item" : "items"}
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-line-light bg-paper">
            <div className="divide-y divide-line-light">
              {order.items.map((item) => (
                <div
                  key={`${item.product.id}-${item.color ?? ""}`}
                  className="group flex items-center gap-4 p-4 transition-colors duration-200 hover:bg-paper-dim/50 sm:p-5"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden bg-paper-dim rounded-lg">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate font-semibold text-ink">
                      {item.product.name}
                    </p>
                    {item.color ? (
                      <p className="mt-1 text-xs text-stone">
                        Color: {item.color}
                      </p>
                    ) : null}
                    <p className="label-tag mt-2 text-stone">
                      Qty {item.quantity}
                    </p>
                  </div>
                  <span className="price shrink-0 text-sm font-semibold">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          {/* Order summary */}
          <section className="overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.035]">
            <div className="border-b border-line-light px-5 py-4">
              <p className="label-tag text-stone"> Order summary </p>
            </div>
            <div className="p-5">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-stone">
                  <span>Subtotal</span>
                  <span className="font-mono text-ink">
                    {formatPrice(order.totals.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone">
                  <span>Shipping</span>
                  <span className="font-mono text-ink">
                    {order.totals.shipping === 0
                      ? "Free"
                      : formatPrice(order.totals.shipping)}
                  </span>
                </div>
                {order.totals.discount > 0 ? (
                  <div className="flex items-center justify-between text-good">
                    <span>Discount</span>
                    <span className="font-mono">
                      −{formatPrice(order.totals.discount)}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-line-light pt-5">
                <span className="label-tag text-stone"> Total </span>
                <span className="price  font-black text-ink">
                  {formatPrice(order.totals.total)}
                </span>
              </div>
            </div>
          </section>
          <section className="rounded-2xl border border-line-light bg-paper p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper-dim text-stone">
                <MapPin className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="label-tag text-stone"> Shipping address </p>
                <p className="mt-2 text-sm font-semibold text-ink">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone">
                  {order.shippingAddress.city}, {order.shippingAddress.country}
                  <br /> {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </section>
          {/* Delivery */}
          <section className="rounded-2xl border border-line-light bg-paper p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-paper-dim text-stone">
                <Truck className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="label-tag text-stone"> Delivery </p>
                <p className="mt-2 text-sm font-semibold text-ink">
                  {order.shippingMethod}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-stone">
                  <Package className="h-3.5 w-3.5 shrink-0" />
                  <span> Estimated delivery {formattedDeliveryDate} </span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default AccountOrderDetail;
