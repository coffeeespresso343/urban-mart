import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, LogOut, Package, ShieldUser, User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../../hooks/uiStore";
import ImageWithFallback from "../ui/ImageWithFallback";

const AccountMenu = () => {
  const { user, profile, signOut, isConfigured, isLoading, isAdmin } =
    useAuth();
  const [isSignOutLoading, setISignOutLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const showToast = useUIStore((s) => s.showToast);

  const handleSignOut = async () => {
    setISignOutLoading(true);
    await signOut();
    setISignOutLoading(false);
    setOpen(false);
    showToast("Successfully signed out! See you again.", "success");
    navigate("/");
  };

  const handleUserAdmin = () => {
    if (!isAdmin) {
      setOpen(false);
      showToast("You don't have admin access", "error");
      return;
    }

    setOpen(false);
    navigate("/admin");
  };

  useEffect(() => {
    if (!open) return;

    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!isConfigured) {
    return (
      <Link
        to="/login"
        className="text-ink transition-colors hover:text-orange"
      >
        <User2 className="h-5 w-5" aria-hidden="true" />
      </Link>
    );
  }

  if (isLoading) {
    return (
      <Link
        to="/login"
        className="h-7 w-7 flex items-center justify-center rounded-full bg-admin-card text-xs font-semibold text-admin-ink transition-opacity hover:opacity-80 active:scale-[0.97]"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      </Link>
    );
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="h-7 w-7 flex items-center justify-center rounded-full bg-admin-card text-xs font-semibold text-admin-gray transition-opacity hover:opacity-80 active:scale-[0.97]"
      >
        <User2 className="h-5 w-5" aria-hidden="true" />
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-7 w-7 overflow-hidden flex items-center justify-center rounded-full bg-admin-card text-xs font-semibold transition-opacity hover:opacity-80 active:scale-[0.97]"
      >
        {profile?.avatarUrl ? (
          <ImageWithFallback
            src={profile.avatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full text-sm bg-admin-gray-light text-admin-gray font-semibold items-center justify-center">
            {profile?.firstName ? profile.firstName[0].toUpperCase() : "-"}
          </div>
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-4.5 lg:mt-6.5 w-60 rounded-b-xl border border-white/30 bg-paper py-2 shadow-[0_25px_80px_rgba(23,22,20,0.22)] backdrop-blur-2xl"
          >
            <div className="bg-paper/90 border-b border-line-light px-4 pb-2 pt-1">
              <Link to="/account" onClick={() => setOpen(false)}>
                <p className="truncate text-sm font-medium">
                  {profile?.firstName
                    ? `${profile?.firstName} ${profile?.lastName}`
                    : "Account"}
                </p>
                <p className="truncate text-xs text-stone">{user.email}</p>
              </Link>
            </div>

            <Link
              to="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-paper-dim active:scale-98"
            >
              <User2 className="h-3.5 w-3.5" /> Account
            </Link>
            <Link
              to="/account/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-paper-dim active:scale-98"
            >
              <Package className="h-3.5 w-3.5" /> Order History
            </Link>
            <button
              onClick={handleUserAdmin}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-all duration-200 hover:bg-paper-dim active:scale-98"
            >
              <ShieldUser className="h-3.5 w-3.5" /> Admin Dashboard
            </button>
            <button
              disabled={isSignOutLoading}
              onClick={handleSignOut}
              className="mt-2 flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-error border-t border-error/10 hover:bg-paper-dim disabled:opacity-40"
            >
              {isSignOutLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Signing
                  out...
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </>
              )}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default AccountMenu;
