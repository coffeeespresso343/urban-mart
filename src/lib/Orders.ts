import type { CartItem, CartTotals } from "../types/Cart";
import type { Order, OrderStatus, ShippingAddress } from "../types/Order";
import { isSupabaseConfigured, supabase } from "./supabase";

interface CreateOrderInput {
  items: CartItem[];
  totals: CartTotals;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  estimatedDelivery: string;
  userId?: string | null;
}

interface OrderRow {
  id: string;
  order_number: string;
  user_id: string | null;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shipping_address: ShippingAddress;
  shipping_method: string;
  status: string;
  created_at: string;
  estimated_delivery: string | null;
}

const generateOrderNumber = () =>
  `UM-${Math.floor(100000 + Math.random() * 900000)}`;

function mapRowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    userId: row.user_id,
    items: row.items,
    totals: {
      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      discount: Number(row.discount),
      total: Number(row.total),
      itemCount: row.items.reduce((sum, item) => sum + item.quantity, 0),
    },
    shippingAddress: row.shipping_address,
    shippingMethod: row.shipping_method,
    status: row.status as OrderStatus,
    placedAt: row.created_at,
    estimatedDelivery: row.estimated_delivery ?? "",
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orderNumber = generateOrderNumber();

  const order: Order = {
    id: orderNumber,
    orderNumber,
    userId: input.userId ?? null,
    items: input.items,
    totals: input.totals,
    shippingAddress: input.shippingAddress,
    shippingMethod: input.shippingMethod,
    status: "processing",
    placedAt: new Date().toISOString(),
    estimatedDelivery: input.estimatedDelivery,
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: input.userId ?? null,
        email: input.shippingAddress.email,
        status: "processing",
        items: input.items,
        subtotal: input.totals.subtotal,
        shipping: input.totals.shipping,
        discount: input.totals.discount,
        total: input.totals.total,
        shipping_method: input.shippingMethod,
        shipping_address: input.shippingAddress,
        estimated_delivery: input.estimatedDelivery,
      })
      .select()
      .single();

    if (!error && data) {
      order.id = (data as OrderRow).id;
    }
  }

  try {
    localStorage.setItem("urban-mart-last-order", JSON.stringify(order));
  } catch {
    //
  }

  return order;
}

export async function fetchOrdersForUsers(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as OrderRow[]).map(mapRowToOrder);
}

export async function fetchOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !data) return null;

  return mapRowToOrder(data as OrderRow);
}

export function getLastLocalOrder(): Order | null {
  try {
    const raw = localStorage.getItem("urban-mart-last-order");
    return raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    return null;
  }
}
