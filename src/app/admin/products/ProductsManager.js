"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, FileText } from "lucide-react";
import { saveProduct, deleteProduct } from "../actions";
import ImageUploader from "@/components/admin/ImageUploader";
import { Badge } from "@/components/admin/ui";
import { formatEGP } from "@/lib/constants";

export default function ProductsManager({ products, categories }) {
  const [editing, setEditing] = useState(null); // product | {} for new | null

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-soft-rose text-white font-black px-5 py-2.5 rounded-2xl hover:bg-brand-dark shadow-soft-sm"
        >
          <Plus className="w-5 h-5" /> منتج جديد
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-3xl border border-pastel-pink/40 overflow-hidden">
            <div className="relative aspect-square bg-cream">
              <Image src={p.image_url || "/sara-avatar.jpg"} alt={p.name_ar} fill className="object-cover" />
              {p.product_type === "pattern_pdf" && (
                <span className="absolute top-2 left-2"><Badge className="bg-warm-mocha text-cream"><FileText className="w-3 h-3 inline" /> باترون</Badge></span>
              )}
              {!p.is_available && (
                <span className="absolute top-2 right-2"><Badge className="bg-rose-100 text-rose-600">غير متاح</Badge></span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-black text-warm-mocha line-clamp-1">{p.name_ar}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="font-black text-soft-rose">{formatEGP(p.price)}</span>
                <span className="text-xs font-bold text-warm-mocha/50">مخزون: {(p.stock ?? 0).toLocaleString("ar-EG")}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setEditing(p)} className="flex-1 flex items-center justify-center gap-1 bg-cream text-warm-mocha font-black py-2 rounded-xl text-sm hover:bg-pastel-pink/30">
                  <Pencil className="w-4 h-4" /> تعديل
                </button>
                <DeleteButton id={p.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ProductModal product={editing} categories={categories} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function DeleteButton({ id }) {
  const [confirming, setConfirming] = useState(false);
  async function onDelete() {
    const fd = new FormData();
    fd.set("id", id);
    await deleteProduct(fd);
  }
  return confirming ? (
    <form action={onDelete} className="flex gap-1">
      <button className="bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-black">تأكيد</button>
      <button type="button" onClick={() => setConfirming(false)} className="bg-cream px-3 py-2 rounded-xl text-xs font-black">إلغاء</button>
    </form>
  ) : (
    <button onClick={() => setConfirming(true)} className="w-10 grid place-items-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50">
      <Trash2 className="w-4 h-4" />
    </button>
  );
}

function buildInitialImages(product) {
  const list = [];
  if (product.image_url) list.push({ url: product.image_url, isMain: true });
  (product.images_gallery || []).forEach((url) => {
    if (url && url !== product.image_url) list.push({ url, isMain: false });
  });
  return list;
}

function ProductModal({ product, categories, onClose }) {
  const isNew = !product.id;
  const [type, setType] = useState(product.product_type || "physical");
  const [images, setImages] = useState(() => buildInitialImages(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // Validate images.
    if (images.length === 0) {
      setError("من فضلك أضيفي صورة رئيسية للمنتج على الأقل.");
      return;
    }

    setSaving(true);
    const fd = new FormData(e.currentTarget);
    if (product.id) fd.set("id", product.id);

    // Main = the flagged one (or first); rest = gallery.
    const main = images.find((x) => x.isMain) || images[0];
    const gallery = images.filter((x) => x.url !== main.url).map((x) => x.url);
    fd.set("image_url", main.url);
    fd.set("images_gallery_json", JSON.stringify(gallery));

    if (product.pdf_url) fd.set("existing_pdf_url", product.pdf_url);
    const res = await saveProduct(fd);
    setSaving(false);
    if (res?.error) setError(res.error);
    else onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-warm-mocha/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[92vh] overflow-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-pastel-pink/30">
          <h2 className="font-black text-warm-mocha text-lg">{isNew ? "منتج جديد" : "تعديل المنتج"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-pastel-pink/30"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-3">
          {error && <p className="text-rose-600 text-sm font-bold bg-rose-50 rounded-xl p-2.5">{error}</p>}

          <Inp label="اسم المنتج (عربي)" name="name_ar" defaultValue={product.name_ar} required />
          <Inp label="الاسم (إنجليزي - اختياري)" name="name" defaultValue={product.name} />
          <Txt label="الوصف (عربي)" name="description_ar" defaultValue={product.description_ar} />

          <div className="grid grid-cols-2 gap-3">
            <Inp label="السعر (ج.م)" name="price" type="number" step="0.01" defaultValue={product.price} required />
            <Inp label="السعر قبل الخصم" name="original_price" type="number" step="0.01" defaultValue={product.original_price} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Inp label="المخزون" name="stock" type="number" defaultValue={product.stock ?? 0} />
            <Sel label="التصنيف" name="category_id" defaultValue={product.category_id}>
              <option value="">— اختاري —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name_ar}</option>)}
            </Sel>
          </div>

          <Sel label="نوع المنتج" name="product_type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="physical">منتج فعلي</option>
            <option value="pattern_pdf">باترون رقمي (PDF)</option>
          </Sel>

          <div>
            <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
              صور المنتج (1 رئيسية + حتى 5 إضافية)
            </span>
            <ImageUploader
              value={images}
              onChange={setImages}
              productId={product.id || "new"}
            />
          </div>

          {type === "pattern_pdf" && (
            <FileInp label="ملف الباترون (PDF)" name="pdf" accept="application/pdf" current={product.pdf_url} pdf />
          )}

          <div className="flex gap-4 pt-1">
            <Chk label="مميّز" name="is_featured" defaultChecked={product.is_featured} />
            <Chk label="متاح" name="is_available" defaultChecked={product.is_available ?? true} />
          </div>

          <button type="submit" disabled={saving} className="w-full bg-soft-rose text-white font-black py-3.5 rounded-2xl hover:bg-brand-dark disabled:opacity-60 mt-2">
            {saving ? "جارٍ الحفظ…" : "حفظ المنتج"}
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
function Txt({ label, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1">{label}</span>
      <textarea rows={3} {...props} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose resize-none" />
    </label>
  );
}
function Sel({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1">{label}</span>
      <select {...props} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose">{children}</select>
    </label>
  );
}
function Chk({ label, ...props }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer font-bold text-warm-mocha">
      <input type="checkbox" {...props} className="w-4 h-4 accent-soft-rose" /> {label}
    </label>
  );
}
function FileInp({ label, current, pdf, ...props }) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1">{label}</span>
      <input type="file" {...props} className="w-full text-sm font-bold text-warm-mocha file:ml-3 file:rounded-xl file:border-0 file:bg-soft-rose file:text-white file:px-4 file:py-2 file:font-black" />
      {current && <span className="text-xs font-bold text-warm-mocha/50 mt-1 block">{pdf ? "📄 ملف مرفوع حاليًا" : "صورة مرفوعة حاليًا"}</span>}
    </label>
  );
}
