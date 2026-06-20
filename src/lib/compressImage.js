"use client";

import imageCompression from "browser-image-compression";

export const MAX_IMAGE_MB = 2;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Arabic validation messages.
export const IMG_ERRORS = {
  type: "نوع الملف غير مدعوم (المسموح: JPG، PNG، WEBP)",
  size: "الصورة كبيرة جداً (الحد الأقصى 2 ميجا)",
};

// Validate a file BEFORE compression. Returns { ok, error }.
export function validateImage(file) {
  if (!file || !ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: IMG_ERRORS.type };
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return { ok: false, error: IMG_ERRORS.size };
  }
  return { ok: true };
}

// Compress an image in the browser to keep uploads small & fast.
// Falls back to the original file if compression fails.
export async function compressImageFile(file) {
  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1, // target ~1MB
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: file.type === "image/png" ? "image/png" : "image/jpeg",
    });
    return compressed;
  } catch {
    return file;
  }
}
