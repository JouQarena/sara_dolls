"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, User, Package, Heart, Shield, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/actions";

export default function MobileNav({ links, isLoggedIn, isAdmin }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
      }}
    >
      {/* backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(92,58,33,0.45)",
        }}
      />

      {/* drawer panel */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          height: "100vh",
          width: "18rem",
          maxWidth: "85%",
          backgroundColor: "#FFF8F5",
          boxShadow: "-8px 0 30px rgba(92,58,33,0.25)",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-black text-lg text-warm-mocha">القائمة ✦</span>
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

        <div
          style={{
            height: 1,
            backgroundColor: "rgba(244,194,194,0.5)",
            margin: "1rem 0",
          }}
        />

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
            style={{ backgroundColor: "#E88A9A", color: "#fff" }}
            className="font-black text-center px-4 py-3 rounded-2xl transition"
          >
            تسجيل الدخول / إنشاء حساب
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 rounded-full hover:bg-pastel-pink/30 text-warm-mocha"
        aria-label="القائمة"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Render the drawer into <body> via a portal so it escapes the
          header's positioning/stacking context and covers the full screen. */}
      {open && mounted && createPortal(drawer, document.body)}
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
