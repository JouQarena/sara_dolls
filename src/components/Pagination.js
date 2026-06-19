import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Server component: builds links preserving existing query params.
export default function Pagination({ page, totalPages, basePath, searchParams }) {
  if (totalPages <= 1) return null;

  function hrefFor(p) {
    const sp = new URLSearchParams();
    Object.entries(searchParams || {}).forEach(([k, v]) => {
      if (v && k !== "page") sp.set(k, v);
    });
    sp.set("page", String(p));
    return `${basePath}?${sp.toString()}`;
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className="w-10 h-10 grid place-items-center rounded-xl bg-white border border-pastel-pink/60 text-warm-mocha hover:border-soft-rose transition"
          aria-label="السابق"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
      {pages.map((p) => (
        <Link
          key={p}
          href={hrefFor(p)}
          className={`w-10 h-10 grid place-items-center rounded-xl font-black transition ${
            p === page
              ? "bg-soft-rose text-white shadow-soft-sm"
              : "bg-white border border-pastel-pink/60 text-warm-mocha hover:border-soft-rose"
          }`}
        >
          {p.toLocaleString("ar-EG")}
        </Link>
      ))}
      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          className="w-10 h-10 grid place-items-center rounded-xl bg-white border border-pastel-pink/60 text-warm-mocha hover:border-soft-rose transition"
          aria-label="التالي"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}
    </nav>
  );
}
