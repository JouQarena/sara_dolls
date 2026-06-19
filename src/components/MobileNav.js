"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, User, Package, Heart, Shield, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

export default function MobileNav({ links, isLoggedIn, isAdmin }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-full hover:bg-pastel-pink/30 text-warm-mocha"
        aria-label="القائمة"
      >
        <Menu className="w-6 h-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-warm-mocha/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 max-w-[85%] bg-cream shadow-2xl p-5 flex flex-col animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <span className="font-black text-lg text-warm-mocha">القائمة</span>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full hover:bg-pastel-pink/30 text-warm-mocha"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-3 rounded-2xl font-black text-warm-mocha hover:bg-pastel-pink/30 transition"
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="h-px bg-pastel-pink/40 my-4" />

            {isLoggedIn ? (
              <div className="flex flex-col gap-1">
                <MobileLink href="/profile" icon={User} onClick={() => setOpen(false)}>
                  حسابي
                </MobileLink>
                <MobileLink href="/my-orders" icon={Package} onClick={() => setOpen(false)}>
                  طلباتي
                </MobileLink>
                <MobileLink href="/wishlist" icon={Heart} onClick={() => setOpen(false)}>
                  المفضلة
                </MobileLink>
                {isAdmin && (
                  <MobileLink href="/admin" icon={Shield} onClick={() => setOpen(false)}>
                    لوحة الإدارة
                  </MobileLink>
                )}
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2.5 px-3 py-3 rounded-2xl font-bold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    تسجيل الخروج
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="bg-soft-rose text-white font-black text-center px-4 py-3 rounded-2xl hover:bg-brand-dark transition"
              >
                تسجيل الدخول / إنشاء حساب
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MobileLink({ href, icon: Icon, children, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-3 rounded-2xl font-bold text-warm-mocha hover:bg-pastel-pink/30 transition"
    >
      <Icon className="w-5 h-5 text-soft-rose" />
      {children}
    </Link>
  );
}
