"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt, isPattern, discountPct }) {
  const list = images && images.length ? images : ["/sara-avatar.jpg"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream border border-pastel-pink/40 shadow-soft-sm">
        <Image
          src={list[active]}
          alt={alt}
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {isPattern && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-warm-mocha text-cream text-xs font-black px-3 py-1.5 rounded-full">
            📄 باترون رقمي
          </span>
        )}
        {discountPct > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full">
            خصم {discountPct}%
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2.5 mt-3">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                active === i
                  ? "border-soft-rose"
                  : "border-pastel-pink/40 hover:border-pastel-pink"
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
