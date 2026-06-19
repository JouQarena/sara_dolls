import Link from "next/link";

export default function ComingSoon({ title, emoji = "🌸", phase }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <h1 className="text-2xl md:text-3xl font-black text-warm-mocha mb-2">
        {title}
      </h1>
      <p className="text-warm-mocha/60 font-bold">
        هذه الصفحة قيد الإنشاء{phase ? ` (المرحلة ${phase})` : ""}.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 bg-soft-rose text-white font-black px-6 py-3 rounded-2xl hover:bg-brand-dark transition"
      >
        العودة للرئيسية
      </Link>
    </div>
  );
}
