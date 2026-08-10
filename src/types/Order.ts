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

export interface Order {
  id: string;
  items: CartItem[];
  totals: CartTotals;
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  placeAt: string;
  estimatedDelivery: string;
}
