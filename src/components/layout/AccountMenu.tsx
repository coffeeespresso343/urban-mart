import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Loader2, LogOut, Package, User2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AccountMenu = () => {
  const { user, profile, signOut, isConfigured } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    setOpen(false);
    navigate("/");
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

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-ink transition-colors hover:text-orange"
      >
        <User2 className="h-5 w-5" aria-hidden="true" />
      </Link>
    );
  }

  const initial = (
    profile?.firstName?.[0] ??
    user.email?.[0] ??
    "U"
  ).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="h-7 w-7 flex items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper transition-opacity hover:opacity-80 active:scale-[0.97]"
      >
        {initial}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-60 rounded-b-lg  bg-paper py-2 shadow-xl"
          >
            <div className="border-b border-line-light px-4 pb-2 pt-1">
              <p className="truncate text-sm font-medium">
                {profile?.firstName
                  ? `${profile?.firstName} ${profile?.lastName}`
                  : "Account"}
              </p>
              <p className="truncate text-xs text-stone">{user.email}</p>
            </div>

            <Link
              to="/account/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm hover:bg-paper-dim"
            >
              <Package className="h-3.5 w-3.5" /> Order History
            </Link>
            <button
              disabled={isLoading}
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-error hover:bg-paper-dim disabled:opacity-40"
            >
              {isLoading ? (
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
