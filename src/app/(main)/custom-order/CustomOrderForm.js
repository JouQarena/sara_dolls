"use client";

import { useState, useRef } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Upload, X, ImagePlus } from "lucide-react";
import { submitCustomOrder } from "./actions";
import { Field, Alert } from "@/components/forms";
import SubmitButton from "@/components/SubmitButton";
import { ORDER_TYPES, SIZES, BUDGET_RANGES } from "@/lib/customOrders";
import { EGYPT_GOVERNORATES } from "@/lib/constants";
import { compressImageFile } from "@/lib/compressImage";
import { useGender } from "@/components/GenderProvider";
import {
  customOrderWhatsappMessage,
  whatsappLink,
} from "@/lib/whatsapp";
import { orderTypeLabel, sizeLabelFor, budgetLabel } from "@/lib/customOrders";

const MAX_IMAGES = 5;

export default function CustomOrderForm() {
  const router = useRouter();
  const { t, gender } = useGender();
  const [state, formAction] = useFormState(handleSubmit, {});
  const [previews, setPreviews] = useState([]); // {url, name}
  const fileInputRef = useRef(null);
  const [fileList, setFileList] = useState([]); // actual File objects
  const [compressing, setCompressing] = useState(false);
  const [imgError, setImgError] = useState("");

  // Wrap the server action so we can redirect on success.
  // try/catch here prevents crashes to the generic error page —
  // network-level failures show a friendly inline message instead.
  async function handleSubmit(prev, formData) {
    if (compressing) {
      return { error: t("جارٍ تجهيز الصور… انتظري لحظة ثم اضغطي إرسال مرة أخرى.", "جارٍ تجهيز الصور… انتظر لحظة ثم اضغط إرسال مرة أخرى.") };
    }
    try {
      // Client-side guard: keep total upload under the server-action body limit.
      const totalBytes = formData
        .getAll("reference_images")
        .filter((f) => f && typeof f === "object" && f.size > 0)
        .reduce((s, f) => s + (f.size || 0), 0);
      if (totalBytes > 7 * 1024 * 1024) {
        return {
          error:
            t("حجم الصور كبير جدًا، احذفي بعض الصور أو اختاري صورًا أصغر ثم أعيدي المحاولة.", "حجم الصور كبير جدًا، احذف بعض الصور أو اختار صورًا أصغر ثم أعد المحاولة."),
        };
      }

      const res = await submitCustomOrder(prev, formData);
      if (res?.success) {
      // Build WhatsApp message and stash for the confirmation page.
      const msg = customOrderWhatsappMessage({
        orderNumber: res.orderNumber,
        fullName: formData.get("full_name"),
        phone: formData.get("phone_number"),
        orderType: orderTypeLabel(formData.get("order_type")),
        description: formData.get("description"),
        colors: formData.get("preferred_colors"),
        size: sizeLabelFor(gender, formData.get("size")),
        budget: budgetLabel(formData.get("budget_range")),
        deadline: formData.get("deadline"),
        notes: formData.get("additional_notes"),
        imagesCount: res.imagesCount || 0,
      });
      try {
        sessionStorage.setItem(
          "sara_custom_confirmation",
          JSON.stringify({
            orderNumber: res.orderNumber,
            whatsapp: whatsappLink(msg),
            demo: res.demo || false,
          })
        );
      } catch {}
      router.push(`/custom-order-confirmation/${res.id}`);
      return prev;
      }
      return res;
    } catch {
      return {
        error: t("تعذّر إرسال الطلب، تحققي من اتصال الإنترنت وحاولي مرة أخرى.", "تعذّر إرسال الطلب، تحقق من اتصال الإنترنت وحاول مرة أخرى."),
      };
    }
  }

  // Compress images in the browser (~1MB each) so phone photos don't exceed
  // the server-action body limit and uploads stay fast for guests too.
  async function onFilesSelected(e) {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;
    setImgError("");

    const room = MAX_IMAGES - fileList.length;
    if (room <= 0) return;
    const picked = incoming.slice(0, room);

    const bad = picked.find((f) => !String(f.type || "").startsWith("image/"));
    if (bad) {
      setImgError("يُسمح برفع الصور فقط (JPG، PNG، WEBP).");
      return;
    }

    setCompressing(true);
    try {
      const compressed = [];
      for (const f of picked) {
        compressed.push(await compressImageFile(f));
      }
      const combined = [...fileList, ...compressed].slice(0, MAX_IMAGES);
      setFileList(combined);
      setPreviews(
        combined.map((f) => ({ url: URL.createObjectURL(f), name: f.name }))
      );
      syncInput(combined);
    } finally {
      setCompressing(false);
    }
  }

  function removeImage(i) {
    const next = fileList.filter((_, idx) => idx !== i);
    setFileList(next);
    setPreviews(next.map((f) => ({ url: URL.createObjectURL(f), name: f.name })));
    syncInput(next);
  }

  // Keep the real <input type=file> in sync (so it submits with the form).
  function syncInput(files) {
    if (!fileInputRef.current) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileInputRef.current.files = dt.files;
  }

  return (
    <form action={formAction} className="space-y-7">
      {state?.error && <Alert type="error">{state.error}</Alert>}

      <div className="bg-pastel-pink/20 border border-pastel-pink/60 rounded-2xl px-4 py-3 text-sm font-bold text-warm-mocha">
        🌸 يمكنك إرسال طلبك الخاص <span className="font-black">بدون إنشاء حساب</span> —
        {t("فقط املئي البيانات وسيتواصل معك فريقنا عبر واتساب.", "فقط املأ البيانات وسيتواصل معك فريقنا عبر واتساب.")}
      </div>

      {/* Personal info */}
      <fieldset className="space-y-4">
        <legend className="font-black text-warm-mocha text-lg mb-2">
          بياناتك 👤
        </legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="الاسم بالكامل" name="full_name" placeholder="اسمك" required />
          <Field
            label="رقم الهاتف"
            name="phone_number"
            type="tel"
            placeholder="01012345678"
            dir="ltr"
            required
          />
        </div>
        <Field
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="example@email.com"
          dir="ltr"
          hint="اختياري"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              المحافظة
            </span>
            <select
              name="governorate"
              className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
            >
              <option value="">{t("اختاري المحافظة (اختياري)", "اختار المحافظة (اختياري)")}</option>
              {EGYPT_GOVERNORATES.map((g) => (
                <option key={g.slug} value={g.ar}>
                  {g.ar}
                </option>
              ))}
            </select>
          </label>
          <Field label="المدينة / المنطقة" name="city" placeholder="اختياري" />
        </div>
        <Field label="العنوان" name="address" placeholder="اختياري" />
      </fieldset>

      <div className="h-px bg-pastel-pink/40" />

      {/* Order details */}
      <fieldset className="space-y-4">
        <legend className="font-black text-warm-mocha text-lg mb-2">
          تفاصيل الطلب ✨
        </legend>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              نوع الطلب <span className="text-soft-rose">*</span>
            </span>
            <select
              name="order_type"
              required
              defaultValue=""
              className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
            >
              <option value="" disabled>
                {t("اختاري نوع الطلب", "اختار نوع الطلب")}
              </option>
              {ORDER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              المقاس
            </span>
            <select
              name="size"
              defaultValue=""
              className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
            >
              <option value="">{t("اختاري المقاس (اختياري)", "اختار المقاس (اختياري)")}</option>
              {SIZES.map((s) => (
                <option key={s.value} value={s.value}>
                  {sizeLabelFor(gender, s.value)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
            اوصفي لنا فكرتك <span className="text-soft-rose">*</span>
          </span>
          <textarea
            name="description"
            required
            rows={5}
            placeholder={t("مثال: عايزة دمية تشبه بنتي، شعرها بني وعيونها عسلية، لابسة فستان وردي مكتوب عليه اسمها...", "مثال: عايز دمية شعرها بني وعيونها عسلية، لابسة فستان وردي مكتوب عليه اسمها...")}
            className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow resize-none"
          />
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field
            label="الألوان المفضّلة"
            name="preferred_colors"
            placeholder="مثال: وردي، بيج، بني"
            hint="اختياري"
          />
          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              الميزانية التقريبية
            </span>
            <select
              name="budget_range"
              defaultValue=""
              className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
            >
              <option value="">{t("اختاري الميزانية (اختياري)", "اختار الميزانية (اختياري)")}</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              الموعد المطلوب
            </span>
            <input
              type="date"
              name="deadline"
              className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow"
            />
            <span className="block text-xs text-warm-mocha/50 mt-1">
              {t("اختياري — امتى محتاجة الطلب؟", "اختياري — امتى محتاج الطلب؟")}
            </span>
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
            ملاحظات إضافية
          </span>
          <textarea
            name="additional_notes"
            rows={3}
            placeholder="أي تفاصيل تحبي تضيفيها..."
            className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow resize-none"
          />
        </label>
      </fieldset>

      <div className="h-px bg-pastel-pink/40" />

      {/* Reference images */}
      <fieldset>
        <legend className="font-black text-warm-mocha text-lg mb-2">
          صور مرجعية 🖼️
        </legend>
        <p className="text-sm text-warm-mocha/60 font-bold mb-3">
          ارفعي صورًا توضّح فكرتك (اختياري — حتى {MAX_IMAGES} صور).
        </p>
        {compressing && (
          <p className="text-sm font-black text-soft-rose mb-3 animate-pulse">
            ⏳ جارٍ تجهيز الصور وضغطها…
          </p>
        )}
        {imgError && (
          <div className="mb-3">
            <Alert type="error">{imgError}</Alert>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          name="reference_images"
          accept="image/*"
          multiple
          onChange={onFilesSelected}
          className="hidden"
          id="ref-images"
        />

        <div className="flex flex-wrap gap-3">
          {previews.map((p, i) => (
            <div
              key={i}
              className="relative w-24 h-24 rounded-2xl overflow-hidden border border-pastel-pink/60"
            >
              <Image src={p.url} alt={p.name} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 left-1 w-6 h-6 grid place-items-center rounded-full bg-warm-mocha/70 text-white hover:bg-rose-600"
                aria-label="حذف"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {previews.length < MAX_IMAGES && (
            <label
              htmlFor="ref-images"
              className="w-24 h-24 rounded-2xl border-2 border-dashed border-pastel-pink/70 grid place-items-center cursor-pointer text-soft-rose hover:bg-pastel-pink/15 transition"
            >
              <div className="text-center">
                <ImagePlus className="w-6 h-6 mx-auto" />
                <span className="text-[0.65rem] font-black block mt-1">{t("أضيفي صورة", "أضف صورة")}</span>
              </div>
            </label>
          )}
        </div>
      </fieldset>

      <div className="h-px bg-pastel-pink/40" />

      {/* Terms */}
      <label className="flex items-start gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          name="agreed_to_terms"
          className="mt-1 w-4 h-4 accent-soft-rose shrink-0"
        />
        <span className="text-sm font-bold text-warm-mocha/80 leading-relaxed">
          أوافق على{" "}
          <Link
            href="/سياسة-الطلبات-الخاصة"
            target="_blank"
            className="text-soft-rose underline underline-offset-2"
          >
            سياسة الطلبات الخاصة
          </Link>{" "}
          (عرض السعر، العربون، مدة التنفيذ، وعدم الاسترجاع للقطع المخصّصة).
        </span>
      </label>

      <SubmitButton className="w-full bg-soft-rose text-white py-4 text-lg hover:bg-brand-dark shadow-soft flex items-center justify-center gap-2">
        <Upload className="w-5 h-5" /> إرسال الطلب الخاص
      </SubmitButton>
    </form>
  );
}
