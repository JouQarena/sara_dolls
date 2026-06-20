"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import ImageLightbox from "@/components/ui/ImageLightbox";

export default function ImageGallery({ images, alt, isPattern, discountPct }) {
  const list = images && images.length ? images.filter(Boolean) : ["/sara-avatar.jpg"];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef(null);

  // Mobile swipe handlers.
  function onTouchStart(e) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      // RTL: swipe left → next, swipe right → prev
      if (dx < 0) setActive((a) => (a + 1) % list.length);
      else setActive((a) => (a - 1 + list.length) % list.length);
    }
    touchX.current = null;
  }

  return (
    <div>
      {/* main image */}
      <div
        className="relative aspect-square rounded-3xl overflow-hidden bg-cream border border-pastel-pink/40 shadow-soft-sm group cursor-zoom-in"
        onClick={() => setLightbox(true)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={list[active]}
          alt={`${alt} - صورة ${active + 1}`}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />

        {isPattern && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-warm-mocha text-cream text-xs font-black px-3 py-1.5 rounded-full z-10">
            📄 باترون رقمي
          </span>
        )}
        {discountPct > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full z-10">
            خصم {discountPct}%
          </span>
        )}

        {/* zoom hint */}
        <span className="absolute bottom-3 left-3 w-9 h-9 grid place-items-center rounded-full bg-white/80 text-warm-mocha opacity-0 group-hover:opacity-100 transition">
          <ZoomIn className="w-5 h-5" />
        </span>

        {/* mobile dots */}
        {list.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 sm:hidden">
            {list.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition ${
                  i === active ? "bg-soft-rose w-5" : "bg-white/70"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* thumbnail strip */}
      {list.length > 1 && (
        <div className="hidden sm:flex gap-2.5 mt-3 flex-wrap">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                active === i
                  ? "border-soft-rose ring-2 ring-rose-glow"
                  : "border-pastel-pink/40 hover:border-pastel-pink"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} مصغّرة ${i + 1}`}
                fill
                loading="lazy"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          images={list}
          index={active}
          alt={alt}
          onClose={() => setLightbox(false)}
          onNav={setActive}
        />
      )}
    </div>
  );
}
