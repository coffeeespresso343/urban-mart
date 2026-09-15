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

/**
 * Uploads a single avatar image to avatars/{userId}/{random}-{filename}.
 * Storage RLS scopes access by the folder name matching auth.uid(), not
 * by admin role — this is a self-service "my own account" upload, so any
 * signed-in user could reuse this later, not just admins.
 */

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<{ url: string | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return {
      url: null,
      error:
        "Supabase isn't configured - avatar upload requires a connected project.",
    };
  }

  const path = `${userId}/${crypto.randomUUID()}-${file.name}`;

  const { error } = await supabase.storage.from("avatars").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);

  return { url: data.publicUrl, error: null };
}
