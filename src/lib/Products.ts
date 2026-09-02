// Product Data Access Layer

import type { Product, ProductBadge, ProductCategory } from "../types/Product";
import { product as staticProducts } from "../data/products";
import { isSupabaseConfigured, supabase } from "./supabase";

interface ProductRow {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  compare_at_price: number | null;
  description: string;
  details: string[];
  images: string[];
  rating: number;
  review_count: number;
  stock: number;
  badge: string | null;
  colors: string[];
  tags: string[];
  featured: boolean;
  is_new: boolean;
  best_seller: boolean;
}

function mapRowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category as ProductCategory,
    price: Number(row.price),
    compareAtPrice:
      row.compare_at_price !== null ? Number(row.compare_at_price) : undefined,
    description: row.description,
    details: row.details,
    images: row.images,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    stock: row.stock,
    badge: (row.badge as ProductBadge | null) ?? undefined,
    colors: row.colors.length > 0 ? row.colors : undefined,
    tags: row.tags,
    featured: row.featured,
    isNew: row.is_new,
    bestSeller: row.best_seller,
  };
}

function mapProductToRow(product: Partial<Product>) {
  const row: Record<string, unknown> = {};

  if (product.id !== undefined) row.id = product.id;
  if (product.sku !== undefined) row.sku = product.sku;
  if (product.name !== undefined) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.price !== undefined) row.price = product.price;
  if (product.compareAtPrice !== undefined)
    row.compare_at_price = product.compareAtPrice;
  if (product.description !== undefined) row.description = product.description;
  if (product.details !== undefined) row.details = product.details;
  if (product.images !== undefined) row.images = product.images;
  if (product.rating !== undefined) row.rating = product.rating;
  if (product.reviewCount !== undefined) row.review_count = product.reviewCount;
  if (product.stock !== undefined) row.stock = product.stock;
  if (product.badge !== undefined) row.badge = product.badge || null;
  if (product.colors !== undefined) row.colors = product.colors ?? [];
  if (product.tags !== undefined) row.tags = product.tags;
  if (product.featured !== undefined) row.featured = product.featured;
  if (product.isNew !== undefined) row.is_new = product.isNew;
  if (product.bestSeller !== undefined) row.best_seller = product.bestSeller;

  return row;
}

// Fetch products from supabase, falls back to static data

export async function fetchProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) return staticProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error(
      "Error fetching products data from Supabase. Returning static products",
      error,
    );
    return staticProducts;
  }

  console.log("Success fetching products data from Supabase.");
  return (data as ProductRow[]).map(mapRowToProduct);
}

export async function createProduct(
  product: Product,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase isn't configured to insert product" };
  }

  const { error } = await supabase
    .from("products")
    .insert(mapProductToRow(product));
  return { error: error?.message ?? null };
}

export async function updateProduct(
  id: number,
  changes: Partial<Product>,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase isn't configured to update product" };
  }

  const { error } = await supabase
    .from("products")
    .update(mapProductToRow(changes))
    .eq("id", id);

  return { error: error?.message ?? null };
}

export async function deleteProduct(
  id: number,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase isn't configured to delete product" };
  }

  const { error } = await supabase.from("products").delete().eq("id", id);

  return { error: error?.message ?? null };
}

/** Next available integer id, for the "new product" form — one past the current max. */
export function nextProductId(products: Product[]): number {
  return products.reduce((max, p) => Math.max(max, p.id), 0) + 1;
}

// For home page sections
export function getFeaturedProducts(products: Product[]): Product[] {
  return products.filter((p) => p.featured);
}

export function getBestSellers(products: Product[]): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getNewArrivals(products: Product[], count = 8): Product[] {
  return [...products]
    .filter((p) => p.isNew)
    .concat(products.filter((p) => !p.isNew))
    .slice(0, count);
}

export function getRelatedProducts(
  products: Product[],
  product: Product,
  count = 4,
): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === p.category)
    .slice(0, count);
}
