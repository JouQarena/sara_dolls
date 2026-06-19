import { Cairo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { ToastProvider } from "@/components/ToastProvider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sara-dolls.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "سارة دولز | Sara Dolls — دمى كروشيه مصنوعة يدويًا بحب",
    template: "%s",
  },
  description:
    "سارة دولز: متجر كروشيه يدوي في مصر. دمى، باترونات، هدايا للكبار والأطفال، وطلبات خاصة مصنوعة خصيصًا لك. الدفع عند الاستلام و انستاباي.",
  keywords: [
    "سارة دولز",
    "Sara Dolls",
    "كروشيه",
    "دمى كروشيه",
    "كروشيه يدوي",
    "هدايا كروشيه",
    "باترونات كروشيه",
    "طلبات خاصة",
    "crochet Egypt",
    "handmade dolls",
  ],
  authors: [{ name: "Sara Dolls" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "سارة دولز",
    title: "سارة دولز | Sara Dolls — دمى كروشيه مصنوعة يدويًا بحب",
    description:
      "متجر كروشيه يدوي في مصر: دمى، باترونات، هدايا، وطلبات خاصة مصنوعة بحب.",
    url: SITE_URL,
    images: [
      {
        url: "/logo-banner.jpg",
        width: 1200,
        height: 1200,
        alt: "سارة دولز",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سارة دولز | Sara Dolls",
    description: "متجر كروشيه يدوي في مصر — دمى، باترونات، هدايا، وطلبات خاصة.",
    images: ["/logo-banner.jpg"],
  },
  icons: {
    icon: "/sara-avatar.jpg",
    apple: "/sara-avatar.jpg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#E88A9A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="font-sans bg-[#FFFDFB] text-warm-mocha antialiased">
        <ToastProvider>
          <CartProvider>{children}</CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
