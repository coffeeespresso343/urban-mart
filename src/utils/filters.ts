import type { Product, ProductCategory } from "../types/Product";

export interface ProductFilters {
  search: string;
  categories: ProductCategory[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
}

export const defaultFilters: ProductFilters = {
  search: "",
  categories: [],
  minPrice: 0,
  maxPrice: 200,
  minRating: 0,
  inStockOnly: false,
};

export const filterProducts = (
  products: Product[],
  filters: ProductFilters,
): Product[] => {
  const query = filters.search.trim().toLowerCase();

  return products.filter((product) => {
    if (query) {
      const haystack = [
        product.name,
        product.category,
        product.description,
        ...product.tags,
      ]
        .join("")
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }

    if (product.rating < filters.minRating) return false;

    if (filters.inStockOnly && product.stock <= 0) return false;

    return true;
  });
};
