export type ProductCategory =
  | "Tools"
  | "Lighting"
  | "Storage"
  | "Tech Accessories"
  | "Home"
  | "Travel"
  | "Lifestyle"
  | "Everyday Carry";

export type ProductBadge = "New" | "Best Seller" | "Limited";

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  description: string;
  details: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badge?: ProductBadge;
  colors?: string[];
  tags: string[];
  featured?: boolean;
  isNew?: boolean;
  bestSeller?: boolean;
}

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating";
