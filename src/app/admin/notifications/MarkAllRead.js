"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";

export default function MarkAllRead() {
  const router = useRouter();
  const [done, setDone] = useState(false);

  async function onClick() {
    try {
      await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setDone(true);
      router.refresh();
    } catch {}
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-cream text-warm-mocha font-black px-4 py-2.5 rounded-2xl text-sm hover:bg-pastel-pink/30 transition"
    >
      <CheckCheck className="w-4 h-4" />
      {done ? "تم ✓" : "تحديد الكل كمقروء"}
    </button>
  );
}
