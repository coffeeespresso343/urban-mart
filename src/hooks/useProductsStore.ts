import { create } from "zustand";
import type { Product } from "../types/Product";
import { fetchProducts as fetchProductsFromApi } from "../lib/Products";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  hasLoaded: boolean;
  loadProducts: () => Promise<void>;
  refetch: () => Promise<void>;
}

// Shared across every consumer (Home, Shop, ProductDetails, Search) so
// the catalog is fetched once per session rather than once per page.

export const useProductsStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  hasLoaded: false,
  loadProducts: async () => {
    if (get().hasLoaded || get().isLoading) return;

    set({ isLoading: true });

    const products = await fetchProductsFromApi();
    set({ products, isLoading: false, hasLoaded: true });
  },

  refetch: async () => {
    set({ isLoading: true });
    const products = await fetchProductsFromApi();
    set({ products, isLoading: false, hasLoaded: true });
  },
}));
