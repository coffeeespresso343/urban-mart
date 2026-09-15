import { isValidPassword } from "../utils/validation";
import { isSupabaseConfigured, supabase } from "./supabase";

export async function updateOwnProfile(
  userId: string,
  changes: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  },
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const row: Record<string, string> = {};

  if (changes.firstName !== undefined) row.first_name = changes.firstName;
  if (changes.lastName !== undefined) row.last_name = changes.lastName;
  if (changes.avatarUrl !== undefined) row.avatar_url = changes.avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(row)
    .eq("id", userId);

  return { error: error?.message ?? null };
}

export async function updateOwnPassword(
  newPassword: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  if (!isValidPassword(newPassword))
    return { error: "Password must be at least 8 characters." };

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message ?? null };
}

/**
 * When this user's admin role was granted — read from user_roles.created_at
 * for their admin row specifically, not profiles.created_at (which is when
 * the account itself was created, not when they became an admin).
 */

export async function fetchAdminGrantedAt(
  userId: string,
): Promise<string | null> {
  if (!isSupabaseConfigured) return null;

  const { data: role } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "admin")
    .single();

  if (!role) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("created_at")
    .eq("user_id", userId)
    .eq("role_id", (role as { id: number }).id)
    .single();

  return (data?.created_at as string | undefined) ?? null;
}
