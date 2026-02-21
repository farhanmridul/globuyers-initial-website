# Feature Research

**Domain:** Dark neon ecommerce/Shopify agency marketing website — section additions
**Researched:** 2026-02-21
**Confidence:** MEDIUM (design pattern research via WebSearch + authoritative industry sources; no single canonical spec exists for agency site sections)

---

## Context

GloBuyers is a digital commerce agency building custom software, Shopify apps, and automation for ecommerce brands. The existing site has: Hero, Services bento grid, Stats bar, Contact CTA, Footer. This research covers the three new sections to add:

1. "How We Work" — process section
2. "Tech Stack" — technology showcase
3. "Why GloBuyers" — differentiators

The target visitor is an ecommerce brand owner deciding whether to hire GloBuyers. The aesthetic is dark + neon cyan/purple glow.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features visitors assume exist on any credible agency site. Missing these = site feels incomplete or untrustworthy.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Process steps (4-6 numbered stages) | Every credible agency shows how they work; hides "black box" fear | LOW | Discovery, Build, Launch, Support is the expected cadence for a software/Shopify agency |
| Technology logos/icons in tech stack | Visitors want proof you use professional tools; legitimizes claims | LOW | Shopify, Next.js, React, Node.js, etc. — recognizable logos create instant credibility |
| Clear differentiators vs. generic agencies | Visitors compare multiple agencies; need a reason to choose you | MEDIUM | Must be specific claims, not "we're passionate" or "we care about quality" |
| Stats/proof points in differentiators | Specificity builds trust: "99.9% uptime" beats "we deliver reliably" | LOW | Already have a stats bar — can reuse data or expand it contextually |
| Scannable layout (not walls of text) | Agency site visitors skim before reading; visual hierarchy is mandatory | LOW | Numbered steps, icons, bold callouts — structure over paragraphs |
| Process section that names deliverables | Top agencies name what you get per phase, not just phase names | MEDIUM | "You get: scope doc, wireframes, working app, support SLA" — tangible outcomes |
| Anchor navigation from hero | Visitors use "How We Work" / "Our Stack" CTAs to jump to sections | LOW | Already have scrollToServices pattern; extend to new sections |
| Responsive layout for all new sections | Mobile usage is non-negotiable in 2025 | LOW | Existing Tailwind setup handles this; just build with responsive classes |

### Differentiators (Competitive Advantage)

Features that set the site apart from generic agency sites. Not required, but meaningfully increase conversion probability.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Vertical scrolling process with animated connector line | Creates visual narrative of the journey; more engaging than flat numbered list | MEDIUM | Use a vertical timeline with a glowing line connecting steps — suits the neon aesthetic perfectly; scroll-triggered draw animation makes it memorable |
| Tech stack section with animated hover glow on logos | Signals technical sophistication; visitors who recognize tools feel confident | LOW | Logos with neon glow on hover; category grouping (Frontend, Backend, Ecommerce, Automation) adds structure |
| "Why GloBuyers" as a contrast/comparison grid | Shows what you do vs. what generic agencies do — binary contrast is highly persuasive | MEDIUM | Two-column layout: "Generic Agency" (red/dim) vs "GloBuyers" (cyan glow); checklist format converts better than prose |
| Process step icons instead of just numbers | Icons help visitors pattern-match faster (magnifying glass = discovery, rocket = launch) | LOW | SVG icons with neon tint; existing icon system in Tailwind can support this |
| Each process step includes time expectation | Reduces anxiety about timeline — one of the biggest objections ecommerce clients have | LOW | "~1 week", "2-4 weeks" — approximate ranges, not commitments; hugely reassuring |
| Tech stack grouped by category | Shows breadth; prevents "do you do X?" questions; positions you as full-service | LOW | Frontend / Ecommerce / Automation / Integrations — 4 groups max |
| Differentiators tied to client outcomes, not internal virtues | "You ship faster" lands better than "We move fast" — visitor-POV framing converts | LOW | Reframe every differentiator: "You get weekly demos" not "We do weekly demos" |
| Subtle scroll-triggered animations on all three sections | Consistent with existing whileInView pattern; creates perceived quality and polish | LOW | Already in the codebase; extend pattern to new sections |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem like good ideas but hurt conversion or create scope/maintenance problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Long-form process descriptions (3+ sentences per step) | Seems thorough and detailed | Visitors skim, not read; walls of text signal insecurity; top agencies use 1 punchy sentence max per step | 1-line description + bullet of outcome; expand only in modal or case study |
| "We use industry-leading tools" generic copy | Sounds professional | Is meaningless noise — every agency says this; no specificity means no trust | Name the actual tools with their logos; specificity is the trust signal |
| Testimonials or case studies in new sections | Adds social proof | Out of scope per PROJECT.md; adds significant content management burden | Keep stats bar as trust mechanism; future phase can add testimonials |
| Interactive process with sub-steps and accordion | Seems comprehensive | Complexity hides the core flow; 4 clear steps beat 12 nested steps | Keep process to 4 steps max; each step has 1 outcome, not a feature list |
| Certifications / partner badges (Shopify Partner, etc.) | Signals authority | Can backfire if not current or if visitor doesn't recognize the badge; creates maintenance burden | Name specific client outcomes tied to the platform instead |
| "Our Values" or "Our Culture" section | Seems to humanize | Ecommerce brand owners hire on capability and proof, not culture; values sections rarely convert | Embed personality through voice/tone in the differentiators; don't add a separate section |
| Real-time stats / live counters | Looks impressive | Requires data infrastructure that doesn't exist; fake/static counters backfire if visitors notice inconsistency | Static, specific stats already in the stats bar are more trustworthy than animated counters |
| Pricing table in differentiators | Visitors sometimes want transparency | Out of scope; pricing is complex for custom software and creates objections before value is established | Use CTA to email for a quote; no pricing on site |
| Photos or imagery of team | Builds human connection | Explicitly out of scope per PROJECT.md; no images policy | Use abstract geometric icons and avatars instead; the aesthetic carries the personality |

---

## Section-Level Specifications

### How We Work Section

**Recommended structure:** Vertical or horizontal 4-step process, numbered, with icon + title + 1-line description + one concrete deliverable per step.

**The 4 steps for GloBuyers:**

| Step | Name | Icon Theme | Description | Deliverable |
|------|------|------------|-------------|-------------|
| 01 | Discovery | Magnifying glass / search | We dig into your store, goals, and technical needs | Scope document + timeline |
| 02 | Build | Code brackets / terminal | We design, develop, and integrate — with weekly updates | Staging environment with demos |
| 03 | Launch | Rocket | Thorough QA, then go live with zero downtime | Live product + handoff docs |
| 04 | Support | Headset / shield | Ongoing monitoring, updates, and direct access | Dedicated support channel |

**Visual treatment:** Vertical timeline preferred (single column, large numbers in neon, connector line between steps). Alternatively, horizontal 4-column grid if viewport allows. Steps animate in from left/right on scroll with `whileInView`.

**Time estimates to include:** Approximate weeks next to each step title reduces client anxiety — this is a low-effort, high-impact trust signal.

### Tech Stack Section

**Recommended structure:** 2 rows of logos OR 4 category columns, displayed on a subtle dark card background with neon border glow. Logos animate on hover (scale + glow pulse).

**Technologies to include by category:**

| Category | Technologies |
|----------|-------------|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Ecommerce | Shopify, Shopify Plus, Shopify APIs |
| Backend / Automation | Node.js, Python, REST APIs, Webhooks |
| Integrations | Klaviyo, Zapier, Stripe, Meta/Google APIs |

**Visual treatment:** Monochrome logos with cyan tint on hover; scrolling marquee (infinite loop) is an acceptable alternative if icon count exceeds 12 — conveys scale without cluttering layout. Marquee is a LOW complexity implementation using CSS animation.

**Why this matters:** Visitors recognize Shopify/React/Next.js and this recognition creates instant confidence. Naming integrations (Klaviyo, Stripe) directly targets the mental questions ecommerce owners already have ("can they connect my email platform?").

### Why GloBuyers Section

**Recommended structure:** Contrast grid — left column "What you get with GloBuyers" vs. implied contrast with generic agencies, OR a 3-4 item feature card grid with bold claim + 1-line explanation.

**Strongest differentiator claims for GloBuyers (from PROJECT.md stats and positioning):**

| Differentiator | Claim | Framing (visitor POV) |
|---------------|-------|----------------------|
| Speed | Fast delivery, not months-long waterfall | "Ship in weeks, not quarters" |
| Reliability | 99.9% uptime stat | "Your store stays live — we keep it that way" |
| Ecommerce-specific | Shopify-native team, not generalists | "We only do ecommerce — we know Shopify deeply" |
| Direct access | No account manager layers | "Talk to the developers, not a middleman" |
| Custom code | Not a plugin-stacker | "Custom-built, not duct-taped together" |

**Visual treatment:** 3-4 large cards on a dark grid background, each with a neon accent icon, bold claim headline (2-4 words), and 1-sentence expansion. Cards animate in with staggered delay on scroll. This mirrors the existing ServiceCard component pattern — low implementation cost.

---

## Feature Dependencies

```
[Process Section]
    └──depends on──> [Anchor navigation working] (scroll to #process)
    └──depends on──> [Framer Motion whileInView] (already in codebase)

[Tech Stack Section]
    └──depends on──> [SVG/PNG logo assets] (must be sourced or created)
    └──depends on──> [Marquee or grid layout component] (new component)

[Why GloBuyers Section]
    └──depends on──> [ServiceCard pattern] (reuse existing or extend)
    └──depends on──> [Icon set decision] (neon SVGs from existing icon library)

[Neon aesthetic push across all sections]
    └──depends on──> [Tailwind CSS custom glow classes] (extend globals.css)
    └──enhances──> [All three new sections]
```

### Dependency Notes

- **Tech Stack logos require sourcing:** SVG logos for Shopify, Next.js, React, Tailwind, Klaviyo, Stripe must be downloaded from official sources (they are freely available and commonly used). This is the only external dependency not already in the codebase.
- **Process section requires no new packages:** Pure Framer Motion + Tailwind, consistent with existing architecture.
- **Why GloBuyers section can reuse ServiceCard:** The existing ServiceCard component is already built for dark card + animated entry; differentiation cards can use the same pattern with different content.

---

## MVP Definition

### Launch With (this milestone)

All three sections are part of this milestone's scope per PROJECT.md. MVP is all three, minimal but complete.

- [ ] "How We Work" — 4 steps, numbered, icon + title + 1-line description + deliverable, scroll-animated
- [ ] "Tech Stack" — 2-row logo grid OR scrolling marquee, 10-14 logos, hover glow effect
- [ ] "Why GloBuyers" — 3-4 differentiator cards, bold claim + 1-sentence explanation, neon icon, scroll-animated
- [ ] All sections connected to anchor navigation from header/hero
- [ ] Neon glow aesthetic consistent with existing hero/services sections

### Defer to Future Milestone

- [ ] Testimonials / client quotes — not in scope per PROJECT.md
- [ ] Case studies with metrics — not in scope per PROJECT.md
- [ ] Interactive process with expanded detail on click — adds complexity without proportional value
- [ ] Pricing transparency — creates premature objections for custom software

---

## Feature Prioritization Matrix

| Feature | Visitor Value | Implementation Cost | Priority |
|---------|--------------|---------------------|----------|
| Process section (4 steps) | HIGH — reduces "black box" anxiety | LOW — Framer Motion + Tailwind only | P1 |
| Differentiators section (3-4 cards) | HIGH — answers "why you vs. others" | LOW — reuses ServiceCard pattern | P1 |
| Tech stack logos with glow | MEDIUM — legitimizes technical claims | LOW — sourcing logos is the main work | P1 |
| Time estimates in process steps | HIGH — reduces timeline anxiety | LOW — pure copy addition | P1 |
| Deliverable listed per process step | HIGH — makes value concrete | LOW — pure copy addition | P1 |
| Animated connector line in process | MEDIUM — visual polish, memorable | MEDIUM — custom SVG or CSS line | P2 |
| Tech stack scrolling marquee | LOW — equivalent to grid visually | LOW — CSS animation only | P2 |
| Hover glow on tech logos | MEDIUM — interactive polish | LOW — Tailwind + Framer hover | P2 |
| Category labels on tech stack | MEDIUM — shows breadth clearly | LOW — pure layout addition | P2 |

---

## Competitor Feature Analysis

Top ecommerce/Shopify agency sites (Conspire, Elkfox, We Make Websites, Lunar) and dark SaaS sites (Linear, Vercel, Railway) were used as reference.

| Feature | Common Agency Pattern | Dark SaaS Pattern | GloBuyers Approach |
|---------|-----------------------|-------------------|--------------------|
| Process section | 4-6 steps, horizontal tabs or vertical timeline | "How it works" with numbered steps + icons | Vertical timeline with neon connector, 4 steps |
| Tech stack | Logo grid, often plain/flat | Animated logo cloud, monochrome, hover glow | Icon grid by category, hover neon pulse |
| Differentiators | "Why us" bullet list or comparison table | Feature cards with bold claims | Dark cards with neon icon + bold claim + 1 sentence |
| Proof in differentiators | Client logos, testimonials | Usage numbers, company logos | Stats already in stats bar; reference in card copy |
| CTA in process/diff sections | "Start a project" button | "Get started free" | "Get in Touch" button linking to #contact |

---

## Sources

- [Shopify: Top 6 Ecommerce Agencies guide](https://www.shopify.com/blog/ecommerce-agency) — MEDIUM confidence (verified, current, specific)
- [Brand Vision: Web Design Agency Process 2026](https://www.brandvm.com/post/web-design-agency-2026) — MEDIUM confidence (current, authoritative on process steps)
- [Marketer Milk: 32 Best SaaS Websites](https://www.marketermilk.com/blog/best-saas-websites) — MEDIUM confidence (curated examples, specific)
- [Huemor: Best Agency Website Designs](https://huemor.rocks/blog/best-agency-website-designs/) — MEDIUM confidence (industry practitioner analysis)
- [Webstacks: Trust Signals](https://www.webstacks.com/blog/trust-signals) — MEDIUM confidence (specific, actionable)
- [Awwwards: Timeline & Process inspiration](https://www.awwwards.com/inspiration/timeline-process-make-it-pop) — MEDIUM confidence (authoritative design showcase)
- [Webflow: Dark SaaS templates](https://brixtemplates.com/templates/dark-mode-saas-tech-webflow-template) — LOW confidence (templates as reference only, not authoritative)
- WebSearch findings throughout — LOW-MEDIUM confidence, cross-referenced across multiple sources

---

*Feature research for: GloBuyers Website — dark neon agency sections milestone*
*Researched: 2026-02-21*
