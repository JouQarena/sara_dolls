"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageLightbox({ images, index, alt, onClose, onNav }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav(index + 1); // RTL: left = next
      if (e.key === "ArrowRight") onNav(index - 1);
    },
    [index, onClose, onNav]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const count = images.length;
  const next = () => onNav((index + 1) % count);
  const prev = () => onNav((index - 1 + count) % count);

  return (
    <div className="fixed inset-0 z-[100] bg-warm-mocha/90 flex items-center justify-center p-4">
      <button
        onClick={onClose}
        className="absolute top-4 left-4 w-11 h-11 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"
        aria-label="إغلاق"
      >
        <X className="w-6 h-6" />
      </button>

      <div
        className="relative w-full max-w-3xl aspect-square"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[index]}
          alt={`${alt} - صورة ${index + 1}`}
          fill
          className="object-contain"
          priority
        />
      </div>

      {count > 1 && (
        <>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"
            aria-label="التالي"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center rounded-full bg-white/15 text-white hover:bg-white/30"
            aria-label="السابق"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="absolute bottom-5 inset-x-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i === index ? "bg-white w-5" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
