"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, MessageCircle, Save } from "lucide-react";
import { updateCustomOrder } from "../actions";
import { Badge } from "@/components/admin/ui";
import { formatEGP } from "@/lib/constants";
import {
  CUSTOM_STATUS_AR,
  CUSTOM_STATUS_STYLE,
  formatDateAr,
} from "@/lib/orderStatus";
import { orderTypeLabel, sizeLabel, budgetLabel } from "@/lib/customOrders";
import { whatsappLink } from "@/lib/whatsapp";

const STATUSES = [
  "pending_review", "quoted", "approved", "in_progress", "completed", "delivered", "cancelled",
];

export default function CustomOrderRow({ order }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [quote, setQuote] = useState(order.admin_quote_price ?? "");
  const [notes, setNotes] = useState(order.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    const fd = new FormData();
    fd.set("id", order.id);
    fd.set("status", status);
    fd.set("admin_quote_price", quote);
    fd.set("admin_notes", notes);
    await updateCustomOrder(fd);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const waMsg = `مرحبًا ${order.full_name} ✨\nبخصوص طلبك الخاص رقم #${order.order_number} من سارة دولز.${
    quote ? `\nعرض السعر: ${quote} ج.م` : ""
  }`;

  return (
    <>
      <tr className="hover:bg-cream/50">
        <td className="px-4 py-3 font-black text-warm-mocha">#{order.order_number}</td>
        <td className="px-4 py-3 font-bold text-warm-mocha">{order.full_name}</td>
        <td className="px-4 py-3 font-bold text-warm-mocha/70">{orderTypeLabel(order.order_type)}</td>
        <td className="px-4 py-3 font-black text-soft-rose whitespace-nowrap">
          {order.admin_quote_price != null ? formatEGP(order.admin_quote_price) : "—"}
        </td>
        <td className="px-4 py-3">
          <Badge className={CUSTOM_STATUS_STYLE[status]}>{CUSTOM_STATUS_AR[status]}</Badge>
        </td>
        <td className="px-4 py-3 text-warm-mocha/60 font-bold whitespace-nowrap">{formatDateAr(order.created_at)}</td>
        <td className="px-4 py-3">
          <button onClick={() => setOpen((o) => !o)} className="p-1.5 rounded-lg hover:bg-pastel-pink/30">
            <ChevronDown className={`w-5 h-5 text-warm-mocha/50 transition ${open ? "rotate-180" : ""}`} />
          </button>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={7} className="px-4 py-4 bg-cream/40">
            <div className="grid md:grid-cols-2 gap-5">
              {/* details */}
              <div className="space-y-1.5 text-sm font-bold text-warm-mocha/75">
                <p><span className="text-warm-mocha/50">الهاتف:</span> <span dir="ltr">{order.phone_number}</span></p>
                {order.email && <p><span className="text-warm-mocha/50">البريد:</span> {order.email}</p>}
                <p><span className="text-warm-mocha/50">العنوان:</span> {order.governorate || "—"}، {order.city || "—"}</p>
                <p><span className="text-warm-mocha/50">الوصف:</span> {order.description}</p>
                <p><span className="text-warm-mocha/50">الألوان:</span> {order.preferred_colors || "—"}</p>
                <p><span className="text-warm-mocha/50">المقاس:</span> {sizeLabel(order.size)}</p>
                <p><span className="text-warm-mocha/50">الميزانية:</span> {budgetLabel(order.budget_range)}</p>
                <p><span className="text-warm-mocha/50">الموعد:</span> {order.deadline ? formatDateAr(order.deadline) : "—"}</p>
                {order.additional_notes && <p><span className="text-warm-mocha/50">ملاحظات:</span> {order.additional_notes}</p>}
                {order.reference_images?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {order.reference_images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="relative w-16 h-16 rounded-xl overflow-hidden border border-pastel-pink/50">
                        <Image src={url} alt={`مرجع ${i + 1}`} fill className="object-cover" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* management */}
              <div className="space-y-3">
                <label className="block">
                  <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">الحالة</span>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-pastel-pink/60 bg-white px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose">
                    {STATUSES.map((s) => <option key={s} value={s}>{CUSTOM_STATUS_AR[s]}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">عرض السعر (ج.م)</span>
                  <input type="number" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="مثال: 450"
                    className="w-full rounded-xl border border-pastel-pink/60 bg-white px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose" />
                </label>
                <label className="block">
                  <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">ملاحظات الإدارة (تظهر للعميلة)</span>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="تفاصيل العرض، المدة..."
                    className="w-full rounded-xl border border-pastel-pink/60 bg-white px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose resize-none" />
                </label>
                <div className="flex gap-2">
                  <button onClick={save} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-soft-rose text-white font-black py-2.5 rounded-xl text-sm hover:bg-brand-dark disabled:opacity-60">
                    <Save className="w-4 h-4" /> {saving ? "جارٍ الحفظ…" : saved ? "تم الحفظ ✓" : "حفظ"}
                  </button>
                  <a href={whatsappLink(waMsg, order.phone_number.replace(/^0/, "20"))} target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-black px-4 py-2.5 rounded-xl text-sm hover:brightness-95">
                    <MessageCircle className="w-4 h-4" /> واتساب
                  </a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
