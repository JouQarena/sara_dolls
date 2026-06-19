import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { getUserAndProfile, isAdminUser } from "@/lib/auth";
import AccountMenu from "@/components/AccountMenu";
import MobileNav from "@/components/MobileNav";
import NavCartIcons from "@/components/NavCartIcons";

const NAV_LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/shop", label: "المتجر" },
  { href: "/طلب-خاص", label: "طلب خاص ✨" },
  { href: "/من-نحن", label: "من نحن" },
  { href: "/تواصل-معنا", label: "تواصل معنا" },
];

export default async function Navbar() {
  const { user, profile } = await getUserAndProfile();
  const admin = await isAdminUser();

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-soft-rose text-white text-xs md:text-sm font-extrabold py-2.5 px-4 text-center">
        🌸 شحن مجاني داخل مصر للطلبات فوق 1000 ج.م — تسوقي الآن!
      </div>

      <header className="glass-header sticky top-0 z-40 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <Image
              src="/sara-avatar.jpg"
              alt="Sara Dolls"
              width={44}
              height={44}
              className="rounded-full border-2 border-soft-rose shadow-soft-sm group-hover:scale-105 transition"
            />
            <div className="leading-tight">
              <h1 className="font-black text-lg md:text-xl text-warm-mocha">
                سارة دولز
              </h1>
              <span className="text-[0.6rem] md:text-[0.65rem] font-bold text-warm-mocha/60 block -mt-0.5 tracking-wide">
                SARA DOLLS
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 font-black text-sm">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-warm-mocha hover:text-soft-rose transition"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 md:gap-2.5">
            <NavCartIcons />

            {user ? (
              <AccountMenu name={profile?.full_name} isAdmin={admin} />
            ) : (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 bg-soft-rose text-white font-black text-sm px-4 py-2 rounded-full hover:bg-brand-dark shadow-soft-sm transition"
              >
                <User className="w-4 h-4" />
                دخول
              </Link>
            )}

            <MobileNav links={NAV_LINKS} isLoggedIn={Boolean(user)} isAdmin={admin} />
          </div>
        </div>
      </header>
    </>
  );
}
