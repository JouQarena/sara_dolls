# 🌸 Sara Dolls — متجر كروشيه يدوي (مصر)

Handmade crochet e-commerce store for the Egyptian market — **dolls, patterns, gifts, and a special Custom Orders section**.
Built with **Next.js (App Router) + Tailwind CSS + Supabase**, free-tier only, deployable on **Vercel**.

- **Currency:** EGP · **Language:** Arabic (RTL, مذكّر/مؤنث حسب المستخدم) · **Payments:** Cash on Delivery + Instapay
- **Categories:** الدمى · الباترونات · هدايا للكبار · هدايا للأطفال · **طلبات خاصة ✨**
- **Ordering:** with account **or as guest** (no signup needed) · **Admin alerts:** 🔔 bell + 📧 email

---

## ✅ Features

**Storefront**
- تصفّح المنتجات + بحث + فلترة + ترتيب + صفحات
- صفحة المنتج: معرض صور متعددة + تقريب (lightbox) + تقييمات + منتجات مشابهة
- أنواع المنتجات: **فعلي** (بمخزون) · **باترون رقمي (PDF)** · **🧶 يُصنع عند الطلب** (كمية مفتوحة + مدة تجهيز بالأيام)
- صفحة **الطلبات الخاصة** بنموذج كامل، مقاسات بالسم (10/20/30)، ورفع صور مرجعية ✨
- سلة تسوّق (Context + localStorage)، مفضلة
- **الطلب بدون حساب** للطلبات العادية والخاصة — فقط بيانات التوصيل
- دفع عند الاستلام + إنستاباي (رفع إيصال) · 27 محافظة مصرية · شحن قابل للضبط
- تتبّع الطلبات + إلغاء خلال 24 ساعة · قبول/رفض عرض السعر للطلبات الخاصة
- **الموقع يخاطبك حسب جنسك** 👩👨 (اختيار عند التسجيل + زرار تبديل للضيوف، يتحفظ في حسابك أو على جهازك)
- تقييمات، نشرة بريدية، تواصل، أسئلة شائعة

**Admin (`/admin`)**
- لوحة تحكم + طلبات + طلبات خاصة + منتجات + تصنيفات + خصومات + تقييمات + رسائل + مشتركون + إعدادات
- **🔔 جرس تنبيهات فوري** للطلبات الجديدة (يتحدث كل 30 ثانية + صوت + صفحة سجل كاملة)
- **📧 إيميل تلقائي** لسارة مع كل طلب جديد (Resend — مجاني)
- إدارة الصور المتعددة (رفع/حذف/ترتيب + صورة رئيسية) وضغط تلقائي

**Tech extras**
- SEO عربي + Open Graph + sitemap + robots + صفحة 404 مخصّصة + JSON-LD + روابط عربية جميلة

---

## 🧱 Tech stack

| Layer | Choice |
|------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Backend | Next.js Server Actions + Route Handlers |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (email + password, تأكيد الإيميل اختياري) |
| Storage | Supabase Storage (products, instapay-screenshots, custom-order-references) |
| Admin emails | Resend (free tier, 100/day) |
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
3. Paste all of `supabase/schema.sql` → **Run** (all tables + RLS + seed + RPC — including
   gender, notifications, made-to-order, and multi-image columns).
4. New query → paste all of `supabase/storage.sql` → **Run** (creates the 3 buckets + policies).

> Re-running both files is safe (idempotent).
>
> **Existing project?** Instead of re-running everything, run only the `supabase/migration_*.sql`
> files you haven't run yet (each is safe to re-run):
> `migration_multiple_images` → `migration_fix_checkout` → `migration_update_whatsapp` →
> `migration_fix_custom_orders` → `migration_add_gender` → `migration_made_to_order` →
> `migration_notifications`.

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
NEXT_PUBLIC_WHATSAPP_NUMBER=201109624671  # Sara's WhatsApp (01109624671), intl format, no + or spaces
NEXT_PUBLIC_INSTAPAY_NUMBER=your-instapay-handle
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_...                     # SERVER ONLY — free key from resend.com (order emails)
# RESEND_FROM_EMAIL=...                   # optional, only if you verify a domain later
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
   (and in `is_admin()` in `schema.sql`). Pick 👩/👨 — it only changes how the site talks to you.
2. Recommended: turn OFF email confirmation (Supabase → **Authentication → Providers → Email → Confirm email** → OFF) so customers can register and log in immediately with no email step. Guest checkout works without any account anyway.
3. Log in → the navbar account menu now shows **«لوحة الإدارة»**, or go directly to **`/admin`**.

> Only the email in `ADMIN_EMAIL` / `is_admin()` can access `/admin` (enforced in code **and** RLS).

---

## 🛍️ Add your first content
From **`/admin`**:
- **التصنيفات** — the 5 categories are seeded; edit names/descriptions or add category images.
- **المنتجات → منتج جديد** — add a product:
  - اسم عربي، وصف، السعر (ج.م)، المخزون، التصنيف.
  - ارفعي صور المنتج (رئيسية + حتى 5 إضافية، تُحفظ في bucket `products`).
  - للباترونات: اختاري النوع **«باترون رقمي (PDF)»** وارفعي ملف الـ PDF.
  - للقطع المصنوعة عند الطلب: اختاري النوع **«🧶 يُصنع عند الطلب»** (كمية مفتوحة،
    بدون مخزون) واكتبي **مدة التجهيز بالأيام** — تظهر للعميلة كـ «التجهيز خلال ~10 أيام».
  - فعّلي **«مميّز»** لإظهاره في الصفحة الرئيسية.
- **الإعدادات** — رقم واتساب، إنستاباي، السوشيال، رسوم الشحن، حد الشحن المجاني، نص شريط الإعلان.
- **أكواد الخصم** — أنشئي أكواد (نسبة أو مبلغ ثابت).

---

## ▲ Deploy to Vercel (free)
1. Push the project to a **GitHub** repo.
2. Go to **https://vercel.com** → **Add New → Project** → import the repo.
3. **Environment Variables** — add the same keys from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
     `ADMIN_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_INSTAPAY_NUMBER`,
     `RESEND_API_KEY` (free key from https://resend.com — for new-order emails)
   - `NEXT_PUBLIC_SITE_URL` = your Vercel URL (e.g. `https://sara-dolls.vercel.app`)
4. **Deploy**.
5. In **Supabase → Authentication → URL Configuration**, set **Site URL** to your Vercel URL
   and add `https://YOUR-DOMAIN/auth/callback` to **Redirect URLs**.

> Update `NEXT_PUBLIC_SITE_URL` so sitemap, robots, and Open Graph URLs are correct in production.

---

## 🔔 New-order alerts (bell + email)

- **🔔 Admin bell** — every new regular/custom order inserts a row into `public.notifications`
  (run `supabase/migration_notifications.sql` once on existing projects). The bell in `/admin`
  polls every 30s, shows an unread count, plays a soft ding (mutable), and links to the full
  list at `/admin/notifications`.
- **📧 Email** — free via [Resend](https://resend.com) (100 emails/day, no card needed):
  1. Sign up with **Sara's email** (the same address as `ADMIN_EMAIL`).
  2. **API Keys → Create API Key** → copy it → set `RESEND_API_KEY` in `.env.local` and Vercel → **Redeploy**.
  3. Keep the default sender (`onboarding@resend.dev`) unless you verify a domain later —
     on the free tier Resend only delivers to your own account email, which is exactly our case.
  4. Without the key, the bell keeps working and email is skipped silently (see Vercel logs —
     search for `[notify]`).

---

## 👩👨 Gender-aware speech (مذكّر/مؤنث)

- At **signup** the customer picks 👩 أنثى (default) or 👨 ذكر — stored in `profiles.gender`.
- **Guests** get a «خاطبني: مؤنث/مذكر» toggle in the navbar (desktop) and the mobile drawer,
  saved in a `sara_gender` cookie (no account needed).
- Logged-in users can also change it later from **حسابي → الجنس**.
- Implementation: `getUserGender()` (server) resolves profile → cookie → `'female'`;
  `GenderProvider` + `useGender().t(feminine, masculine)` for client components and
  `gx(gender, feminine, masculine)` for server components/actions. Only second-person
  speech changes — product descriptions stay as-is, and `/admin` always speaks feminine (Sara 💁‍♀️).

---

## 🗂️ Project structure
```
src/
├── app/
│   ├── (auth)/            login, signup (with gender), forgot/reset password + actions
│   ├── (main)/            storefront (home, shop, product, category, cart,
│   │                      checkout, custom-order, my-orders, profile, wishlist,
│   │                      legal/info pages) + layout (navbar/footer)
│   ├── admin/             protected admin dashboard (11 sections incl. notifications) + actions
│   ├── api/               settings, discount, products-by-ids, admin/notifications
│   ├── auth/callback/     Supabase auth code exchange
│   ├── layout.js          root: Cairo font, RTL, metadata, providers (gender/cart/toast)
│   ├── sitemap.js         /sitemap.xml
│   ├── robots.js          /robots.txt
│   └── not-found.js       custom Arabic 404
├── components/            UI: Navbar, Footer, ProductCard, CartProvider,
│                          GenderProvider, GenderToggle, ToastProvider,
│                          admin UI (incl. NotificationBell), forms, skeletons...
├── lib/                   supabase clients, products, orders, settings,
│                          admin, validation, whatsapp, genderedText,
│                          notifyAdmin, customOrders, constants
└── data/                  demo products (preview fallback)
supabase/
├── schema.sql             all tables + RLS + seed + RPC  (run 1st, fresh projects)
├── storage.sql            3 buckets + policies            (run 2nd)
└── migration_*.sql        one-step upgrades for existing projects (safe to re-run)
```

## 📜 Pretty Arabic URLs
Routes like `/طلب-خاص` and `/سياسة-الطلبات-الخاصة` are served via `rewrites` in
`next.config.mjs` mapping the (encoded) Arabic paths to ASCII route folders — works on Vercel.

---

## 🔐 Security notes
- `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` are used **only** server-side
  (admin pages/actions, order saving, notifications). Never imported client-side.
- Row Level Security protects every table; admin access is gated by `is_admin()` + `ADMIN_EMAIL`.
- Prices and stock are re-validated **server-side** at checkout (the client is never trusted).
- Notification failures (bell/email) are caught and logged — they can never break checkout.

© Sara Dolls — صُنع بحب 🌸
