import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { getUserGender } from "@/lib/auth";
import { gx } from "@/lib/genderedText";

// Policy links are fully built in Phase 3; links are in place now.
const SHOP_LINKS = [
  { href: "/shop", label: "كل المنتجات" },
  { href: "/category/dolls", label: "الدمى" },
  { href: "/category/patterns", label: "الباترونات" },
  { href: "/category/adult-gifts", label: "هدايا للكبار" },
  { href: "/category/kids-gifts", label: "هدايا للأطفال" },
  { href: "/طلب-خاص", label: "طلبات خاصة ✨" },
];

const INFO_LINKS = [
  { href: "/من-نحن", label: "من نحن" },
  { href: "/تواصل-معنا", label: "تواصل معنا" },
  { href: "/الاسئلة-الشائعة", label: "الأسئلة الشائعة" },
];

const POLICY_LINKS = [
  { href: "/اتفاقية-المستخدم", label: "اتفاقية المستخدم" },
  { href: "/سياسة-الخصوصية", label: "سياسة الخصوصية" },
  { href: "/سياسة-الاسترجاع", label: "سياسة الاسترجاع" },
  { href: "/سياسة-الطلبات-الخاصة", label: "سياسة الطلبات الخاصة" },
];

export default async function Footer() {
  const gender = await getUserGender();
  return (
    <footer className="bg-warm-mocha text-cream mt-16">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/sara-avatar.jpg"
                alt="Sara Dolls"
                width={44}
                height={44}
                className="rounded-full border-2 border-pastel-pink"
              />
              <span className="font-black text-lg">سارة دولز</span>
            </div>
            <p className="text-cream/70 text-sm font-semibold leading-relaxed">
              كل دمية حكاية مصنوعة بحب. كروشيه يدوي 100% من قلب مصر.
            </p>
            {/* Sara's store contact (NOT the developer number below) */}
            <a
              href="https://wa.me/201109624671"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm font-black text-pastel-pink hover:text-white transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span dir="ltr">01109624671</span>
            </a>
            <div className="flex gap-2 mt-3">
              <SocialIcon href="https://instagram.com" icon={Instagram} label="إنستجرام" />
              <SocialIcon href="https://facebook.com" icon={Facebook} label="فيسبوك" />
              <SocialIcon href="https://wa.me/201109624671" icon={MessageCircle} label="واتساب" />
            </div>
          </div>

          <FooterCol title={gx(gender, "تسوّقي", "تسوّق")} links={SHOP_LINKS} />
          <FooterCol title="معلومات" links={INFO_LINKS} />
          <FooterCol title="السياسات" links={POLICY_LINKS} />
        </div>

        <div className="border-t border-cream/15 mt-10 pt-6 text-center text-sm text-cream/60 font-semibold space-y-1.5">
          <p>© {new Date().getFullYear()} سارة دولز — جميع الحقوق محفوظة 🌸</p>
          <p>
            تطوير وتصميم:{" "}
            <span className="text-pastel-pink font-black">يوسف</span>{" "}
            ·{" "}
            <a
              href="https://wa.me/201157514941"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pastel-pink hover:text-white transition"
              dir="ltr"
            >
              01157514941
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="font-black text-pastel-pink mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-cream/75 text-sm font-semibold hover:text-pastel-pink transition"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 grid place-items-center rounded-full bg-cream/10 hover:bg-soft-rose transition"
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}
