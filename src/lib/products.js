import { createClient } from "@/lib/supabase/server";
import {
  DEMO_PRODUCTS,
  DEMO_CATEGORIES,
  DEMO_REVIEWS,
} from "@/data/demoProducts";

function isConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Whether we are running on demo data (no Supabase configured).
export function usingDemoData() {
  return !isConfigured();
}

function attachCategorySlug(products, categories) {
  const byId = Object.fromEntries(categories.map((c) => [c.id, c.slug]));
  return products.map((p) => ({
    ...p,
    category_slug: p.category_slug || byId[p.category_id] || null,
  }));
}

// -------- CATEGORIES --------
export async function getCategories() {
  if (!isConfigured()) return DEMO_CATEGORIES;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error || !data?.length) return DEMO_CATEGORIES;
    return data;
  } catch {
    return DEMO_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug) {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) || null;
}

// -------- PRODUCTS --------
export async function getFeaturedProducts(limit = 6) {
  if (!isConfigured()) {
    return DEMO_PRODUCTS.filter((p) => p.is_featured && p.is_available).slice(
      0,
      limit
    );
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) return [];
    const cats = await getCategories();
    return attachCategorySlug(data || [], cats);
  } catch {
    return [];
  }
}

// Filterable/sortable/paginated product list for the shop & category pages.
export async function getProducts({
  category = null,
  search = "",
  sort = "featured",
  page = 1,
  pageSize = 12,
} = {}) {
  const from = (page - 1) * pageSize;

  if (!isConfigured()) {
    let list = DEMO_PRODUCTS.filter((p) => p.is_available);
    if (category) list = list.filter((p) => p.category_slug === category);
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name_ar?.toLowerCase().includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.description_ar?.toLowerCase().includes(q)
      );
    }
    list = sortList(list, sort);
    const total = list.length;
    return {
      products: list.slice(from, from + pageSize),
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      page,
    };
  }

  try {
    const supabase = createClient();
    const cats = await getCategories();
    let categoryId = null;
    if (category) {
      categoryId = cats.find((c) => c.slug === category)?.id || "none";
    }

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("is_available", true);

    if (categoryId) query = query.eq("category_id", categoryId);
    if (search) {
      const q = search.trim();
      query = query.or(`name_ar.ilike.%${q}%,name.ilike.%${q}%`);
    }

    query = applySort(query, sort).range(from, from + pageSize - 1);

    const { data, error, count } = await query;
    if (error) return { products: [], total: 0, totalPages: 1, page };

    return {
      products: attachCategorySlug(data || [], cats),
      total: count || 0,
      totalPages: Math.max(1, Math.ceil((count || 0) / pageSize)),
      page,
    };
  } catch {
    return { products: [], total: 0, totalPages: 1, page };
  }
}

export async function getProductBySlug(slug) {
  if (!isConfigured()) {
    const p = DEMO_PRODUCTS.find((x) => x.slug === slug);
    if (!p) return null;
    return { ...p, reviews: DEMO_REVIEWS[p.id] || [] };
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error || !data) return null;

    const cats = await getCategories();
    const [withSlug] = attachCategorySlug([data], cats);

    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, user_id")
      .eq("product_id", data.id)
      .order("created_at", { ascending: false });

    return { ...withSlug, reviews: reviews || [] };
  } catch {
    return null;
  }
}

// Fetch multiple products by id (for wishlist / cart hydration).
export async function getProductsByIds(ids) {
  if (!ids || ids.length === 0) return [];
  if (!isConfigured()) {
    return DEMO_PRODUCTS.filter((p) => ids.includes(p.id));
  }
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);
    if (error) return [];
    const cats = await getCategories();
    return attachCategorySlug(data || [], cats);
  } catch {
    return [];
  }
}

export async function getRelatedProducts(product, limit = 4) {
  if (!product) return [];
  const { products } = await getProducts({
    category: product.category_slug,
    pageSize: limit + 1,
  });
  return products.filter((p) => p.id !== product.id).slice(0, limit);
}

// -------- helpers --------
function sortList(list, sort) {
  const arr = [...list];
  switch (sort) {
    case "price_low":
      return arr.sort((a, b) => a.price - b.price);
    case "price_high":
      return arr.sort((a, b) => b.price - a.price);
    case "rating":
      return arr.sort((a, b) => b.average_rating - a.average_rating);
    case "newest":
      return arr; // demo: keep order
    default: // featured
      return arr.sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
  }
}

function applySort(query, sort) {
  switch (sort) {
    case "price_low":
      return query.order("price", { ascending: true });
    case "price_high":
      return query.order("price", { ascending: false });
    case "rating":
      return query.order("average_rating", { ascending: false });
    case "newest":
      return query.order("created_at", { ascending: false });
    default:
      return query
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
  }
}
