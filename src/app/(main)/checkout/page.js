import { PageHeader } from "@/components/legal";
import CheckoutForm from "./CheckoutForm";

export const metadata = {
  title: "إتمام الطلب | سارة دولز",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <main>
      <PageHeader emoji="🛒" title="إتمام الطلب" />
      <div className="max-w-6xl mx-auto px-5 py-8">
        <CheckoutForm />
      </div>
    </main>
  );
}
