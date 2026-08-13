import { createContext, useContext, type ReactNode } from "react";
import type { Product } from "../types/Product";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useUIStore } from "../hooks/uiStore";

interface WishlistContextValue {
  productIds: number[];
  isWishListed: (productId: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  clearWishlist: () => void;
}
const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined,
);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [productIds, setProductIds] = useLocalStorage<number[]>(
    "urban-mart-wishlist",
    [],
  );

  const showToast = useUIStore((s) => s.showToast);

  const isWishListed = (productId: number) => productIds.includes(productId);

  const toggleWishlist = (product: Product) => {
    setProductIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed form wishlist`, "info");
        return prev.filter((id) => id !== product.id);
      }
      showToast(`Added to wishlist - ${product.name}`, "success");
      return [...prev, product.id];
    });
  };

  const removeFromWishlist = (productId: number) => {
    setProductIds((prev) => prev.filter((id) => id !== productId));
  };

  const clearWishlist = () => setProductIds([]);

  const value: WishlistContextValue = {
    productIds,
    isWishListed,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlistContext(): WishlistContextValue {
  const ctx = useContext(WishlistContext);

  if (!ctx)
    throw new Error("useWishlistContext must be used within WishlistProvider");

  return ctx;
}
