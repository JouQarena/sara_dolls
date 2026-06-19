"use client";

import { Download } from "lucide-react";
import { TableWrap, EmptyRow } from "@/components/admin/ui";
import { formatDateAr } from "@/lib/orderStatus";

export default function SubscribersList({ subscribers }) {
  function exportCSV() {
    const rows = [["email", "subscribed_at"]];
    subscribers.forEach((s) => rows.push([s.email, s.created_at]));
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sara-dolls-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={exportCSV}
          disabled={subscribers.length === 0}
          className="flex items-center gap-2 bg-warm-mocha text-cream font-black px-5 py-2.5 rounded-2xl hover:opacity-90 disabled:opacity-50"
        >
          <Download className="w-5 h-5" /> تصدير CSV
        </button>
      </div>
      <TableWrap head={["البريد الإلكتروني", "تاريخ الاشتراك"]}>
        {subscribers.length === 0 ? (
          <EmptyRow>لا يوجد مشتركون بعد.</EmptyRow>
        ) : (
          subscribers.map((s) => (
            <tr key={s.id} className="hover:bg-cream/50">
              <td className="px-4 py-3 font-bold text-warm-mocha" dir="ltr">{s.email}</td>
              <td className="px-4 py-3 font-bold text-warm-mocha/60">{formatDateAr(s.created_at)}</td>
            </tr>
          ))
        )}
      </TableWrap>
    </div>
  );
}
