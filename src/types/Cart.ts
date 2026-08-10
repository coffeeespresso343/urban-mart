import type { Product } from "./Product";

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  itemCount: number;
}
