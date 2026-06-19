import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "الصفحة غير موجودة | سارة دولز",
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pastel-pink/40 via-cream to-cream flex items-center justify-center px-5 py-16">
      <div className="text-center max-w-md">
        <Image
          src="/sara-avatar.jpg"
          alt="Sara Dolls"
          width={100}
          height={100}
          className="rounded-full border-4 border-pastel-pink shadow-soft mx-auto mb-6 animate-float-slow"
          priority
        />
        <p className="text-7xl font-black text-soft-rose mb-2">٤٠٤</p>
        <h1 className="text-2xl font-black text-warm-mocha mb-2">
          الصفحة غير موجودة
        </h1>
        <p className="text-warm-mocha/60 font-bold leading-relaxed mb-7">
          يبدو أن هذه الصفحة قد ضاعت بين خيوط الكروشيه 🧶 — لكن لا تقلقي، يمكنك
          العودة للرئيسية أو متابعة التسوّق.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-soft-rose text-white font-black px-6 py-3.5 rounded-2xl hover:bg-brand-dark shadow-soft transition"
          >
            <Home className="w-5 h-5" /> الرئيسية
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white text-warm-mocha font-black px-6 py-3.5 rounded-2xl border border-pastel-pink/60 hover:border-soft-rose transition"
          >
            <ShoppingBag className="w-5 h-5" /> المتجر
          </Link>
        </div>
      </div>
    </main>
  );
}
