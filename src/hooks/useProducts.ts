import { useEffect } from "react";
import { useProductsStore } from "./useProductsStore";

/**
 * Live product catalog - from supabase when configured, falling back to static products
 */
export function useProducts() {
  const products = useProductsStore((s) => s.products);
  const isLoading = useProductsStore((s) => s.isLoading);
  const hasLoaded = useProductsStore((s) => s.hasLoaded);
  const loadProducts = useProductsStore((s) => s.loadProducts);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return { products, isLoading: isLoading || !hasLoaded };
}
