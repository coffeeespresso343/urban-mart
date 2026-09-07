import { useEffect, useMemo, useRef, useState } from "react";
import { useUIStore } from "../../hooks/uiStore";
import type { Order, OrderStatus } from "../../types/Order";
import { fetchAllOrders, updateOrderStatus } from "../../lib/Admin";
import { AdminOrdersSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { PackageX } from "lucide-react";
import { formatPrice } from "../../utils/currency";
import Badge from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";

const STATUS_OPTIONS: OrderStatus[] = [
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_TONE: Record<OrderStatus, "ink" | "orange" | "good" | "warn"> = {
  processing: "orange",
  shipped: "ink",
  delivered: "good",
  cancelled: "warn",
};

type StatusFilter = "all" | OrderStatus;

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const AdminOrders = () => {
  const showToast = useUIStore((s) => s.showToast);

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const activeFilterBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!activeFilterBtnRef.current) return;

    activeFilterBtnRef.current.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [statusFilter]);

  const load = () => {
    fetchAllOrders().then(setOrders);
  };

  useEffect(load, []);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    if (statusFilter === "all") {
      return orders;
    }

    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleStatusChange = async (order: Order, status: OrderStatus) => {
    setPendingId(order.id);

    const { error } = await updateOrderStatus(order.id, status);
    setPendingId(null);

    if (error) {
      showToast(error, "error");
      return;
    }

    showToast(`Order #${order.orderNumber} marked ${status}`, "success");
    setOrders(
      (prev) =>
        prev?.map((o) => (o.id === order.id ? { ...o, status } : o)) ?? prev,
    );
  };

  if (orders === null) {
    return <AdminOrdersSkeleton count={6} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={PackageX}
        title="No orders yet"
        message="Placed orders will show up here."
      />
    );
  }

  return (
    <div>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-display font-bold tracking-tight">
            Orders
          </h2>
          <p className="mt-1 text-sm text-stone">({filteredOrders.length})</p>
        </div>
        <p className="mt-1 text-sm text-stone">
          Manage and track customer orders.
        </p>
      </div>

      <div className="mt-6 overflow-x-auto scrollbar-none">
        <div className="inline-flex min-w-max gap-1 rounded-2xl border border-paper-warm/50 bg-paper-warm/40 p-1">
          {FILTER_OPTIONS.map((option) => {
            const isActive = statusFilter === option.value;

            const count =
              option.value === "all"
                ? orders.length
                : orders.filter((order) => order.status === option.value)
                    .length;

            return (
              <button
                ref={isActive ? activeFilterBtnRef : null}
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                className={`label-tag flex items-center gap-1 rounded-xl px-3 py-2 font-semibold
                  transition-all duration-200 active:scale-[0.97] ${
                    isActive
                      ? "bg-paper text-orange shadow-sm"
                      : "text-stone hover:bg-paper/70"
                  }`}
              >
                <span>{option.label}</span>
                <span
                  className={`min-w-5 text-center  ${
                    isActive ? "text-orange" : "text-stone/70"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-line-light">
        {filteredOrders.length === 0 ? (
          <EmptyState
            icon={PackageX}
            title={`No ${statusFilter} orders`}
            message="There are currently no order with this status."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                View All Orders
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-line-light">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col px-4 py-4 transition-colors duration-200 hover:bg-paper-dim/30 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="label-tag font-semibold text-orange">
                      #{order.orderNumber}
                    </p>
                    <Badge
                      tone={STATUS_TONE[order.status]}
                      className="uppercase text-[10px]"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap text-xs items-center gap-x-2 text-stone">
                    <span className="max-w-full truncate">
                      {order.shippingAddress.email}
                    </span>
                    <span aria-hidden="true" className="text-stone/40">
                      ·
                    </span>

                    <time dateTime={order.placedAt}>
                      {new Date(order.placedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>

                    <span aria-hidden="true" className="text-stone/40">
                      ·
                    </span>

                    <span>
                      {order.totals.itemCount}{" "}
                      {order.totals.itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex w-full items-center justify-between gap-4 sm:justify-end lg:w-auto">
                  <div className="min-w-20 sm:text-right">
                    <p className="price mt-0.5 text-sm font-bold tracking-tight text-ink">
                      {formatPrice(order.totals.total)}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <label htmlFor={`status-${order.id}`} className="sr-only">
                      Update status for order {order.orderNumber}
                    </label>
                    <select
                      id={`status-${order.id}`}
                      value={order.status}
                      disabled={pendingId === order.id}
                      onChange={(e) =>
                        handleStatusChange(order, e.target.value as OrderStatus)
                      }
                      className="label-tag min-w-28 cursor-pointer rounded-xl border border-line-light bg-paper px-2 py-1 font-medium
                capitalize outline-none transition-colors hover:border-ink/30 focus:border-orange focus:ring-2 focus:ring-orange disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} className="capitalize">
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
