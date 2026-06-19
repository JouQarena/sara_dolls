import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pastel-pink/40 via-cream to-cream flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Brand */}
          <Link
            href="/"
            className="flex flex-col items-center gap-3 mb-7 group"
          >
            <Image
              src="/sara-avatar.jpg"
              alt="Sara Dolls"
              width={84}
              height={84}
              className="rounded-full border-4 border-pastel-pink shadow-soft group-hover:scale-105 transition"
              priority
            />
            <div className="text-center">
              <h1 className="text-2xl font-black text-warm-mocha">سارة دولز</h1>
              <p className="text-soft-rose text-sm font-bold">
                كل دمية حكاية مصنوعة بحب
              </p>
            </div>
          </Link>

          {/* Card */}
          <div className="bg-white rounded-4xl p-7 md:p-8 shadow-soft border border-pastel-pink/40">
            {children}
          </div>

          <p className="text-center text-xs font-bold text-warm-mocha/50 mt-6">
            بالاستمرار فإنك توافقين على{" "}
            <Link
              href="/اتفاقية-المستخدم"
              className="text-soft-rose underline underline-offset-2"
            >
              اتفاقية المستخدم
            </Link>{" "}
            و{" "}
            <Link
              href="/سياسة-الخصوصية"
              className="text-soft-rose underline underline-offset-2"
            >
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
