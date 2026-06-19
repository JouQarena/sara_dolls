"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFormState } from "react-dom";
import {
  Package,
  Sparkles,
  ChevronDown,
  X,
  Check,
  MessageCircle,
} from "lucide-react";
import { cancelOrder, respondToQuote } from "./actions";
import { Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";
import { formatEGP } from "@/lib/constants";
import {
  ORDER_STATUS_AR,
  ORDER_STATUS_STYLE,
  CUSTOM_STATUS_AR,
  CUSTOM_STATUS_STYLE,
  canCancelOrder,
  formatDateAr,
} from "@/lib/orderStatus";
import {
  orderTypeLabel,
  sizeLabel,
  budgetLabel,
} from "@/lib/customOrders";

export default function MyOrdersTabs({ orders, customOrders }) {
  const [tab, setTab] = useState("regular");

  return (
    <div>
      {/* tabs */}
      <div className="flex gap-2 mb-6 bg-cream p-1.5 rounded-2xl border border-pastel-pink/40 max-w-md">
        <TabButton active={tab === "regular"} onClick={() => setTab("regular")} icon={Package}>
          الطلبات العادية ({orders.length.toLocaleString("ar-EG")})
        </TabButton>
        <TabButton active={tab === "custom"} onClick={() => setTab("custom")} icon={Sparkles}>
          الطلبات الخاصة ({customOrders.length.toLocaleString("ar-EG")})
        </TabButton>
      </div>

      {tab === "regular" ? (
        <RegularOrders orders={orders} />
      ) : (
        <CustomOrders orders={customOrders} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-black text-sm transition ${
        active ? "bg-soft-rose text-white shadow-soft-sm" : "text-warm-mocha/70"
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  );
}

/* ---------------- Regular Orders ---------------- */
function RegularOrders({ orders }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="لا توجد طلبات بعد"
        text="ابدئي التسوّق من مجموعتنا المصنوعة بحب 🌸"
      />
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <RegularOrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function RegularOrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(cancelOrder, {});
  const cancellable = canCancelOrder(order) && !state?.success;

  return (
    <div className="bg-white rounded-3xl border border-pastel-pink/40 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 text-right"
      >
        <div>
          <p className="font-black text-warm-mocha">طلب #{order.order_number}</p>
          <p className="text-xs font-bold text-warm-mocha/50 mt-0.5">
            {formatDateAr(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-black text-soft-rose whitespace-nowrap">
            {formatEGP(order.total_price)}
          </span>
          <StatusBadge
            label={ORDER_STATUS_AR[order.status]}
            style={ORDER_STATUS_STYLE[order.status]}
          />
          <ChevronDown
            className={`w-5 h-5 text-warm-mocha/40 transition ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-pastel-pink/30 pt-4 animate-fade-in">
          <div className="space-y-2 mb-4">
            {(order.order_items || []).map((it) => (
              <div key={it.id} className="flex justify-between text-sm font-bold">
                <span className="text-warm-mocha">
                  {it.product_name_ar} × {it.quantity.toLocaleString("ar-EG")}
                </span>
                <span className="text-warm-mocha/70">
                  {formatEGP(it.price_at_purchase * it.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="text-sm font-bold text-warm-mocha/70 space-y-1 bg-cream rounded-2xl p-4">
            <InfoLine label="المحافظة" value={order.governorate} />
            <InfoLine label="العنوان" value={order.address} />
            <InfoLine
              label="طريقة الدفع"
              value={order.payment_method === "instapay" ? "إنستاباي" : "عند الاستلام"}
            />
            {order.discount_amount > 0 && (
              <InfoLine label="الخصم" value={`- ${formatEGP(order.discount_amount)}`} />
            )}
            <InfoLine label="الشحن" value={formatEGP(order.shipping_fee)} />
          </div>

          {state?.success && (
            <div className="mt-4">
              <Alert type="success">{state.success}</Alert>
            </div>
          )}
          {state?.error && (
            <div className="mt-4">
              <Alert type="error">{state.error}</Alert>
            </div>
          )}

          {cancellable && (
            <form action={formAction} className="mt-4 flex flex-col sm:flex-row gap-2">
              <input type="hidden" name="order_id" value={order.id} />
              <input
                name="reason"
                placeholder="سبب الإلغاء (اختياري)"
                className="flex-1 rounded-xl border border-pastel-pink/60 bg-cream px-3 py-2.5 text-sm font-bold text-warm-mocha outline-none focus:border-soft-rose"
              />
              <SubmitButton className="bg-rose-50 text-rose-600 border border-rose-200 px-5 py-2.5 text-sm hover:bg-rose-100">
                <X className="w-4 h-4" /> إلغاء الطلب
              </SubmitButton>
            </form>
          )}
          {!cancellable && order.status === "pending" && !state?.success && (
            <p className="mt-3 text-xs font-bold text-warm-mocha/40">
              ⏱️ يمكن الإلغاء خلال 24 ساعة فقط من تقديم الطلب.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Custom Orders ---------------- */
function CustomOrders({ orders }) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="لا توجد طلبات خاصة بعد"
        text="عندك فكرة في بالك؟ احكيلنا وهنصنعها مخصوص لك ✨"
        ctaHref="/طلب-خاص"
        ctaLabel="اطلبي تصميمك الخاص"
      />
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <CustomOrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}

function CustomOrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useFormState(respondToQuote, {});
  const isQuoted = order.status === "quoted" && !state?.success;

  return (
    <div className="bg-white rounded-3xl border border-pastel-pink/40 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 p-5 text-right"
      >
        <div>
          <p className="font-black text-warm-mocha">
            طلب خاص #{order.order_number}
          </p>
          <p className="text-xs font-bold text-warm-mocha/50 mt-0.5">
            {orderTypeLabel(order.order_type)} · {formatDateAr(order.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {order.admin_quote_price != null && (
            <span className="font-black text-soft-rose whitespace-nowrap">
              {formatEGP(order.admin_quote_price)}
            </span>
          )}
          <StatusBadge
            label={CUSTOM_STATUS_AR[order.status]}
            style={CUSTOM_STATUS_STYLE[order.status]}
          />
          <ChevronDown
            className={`w-5 h-5 text-warm-mocha/40 transition ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-pastel-pink/30 pt-4 animate-fade-in space-y-3">
          <div className="text-sm font-bold text-warm-mocha/75 bg-cream rounded-2xl p-4 space-y-1.5">
            <InfoLine label="الوصف" value={order.description} />
            <InfoLine label="الألوان" value={order.preferred_colors} />
            <InfoLine label="المقاس" value={sizeLabel(order.size)} />
            <InfoLine label="الميزانية" value={budgetLabel(order.budget_range)} />
            <InfoLine label="الموعد" value={order.deadline ? formatDateAr(order.deadline) : "—"} />
          </div>

          {order.reference_images?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {order.reference_images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="relative w-16 h-16 rounded-xl overflow-hidden border border-pastel-pink/50"
                >
                  <Image src={url} alt={`مرجع ${i + 1}`} fill className="object-cover" />
                </a>
              ))}
            </div>
          )}

          {/* quote box */}
          {order.admin_quote_price != null && (
            <div className="rounded-2xl bg-pastel-pink/20 border border-soft-rose/40 p-4">
              <p className="font-black text-warm-mocha mb-1">
                💰 عرض السعر: {formatEGP(order.admin_quote_price)}
              </p>
              {order.admin_notes && (
                <p className="text-sm font-semibold text-warm-mocha/75 leading-relaxed">
                  {order.admin_notes}
                </p>
              )}
            </div>
          )}

          {state?.success && <Alert type="success">{state.success}</Alert>}
          {state?.error && <Alert type="error">{state.error}</Alert>}

          {isQuoted && (
            <div className="flex gap-2">
              <form action={formAction} className="flex-1">
                <input type="hidden" name="custom_order_id" value={order.id} />
                <input type="hidden" name="decision" value="approved" />
                <SubmitButton className="w-full bg-soft-rose text-white py-3 text-sm hover:bg-brand-dark">
                  <Check className="w-4 h-4" /> أوافق على العرض
                </SubmitButton>
              </form>
              <form action={formAction} className="flex-1">
                <input type="hidden" name="custom_order_id" value={order.id} />
                <input type="hidden" name="decision" value="cancelled" />
                <SubmitButton className="w-full bg-white text-rose-600 border border-rose-200 py-3 text-sm hover:bg-rose-50">
                  <X className="w-4 h-4" /> أرفض
                </SubmitButton>
              </form>
            </div>
          )}

          {order.status === "pending_review" && (
            <p className="text-xs font-bold text-warm-mocha/50 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              فريقنا يراجع طلبك وسيتواصل معك قريبًا بعرض السعر.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- shared ---------------- */
function StatusBadge({ label, style }) {
  return (
    <span className={`text-xs font-black px-3 py-1 rounded-full whitespace-nowrap ${style}`}>
      {label}
    </span>
  );
}

function InfoLine({ label, value }) {
  return (
    <p>
      <span className="text-warm-mocha/50">{label}:</span>{" "}
      <span className="text-warm-mocha">{value || "—"}</span>
    </p>
  );
}

function EmptyState({ icon: Icon, title, text, ctaHref = "/shop", ctaLabel = "ابدئي التسوّق" }) {
  return (
    <div className="text-center py-16 bg-white rounded-3xl border border-pastel-pink/40">
      <Icon className="w-14 h-14 mx-auto text-pastel-pink mb-3" />
      <p className="text-xl font-black text-warm-mocha mb-1">{title}</p>
      <p className="text-warm-mocha/60 font-bold mb-5">{text}</p>
      <Link
        href={ctaHref}
        className="inline-block bg-soft-rose text-white font-black px-6 py-3 rounded-2xl hover:bg-brand-dark transition"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
