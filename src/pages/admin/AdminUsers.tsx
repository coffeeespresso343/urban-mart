import { useEffect, useMemo, useState } from "react";
import { useUIStore } from "../../hooks/uiStore";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchAllUsers,
  setUserAdmin,
  setUserBlocked,
  type AdminUser,
} from "../../lib/admin";
import { AdminUsersSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import {
  ArrowUpRight,
  Ban,
  Clock,
  Loader2,
  Mail,
  Search,
  ShieldCheck,
  ShieldOff,
  User2,
  Users2,
  UserX2,
  X,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import { Link } from "react-router-dom";
import ImageWithFallback from "../../components/ui/ImageWithFallback";

type UserFilter = "all" | "customer" | "admin" | "blocked";

const FILTER_OPTIONS: { value: UserFilter; label: string }[] = [
  { value: "all", label: "All Users" },
  { value: "admin", label: "Admin" },
  { value: "customer", label: "Customers" },
  { value: "blocked", label: "Blocked Users" },
];

const AdminUsers = () => {
  const { user: currentUser } = useAuth();

  const showToast = useUIStore((s) => s.showToast);
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState<UserFilter>("all");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<"admin" | "block" | null>(
    null,
  );

  const load = () => {
    fetchAllUsers().then(setUsers);
  };

  useEffect(load, []);

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    let result = users;

    if (userFilter === "admin") {
      result = result.filter((user) => user.isAdmin);
    } else if (userFilter === "customer") {
      result = result.filter((user) => !user.isAdmin);
    } else if (userFilter === "blocked") {
      result = result.filter((user) => user.isBlocked);
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) return result;

    return result.filter((u) => {
      const fullName = `${u.firstName ?? ""} ${u.lastName ?? ""}`
        .trim()
        .toLowerCase();
      const haystack = [fullName, u.email ?? "", u.id].join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [users, userFilter, searchQuery]);

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
      setPendingAction(null);
    }
  };

  const toggleBlocked = async (targetUser: AdminUser) => {
    if (guardSelf(targetUser, "You can't block your own account")) return;

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
      setPendingId(null);
      setPendingAction(null);
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
        <div className="flex  items-center gap-2">
          <h2 className="text-xl font-display font-bold tracking-tight">
            {userFilter === "admin"
              ? "Admin"
              : userFilter === "customer"
                ? "All Customers"
                : userFilter === "blocked"
                  ? "Blocked Users"
                  : "All Users"}
          </h2>
          <p className="mt-1 text-sm font-bold text-admin-gray">
            ({filteredUsers.length ?? 0}{" "}
            {filteredUsers.length <= 1 ? "account" : "accounts"})
          </p>
        </div>
        <div className="shrink-0">
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value as UserFilter)}
            className="min-w-30 h-8 cursor-pointer text-xs rounded-lg bg-admin-card border border-admin-border px-2 py-1 font-medium
                capitalize outline-none transition-colors hover:border-admin-ink focus:border-admin-blue focus:ring-2 focus:ring-admin-blue"
          >
            {FILTER_OPTIONS.map((user) => (
              <option key={user.value} value={user.value}>
                {user.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative mt-6 flex-1 lg:max-w-[50%]">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-gray-light h-4 w-4" />
        <label htmlFor="user-search" className="sr-only">
          Search users by name, email, or ID
        </label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users by name, email or ID"
          className="w-full rounded-full border border-admin-border bg-admin-card py-2.5 pl-9 pr-9
          text-sm outline-none focus:border-admin-blue"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-admin-gray-light absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>

      <div className="mt-6 overflow-hidden border-admin-border bg-admin-card rounded-2xl">
        {filteredUsers.length === 0 ? (
          <EmptyState
            icon={UserX2}
            title="No Users Found!"
            message={
              searchQuery
                ? `No users match "${searchQuery}".`
                : `No ${userFilter} users found.`
            }
          />
        ) : filteredUsers.length > 0 ? (
          <div className="divide-y divide-admin-gray-light">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group relative flex flex-col gap-4 px-4 py-4 transition-colors duration-200
              sm:flex-row sm:items-center sm:justify-between sm:px-5"
              >
                <Link
                  to={`/admin/users/${user.id}`}
                  className="absolute right-4 top-4 sm:top-2 sm:right-2"
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center
                    rounded-full 
                    bg-paper-dim/10 text-admin-ink
                    backdrop-blur-sm
                    transition-all duration-200
                    hover:bg-orange
                    hover:text-paper
                    hover:rotate-45
                    active:scale-[0.98]
                  "
                  >
                    <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
                  </span>
                </Link>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden ring ring-admin-gray/20 rounded-full bg-admin-bg">
                      {user.avatarUrl ? (
                        <ImageWithFallback
                          src={user.avatarUrl}
                          alt=""
                          className="h-full w-full"
                        />
                      ) : (
                        <div className="h-full w-full text-admin-gray-light flex items-center justify-center">
                          <User2 className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm truncate font-semibold text-admin-gray">
                      {user.firstName
                        ? `${user.firstName} ${user.lastName ?? ""}`.trim()
                        : "-"}
                    </p>
                    {user.isAdmin && (
                      <Badge tone="blue" className="">
                        <ShieldCheck className="h-3 w-3" strokeWidth={2.5} />
                        Admin
                      </Badge>
                    )}
                    {user.isBlocked ? (
                      <Badge tone="pink" className="">
                        Blocked
                      </Badge>
                    ) : null}

                    {currentUser?.id === user.id && (
                      <span className="text-admin-gray  font-semibold text-xs">
                        (You)
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-mono font-semibold truncate text-xs text-admin-gray">
                    ID #{user.id}
                  </p>
                  <p className="mt-1 truncate flex items-center gap-2 text-sm text-admin-gray">
                    <Mail className="h-3 w-3" />
                    {user.email ?? "No email on file"}
                  </p>

                  <p className="mt-1 text-xs flex items-center gap-2 font-medium text-admin-gray-light">
                    <Clock className="h-3 w-3" />
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
                      currentUser?.id === user.id ||
                      (pendingId === user.id && pendingAction === "admin")
                    }
                    onClick={() => toggleAdmin(user)}
                    className={`shrink-0 h-8 min-w-34 rounded-lg flex items-center justify-center gap-1.5 border font-medium text-xs px-3 py-1.5
                      transition-all text-admin-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30 ${
                        user.isAdmin
                          ? "bg-admin-pink/20 text-admin-pink border-admin-pink/30 hover:bg-admin-pink/35"
                          : "bg-admin-gold/50 border-admin-gold/35 hover:bg-admin-gold/90"
                      }`}
                  >
                    {pendingId === user.id && pendingAction === "admin" ? (
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

                  <button
                    type="button"
                    onClick={() => toggleBlocked(user)}
                    disabled={
                      currentUser?.id === user.id ||
                      (pendingId === user.id && pendingAction === "block")
                    }
                    className={`flex shrink-0 h-8 min-w-28 text-admin-ink items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:text-stone disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98] ${
                      user.isBlocked
                        ? "bg-admin-green/30 border-admin-green/20 hover:bg-admin-green/35"
                        : "bg-admin-pink/10 border-admin-pink/10 text-admin-pink hover:bg-admin-pink/20"
                    }`}
                  >
                    {pendingId === user.id && pendingAction === "block" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        {user.isBlocked ? "Unblocking" : "Blocking"}
                      </>
                    ) : user.isBlocked ? (
                      "Unblock"
                    ) : (
                      <>
                        <Ban className="h-3.5 w-3.5" />
                        Block
                      </>
                    )}
                  </button>
                  <Link
                    to={`/admin/users/${user.id}`}
                    className="shrink-0 h-8 rounded-lg flex items-center justify-center
                   bg-admin-gray/5 border border-admin-gray/10 font-medium text-admin-gray transition-colors
                    text-xs px-3 py-1.5 hover:border-admin-gray/20 hover:bg-admin-gray/30 active:scale-[0.98]"
                  >
                    Details
                  </Link>
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
