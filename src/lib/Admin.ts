// Admin Access Layer

import { isSupabaseConfigured, supabase } from "./supabase";
import type { Order, OrderStatus } from "../types/Order";
import { mapRowToOrder, type OrderRow } from "./Orders";

export interface AdminUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  isAdmin: boolean;
}

interface ProfileRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface UserRoleRow {
  user_id: string;
  // PostgREST returns the embedded many-to-one relation as an object, but
  // this is defensive against it coming back as a single-item array too.
  roles: { name: string } | { name: string }[] | null;
}

function roleNameof(row: UserRoleRow): string | undefined {
  if (!row.roles) return undefined;

  return Array.isArray(row.roles) ? row.roles[0]?.name : row.roles.name;
}

export async function fetchAllUsers(): Promise<AdminUser[]> {
  if (!isSupabaseConfigured) return [];

  const [profileResult, roleResult] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, first_name, last_name, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("user_roles").select("user_id, roles(name)"),
  ]);

  if (profileResult.error || !profileResult.data) return [];

  const adminIds = new Set(
    ((roleResult.data as UserRoleRow[] | null) ?? [])
      .filter((row) => roleNameof(row) === "admin")
      .map((row) => row.user_id),
  );

  return (profileResult.data as ProfileRow[]).map((row) => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
    isAdmin: adminIds.has(row.id),
  }));
}

export async function setUserAdmin(
  userId: string,
  makeAdmin: boolean,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const { data: role, error: roleError } = await supabase
    .from("roles")
    .select("id")
    .eq("name", "admin")
    .single();

  if (roleError || !role) {
    return {
      error:
        roleError?.message ?? "Admin role not found - check schema-admin.sql",
    };
  }

  if (makeAdmin) {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role_id: (role as { id: number }).id });

    return { error: error?.message ?? null };
  }

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", userId)
    .eq("role_id", (role as { id: number }).id);

  return { error: error?.message ?? null };
}

export async function fetchAllOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return (data as OrderRow[]).map(mapRowToOrder);
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  return { error: error?.message ?? null };
}

export interface TopProducts {
  name: string;
  unitsSold: number;
  revenue: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  orderCount: number;
  userCount: number;
  averageOrderValue: number;
  topProducts: TopProducts[];
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const [orders, users] = await Promise.all([
    fetchAllOrders(),
    fetchAllUsers(),
  ]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totals.total,
    0,
  );

  const orderCount = orders.length;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;

  const productTotals = new Map<string, TopProducts>();
  for (const order of orders) {
    for (const item of order.items) {
      const existing = productTotals.get(item.product.name) ?? {
        name: item.product.name,
        unitsSold: 0,
        revenue: 0,
      };

      existing.unitsSold += item.quantity;
      existing.revenue += item.product.price * item.quantity;
      productTotals.set(item.product.name, existing);
    }
  }

  const topProducts = Array.from(productTotals.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    totalRevenue,
    orderCount,
    userCount: users.length,
    averageOrderValue,
    topProducts,
  };
}
