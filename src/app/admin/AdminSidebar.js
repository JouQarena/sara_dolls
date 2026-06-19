"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Package,
  FolderTree,
  Ticket,
  Star,
  MessageSquare,
  Mail,
  Settings,
  Menu,
  X,
  Home,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

const LINKS = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/custom-orders", label: "الطلبات الخاصة", icon: Sparkles, star: true },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: FolderTree },
  { href: "/admin/discount-codes", label: "أكواد الخصم", icon: Ticket },
  { href: "/admin/reviews", label: "التقييمات", icon: Star },
  { href: "/admin/messages", label: "الرسائل", icon: MessageSquare },
  { href: "/admin/subscribers", label: "المشتركون", icon: Mail },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (link) =>
    link.exact ? pathname === link.href : pathname.startsWith(link.href);

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition ${
            isActive(l)
              ? "bg-soft-rose text-white shadow-soft-sm"
              : "text-warm-mocha/80 hover:bg-pastel-pink/30"
          }`}
        >
          <l.icon className="w-4.5 h-4.5 w-5 h-5 shrink-0" />
          <span className="flex-1">{l.label}</span>
          {l.star && <span className="text-xs">✨</span>}
        </Link>
      ))}
    </nav>
  );

  return (
    <>
      {/* mobile topbar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-pastel-pink/40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/sara-avatar.jpg" alt="" width={32} height={32} className="rounded-full" />
          <span className="font-black text-warm-mocha">لوحة الإدارة</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="القائمة" className="p-2">
          <Menu className="w-6 h-6 text-warm-mocha" />
        </button>
      </div>

      {/* desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-l border-pastel-pink/40 p-4 sticky top-0 h-screen">
        <Link href="/admin" className="flex items-center gap-2.5 mb-6 px-2">
          <Image src="/sara-avatar.jpg" alt="" width={40} height={40} className="rounded-full border-2 border-soft-rose" />
          <div>
            <p className="font-black text-warm-mocha leading-tight">سارة دولز</p>
            <p className="text-[0.65rem] font-bold text-warm-mocha/50">لوحة الإدارة</p>
          </div>
        </Link>
        {nav}
        <div className="mt-auto pt-4 border-t border-pastel-pink/30 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-warm-mocha/80 hover:bg-pastel-pink/30">
            <Home className="w-5 h-5" /> عرض المتجر
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50">
              <LogOut className="w-5 h-5" /> خروج
            </button>
          </form>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-warm-mocha/40" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85%] bg-white p-4 flex flex-col overflow-auto">
            <div className="flex items-center justify-between mb-5">
              <span className="font-black text-warm-mocha">لوحة الإدارة</span>
              <button onClick={() => setOpen(false)} aria-label="إغلاق" className="p-2">
                <X className="w-5 h-5 text-warm-mocha" />
              </button>
            </div>
            {nav}
            <div className="mt-auto pt-4 border-t border-pastel-pink/30 space-y-1">
              <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-warm-mocha/80 hover:bg-pastel-pink/30">
                <Home className="w-5 h-5" /> عرض المتجر
              </Link>
              <form action={logoutAction}>
                <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50">
                  <LogOut className="w-5 h-5" /> خروج
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
