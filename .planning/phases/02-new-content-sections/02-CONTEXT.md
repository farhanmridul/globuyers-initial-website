# Phase 2: New Content Sections - Context

**Gathered:** 2026-02-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Three new marketing sections added to the landing page: "How We Work" (4-step process), "Tech Stack" (technology badges by category), and "Why GloBuyers" (differentiator cards). All three animate in on scroll consistent with existing whileInView pattern.

</domain>

<decisions>
## Implementation Decisions

### How We Work — Layout
- Horizontal timeline with arrow connectors between steps on desktop
- Steps stack vertically on mobile (no horizontal scroll)
- 4 steps: Discovery → Build → Launch → Support
- Each step has a large number accent and a deliverable description
- Steps animate in sequentially (staggered) as section scrolls into view

### Tech Stack — Content & Display
- **Excluded:** make.com, n8n, Zapier, and any commodity automation tools ("simpler stuff that anyone can do")
- **Include:** Shopify, Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Stripe, Google Analytics (GA4)
- Categories: Frontend (Next.js, React, TypeScript, Tailwind, Framer Motion), Ecommerce (Shopify, Stripe), Analytics (GA4)
- Always-expanded categories (no tabs/filters) — all visible at once
- Badge hover: neon glow effect consistent with site's existing glow style
- Badges animate in with staggered reveal on scroll

### Why GloBuyers — Content & Cards
- 3 differentiators: Shopify specialists, fast delivery, post-launch support
- Bold short headline + one-sentence visitor-framed expansion per card
- Neon icon accent per card
- Card interactivity: Claude's discretion (match existing ServiceCard pattern)

### Claude's Discretion
- "Why GloBuyers" card hover interaction (static vs subtle hover state)
- Exact background treatments for each section
- Section ordering on the page
- Icon choices for each tech badge and differentiator card

</decisions>

<specifics>
## Specific Ideas

- Horizontal timeline with "──▶" style connectors between numbered steps
- Tech stack categories always visible (not tabbed) — visitors shouldn't have to interact to see the full list
- Avoid showcasing automation tools that feel generic or cheap — position GloBuyers as a quality technical partner

</specifics>

<deferred>
## Deferred Ideas

- Remove Twitter from footer — existing content fix, not Phase 2
- "Digital Commerce" heading text visibility improvement — existing content fix, not Phase 2
- Remove make.com / n8n references from any existing content — existing content fix, not Phase 2

</deferred>

---

*Phase: 02-new-content-sections*
*Context gathered: 2026-02-21*
