import { isSupabaseConfigured, supabase } from "./supabase";

export type NofificationType =
  | "new_order"
  | "new_signup"
  | "low_stock"
  | "user_blocked";

export interface AppNotification {
  id: string;
  type: NofificationType;
  title: string;
  body: string;
  link: string | null;
  createdAt: string;
  isRead: boolean;
}

interface NotificationRow {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  created_at: string;
}

function mapRow(row: NotificationRow, isRead: boolean): AppNotification {
  return {
    id: row.id,
    type: row.type as NofificationType,
    title: row.title,
    body: row.body,
    link: row.link,
    createdAt: row.created_at,
    isRead,
  };
}

const FETCH_LIMIT = 30;

export const fetchNotifications = async (
  userId: string,
): Promise<AppNotification[]> => {
  if (!isSupabaseConfigured) return [];

  const { data: rows, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(FETCH_LIMIT);

  if (error || !rows) return [];

  const ids = (rows as NotificationRow[]).map((r) => r.id);

  const { data: reads } = await supabase
    .from("notification_reads")
    .select("notification_id")
    .eq("user_id", userId)
    .in("notification_id", ids);

  const readIds = new Set(
    ((reads as { notification_id: string }[] | null) ?? []).map(
      (r) => r.notification_id,
    ),
  );

  return (rows as NotificationRow[]).map((row) =>
    mapRow(row, readIds.has(row.id)),
  );
};

export const markNotificationRead = async (
  notificationId: string,
  userId: string,
): Promise<{ error: string | null }> => {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("notification_reads")
    .upsert({ notification_id: notificationId, user_id: userId });

  return { error: error?.message ?? null };
};

export const markAllNotificationsRead = async (
  notificationIds: string[],
  userId: string,
): Promise<{ error: string | null }> => {
  if (!isSupabaseConfigured || notificationIds.length === 0)
    return { error: null };

  const rows = notificationIds.map((id) => ({
    notification_id: id,
    user_id: userId,
  }));

  const { error } = await supabase.from("notification_reads").upsert(rows);

  return { error: error?.message ?? null };
};

/**
 * Subscribes to new notification rows via Supabase Realtime. Returns an
 * unsubscribe function — call it on unmount to avoid leaking channels
 * (e.g. across StrictMode's double-invoke in development).
 */

export function subscribeToNewNotifications(
  onNew: (notification: AppNotification) => void,
): () => void {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel("admin-notifications")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        onNew(mapRow(payload.new as NotificationRow, false));
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
