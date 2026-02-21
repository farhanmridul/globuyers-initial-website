# External Integrations

**Analysis Date:** 2026-02-21

## APIs & External Services

**Email Communication:**
- Contact link in `app/page.tsx` (line 200) uses `mailto:support@globuyers.com`
- No email service SDK integrated (direct mailto handler)

**Font Services:**
- Google Fonts - Geist and Geist Mono font families loaded via `next/font/google` in `app/layout.tsx`
- No API key required (public CDN)

## Data Storage

**Databases:**
- Not detected - This is a static marketing website with no backend database

**File Storage:**
- Local filesystem only - Static assets in `public/` directory
- No cloud storage integration (AWS S3, Google Cloud Storage, etc.)

**Caching:**
- Next.js built-in static generation and incremental static regeneration (ISR)
- No external cache service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- Not detected - This is a marketing website with no authentication system
- No user accounts or protected content

## Monitoring & Observability

**Error Tracking:**
- Not detected - No Sentry, Rollbar, or similar error tracking service

**Logs:**
- Standard Node.js console logging only
- Deployment platform logs (Railway/Vercel) used for monitoring

**Analytics:**
- Not detected - No Google Analytics, Mixpanel, or similar tracking service configured

## CI/CD & Deployment

**Hosting:**
- Railway.app (primary deployment target per `RAILWAY_DEPLOY.md`)
- Vercel (alternative, mentioned in README as native Next.js platform)

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or similar configured
- Deployment triggered via Railway/Vercel Git integration (push-to-deploy)

**Build Configuration:**
- Build Command: `npm run build`
- Start Command: `npm start`
- No custom environment variables required for basic deployment

## Environment Configuration

**Required Environment Variables:**
- None required for basic operation
- Optional: Custom domain configuration at deployment platform
- No API keys or secrets needed

**Secrets Location:**
- Not applicable - No external service credentials configured
- Email contact is public (mailto: link)

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints configured

**Outgoing:**
- Not detected - No outbound webhooks to external services

## Third-Party Libraries & CDNs

**Content Delivery:**
- Google Fonts CDN - Font delivery
- NPM registry - Dependency distribution

**No Integration with:**
- Stripe, PayPal (no payments)
- Auth0, Firebase Auth (no user authentication)
- Supabase, Firebase (no database)
- Sendgrid, Mailgun (no email service SDK)
- Shopify API (marketing site only, though services offered include Shopify development)

## Architecture Notes

This is a **static marketing website** with no backend integrations. The application:
- Renders as static HTML with client-side React interactivity
- Uses Google Fonts for typography
- Deploys to Node.js hosting (Railway/Vercel) but requires no external services
- Can be deployed to CDN with static export if needed
- Contact form not yet implemented (only mailto link)

---

*Integration audit: 2026-02-21*
