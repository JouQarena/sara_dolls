import { adminGetMessages } from "@/lib/adminData";
import { AdminHeader, Card, Badge } from "@/components/admin/ui";
import { formatDateAr } from "@/lib/orderStatus";
import { toggleMessageRead, deleteMessage } from "../actions";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await adminGetMessages();
  const unread = messages.filter((m) => !m.is_read).length;

  async function toggle(formData) { "use server"; await toggleMessageRead(formData); }
  async function remove(formData) { "use server"; await deleteMessage(formData); }

  return (
    <div>
      <AdminHeader title="الرسائل" subtitle={`${messages.length.toLocaleString("ar-EG")} رسالة · ${unread.toLocaleString("ar-EG")} غير مقروءة`} />
      <div className="space-y-3">
        {messages.length === 0 ? (
          <Card className="p-12 text-center text-warm-mocha/50 font-bold">لا توجد رسائل.</Card>
        ) : messages.map((m) => (
          <Card key={m.id} className={`p-5 ${!m.is_read ? "ring-2 ring-soft-rose/30" : ""}`}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-warm-mocha">{m.name}</span>
                  {!m.is_read && <Badge className="bg-soft-rose text-white">جديدة</Badge>}
                </div>
                <p className="text-sm font-bold text-warm-mocha/60" dir="ltr">{m.email || ""} {m.phone ? `· ${m.phone}` : ""}</p>
                <p className="text-warm-mocha/80 font-semibold mt-2 leading-relaxed">{m.message}</p>
                <p className="text-xs font-bold text-warm-mocha/40 mt-2">{formatDateAr(m.created_at)}</p>
              </div>
              <div className="flex gap-2">
                {m.phone && (
                  <a href={whatsappLink(`مرحبًا ${m.name} 🌸`, m.phone.replace(/^0/, "20"))} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-[#25D366] text-white text-xs font-black px-3">واتساب</a>
                )}
                <form action={toggle}>
                  <input type="hidden" name="id" value={m.id} />
                  <input type="hidden" name="is_read" value={String(m.is_read)} />
                  <button className="p-2 rounded-lg bg-cream text-warm-mocha hover:bg-pastel-pink/30" title={m.is_read ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}>
                    {m.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                  </button>
                </form>
                <form action={remove}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="p-2 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></button>
                </form>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
