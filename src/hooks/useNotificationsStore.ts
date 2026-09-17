import { create } from "zustand";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from "../lib/notifications";

interface NotificationState {
  notifications: AppNotification[];
  hasLoaded: boolean;
  load: (userId: string) => Promise<void>;
  addNotification: (notification: AppNotification) => void;
  markRead: (notificationId: string, userId: string) => Promise<void>;
  markAllRead: (userId: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationState>((set, get) => ({
  notifications: [],
  hasLoaded: false,

  load: async (userId) => {
    const notifications = await fetchNotifications(userId);
    set({ notifications, hasLoaded: true });
  },

  addNotification: (notification) => {
    set((state) => {
      if (state.notifications.some((n) => n.id === notification.id))
        return state;
      return { notifications: [notification, ...state.notifications] };
    });
  },

  markRead: async (notificationId, userId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId
          ? {
              ...n,
              isRead: true,
            }
          : n,
      ),
    }));

    await markNotificationRead(notificationId, userId);
  },

  markAllRead: async (userId) => {
    const unreadIds = get()
      .notifications.filter((n) => !n.isRead)
      .map((n) => n.id);
    set((state) => ({
      notifications: state.notifications.map((n) => ({
        ...n,
        isRead: true,
      })),
    }));

    await markAllNotificationsRead(unreadIds, userId);
  },
}));
