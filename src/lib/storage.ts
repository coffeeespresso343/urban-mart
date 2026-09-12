import { isSupabaseConfigured, supabase } from "./supabase";

const BUCKET = "product-images";

export interface UploadResult {
  urls: string[];
  error: string | null;
}

/**
 * Uploads each file to the product-images bucket under products/{prduct.id}/{random}
 * then returns URLS
 * @param files
 * @param productId
 * @returns urls
 */
export async function uploadProductImages(
  files: File[],
  productId: number,
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    return {
      urls: [],
      error:
        "Supabase isn't configured - image upload requires a connected project.",
    };
  }

  const urls: string[] = [];

  for (const file of files) {
    const path = `products/${productId}/${crypto.randomUUID()}-${file.name}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      return { urls, error: error.message };
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return { urls, error: null };
}
