// Admin Access Layer

import { isSupabaseConfigured, supabase } from "./supabase";
import type { Order, OrderStatus } from "../types/Order";
import { mapRowToOrder, type OrderRow } from "./orders";
import type { Product } from "../types/Product";
import { fetchProducts } from "./products";

export interface AdminUser {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  isAdmin: boolean;
  isBlocked: boolean;
  avatarUrl: string | null;
}

interface ProfileRow {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  is_blocked: boolean;
  avatar_url: string | null;
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
      .select(
        "id, email, first_name, last_name, created_at, is_blocked, avatar_url",
      )
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
    isBlocked: row.is_blocked,
    avatarUrl: row.avatar_url,
  }));
}

export async function fetchUserById(userId: string): Promise<AdminUser | null> {
  if (!isSupabaseConfigured) return null;

  const [profileResult, rolesResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "id, first_name, last_name, email, created_at, is_blocked, avatar_url",
      )
      .eq("id", userId)
      .single(),
    supabase
      .from("user_roles")
      .select("user_id, roles(name)")
      .eq("user_id", userId),
  ]);

  if (profileResult.error || !profileResult.data) return null;

  const row = profileResult.data as ProfileRow;
  const isAdmin = ((rolesResult.data as UserRoleRow[] | null) ?? []).some(
    (r) => roleNameof(r) === "admin",
  );

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    createdAt: row.created_at,
    isAdmin,
    isBlocked: row.is_blocked,
    avatarUrl: row.avatar_url,
  };
}

export async function setUserBlocked(
  userId: string,
  blocked: boolean,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const { error } = await supabase
    .from("profiles")
    .update({
      is_blocked: blocked,
    })
    .eq("id", userId);

  return { error: error?.message ?? null };
}

/**
 * Parmanently deletes the user's account via the delete-user Edge
 * Function (see/functions/delete-user) - this can't be undone
 * with the anon/authenticated client directly, since delete an auth.users row requires the service-role-key
 * @param userId
 * @returns
 */

export async function deleteUserAccount(
  userId: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const { data, error } = await supabase.functions.invoke<{ error?: string }>(
    "delete-user",
    {
      body: { userId },
    },
  );

  if (error) return { error: error.message };

  if (data?.error) return { error: data.error };

  return { error: null };
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

// Dashboard metrics

export interface TopProducts {
  name: string;
  unitsSold: number;
  revenue: number;
  image: string;
}

export interface RevenuePoint {
  date: string;
  isoDate: string;
  revenue: number;
}

export interface CountPoint {
  date: string;
  isoDate: string;
  count: number;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface DashboardMetrics {
  orderCount: number;
  orderCountDeltaPct: number | null;
  deliveredCount: number;
  fulfillmentRatePct: number;
  totalRevenue: number;
  currentMonthRevenue: number;
  revenueDeltaPct: number | null;
  averageOrderValue: number;
  userCount: number;
  userSegments: DonutSlice[];
  stockHealth: DonutSlice[];
  revenueByDay: RevenuePoint[];
  revenueByMonth: RevenuePoint[];
  signupsByDay: CountPoint[];
  recentOrders: Order[];
  topProducts: TopProducts[];
}

const TREND_WINDOW_DAYS = 14;

function computeDeltaPct(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

function inRange(iso: string, start: Date, end: Date): boolean {
  const d = new Date(iso);
  return d >= start && d < end;
}

function buildRevenueByDay(orders: Order[], days: number): RevenuePoint[] {
  const buckets = new Map<string, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const order of orders) {
    const isoDate = order.placedAt.slice(0, 10);
    if (buckets.has(isoDate)) {
      buckets.set(isoDate, (buckets.get(isoDate) ?? 0) + order.totals.total);
    }
  }

  return Array.from(buckets.entries()).map(([isoDate, revenue]) => ({
    isoDate,
    date: new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: Math.round(revenue * 100) / 100,
  }));
}

function buildRevenueByMonth(orders: Order[]): RevenuePoint[] {
  const year = new Date().getFullYear();
  const buckets = new Map<string, number>();

  for (let m = 0; m < 12; m++) {
    buckets.set(new Date(year, m, 1).toISOString().slice(0, 7), 0);
  }

  for (const order of orders) {
    const key = order.placedAt.slice(0, 7);
    if (buckets.has(key))
      buckets.set(key, (buckets.get(key) ?? 0) + order.totals.total);
  }

  return Array.from(buckets.entries()).map(([key, revenue]) => ({
    isoDate: key,
    date: new Date(`${key}-01`).toLocaleDateString("en-US", { month: "short" }),
    revenue: Math.round(revenue * 100) / 100,
  }));
}

function buildSignupsByDay(users: AdminUser[], days: number): CountPoint[] {
  const buckets = new Map<string, number>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const user of users) {
    const isoDate = user.createdAt.slice(0, 10);
    if (buckets.has(isoDate))
      buckets.set(isoDate, (buckets.get(isoDate) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([isoDate, count]) => ({
    isoDate,
    date: new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    count,
  }));
}

function computeUserSegments(
  users: AdminUser[],
  orders: Order[],
): DonutSlice[] {
  const userWithOrders = new Set(
    orders.filter((o) => o.userId).map((o) => o.userId as string),
  );
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let newUsers = 0;
  let returning = 0;
  let inactive = 0;

  for (const user of users) {
    if (new Date(user.createdAt) >= thirtyDaysAgo) newUsers++;
    else if (userWithOrders.has(user.id)) returning++;
    else inactive++;
  }

  return [
    { label: "New", value: newUsers, color: "#F4B400" },
    { label: "Returning", value: returning, color: "#FDE293" },
    { label: "Inactive", value: inactive, color: "#F6E9C9" },
  ];
}

function computeStockHealth(products: Product[]): DonutSlice[] {
  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  for (const product of products) {
    if (product.stock === 0) outOfStock++;
    else if (product.stock <= 5) lowStock++;
    else inStock++;
  }

  return [
    { label: "In Stock", value: inStock, color: "#12b76a" },
    { label: "Low Stock", value: lowStock, color: "#D49A3A" },
    { label: "Out of Stock", value: outOfStock, color: "#C65A5A" },
  ];
}

export async function fetchDashboardMetrics(): Promise<DashboardMetrics> {
  const [orders, users, products] = await Promise.all([
    fetchAllOrders(),
    fetchAllUsers(),
    fetchProducts(),
  ]);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totals.total,
    0,
  );

  const orderCount = orders.length;
  const revenueOrders = orders.filter((o) => o.status !== "cancelled");

  const averageOrderValue =
    revenueOrders.length > 0 ? totalRevenue / revenueOrders.length : 0;

  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const fulfillmentRatePct =
    orderCount > 0 ? Math.round((deliveredCount / orderCount) * 100) : 0;

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const periodEnd = new Date(now);
  periodEnd.setDate(periodEnd.getDate() + 1);

  const currentStart = new Date(now);
  currentStart.setDate(currentStart.getDate() - TREND_WINDOW_DAYS);
  const previousStart = new Date(currentStart);
  previousStart.setDate(previousStart.getDate() - TREND_WINDOW_DAYS);

  const currentPeriodOrders = orders.filter((o) =>
    inRange(o.placedAt, currentStart, periodEnd),
  );
  const previousPeriodOrders = orders.filter((o) =>
    inRange(o.placedAt, previousStart, currentStart),
  );

  const currentRevenue = currentPeriodOrders.reduce(
    (s, o) => s + o.totals.total,
    0,
  );
  const previousRevenue = previousPeriodOrders.reduce(
    (s, o) => s + o.totals.total,
    0,
  );

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthRevenue = orders
    .filter((o) => new Date(o.placedAt) >= monthStart)
    .reduce((s, o) => s + o.totals.total, 0);

  const productTotals = new Map<string, TopProducts>();

  for (const order of orders) {
    for (const item of order.items) {
      const existing = productTotals.get(item.product.name) ?? {
        name: item.product.name,
        unitsSold: 0,
        revenue: 0,
        image: item.product.images[0],
      };

      existing.unitsSold += item.quantity;
      existing.revenue += item.product.price * item.quantity;
      existing.image = item.product.images[0];
      productTotals.set(item.product.name, existing);
    }
  }

  const topProducts = Array.from(productTotals.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    orderCount,
    orderCountDeltaPct: computeDeltaPct(
      currentPeriodOrders.length,
      previousPeriodOrders.length,
    ),
    deliveredCount,
    fulfillmentRatePct,
    totalRevenue,
    currentMonthRevenue,
    revenueDeltaPct: computeDeltaPct(currentRevenue, previousRevenue),
    averageOrderValue,
    userCount: users.length,
    userSegments: computeUserSegments(users, orders),
    stockHealth: computeStockHealth(products),
    revenueByDay: buildRevenueByDay(orders, TREND_WINDOW_DAYS),
    revenueByMonth: buildRevenueByMonth(orders),
    signupsByDay: buildSignupsByDay(users, TREND_WINDOW_DAYS),
    recentOrders: orders.slice(0, 6),
    topProducts,
  };
}
