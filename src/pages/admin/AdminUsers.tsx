import { useEffect, useState } from "react";
import { useUIStore } from "../../hooks/uiStore";
import { useAuth } from "../../hooks/useAuth";
import {
  deleteUserAccount,
  fetchAllUsers,
  setUserAdmin,
  setUserBlocked,
  type AdminUser,
} from "../../lib/Admin";
import { AdminUsersSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import {
  Ban,
  Eye,
  Loader2,
  ShieldCheck,
  ShieldOff,
  Users2,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import { Link } from "react-router-dom";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();

  const showToast = useUIStore((s) => s.showToast);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);

  const load = () => {
    fetchAllUsers().then(setUsers);
  };

  useEffect(load, []);

  const guardSelf = (targetUser: AdminUser, message: string) => {
    if (targetUser.id === currentUser?.id) {
      showToast(message, "error");
      return true;
    }
    return false;
  };

  const toggleAdmin = async (targetUser: AdminUser) => {
    if (targetUser.id === currentUser?.id) {
      showToast("You can't change your own admin status", "error");
      return;
    }

    setPendingId(targetUser.id);
    setIsAdminLoading(true);

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
      setIsAdminLoading(false);
    }
  };

  const toggleBlocked = async (targetUser: AdminUser) => {
    if (guardSelf(targetUser, "You can't block your own account")) return;

    setPendingId(targetUser.id);
    setIsBlocking(true);

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
      setPendingId(null);
      setIsBlocking(false);
    }
  };

  // const handleDelete = async (targetUser: AdminUser) => {
  //   if (guardSelf(targetUser, "You can't delete your own account")) return;

  //   if (
  //     !window.confirm(
  //       `Permanently delete ${targetUser.firstName ?? targetUser.email} ${targetUser.lastName ?? ""}? This can't be undone.`,
  //     )
  //   )
  //     return;

  //   setPendingId(targetUser.id);
  //   const { error } = await deleteUserAccount(targetUser.id);
  //   setPendingId(null);
  //   if (error) return showToast(error, "error");

  //   showToast(
  //     `Deleted ${targetUser.firstName ?? targetUser.email} ${targetUser.lastName ?? ""}`,
  //   );

  //   load();
  // };

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
                    <div>
                      <span className="h-7 w-7 flex items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper transition-opacity hover:opacity-80 active:scale-[0.97]">
                        {user.firstName ? user.firstName[0].toUpperCase() : "-"}
                      </span>
                    </div>
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
                    {user.isBlocked ? (
                      <Badge tone="error" className="text-[10px] px-2 py-0.5">
                        Blocked
                      </Badge>
                    ) : null}

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

                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <button
                    type="button"
                    disabled={
                      currentUser?.id === user.id || pendingId === user.id
                    }
                    onClick={() => toggleAdmin(user)}
                    className={`shrink-0 rounded-2xl flex items-center justify-center gap-1.5 border font-medium text-xs px-3 py-1.5
                      active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 ${
                        user.isAdmin
                          ? "bg-warn text-ink border-warn/90 hover:bg-warn/90"
                          : "bg-ink text-paper border-ink hover:bg-ink/90"
                      }`}
                  >
                    {isAdminLoading && pendingId === user.id ? (
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

                  <Link
                    to={`/admin/users/${user.id}`}
                    className="shrink-0 rounded-2xl flex items-center justify-center gap-1.5 
                    border border-line-light font-medium text-stone text-xs px-3 py-1.5 hover:bg-paper active:scale-[0.97]"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleBlocked(user)}
                    disabled={
                      currentUser?.id === user.id || pendingId === user.id
                    }
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-2xl border font-medium transition-colors hover:text-stone disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] ${
                      user.isBlocked
                        ? "bg-warn/40 border-warn/45 text-ink"
                        : "bg-error/20 border-error/30 text-error"
                    }`}
                  >
                    {user.isBlocked ? (
                      <>
                        {isBlocking && pendingId === user.id ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Unblocking
                          </>
                        ) : (
                          "Unblock"
                        )}
                      </>
                    ) : isBlocking && pendingId === user.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Blocking
                      </>
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5" />
                        Block
                      </>
                    )}
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => handleDelete(user)}
                    disabled={
                      currentUser?.id === user.id || user.id === pendingId
                    }
                    className="text-error transition-colors hover:text-warn disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]"
                  >
                    <Trash2 className="h-4 w-4 shrink-0" />
                  </button> */}
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
