"use client";

import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function Error({ reset }) {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-5 py-16">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-2xl font-black text-warm-mocha mb-2">
          حدث خطأ ما
        </h1>
        <p className="text-warm-mocha/60 font-bold leading-relaxed mb-7">
          نعتذر عن الإزعاج، حدث خطأ غير متوقع. حاولي إعادة تحميل الصفحة.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 bg-soft-rose text-white font-black px-6 py-3.5 rounded-2xl hover:bg-brand-dark shadow-soft transition"
          >
            <RefreshCw className="w-5 h-5" /> إعادة المحاولة
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white text-warm-mocha font-black px-6 py-3.5 rounded-2xl border border-pastel-pink/60 hover:border-soft-rose transition"
          >
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
