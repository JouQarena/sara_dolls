"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const SORTS = [
  { value: "featured", label: "الأكثر تميّزاً" },
  { value: "price_low", label: "السعر: من الأقل للأعلى" },
  { value: "price_high", label: "السعر: من الأعلى للأقل" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "newest", label: "الأحدث" },
];

export default function ShopControls({ categories }) {
  const router = useRouter();
  const params = useSearchParams();

  const activeCat = params.get("category") || "";
  const activeSort = params.get("sort") || "featured";
  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");

  // Keep input in sync if params change externally.
  useEffect(() => {
    setSearchTerm(params.get("search") || "");
  }, [params]);

  function update(next) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    sp.delete("page"); // reset to first page on any filter change
    router.push(`/shop?${sp.toString()}`);
  }

  function onSearchSubmit(e) {
    e.preventDefault();
    update({ search: searchTerm.trim() });
  }

  const filterCats = categories.filter((c) => !c.is_special);

  return (
    <div className="space-y-4">
      {/* search */}
      <form onSubmit={onSearchSubmit} className="relative">
        <Search className="absolute top-1/2 -translate-y-1/2 right-4 w-5 h-5 text-warm-mocha/40" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحثي عن دمية، باترون، أو هدية..."
          className="w-full rounded-2xl border border-pastel-pink/60 bg-white pr-12 pl-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow transition"
        />
      </form>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {/* category chips */}
        <div className="flex flex-wrap gap-2">
          <Chip active={!activeCat} onClick={() => update({ category: "" })}>
            الكل
          </Chip>
          {filterCats.map((c) => (
            <Chip
              key={c.id}
              active={activeCat === c.slug}
              onClick={() => update({ category: c.slug })}
            >
              {c.name_ar}
            </Chip>
          ))}
        </div>

        {/* sort */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold text-warm-mocha/60 whitespace-nowrap">
            ترتيب:
          </span>
          <select
            value={activeSort}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-2xl border border-pastel-pink/60 bg-white px-3 py-2.5 text-sm font-bold text-warm-mocha outline-none focus:border-soft-rose cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-black transition ${
        active
          ? "bg-soft-rose text-white shadow-soft-sm"
          : "bg-white text-warm-mocha border border-pastel-pink/60 hover:border-soft-rose"
      }`}
    >
      {children}
    </button>
  );
}
