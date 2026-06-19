# 🌸 Sara Dolls — متجر كروشيه يدوي (مصر)

Handmade crochet e-commerce store for the Egyptian market — **dolls, patterns, gifts, and a special Custom Orders section**.
Built with **Next.js (App Router) + Tailwind CSS + Supabase**, free-tier only, deployable on **Vercel**.

- **Currency:** EGP · **Language:** Arabic (RTL) · **Payments:** Cash on Delivery + Instapay
- **Categories:** الدمى · الباترونات · هدايا للكبار · هدايا للأطفال · **طلبات خاصة ✨**

---

## ✅ Features

- تسجيل / دخول / استعادة كلمة المرور (Supabase Auth)
- تصفّح المنتجات + بحث + فلترة + ترتيب + صفحات
- صفحة **الطلبات الخاصة** بنموذج كامل ورفع صور مرجعية ✨
- سلة تسوّق (Context + localStorage)، مفضلة
- دفع عند الاستلام + إنستاباي (رفع إيصال)
- 27 محافظة مصرية، شحن قابل للضبط
- تتبّع الطلبات + إلغاء خلال 24 ساعة
- تتبّع الطلبات الخاصة + قبول/رفض عرض السعر
- إشعار واتساب للطلبات والطلبات الخاصة
- تقييمات، نشرة بريدية، تواصل
- لوحة إدارة كاملة (طلبات، طلبات خاصة، منتجات، تصنيفات، خصومات، تقييمات، رسائل، مشتركون، إعدادات)
- SEO عربي + Open Graph + sitemap + robots + صفحة 404 مخصّصة + JSON-LD

---

## 🧱 Tech stack

| Layer | Choice |
|------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js Server Actions + Route Handlers |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password) |
| Storage | Supabase Storage (products, instapay-screenshots, custom-order-references) |
| Payments | Cash on Delivery + Instapay |
| Hosting | Vercel (free tier) |
| Font | Cairo (Arabic, via `next/font`) |

---

## 🚀 Full setup guide

### 1) Create a free Supabase project
1. Go to **https://supabase.com** → **New project**.
2. Name it `sara-dolls`, set a DB password, pick a region near Egypt (e.g. **EU Frankfurt**).
3. Wait ~2 minutes for provisioning.

### 2) Run the database schema
1. Supabase → **SQL Editor → New query**.
2. ⚠️ **Before running**, open `supabase/schema.sql` and change the admin email inside the
   `is_admin()` function (`'admin@saradolls.com'`) to **your** real admin email.
3. Paste all of `supabase/schema.sql` → **Run**.
4. New query → paste all of `supabase/storage.sql` → **Run** (creates the 3 buckets + policies).

> Re-running both files is safe (idempotent). If you set up before Phase 6, re-run `schema.sql`
> to add the `increment_discount_use` RPC.

### 3) Get your API keys
Supabase → **Project Settings → API**: copy the **Project URL**, **anon public** key, and **service_role** key.

### 4) Configure environment variables
```bash
cp .env.example .env.local
```
Fill `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOURPROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...          # SERVER ONLY — never expose
ADMIN_EMAIL=admin@saradolls.com           # must match is_admin() in schema.sql
NEXT_PUBLIC_WHATSAPP_NUMBER=201001234567  # intl format, no + or spaces
NEXT_PUBLIC_INSTAPAY_NUMBER=your-instapay-handle
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5) Install & run
```bash
npm install
npm run dev
```
Open **http://localhost:3000**.

> **Preview/demo mode:** if Supabase env vars are missing, the store still runs using built-in
> demo products/orders so you can preview every page. Real data flows automatically once configured.

---

## 👤 Create the admin account
1. Run the app, go to **`/signup`**, and register using the **exact email** you put in `ADMIN_EMAIL`
   (and in `is_admin()` in `schema.sql`).
2. If email confirmation is on (Supabase → Authentication → Providers → Email), confirm via the email link.
3. Log in → the navbar account menu now shows **«لوحة الإدارة»**, or go directly to **`/admin`**.

> Only the email in `ADMIN_EMAIL` / `is_admin()` can access `/admin` (enforced in code **and** RLS).

---

## 🛍️ Add your first content
From **`/admin`**:
- **التصنيفات** — the 5 categories are seeded; edit names/descriptions or add category images.
- **المنتجات → منتج جديد** — add a product:
  - اسم عربي، وصف، السعر (ج.م)، المخزون، التصنيف.
  - ارفعي صورة المنتج (تُحفظ في bucket `products`).
  - للباترونات: اختاري النوع **«باترون رقمي (PDF)»** وارفعي ملف الـ PDF.
  - فعّلي **«مميّز»** لإظهاره في الصفحة الرئيسية.
- **الإعدادات** — رقم واتساب، إنستاباي، السوشيال، رسوم الشحن، حد الشحن المجاني، نص شريط الإعلان.
- **أكواد الخصم** — أنشئي أكواد (نسبة أو مبلغ ثابت).

---

## ▲ Deploy to Vercel (free)
1. Push the project to a **GitHub** repo.
2. Go to **https://vercel.com** → **Add New → Project** → import the repo.
3. **Environment Variables** — add the same keys from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
     `ADMIN_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAPAY_NUMBER`
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g. `https://sara-dolls.vercel.app`)
4. **Deploy**.
5. In **Supabase → Authentication → URL Configuration**, set **Site URL** to your Vercel URL
   and add `https://YOUR-DOMAIN/auth/callback` to **Redirect URLs**.

> Update `NEXT_PUBLIC_SITE_URL` so sitemap, robots, and Open Graph URLs are correct in production.

---

## 🗂️ Project structure
```
src/
├── app/
│   ├── (auth)/            login, signup, forgot/reset password + actions
│   ├── (main)/            storefront (home, shop, product, category, cart,
│   │                      checkout, custom-order, my-orders, profile, wishlist,
│   │                      legal/info pages) + layout (navbar/footer)
│   ├── admin/             protected admin dashboard (10 sections) + actions
│   ├── api/               settings, discount, products-by-ids route handlers
│   ├── auth/callback/     Supabase auth code exchange
│   ├── layout.js          root: Cairo font, RTL, metadata, providers
│   ├── sitemap.js         /sitemap.xml
│   ├── robots.js          /robots.txt
│   └── not-found.js       custom Arabic 404
├── components/            UI: Navbar, Footer, ProductCard, CartProvider,
│                          ToastProvider, admin UI, forms, skeletons...
├── lib/                   supabase clients, products, orders, settings,
│                          admin, validation, whatsapp, constants
└── data/                  demo products (preview fallback)
supabase/
├── schema.sql             all tables + RLS + seed + RPC  (run 1st)
└── storage.sql            3 buckets + policies            (run 2nd)
```

## 📜 Pretty Arabic URLs
Routes like `/طلب-خاص` and `/سياسة-الطلبات-الخاصة` are served via `rewrites` in
`next.config.mjs` mapping the (encoded) Arabic paths to ASCII route folders — works on Vercel.

---

## 🔐 Security notes
- `SUPABASE_SERVICE_ROLE_KEY` is used **only** server-side (admin pages/actions). Never imported client-side.
- Row Level Security protects every table; admin access is gated by `is_admin()` + `ADMIN_EMAIL`.
- Prices and stock are re-validated **server-side** at checkout (the client is never trusted).

© Sara Dolls — صُنع بحب 🌸
