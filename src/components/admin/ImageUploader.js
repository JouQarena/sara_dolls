"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { UploadCloud, X, Star } from "lucide-react";
import {
  validateImage,
  compressImageFile,
  ALLOWED_TYPES,
} from "@/lib/compressImage";
import { uploadProductImage } from "@/lib/uploadImage";

/**
 * Multi-image uploader.
 * - `value`: array of { url, isMain } (existing + newly uploaded)
 * - `onChange(next)`: called with the updated array
 * - first item (or the one flagged isMain) is the MAIN image
 * Max 6 total (1 main + 5 gallery).
 */
const MAX_TOTAL = 6;

export default function ImageUploader({ value = [], onChange, productId = "new" }) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(
    async (accepted, rejected) => {
      setError("");
      if (rejected?.length) {
        setError("نوع الملف غير مدعوم (المسموح: JPG، PNG، WEBP)");
      }
      const room = MAX_TOTAL - value.length;
      if (room <= 0) {
        setError(`أقصى عدد: ${MAX_TOTAL} صور (1 رئيسية + 5 إضافية)`);
        return;
      }
      const files = accepted.slice(0, room);

      setUploading(true);
      setProgress(0);
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const check = validateImage(file);
        if (!check.ok) {
          setError(check.error);
          continue;
        }
        try {
          const compressed = await compressImageFile(file);
          const url = await uploadProductImage(compressed, {
            productId,
            index: value.length + newItems.length,
          });
          newItems.push({ url, isMain: false });
        } catch {
          setError("تعذّر رفع إحدى الصور، حاولي مرة أخرى.");
        }
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      let next = [...value, ...newItems];
      // Ensure exactly one main image (first one by default).
      if (!next.some((x) => x.isMain) && next.length) next[0].isMain = true;
      onChange(next);
      setUploading(false);
      setProgress(0);
    },
    [value, onChange, productId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
    multiple: true,
    disabled: uploading || value.length >= MAX_TOTAL,
  });

  function removeAt(idx) {
    const removed = value[idx];
    let next = value.filter((_, i) => i !== idx);
    // If we removed the main, promote the first remaining.
    if (removed?.isMain && next.length) {
      next = next.map((x, i) => ({ ...x, isMain: i === 0 }));
    }
    onChange(next);
  }

  function setMain(idx) {
    onChange(value.map((x, i) => ({ ...x, isMain: i === idx })));
  }

  return (
    <div className="space-y-3">
      {/* dropzone */}
      <div
        {...getRootProps()}
        className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition ${
          isDragActive
            ? "border-soft-rose bg-pastel-pink/20"
            : "border-pastel-pink/60 hover:border-soft-rose hover:bg-pastel-pink/10"
        } ${value.length >= MAX_TOTAL ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-8 h-8 mx-auto text-soft-rose mb-2" />
        <p className="font-black text-warm-mocha text-sm">
          اسحب الصور هنا أو اضغط للاختيار
        </p>
        <p className="text-xs font-bold text-warm-mocha/50 mt-1">
          أقصى حجم: 2 ميجا · أقصى عدد: {MAX_TOTAL} صور · JPG / PNG / WEBP
        </p>
      </div>

      {error && (
        <p className="text-rose-600 text-sm font-bold bg-rose-50 rounded-xl p-2.5">
          {error}
        </p>
      )}

      {uploading && (
        <div className="w-full bg-pastel-pink/30 rounded-full h-2 overflow-hidden">
          <div
            className="bg-soft-rose h-2 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* previews */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {value.map((img, idx) => (
            <div
              key={img.url + idx}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 group ${
                img.isMain ? "border-soft-rose" : "border-pastel-pink/40"
              }`}
            >
              <Image src={img.url} alt={`صورة ${idx + 1}`} fill className="object-cover" />

              {/* main badge */}
              {img.isMain && (
                <span className="absolute top-1 right-1 bg-soft-rose text-white text-[0.6rem] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" /> رئيسية
                </span>
              )}

              {/* set as main */}
              {!img.isMain && (
                <button
                  type="button"
                  onClick={() => setMain(idx)}
                  className="absolute bottom-1 right-1 left-1 bg-white/85 text-warm-mocha text-[0.6rem] font-black py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                >
                  اجعليها رئيسية
                </button>
              )}

              {/* remove */}
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute top-1 left-1 w-6 h-6 grid place-items-center rounded-full bg-warm-mocha/70 text-white hover:bg-rose-600"
                aria-label="حذف"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs font-bold text-warm-mocha/40">
        الصورة الأولى أو المحدّدة بـ«رئيسية» ستظهر كصورة أساسية للمنتج.
      </p>
    </div>
  );
}

export { ALLOWED_TYPES };
