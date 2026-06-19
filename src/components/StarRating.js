import { Star } from "lucide-react";

export default function StarRating({ value = 0, count, size = "sm" }) {
  const full = Math.round(value);
  const px = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" dir="ltr">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`${px} ${
              i <= full
                ? "fill-amber-400 text-amber-400"
                : "fill-pastel-pink/40 text-pastel-pink/40"
            }`}
          />
        ))}
      </div>
      {typeof count === "number" && (
        <span className="text-xs font-bold text-warm-mocha/50">
          ({count})
        </span>
      )}
    </div>
  );
}
