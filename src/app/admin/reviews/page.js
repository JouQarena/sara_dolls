import { adminGetReviews } from "@/lib/adminData";
import { AdminHeader, TableWrap, EmptyRow } from "@/components/admin/ui";
import { formatDateAr } from "@/lib/orderStatus";
import { deleteReview } from "../actions";
import { Trash2, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await adminGetReviews();

  async function remove(formData) {
    "use server";
    await deleteReview(formData);
  }

  return (
    <div>
      <AdminHeader title="التقييمات" subtitle={`${reviews.length.toLocaleString("ar-EG")} تقييم`} />
      <TableWrap head={["المنتج", "التقييم", "التعليق", "التاريخ", ""]}>
        {reviews.length === 0 ? <EmptyRow>لا توجد تقييمات.</EmptyRow> : reviews.map((r) => (
          <tr key={r.id} className="hover:bg-cream/50">
            <td className="px-4 py-3 font-bold text-warm-mocha">{r.products?.name_ar || "—"}</td>
            <td className="px-4 py-3">
              <span className="flex items-center gap-0.5 text-amber-400" dir="ltr">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </span>
            </td>
            <td className="px-4 py-3 font-semibold text-warm-mocha/70 max-w-xs">{r.comment || "—"}</td>
            <td className="px-4 py-3 font-bold text-warm-mocha/60 whitespace-nowrap">{formatDateAr(r.created_at)}</td>
            <td className="px-4 py-3">
              <form action={remove}>
                <input type="hidden" name="id" value={r.id} />
                <button className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
              </form>
            </td>
          </tr>
        ))}
      </TableWrap>
    </div>
  );
}
