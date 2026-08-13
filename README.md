# U Graphics — Website Project

Next.js (App Router) + MongoDB full-stack project. No separate Express server —
backend logic lives in `app/api/*` route handlers.

## Stack
- Next.js 14 (frontend + backend API routes)
- MongoDB + Mongoose
- Tailwind CSS (theme tokens in `tailwind.config.js`)
- NextAuth.js (admin login) — to be wired in Step 7
- Cloudinary (image uploads) — to be wired in Step 7
- Nodemailer (enquiry email notifications)

## Getting Started (on your machine)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your MongoDB Atlas URI, Cloudinary keys, SMTP credentials, and
   WhatsApp number.
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Visit `http://localhost:3000`

## Project Structure

```
app/
  page.js                 → Homepage
  layout.js                → Root layout (fonts, header, footer)
  globals.css               → Theme tokens + base styles
  about/                    → About page
  services/                 → Services listing + detail
  portfolio/                → Portfolio gallery
  blog/                     → Blog listing + posts
  get-a-quote/               → Quotation form page
  contact/                   → Contact page
  careers/                   → Careers page
  privacy-policy/             → Legal page
  admin/                     → Admin CMS panel (Step 7)
  api/
    services/route.js         → Services CRUD API
    portfolio/route.js         → Portfolio CRUD API
    blog/route.js              → Blog CRUD API
    enquiry/route.js            → Quote form submission handler
    admin/login/                → Admin auth endpoint (Step 7)

components/
  layout/    → Header, Footer, WhatsAppButton, MobileActionBar
  home/      → Homepage sections
  services/  → Service cards, category filters
  portfolio/ → Project gallery, lightbox
  blog/      → Blog cards
  forms/     → Quote form, contact form
  ui/        → Shared/reusable UI elements

models/      → Mongoose schemas (Category, Service, Project, BlogPost, Enquiry, AdminUser)
lib/         → mongodb.js (DB connection), future helpers (auth, email, cloudinary)
public/      → Static assets (placeholder logo, images)
```

## Common Components (`components/ui/`)

| Component | Use |
|---|---|
| `Button.js` | Primary/outline/ghost buttons site-wide |
| `SectionHeading.js` | Eyebrow + title + subtitle pattern for each section |
| `Card.js` | Service / Project / Blog card |
| `PageHero.js` | Inner-page banner (About, Services, Portfolio, Contact) with breadcrumb |
| `Breadcrumb.js` | Navigation trail |
| `StatsCounter.js` | Animated number counters (e.g. "500+ Projects") |
| `TestimonialCard.js` | Client quote card |
| `FormFields.js` | Styled `FormInput`, `FormTextarea`, `FormSelect` for react-hook-form |
| `CategoryFilterTabs.js` | Filter buttons for Portfolio/Services |
| `EmptyState.js` | "No results" message |
| `LoadMoreButton.js` | Pagination button with loading state |
| `Lightbox.js` | Portfolio gallery viewer (thumbnail grid + full-screen modal) |

## Status
- [x] Step 1 — Planning & structure
- [x] Step 2 — UI/UX & branding tokens
- [x] Step 3 — Project setup (this scaffold)
- [x] Step 4 — Common components (Button, SectionHeading, Card, PageHero, Breadcrumb, StatsCounter, TestimonialCard, FormFields, CategoryFilterTabs, EmptyState, LoadMoreButton, Lightbox)
- [ ] Step 5 — Build pages one by one
- [ ] Step 6 — Responsive polish
- [ ] Step 7 — Backend: admin auth, image upload, full CRUD UI
- [ ] Step 8 — Testing & SEO
- [ ] Step 9 — Deployment (Vercel + MongoDB Atlas)
