// Server-safe helper to delete product images from Supabase Storage.
// Accepts public URLs and extracts the storage path after the bucket name.
import { STORAGE_BUCKETS } from "@/lib/constants";

// Extract the object path from a Supabase public URL.
// e.g. https://x.supabase.co/storage/v1/object/public/products/abc_123_0.jpg -> abc_123_0.jpg
export function pathFromPublicUrl(url, bucket = STORAGE_BUCKETS.PRODUCTS) {
  if (!url) return null;
  const marker = `/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length));
}

/**
 * Delete a list of image URLs from the products bucket.
 * `supabaseClient` should be the service-role admin client (server-side).
 */
export async function deleteProductImages(supabaseClient, urls = []) {
  const paths = (urls || [])
    .map((u) => pathFromPublicUrl(u))
    .filter(Boolean);
  if (paths.length === 0) return;
  try {
    await supabaseClient.storage.from(STORAGE_BUCKETS.PRODUCTS).remove(paths);
  } catch {
    // best-effort; don't block product deletion if cleanup fails
  }
}
