import Link from "next/link";

// Page header for legal / info pages.
export function PageHeader({ emoji, title, subtitle, updated }) {
  return (
    <div className="bg-gradient-to-b from-pastel-pink/40 to-cream border-b border-pastel-pink/40">
      <div className="max-w-3xl mx-auto px-5 py-12 text-center">
        {emoji && <div className="text-5xl mb-3">{emoji}</div>}
        <h1 className="text-3xl md:text-4xl font-black text-warm-mocha">
          {title}
        </h1>
        {subtitle && (
          <p className="text-warm-mocha/70 font-bold mt-3 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {updated && (
          <p className="text-xs font-bold text-warm-mocha/40 mt-4">
            آخر تحديث: {updated}
          </p>
        )}
      </div>
    </div>
  );
}

// A numbered section in a legal document.
export function Section({ n, title, children }) {
  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-2.5 text-xl font-black text-warm-mocha mb-3">
        {n != null && (
          <span className="grid place-items-center w-8 h-8 rounded-full bg-soft-rose text-white text-sm shrink-0">
            {n}
          </span>
        )}
        {title}
      </h2>
      <div className="text-warm-mocha/80 font-semibold leading-loose space-y-3 ltr:pl-10 rtl:pr-10">
        {children}
      </div>
    </section>
  );
}

// Bullet list helper.
export function Bullets({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="text-soft-rose mt-1.5 shrink-0">●</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LegalContainer({ children }) {
  return (
    <div className="max-w-3xl mx-auto px-5 py-12">{children}</div>
  );
}

// A soft callout box (e.g. for important custom-order notes).
export function Callout({ emoji = "💡", children, tone = "rose" }) {
  const tones = {
    rose: "bg-pastel-pink/25 border-soft-rose/40",
    warn: "bg-amber-50 border-amber-300",
    info: "bg-cream border-pastel-pink/60",
  };
  return (
    <div
      className={`rounded-3xl border ${tones[tone]} p-5 my-6 flex items-start gap-3`}
    >
      <span className="text-2xl shrink-0">{emoji}</span>
      <div className="text-warm-mocha/85 font-bold leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function ContactCTA() {
  return (
    <div className="mt-10 rounded-3xl bg-warm-mocha text-cream p-7 text-center">
      <p className="font-black text-lg mb-1">عندك سؤال؟</p>
      <p className="text-cream/70 font-semibold mb-4">
        فريق سارة دولز سعيد بمساعدتك في أي وقت 🌸
      </p>
      <Link
        href="/تواصل-معنا"
        className="inline-block bg-soft-rose text-white font-black px-6 py-3 rounded-2xl hover:bg-brand-dark transition"
      >
        تواصلي معنا
      </Link>
    </div>
  );
}
