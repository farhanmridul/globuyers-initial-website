# GloBuyers Website

## What This Is

GloBuyers is a digital commerce agency that builds custom software, Shopify apps, and automation systems for ecommerce brands. The website is a single-page marketing site targeting ecommerce brand owners — its job is to make visitors excited to work with us.

## Core Value

Visitors should finish scrolling and feel one thing: **I want to work with these people** — confident, excited, ready to reach out.

## Requirements

### Validated

- ✓ Hero section with animated text and floating particles — existing
- ✓ Services bento grid (4 services) — existing
- ✓ Stats/trust bar (uptime, delivery speed, support, clients) — existing
- ✓ Contact section with email CTA — existing
- ✓ Footer with basic links — existing
- ✓ Dark theme with Framer Motion animations — existing
- ✓ Privacy policy page at /privacy — existing

### Active

- [ ] Push neon glow aesthetic further — more dramatic dark + cyan/purple glow effects throughout
- [ ] Deeper service cards with brief capability descriptions (what we automate, what APIs we connect, what Shopify apps we build, what custom apps we deliver)
- [ ] New "How We Work" section — process steps: discovery → build → launch → support
- [ ] New "Tech Stack" section — visual display of technologies used
- [ ] New "Why GloBuyers" / differentiators section — what sets us apart
- [ ] Footer linked to privacy policy page (/privacy)
- [ ] Overall page should feel more professional, dense with information, and futuristic

### Out of Scope

- Multiple pages — single-page only
- Photos or real images — objects and animations only
- Mobile app section — not a current service offering
- Blog, case studies, or testimonials — not requested
- Contact form — email link only

## Context

- Tech stack: Next.js 16, React 19, Framer Motion 12, Tailwind CSS 4, TypeScript
- No external APIs or databases — purely static/presentational
- Existing animation system: FloatingParticles, GradientOrb, ServiceCard, AnimatedText, GlowButton components
- Target visitor: Ecommerce brand owner deciding whether to hire GloBuyers
- No photos/images — all visual interest comes from CSS/SVG objects and motion

## Constraints

- **Tech stack**: Must use existing Next.js/Framer Motion/Tailwind setup — no new frameworks
- **Single page**: All content lives in `app/page.tsx` — no new routes except the existing /privacy
- **No images**: Visual appeal through animation, gradients, geometric shapes, and typography only
- **Performance**: Animations must not tank Core Web Vitals — use `whileInView` with `once: true`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Single page only | User explicitly wants one-page site | — Pending |
| Dark + neon glow aesthetic | User confirmed: push existing direction further | — Pending |
| Brief service descriptions | User wants succinct bullets, not full feature breakdowns | — Pending |
| Privacy policy in footer | User wants /privacy linked from homepage footer | — Pending |

---
*Last updated: 2026-02-21 after initialization*
