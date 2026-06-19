const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sara-dolls.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/checkout",
          "/order-confirmation/",
          "/custom-order-confirmation/",
          "/my-orders",
          "/profile",
          "/wishlist",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
