// Pretty Arabic URLs → internal ASCII routes.
// Browsers percent-encode Arabic paths, so sources use the encoded form.
const ARABIC_ROUTES = [
  { ar: "اتفاقية-المستخدم", en: "user-agreement" },
  { ar: "سياسة-الخصوصية", en: "privacy-policy" },
  { ar: "سياسة-الاسترجاع", en: "returns-policy" },
  { ar: "سياسة-الطلبات-الخاصة", en: "custom-order-policy" },
  { ar: "من-نحن", en: "about" },
  { ar: "تواصل-معنا", en: "contact" },
  { ar: "الاسئلة-الشائعة", en: "faq" },
  { ar: "طلب-خاص", en: "custom-order" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  async rewrites() {
    return ARABIC_ROUTES.flatMap(({ ar, en }) => {
      const encoded = encodeURIComponent(ar);
      return [
        { source: `/${ar}`, destination: `/${en}` },
        { source: `/${encoded}`, destination: `/${en}` },
      ];
    });
  },
};

export default nextConfig;
