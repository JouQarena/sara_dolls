"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
  autoComplete,
  dir,
  hint,
}) {
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
        {label} {required && <span className="text-soft-rose">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        dir={dir}
        className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow transition"
      />
      {hint && <span className="block text-xs text-warm-mocha/50 mt-1">{hint}</span>}
    </label>
  );
}

export function PasswordField({
  label,
  name,
  placeholder,
  required,
  autoComplete,
  hint,
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block">
      <span className="block text-sm font-extrabold text-warm-mocha mb-1.5">
        {label} {required && <span className="text-soft-rose">*</span>}
      </span>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          dir="ltr"
          className="w-full rounded-2xl border border-pastel-pink/60 bg-cream/60 px-4 py-3 ltr:pr-11 rtl:pl-11 text-warm-mocha font-semibold placeholder:text-warm-mocha/40 outline-none focus:border-soft-rose focus:ring-2 focus:ring-rose-glow transition text-left"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute inset-y-0 ltr:right-3 rtl:left-3 flex items-center text-warm-mocha/50 hover:text-soft-rose"
          tabIndex={-1}
          aria-label={show ? "إخفاء" : "إظهار"}
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {hint && <span className="block text-xs text-warm-mocha/50 mt-1">{hint}</span>}
    </label>
  );
}

export function Alert({ type = "error", children }) {
  if (!children) return null;
  const isError = type === "error";
  return (
    <div
      className={`flex items-start gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
        isError
          ? "bg-rose-50 text-rose-700 border border-rose-200"
          : "bg-green-50 text-green-700 border border-green-200"
      }`}
    >
      {isError ? (
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </div>
  );
}
