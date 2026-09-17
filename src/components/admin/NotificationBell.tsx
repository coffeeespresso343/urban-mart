import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Ban,
  Bell,
  CheckCheck,
  Inbox,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../hooks/uiStore";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationsStore } from "../../hooks/useNotificationsStore";
import {
  subscribeToNewNotifications,
  type AppNotification,
  type NofificationType,
} from "../../lib/notifications";

const TYPE_ICON: Record<NofificationType, typeof Bell> = {
  new_order: ShoppingCart,
  new_signup: UserPlus,
  low_stock: AlertTriangle,
  user_blocked: Ban,
};

const TYPE_TINT: Record<NofificationType, string> = {
  new_order: "var(--color-admin-blue-light)",
  new_signup: "var(--color-admin-gold-light)",
  low_stock: "var(--color-admin-pink-light)",
  user_blocked: "var(--color-admin-pink-light)",
};

const timeAgo = (iso: string): string => {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
};

const NotificationBell = () => {
  const { user } = useAuth();
  const showToast = useUIStore((s) => s.showToast);
  const { notifications, load, addNotification, markRead, markAllRead } =
    useNotificationsStore();

  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (user) void load(user.id);
  }, [user, load]);

  useEffect(() => {
    const unsubscribe = subscribeToNewNotifications((notification) => {
      addNotification(notification);
      showToast(notification.title, "info");
    });

    return unsubscribe;
  }, [addNotification, showToast]);

  useEffect(() => {
    if (!isOpen) return;

    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setIsOpen(false);
    };

    document.addEventListener("mousedown", onClick);

    return () => document.removeEventListener("mousedown", onClick);
  }, [isOpen]);

  const handleClick = (notification: AppNotification) => {
    if (user && !notification.isRead) void markRead(notification.id, user.id);

    setIsOpen(false);

    if (notification.link) navigate(notification.link);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full
      text-admin-gray transition-all hover:bg-admin-active active:scale-95"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 ? (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full
          bg-admin-pink px-1 text-[10px] font-semibold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-3 w-80 rounded-2xl border border-admin-border bg-admin-card shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
              <p className="text-sm font-semibold">Notifications</p>
              {unreadCount > 0 && user ? (
                <button
                  onClick={() => void markAllRead(user.id)}
                  className="flex items-center gap-1 text-xs font-medium text-admin-blue hover:underline"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all as read
                </button>
              ) : null}
            </div>

            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <Inbox className="h-6 w-6 text-admin-gray-light" />
                <p className="text-sm text-admin-gray-light">
                  Nothing yet - new orders and signups show up here.
                </p>
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const Icon = TYPE_ICON[notification.type];
                  return (
                    <button
                      type="button"
                      key={notification.id}
                      onClick={() => handleClick(notification)}
                      className={`flex w-full items-start gap-3 border-b border-admin-border px-4 py-3
                    text-left transition-colors last:border-b-0 hover:bg-admin-active/60 ${
                      notification.isRead ? "" : "bg-admin-active/30"
                    }`}
                    >
                      <span
                        className="h-8 w-8 flex shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: TYPE_TINT[notification.type],
                        }}
                      >
                        <Icon className="h-3.5 w-3.5 text-admin-gray" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {notification.title}
                        </span>
                        <span className="block truncate text-xs text-admin-gray">
                          {notification.body}
                        </span>
                        <span className="mt-0.5 block text-xs text-admin-gray-light">
                          {timeAgo(notification.createdAt)}
                        </span>
                      </span>
                      {!notification.isRead ? (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-admin-blue" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
