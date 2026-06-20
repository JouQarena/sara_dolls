"use client";

import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKETS } from "@/lib/constants";

function extFromType(type) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

/**
 * Upload a single image File to the `products` bucket.
 * Filename pattern: {productId}_{timestamp}_{index}.{ext}
 * Returns the public URL (or throws).
 */
export async function uploadProductImage(file, { productId = "new", index = 0 } = {}) {
  const supabase = createClient();
  const ext = extFromType(file.type);
  const path = `${productId}_${Date.now()}_${index}.${ext}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.PRODUCTS)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.PRODUCTS)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Upload many images sequentially, calling onProgress(done, total) as it goes.
 * Returns an array of public URLs (in order).
 */
export async function uploadProductImages(files, { productId = "new", onProgress } = {}) {
  const urls = [];
  for (let i = 0; i < files.length; i++) {
    const url = await uploadProductImage(files[i], { productId, index: i });
    urls.push(url);
    if (onProgress) onProgress(i + 1, files.length);
  }
  return urls;
}
