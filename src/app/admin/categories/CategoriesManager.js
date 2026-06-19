"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { saveCategory, deleteCategory } from "../actions";
import { Badge } from "@/components/admin/ui";

export default function CategoriesManager({ categories }) {
  const [editing, setEditing] = useState(null);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setEditing({})} className="flex items-center gap-2 bg-soft-rose text-white font-black px-5 py-2.5 rounded-2xl hover:bg-brand-dark shadow-soft-sm">
          <Plus className="w-5 h-5" /> تصنيف جديد
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-pastel-pink/40 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-warm-mocha">{c.name_ar}</h3>
                <p className="text-xs font-bold text-warm-mocha/40 mt-0.5">/{c.slug}</p>
              </div>
              {c.is_special && <Badge className="bg-soft-rose/20 text-soft-rose">مميّز ✨</Badge>}
            </div>
            <p className="text-sm font-semibold text-warm-mocha/60 mt-2 line-clamp-2">{c.description_ar}</p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setEditing(c)} className="flex-1 flex items-center justify-center gap-1 bg-cream text-warm-mocha font-black py-2 rounded-xl text-sm hover:bg-pastel-pink/30">
                <Pencil className="w-4 h-4" /> تعديل
              </button>
              <DeleteBtn id={c.id} />
            </div>
          </div>
        ))}
      </div>

      {editing && <Modal category={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function DeleteBtn({ id }) {
  const [c, setC] = useState(false);
  async function go() { const fd = new FormData(); fd.set("id", id); await deleteCategory(fd); }
  return c ? (
    <form action={go} className="flex gap-1">
      <button className="bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-black">تأكيد</button>
      <button type="button" onClick={() => setC(false)} className="bg-cream px-3 py-2 rounded-xl text-xs font-black">×</button>
    </form>
  ) : (
    <button onClick={() => setC(true)} className="w-10 grid place-items-center rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
  );
}

function Modal({ category, onClose }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); setError("");
    const fd = new FormData(e.currentTarget);
    if (category.id) fd.set("id", category.id);
    const res = await saveCategory(fd);
    setSaving(false);
    if (res?.error) setError(res.error); else onClose();
  }
  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-warm-mocha/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-pastel-pink/30">
          <h2 className="font-black text-warm-mocha text-lg">{category.id ? "تعديل التصنيف" : "تصنيف جديد"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-pastel-pink/30"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSubmit} className="p-5 space-y-3">
          {error && <p className="text-rose-600 text-sm font-bold bg-rose-50 rounded-xl p-2.5">{error}</p>}
          <Inp label="الاسم (عربي)" name="name_ar" defaultValue={category.name_ar} required />
          <Inp label="الاسم (إنجليزي)" name="name" defaultValue={category.name} />
          <Inp label="الرابط (slug)" name="slug" defaultValue={category.slug} placeholder="dolls" />
          <label className="block">
            <span className="block text-sm font-extrabold text-warm-mocha mb-1">الوصف</span>
            <textarea name="description_ar" rows={2} defaultValue={category.description_ar} className="w-full rounded-xl border border-pastel-pink/60 bg-cream/60 px-3 py-2.5 font-bold text-warm-mocha outline-none focus:border-soft-rose resize-none" />
          </label>
          <label className="flex items-center gap-2 cursor-pointer font-bold text-warm-mocha">
            <input type="checkbox" name="is_special" defaultChecked={category.is_special} className="w-4 h-4 accent-soft-rose" /> تصنيف مميّز (طلبات خاصة)
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
