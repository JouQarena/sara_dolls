"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { saveDiscount, deleteDiscount } from "../actions";
import { Badge, TableWrap, EmptyRow } from "@/components/admin/ui";
import { formatEGP } from "@/lib/constants";

export default function DiscountsManager({ discounts }) {
  const [editing, setEditing] = useState(null);
  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="flex items-center gap-2 bg-soft-rose text-white font-black px-5 py-2.5 rounded-2xl hover:bg-brand-dark shadow-soft-sm">
          <Plus className="w-5 h-5" /> كود جديد
        </button>
      </div>
      <TableWrap head={["الكود", "القيمة", "حد أدنى", "الاستخدام", "الحالة", ""]}>
        {discounts.length === 0 ? <EmptyRow>لا توجد أكواد.</EmptyRow> : discounts.map((d) => (
          <tr key={d.id} className="hover:bg-cream/50">
            <td className="px-4 py-3 font-black text-warm-mocha" dir="ltr">{d.code}</td>
            <td className="px-4 py-3 font-bold text-soft-rose">
              {d.discount_type === "percentage" ? `${d.discount_value}%` : formatEGP(d.discount_value)}
            </td>
            <td className="px-4 py-3 font-bold text-warm-mocha/70">{formatEGP(d.min_order_amount)}</td>
            <td className="px-4 py-3 font-bold text-warm-mocha/70">
              {(d.used_count ?? 0).toLocaleString("ar-EG")}{d.max_uses ? ` / ${d.max_uses}` : ""}
            </td>
            <td className="px-4 py-3">
              <Badge className={d.is_active ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-600"}>
                {d.is_active ? "فعّال" : "موقوف"}
              </Badge>
            </td>
            <td className="px-4 py-3">
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(d)} className="p-2 rounded-lg bg-cream hover:bg-pastel-pink/30 text-warm-mocha"><Pencil className="w-4 h-4" /></button>
                <DelBtn id={d.id} />
              </div>
            </td>
          </tr>
        ))}
      </TableWrap>
      {editing && <Modal discount={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function DelBtn({ id }) {
  const [c, setC] = useState(false);
  async function go() { const fd = new FormData(); fd.set("id", id); await deleteDiscount(fd); }
  return c ? (
    <form action={go} className="flex gap-1">
      <button className="bg-rose-600 text-white px-2.5 py-2 rounded-lg text-xs font-black">تأكيد</button>
      <button type="button" onClick={() => setC(false)} className="bg-cream px-2.5 py-2 rounded-lg text-xs font-black">×</button>
    </form>
  ) : (
    <button onClick={() => setC(true)} className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
  );
}

function Modal({ discount, onClose }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e) {
    e.preventDefault(); setSaving(true); setError("");
    const fd = new FormData(e.currentTarget);
    if (discount.id) fd.set("id", discount.id);
    const res = await saveDiscount(fd);
    setSaving(false);
    if (res?.error) setError(res.error); else onClose();
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-warm-mocha/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-auto">
        <div className="flex items-center justify-between p-5 border-b border-pastel-pink/30">
          <h2 className="font-black text-warm-mocha text-lg">{discount.id ? "تعديل الكود" : "كود جديد"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-pastel-pink/30"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-3">
          {error && <p className="text-rose-600 text-sm font-bold bg-rose-50 rounded-xl p-2.5">{error}</p>}
          <Inp label="الكود" name="code" defaultValue={discount.code} placeholder="SARA10" required dir="ltr" />
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-sm font-extrabold text-warm-mocha mb-1">النوع</span>
              <select name="discount_type" defaultValue={discount.discount_type || "percentage"} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose">
                <option value="percentage">نسبة %</option>
                <option value="fixed">مبلغ ثابت</option>
              </select>
            </label>
            <Inp label="القيمة" name="discount_value" type="number" step="0.01" defaultValue={discount.discount_value} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Inp label="حد أدنى للطلب" name="min_order_amount" type="number" defaultValue={discount.min_order_amount ?? 0} />
            <Inp label="أقصى استخدام" name="max_uses" type="number" defaultValue={discount.max_uses} placeholder="غير محدود" />
          </div>
          <Inp label="تاريخ الانتهاء" name="expires_at" type="date" defaultValue={discount.expires_at?.slice?.(0, 10)} />
          <label className="flex items-center gap-2 cursor-pointer font-bold text-warm-mocha">
            <input type="checkbox" name="is_active" defaultChecked={discount.is_active ?? true} className="w-4 h-4 accent-soft-rose" /> فعّال
          </label>
          <button type="submit" disabled={saving} className="w-full bg-soft-rose text-white font-black py-3.5 rounded-2xl hover:bg-brand-dark disabled:opacity-60">
            {saving ? "جارٍ الحفظ…" : "حفظ"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Inp({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1">{label}</span>
      <input {...props} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose" />
    </label>
  );
}
