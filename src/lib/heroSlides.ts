import type { HeroSlide } from "../types/HeroSlide";
import { mapRowToProduct, type ProductRow } from "./products";
import { isSupabaseConfigured, supabase } from "./supabase";

interface HeroSlideRow {
  id: string;
  product_id: number;
  tagline: string;
  title: string;
  highlight_text: string;
  description: string;
  image: string;
  thumb: string;
  accent_color: string;
  position: number;
  is_active: boolean;
  product: ProductRow;
}

function mapRowToHeroSlide(row: HeroSlideRow): HeroSlide {
  return {
    id: row.id,
    tagline: row.tagline,
    title: row.title,
    highlightText: row.highlight_text,
    description: row.description,
    image: row.image,
    thumb: row.thumb,
    accentColor: row.accent_color,
    position: row.position,
    isActive: row.is_active,
    product: mapRowToProduct(row.product),
  };
}

const SELECT_WITH_PRODUCT = "*, product:products(*)";

export async function fetchActiveHeroSlides(): Promise<HeroSlide[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("hero_slides")
    .select(SELECT_WITH_PRODUCT)
    .eq("is_active", true)
    .order("position", { ascending: true });

  if (error || !data) return [];

  return (data as unknown as HeroSlideRow[]).map(mapRowToHeroSlide);
}

export async function fetchAllHeroSlides(): Promise<HeroSlide[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from("hero_slides")
    .select(SELECT_WITH_PRODUCT)
    .order("position", { ascending: true });

  if (error || !data) return [];

  return (data as unknown as HeroSlideRow[]).map(mapRowToHeroSlide);
}

export interface HeroSlideInput {
  productId: number;
  tagline: string;
  title: string;
  highlightText: string;
  description: string;
  image: string;
  thumb: string;
  accentColor: string;
  position: number;
  isActive: boolean;
}

function toRow(input: Partial<HeroSlideInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (input.productId !== undefined) row.product_id = input.productId;

  if (input.tagline !== undefined) row.tagline = input.tagline;
  if (input.title !== undefined) row.title = input.title;
  if (input.highlightText !== undefined)
    row.highlight_text = input.highlightText;
  if (input.description !== undefined) row.description = input.description;
  if (input.image !== undefined) row.image = input.image;
  if (input.thumb !== undefined) row.thumb = input.thumb;
  if (input.accentColor !== undefined) row.accent_color = input.accentColor;
  if (input.position !== undefined) row.position = input.position;
  if (input.isActive !== undefined) row.is_active = input.isActive;
  return row;
}

export async function createHeroSlide(
  input: HeroSlideInput,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };

  const { error } = await supabase.from("hero_slides").insert(toRow(input));

  return { error: error?.message ?? null };
}

export async function updateHeroSlide(
  id: string,
  changes: Partial<HeroSlideInput>,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };
  const { error } = await supabase
    .from("hero_slides")
    .update(toRow(changes))
    .eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteHeroSlide(
  id: string,
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured." };
  const { error } = await supabase.from("hero_slides").delete().eq("id", id);
  return { error: error?.message ?? null };
}
