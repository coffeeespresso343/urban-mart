import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../hooks/uiStore";
import { useEffect, useState } from "react";

import type { Order, OrderStatus } from "../../types/Order";
import { AdminUsersDetailSkeleton } from "../../components/ui/Skeleton";
import {
  Ban,
  ChevronLeft,
  Loader2,
  PackageX,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import { formatPrice } from "../../utils/currency";
import EmptyState from "../../components/ui/EmptyState";

import { fetchOrdersForUsers } from "../../lib/orders";
import {
  fetchUserById,
  setUserAdmin,
  setUserBlocked,
  type AdminUser,
} from "../../lib/admin";

const STATUS_TONE: Record<OrderStatus, "ink" | "orange" | "good" | "warn"> = {
  processing: "orange",
  shipped: "ink",
  delivered: "good",
  cancelled: "warn",
};

const AdminUserDetail = () => {
  const { userId } = useParams<{ userId: string }>();

  const { user: currentUser } = useAuth();

  const showToast = useUIStore((s) => s.showToast);

  const [targetUser, setTargetUser] = useState<AdminUser | null | undefined>(
    undefined,
  );
  const [orders, setOrders] = useState<Order[] | null>(null);

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"admin" | "block" | null>(
    null,
  );

  const load = () => {
    if (!userId) return;

    fetchUserById(userId).then(setTargetUser);
    fetchOrdersForUsers(userId).then(setOrders);
  };

  useEffect(load, [userId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (targetUser === undefined || orders === null) {
    return <AdminUsersDetailSkeleton count={4} />;
  }

  if (targetUser === null || !userId) {
    return <Navigate to="/404" replace />;
  }

  const isSelf = targetUser.id === currentUser?.id;

  const toggleAdmin = async (targetUser: AdminUser) => {
    if (targetUser.id === currentUser?.id) {
      showToast("You can't change your own admin status", "error");
      return;
    }

    setPendingId(targetUser.id);
    setPendingAction("admin");

    try {
      const { error } = await setUserAdmin(targetUser.id, !targetUser.isAdmin);

      if (error) {
        showToast(error, "error");
        return;
      }

      showToast(
        targetUser.isAdmin
          ? `Removed admin access to ${targetUser.firstName ?? targetUser.email} ${targetUser.lastName ?? ""}`
          : `Granted admin access to ${targetUser.firstName ?? targetUser.email} ${targetUser.lastName ?? ""}`,
        "success",
      );
      load();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setPendingId(null);
      setPendingAction("admin");
    }
  };

  const toggleBlocked = async (targetUser: AdminUser) => {
    if (targetUser.id === currentUser?.id) {
      showToast("You can't block your own account.", "error");
      return;
    }

    setPendingId(targetUser.id);
    setPendingAction("block");

    try {
      const { error } = await setUserBlocked(
        targetUser.id,
        !targetUser.isBlocked,
      );

      if (error) {
        showToast(error, "error");
        return;
      }

      showToast(
        targetUser.isBlocked
          ? `Unblocked ${targetUser.firstName ?? targetUser.email} ${targetUser.lastName ?? ""}`
          : `Blocked ${targetUser.firstName ?? targetUser.email} ${targetUser.lastName ?? ""}`,
        "success",
      );
      load();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setPendingAction(null);
      setPendingAction(null);
    }
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.totals.total, 0);

  return (
    <div>
      <Link
        to="/admin/users"
        className="flex items-center gap-1.5 text-stone text-sm hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Users
      </Link>

      <div className="mt-6 flex flex-wrap flex-col lg:flex-row items-start justify-between gap-6">
        <div>
          <div className="flex items-start gap-3 rounded-xl bg-paper-dim/50 px-4 py-6">
            <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-orange text-paper ring-2 ring-orange/30">
              {targetUser?.firstName
                ? targetUser.firstName[0].toUpperCase()
                : "-"}
            </div>

            <div className="min-w-60">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-md font-bold">
                  {targetUser.firstName
                    ? `${targetUser.firstName} ${targetUser.lastName ?? ""}`.trim()
                    : "Unnamed User"}
                </h2>
                {targetUser.isAdmin ? (
                  <Badge tone="orange">
                    <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                    Admin
                  </Badge>
                ) : null}
                {targetUser.isBlocked ? (
                  <Badge tone="error">Blocked</Badge>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-stone">
                {targetUser.email ?? "no email on file"}
              </p>
              <p className="mt-1 text-sm text-stone">
                Joined{" "}
                {new Date(targetUser.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={
              isSelf ||
              (pendingId === targetUser.id && pendingAction === "admin")
            }
            onClick={() => toggleAdmin(targetUser)}
            className={`shrink-0 h-8 min-w-34 rounded-lg flex items-center justify-center gap-1.5 border font-medium text-xs px-3 py-1.5
                      transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 ${
                        targetUser.isAdmin
                          ? "bg-warn/40 text-ink border-warn/20 hover:bg-warn/55"
                          : "bg-orange/80 border-orange/15 text-paper hover:bg-orange/90"
                      }`}
          >
            {pendingId === targetUser.id && pendingAction === "admin" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating...
              </>
            ) : targetUser.isAdmin ? (
              <>
                <ShieldOff className="h-3.5 w-3.5" />
                Remove Admin
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" />
                Make Admin
              </>
            )}
          </button>
          <button
            type="button"
            disabled={
              isSelf ||
              (pendingId === targetUser.id && pendingAction === "block")
            }
            onClick={() => toggleBlocked(targetUser)}
            className={`flex shrink-0 h-8 min-w-28 items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:text-stone disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] ${
              targetUser.isBlocked
                ? "bg-good/30 border-good/10 text-ink hover:bg-good/15"
                : "bg-error/30 border-error/10 text-error hover:bg-error/15"
            }`}
          >
            {pendingId === targetUser.id && pendingAction === "block" ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {targetUser.isBlocked ? "Unblocking" : "Blocking"}
              </>
            ) : targetUser.isBlocked ? (
              "Unblock"
            ) : (
              <>
                <Ban className="h-3.5 w-3.5" />
                Block
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h3 className="label-tag font-semibold text-stone">Order History</h3>
          <p className="text-sm text-stone font-semibold">
            {orders.length} order{orders.length === 1 ? "" : "s"} ·{" "}
            {formatPrice(totalSpent)} total
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-2">
            <EmptyState
              icon={PackageX}
              title="No orders yet"
              message="This user hasn't placed any orders yet."
            />
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line-light border-y border-line-light">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="label-tag font-semibold text-orange">
                      #{order.orderNumber}
                    </p>
                    <Badge
                      tone={STATUS_TONE[order.status]}
                      className="capitalize text-[10px]"
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-stone">
                    {new Date(order.placedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {order.totals.itemCount} item
                    {order.totals.itemCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="price text-sm font-semibold">
                  {formatPrice(order.totals.total)}
                </span>
                <Link
                  to={`/account/orders/${order.orderNumber}`}
                  className="shrink-0 rounded-lg flex items-center justify-center gap-1 px-2 py-1 text-ink
                   bg-paper border border-ink/20 font-medium transition-colors text-xs hover:border-ink/20 hover:bg-paper-warm active:scale-[0.98]"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
