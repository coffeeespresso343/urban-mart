import type { Product, SortOption } from "../types/Product";

export const sortProducts = (
  products: Product[],
  sort: SortOption,
): Product[] => {
  const list = [...products];

  switch (sort) {
    case "newest": {
      return list.sort(
        (a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id,
      );
    }

    case "price-asc": {
      return list.sort((a, b) => a.price - b.price);
    }

    case "price-desc": {
      return list.sort((a, b) => b.price - a.price);
    }

    case "rating": {
      return list.sort((a, b) => b.rating - a.rating);
    }
    case "featured":
    default: {
      return list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id,
      );
    }
  }
};
