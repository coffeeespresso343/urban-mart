import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../hooks/uiStore";
import { useEffect, useState } from "react";
import {
  fetchUserById,
  setUserAdmin,
  setUserBlocked,
  type AdminUser,
} from "../../lib/Admin";
import type { Order, OrderStatus } from "../../types/Order";
import { fetchOrdersForUsers } from "../../lib/Orders";
import { ProductGridSkeleton } from "../../components/ui/Skeleton";
import { Ban, ChevronLeft, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";
import Badge from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { formatPrice } from "../../utils/currency";

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
  const navigate = useNavigate();

  const [targetUser, setTargetUser] = useState<AdminUser | null | undefined>(
    undefined,
  );
  const [orders, setOrders] = useState<Order[] | null>(null);

  const [isPending, setIsPending] = useState(false);

  const load = () => {
    if (!userId) return;

    fetchUserById(userId).then(setTargetUser);
    fetchOrdersForUsers(userId).then(setOrders);
  };

  useEffect(load, [userId]);

  if (targetUser === undefined || orders === null) {
    return <ProductGridSkeleton count={3} />;
  }

  if (targetUser === null || !userId) {
    return <Navigate to="/404" replace />;
  }

  const isSelf = targetUser.id === currentUser?.id;

  const runAction = async (
    action: () => Promise<{ error: string | null }>,
    successMessage: string,
  ) => {
    setIsPending(true);
    const { error } = await action();
    setIsPending(false);
    if (error) return showToast(error, "error");

    showToast(successMessage, "success");
    load();
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.totals.total, 0);

  return (
    <div>
      <Link
        to="/admin/users"
        className="label-tag flex items-center gap-1.5 text-stone hover:text-ink"
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Users
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
              {targetUser.firstName
                ? `${targetUser.firstName} ${targetUser.lastName ?? ""}`.trim()
                : "Unnamed User"}
            </h2>
            {targetUser.isAdmin ? <Badge tone="orange">Admin</Badge> : null}
            {targetUser.isBlocked ? <Badge tone="warn">Blocked</Badge> : null}
          </div>
          <p className="mt-1 text-sm text-stone">
            {targetUser.email ?? "no email on file"}
          </p>
          <p className="label-tag mt-1 text-stone">
            Joined{" "}
            {new Date(targetUser.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            isLoading={isPending}
            disabled={isSelf}
            onClick={() =>
              runAction(
                () => setUserAdmin(targetUser.id, !targetUser.isAdmin),
                targetUser.isAdmin
                  ? "Removed admin access"
                  : "Granted admin access",
              )
            }
          >
            {targetUser.isAdmin ? (
              <>
                <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" /> Remove
                Admin
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Make
                Admin
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            isLoading={isPending}
            disabled={isSelf}
            onClick={() =>
              runAction(
                () => setUserBlocked(targetUser.id, !targetUser.isBlocked),
                targetUser.isBlocked ? "User unblocked" : "User blocked",
              )
            }
          >
            <Ban className="h-3.5 w-3.5" aria-hidden="true" />{" "}
            {targetUser.isBlocked ? "Unblock" : "Block"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            isLoading={isPending}
            disabled={isSelf}
            onClick={async () => {
              if (
                !window.confirm(
                  `Permanently delete ${targetUser.email ?? "this user"}? This can't be undone.`,
                )
              ) {
                return;
              }
              setIsPending(true);
              //   const { error } = await deleteUserAccount(targetUser.id);
              //   setIsPending(false);
              //   if (error) return showToast(error, "error");
              //   showToast("User deleted", "success");
              navigate("/admin/users");
            }}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
          </Button>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h3 className="label-tag font-semibold text-stone">Order History</h3>
          <p className="text-sm text-stone">
            {orders.length} order{orders.length === 1 ? "" : "s"} ·{" "}
            {formatPrice(totalSpent)} total
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="mt-6 text-sm text-stone">
            This user hasn't placed any orders yet.
          </p>
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
                    <Badge tone={STATUS_TONE[order.status]}>
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
