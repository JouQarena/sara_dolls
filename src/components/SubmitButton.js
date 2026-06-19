"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function SubmitButton({ children, className = "", ...props }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`relative inline-flex items-center justify-center gap-2 font-black rounded-2xl transition active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}
