import { useEffect, useState } from "react";
import { useUIStore } from "../../hooks/uiStore";
import { useAuth } from "../../hooks/useAuth";
import { fetchAllUsers, setUserAdmin, type AdminUser } from "../../lib/Admin";
import { AdminUsersSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { Loader2, ShieldCheck, ShieldOff, Users2 } from "lucide-react";
import Badge from "../../components/ui/Badge";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();

  const showToast = useUIStore((s) => s.showToast);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = () => {
    fetchAllUsers().then(setUsers);
  };

  useEffect(load, []);

  const toggleAdmin = async (targetUser: AdminUser) => {
    if (targetUser.id === currentUser?.id) {
      showToast("You can't change your own admin status", "error");
      return;
    }

    setPendingId(targetUser.id);

    try {
      const { error } = await setUserAdmin(targetUser.id, !targetUser.isAdmin);

      if (error) {
        showToast(error, "error");
        return;
      }

      showToast(
        targetUser.isAdmin ? "Removed admin access" : "Granted admin access",
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
    }
  };

  if (users === null) {
    return <AdminUsersSkeleton count={5} />;
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={Users2}
        title="No users yet"
        message="Users who sign up will show up here."
      />
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-xl font-display font-bold tracking-tight">Users</h2>
        <p className="mt-1 text-sm text-stone">
          {users.length ?? 0} {users.length === 1 ? "account" : "accounts"}
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line-light bg-paper/50">
        {users.length > 0 ? (
          <div className="divide-y divide-line-light">
            {users.map((user) => (
              <div
                key={user.id}
                className="group flex flex-col gap-4 px-4 py-4 transition-colors duration-200 hover:bg-paper-dim/40
              sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm truncate font-semibold text-ink">
                      {user.firstName
                        ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                        : "-"}
                    </p>
                    {user.isAdmin && (
                      <Badge tone="orange" className="text-[10px] px-2 py-0.5">
                        <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                        Admin
                      </Badge>
                    )}

                    {currentUser?.id === user.id && (
                      <span className="text-stone  font-semibold text-xs">
                        (You)
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-mono font-semibold truncate text-xs text-stone">
                    ID: #{user.id}
                  </p>
                  <p className="mt-1 truncate text-sm text-stone">
                    {user.email ?? "No email on file"}
                  </p>

                  <p className="mt-2 text-xs font-medium text-stone/80">
                    Joined{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    disabled={
                      currentUser?.id === user.id || pendingId === user.id
                    }
                    onClick={() => toggleAdmin(user)}
                    className={`w-full rounded-2xl flex items-center justify-center gap-1.5 border font-semibold text-sm px-3 py-1
                      active:scale-[0.98] sm:w-auto disabled:cursor-not-allowed disabled:opacity-30 ${
                        user.isAdmin
                          ? "bg-transparent text-error border-error/90 hover:bg-error/5"
                          : "bg-ink text-paper border-ink hover:bg-ink/90"
                      }`}
                  >
                    {pendingId === user.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Updating...
                      </>
                    ) : user.isAdmin ? (
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
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminUsers;
