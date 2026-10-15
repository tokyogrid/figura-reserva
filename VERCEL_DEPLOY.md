# Vercel Deployment Guide

## 1. Pre-deployment Checklist

### Required Changes for Production

**A. Database (SQLite → PostgreSQL)**
- Local uses SQLite (`file:./dev.db`) - **won't work on Vercel**
- Must use **PostgreSQL** (Vercel Postgres, Neon, Supabase, Railway, etc.)
- Run `prisma migrate deploy` after setting `DATABASE_URL`

**B. Update `next.config.js`** (if exists) for image domains:
```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.vercel.app' },
      { protocol: 'https', hostname: 'your-domain.com' },
    ],
  },
}
```

**C. Stripe Webhook URL**
- After deploy, update Stripe Dashboard → Webhooks → `https://your-app.vercel.app/api/stripe/webhook`

---

## 2. Environment Variables for Vercel

Go to **Vercel Dashboard → Project → Settings → Environment Variables** and add:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string | `postgresql://user:pass@host/db?schema=public` |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key (sk_live_...) | `sk_live_abc123...` |
| `STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key (pk_live_...) | `pk_live_abc123...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ | From Stripe webhook endpoint | `whsec_abc123...` |
| `NEXT_PUBLIC_APP_URL` | ✅ | Your production URL | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | ✅ | App name for emails | `Tokyo Grid` |
| `ADMIN_EMAIL` | ✅ | Admin notification email | `admin@yourdomain.com` |
| `ADMIN_PASSWORD_HASH` | ✅ | Bcrypt hash for admin login | `$2b$12$...` |
| `RESEND_API_KEY` | ✅ | Resend API key | `re_abc123...` |
| `SESSION_PASSWORD` | ✅ | 32+ char random string | Generate: `openssl rand -base64 32` |
| `ENCRYPTION_KEY` | ✅ | 32-char base64 for Vinted passwords | Generate: `openssl rand -base64 32` |
| `TELEGRAM_BOT_TOKEN` | ⚠️ | Bot token from @BotFather | `123456:ABC-DEF...` |
| `TELEGRAM_CHAT_ID` | ⚠️ | Chat ID for notifications | `-1001234567890` |
| `NEXT_PUBLIC_LOGO_URL` | ✅ | **Public logo URL for emails** | `https://your-app.vercel.app/images/logo.png` |

---

## 3. Deploy Steps

### Option A: Vercel CLI (Recommended)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy from project root
cd figura-reserva
vercel

# 4. Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No (first time)
# - Project name: figura-reserva
# - Directory: ./
# - Override settings? No

# 5. After first deploy, add env vars:
vercel env add DATABASE_URL
vercel env add STRIPE_SECRET_KEY
# ... repeat for all variables

# 6. Redeploy with env vars
vercel --prod
```

### Option B: GitHub Integration (Easier)

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOURUSER/figura-reserva.git
git push -u origin main
```

2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo
4. **Add all Environment Variables** in the configure step
5. Deploy

---

## 4. Post-Deploy Configuration

### Database Setup
```bash
# After first deploy with DATABASE_URL set:
vercel env pull .env.local  # Pull vars locally
npx prisma migrate deploy   # Run migrations on production DB
npx prisma db seed          # If you have seed script
```

### Stripe Webhook
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_failed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy `STRIPE_WEBHOOK_SECRET` → Add to Vercel env vars → Redeploy

### Resend Domain
1. Go to [Resend → Domains](https://resend.com/domains)
2. Add your domain (`yourdomain.com`) or use `onboarding@resend.dev` for testing
3. Verify DNS records

### Logo for Emails
Upload `public/images/logo.png` to your deployed app (it will be at `https://your-app.vercel.app/images/logo.png`) and set `NEXT_PUBLIC_LOGO_URL` to that URL.

---

## 5. Generate Secure Secrets

Run these locally to generate secure values:

```bash
# Session password (32+ chars)
openssl rand -base64 32

# Encryption key (32 chars base64)
openssl rand -base64 32

# Admin password hash (replace 'yourpassword')
node -e "console.log(require('bcryptjs').hashSync('yourpassword', 12))"
```

---

## 6. Common Issues

| Issue | Fix |
|-------|-----|
| Prisma client not found | Ensure `postinstall: "prisma generate"` in package.json |
| Database connection timeout | Use connection pooling (PgBouncer) for serverless |
| Images not loading | Add `remotePatterns` to `next.config.js` |
| Webhook fails | Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard |
| Emails not sending | Verify Resend domain and `RESEND_API_KEY` |
| Admin login fails | Check `ADMIN_PASSWORD_HASH` matches bcrypt hash |

---

## 7. Vercel Project Settings

- **Framework Preset**: Next.js
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (runs `prisma generate` via postinstall)
- **Node.js Version**: 20.x (in `.nvmrc` or Vercel settings)

---

## 8. Quick Commands Reference

```bash
# Local development with production env
vercel env pull .env.local
npm run dev

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs <deployment-url>

# Update env var
vercel env rm VARIABLE_NAME
vercel env add VARIABLE_NAME
```