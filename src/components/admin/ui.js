import Link from "next/link";

export function AdminHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-2xl font-black text-warm-mocha">{title}</h1>
        {subtitle && <p className="text-warm-mocha/60 font-bold text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-3xl border border-pastel-pink/40 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, href, tone = "rose" }) {
  const tones = {
    rose: "bg-pastel-pink/40 text-soft-rose",
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-700",
    blue: "bg-blue-100 text-blue-700",
  };
  const inner = (
    <div className="bg-white rounded-3xl border border-pastel-pink/40 p-5 hover:shadow-soft-sm transition h-full">
      <div className={`w-11 h-11 grid place-items-center rounded-2xl mb-3 ${tones[tone]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-black text-warm-mocha">{value}</p>
      <p className="text-sm font-bold text-warm-mocha/60">{label}</p>
      {sub && <p className="text-xs font-bold text-warm-mocha/40 mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export function EmptyRow({ children, colSpan = 99 }) {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-12 text-warm-mocha/50 font-bold">
        {children || "لا توجد بيانات."}
      </td>
    </tr>
  );
}

export function TableWrap({ head, children }) {
  return (
    <div className="bg-white rounded-3xl border border-pastel-pink/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-cream text-warm-mocha/70 font-black text-right">
              {head.map((h, i) => (
                <th key={i} className="px-4 py-3 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-pastel-pink/30">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function Badge({ children, className = "" }) {
  return (
    <span className={`inline-block text-xs font-black px-2.5 py-1 rounded-full whitespace-nowrap ${className}`}>
      {children}
    </span>
  );
}
