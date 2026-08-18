import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { CartItem, CartTotals } from "../types/Cart";
import type { Product } from "../types/Product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useUIStore } from "../hooks/uiStore";

const FREE_SHIPPING_THRESHOLD = 99;
const STANDARD_SHIPPING = 8;

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, color?: string) => void;
  removeItem: (productId: number, color?: string) => void;
  updateQuantity: (productId: number, quantity: number, color?: string) => void;
  clearCart: () => void;
  promoCode: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  totals: CartTotals;
  isAdded: (productId: number, color?: string) => boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const VALID_PROMOS: Record<string, number> = {
  URBAN10: 0.1,
  WELCOME15: 0.15,
};

const lineKey = (id: number, color?: string) => `${id}::${color ?? ""}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>("urban-mart-cart", []);

  const [promoCode, setPromoCode] = useLocalStorage<string | null>(
    "urban-mart-promo",
    null,
  );

  const showToast = useUIStore((s) => s.showToast);

  const addItem = (product: Product, quantity = 1, color?: string) => {
    setItems((prev) => {
      const key = lineKey(product.id, color);
      const existing = prev.find(
        (item) => lineKey(item.product.id, item.color) === key,
      );

      if (existing) {
        return prev.map((item) =>
          lineKey(item.product.id, item.color) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { product, quantity, color }];
    });
    // console.log(`Added to your bag - ${product.name}`);
    showToast(`Added to your bag - ${product.name}`, "success");
    // openCart();
  };

  const isAdded = (productId: number, color?: string) => {
    return items.some(
      (item) =>
        lineKey(item.product.id, item.color) === lineKey(productId, color),
    );
  };

  const removeItem = (productId: number, color?: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          lineKey(item.product.id, item.color) !== lineKey(productId, color),
      ),
    );
  };

  const updateQuantity = (
    productId: number,
    quantity: number,
    color?: string,
  ) => {
    if (quantity <= 0) {
      removeItem(productId, color);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        lineKey(item.product.id, item.color) === lineKey(productId, color)
          ? { ...item, quantity }
          : item,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized in VALID_PROMOS) {
      setPromoCode(normalized);
      showToast("Promo code applied", "success");
      return true;
    }

    showToast("Promo code isn't valid", "error");
    return false;
  };

  const removePromoCode = () => setPromoCode(null);

  const totals = useMemo<CartTotals>(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const shipping =
      subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING;

    const discountRate = promoCode ? (VALID_PROMOS[promoCode] ?? 0) : 0;
    const discount = Math.round(subtotal * discountRate * 100) / 100;
    const total = Math.max(subtotal - discount + shipping, 0);

    return { subtotal, shipping, discount, total, itemCount };
  }, [items, promoCode]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    promoCode,
    applyPromoCode,
    removePromoCode,
    totals,
    isAdded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const ctx = useContext(CartContext);

  if (!ctx) throw new Error("useCartContext must be used with CartProvider.");

  return ctx;
}
