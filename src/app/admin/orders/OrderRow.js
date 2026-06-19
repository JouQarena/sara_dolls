"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, Image as ImageIcon } from "lucide-react";
import { updateOrderStatus } from "../actions";
import { Badge } from "@/components/admin/ui";
import { formatEGP } from "@/lib/constants";
import { ORDER_STATUS_AR, ORDER_STATUS_STYLE, formatDateAr } from "@/lib/orderStatus";
import { whatsappLink } from "@/lib/whatsapp";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrderRow({ order, signedScreenshot }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [saving, setSaving] = useState(false);

  async function changeStatus(newStatus) {
    setStatus(newStatus);
    setSaving(true);
    const fd = new FormData();
    fd.set("id", order.id);
    fd.set("status", newStatus);
    await updateOrderStatus(fd);
    setSaving(false);
  }

  const waMsg = `مرحبًا ${order.full_name} 🌸\nبخصوص طلبك رقم #${order.order_number} من سارة دولز.`;

  return (
    <>
      <tr className="hover:bg-cream/50">
        <td className="px-4 py-3 font-black text-warm-mocha">#{order.order_number}</td>
        <td className="px-4 py-3 font-bold text-warm-mocha">{order.full_name}</td>
        <td className="px-4 py-3 font-bold text-warm-mocha/70" dir="ltr">{order.phone_number}</td>
        <td className="px-4 py-3 font-black text-soft-rose whitespace-nowrap">{formatEGP(order.total_price)}</td>
        <td className="px-4 py-3">
          <Badge className={ORDER_STATUS_STYLE[status]}>{ORDER_STATUS_AR[status]}</Badge>
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
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-sm font-bold text-warm-mocha/75">
                <p><span className="text-warm-mocha/50">العنوان:</span> {order.governorate}، {order.city}، {order.address}</p>
                <p><span className="text-warm-mocha/50">الدفع:</span> {order.payment_method === "instapay" ? "إنستاباي" : "عند الاستلام"}</p>
                {order.discount_amount > 0 && <p><span className="text-warm-mocha/50">الخصم:</span> {formatEGP(order.discount_amount)}</p>}
                <p><span className="text-warm-mocha/50">الشحن:</span> {formatEGP(order.shipping_fee)}</p>
                {order.notes && <p><span className="text-warm-mocha/50">ملاحظات:</span> {order.notes}</p>}
                <div className="pt-2">
                  <p className="text-warm-mocha/50 mb-1">المنتجات:</p>
                  {(order.order_items || []).map((it) => (
                    <p key={it.id}>• {it.product_name_ar} × {it.quantity} = {formatEGP(it.price_at_purchase * it.quantity)}</p>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">تغيير الحالة {saving && "…"}</span>
                  <select
                    value={status}
                    onChange={(e) => changeStatus(e.target.value)}
                    className="w-full rounded-xl border border-pastel-pink/60 bg-white px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{ORDER_STATUS_AR[s]}</option>
                    ))}
                  </select>
                </label>

                <a
                  href={whatsappLink(waMsg, order.phone_number.replace(/^0/, "20"))}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-2.5 rounded-xl text-sm hover:brightness-95"
                >
                  <MessageCircle className="w-4 h-4" /> مراسلة العميلة
                </a>

                {order.payment_method === "instapay" && (
                  signedScreenshot ? (
                    <a href={signedScreenshot} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-warm-mocha text-cream font-black py-2.5 rounded-xl text-sm">
                      <ImageIcon className="w-4 h-4" /> عرض إيصال إنستاباي
                    </a>
                  ) : order.instapay_screenshot_url ? (
                    <p className="text-xs font-bold text-warm-mocha/50 text-center">إيصال إنستاباي مرفق (يُعرض عند ضبط Supabase).</p>
                  ) : null
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
