import { getCategories, getProducts } from "@/lib/products";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://sara-dolls.vercel.app";

export default async function sitemap() {
  const now = new Date();

  // Static public pages (pretty Arabic URLs supported via rewrites).
  const staticPaths = [
    "",
    "/shop",
    "/طلب-خاص",
    "/من-نحن",
    "/تواصل-معنا",
    "/الاسئلة-الشائعة",
    "/اتفاقية-المستخدم",
    "/سياسة-الخصوصية",
    "/سياسة-الاسترجاع",
    "/سياسة-الطلبات-الخاصة",
  ];

  const staticEntries = staticPaths.map((p) => ({
    url: `${SITE_URL}/${encodeURI(p.replace(/^\//, ""))}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  let categoryEntries = [];
  let productEntries = [];
  try {
    const categories = await getCategories();
    categoryEntries = categories
      .filter((c) => !c.is_special)
      .map((c) => ({
        url: `${SITE_URL}/category/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      }));

    const { products } = await getProducts({ pageSize: 1000 });
    productEntries = products.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    // ignore — return at least the static entries
  }

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
