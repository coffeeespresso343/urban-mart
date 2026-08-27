import type { CartItem, CartTotals } from "./Cart";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  items: CartItem[];
  totals: CartTotals;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  placeAt: string;
  estimatedDelivery: string;
}
