import Link from "next/link";
import { Package, Heart, LogOut } from "lucide-react";
import { PageHeader } from "@/components/legal";
import { getUserAndProfile } from "@/lib/auth";
import { logoutAction } from "@/app/(auth)/actions";
import { ProfileInfoForm, ChangePasswordForm } from "./ProfileForms";

export const dynamic = "force-dynamic";

export const metadata = { title: "حسابي | سارة دولز" };

export default async function ProfilePage() {
  const { user, profile } = await getUserAndProfile();

  return (
    <main>
      <PageHeader emoji="👤" title="حسابي" subtitle="إدارة بياناتك وعنوانك وكلمة المرور." />

      <div className="max-w-3xl mx-auto px-5 py-8 space-y-6">
        {/* quick links */}
        <div className="grid grid-cols-3 gap-3">
          <QuickLink href="/my-orders" icon={Package} label="طلباتي" />
          <QuickLink href="/wishlist" icon={Heart} label="المفضلة" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 border border-pastel-pink/40 text-rose-600 hover:border-rose-300 transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-xs font-black">خروج</span>
            </button>
          </form>
        </div>

        <ProfileInfoForm profile={profile} email={user?.email} />
        <ChangePasswordForm />
      </div>
    </main>
  );
}

function QuickLink({ href, icon: Icon, label }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 bg-white rounded-2xl p-4 border border-pastel-pink/40 text-warm-mocha hover:border-soft-rose transition"
    >
      <Icon className="w-5 h-5 text-soft-rose" />
      <span className="text-xs font-black">{label}</span>
    </Link>
  );
}
