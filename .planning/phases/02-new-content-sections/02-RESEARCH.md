# Phase 2: New Content Sections - Research

**Researched:** 2026-02-21
**Domain:** React component authoring, Framer Motion scroll-triggered stagger animations, SVG icon libraries
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**How We Work — Layout**
- Horizontal timeline with arrow connectors between steps on desktop
- Steps stack vertically on mobile (no horizontal scroll)
- 4 steps: Discovery → Build → Launch → Support
- Each step has a large number accent and a deliverable description
- Steps animate in sequentially (staggered) as section scrolls into view

**Tech Stack — Content & Display**
- Excluded: make.com, n8n, Zapier, and any commodity automation tools
- Include: Shopify, Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Stripe, Google Analytics (GA4)
- Categories: Frontend (Next.js, React, TypeScript, Tailwind, Framer Motion), Ecommerce (Shopify, Stripe), Analytics (GA4)
- Always-expanded categories (no tabs/filters) — all visible at once
- Badge hover: neon glow effect consistent with site's existing glow style
- Badges animate in with staggered reveal on scroll

**Why GloBuyers — Content & Cards**
- 3 differentiators: Shopify specialists, fast delivery, post-launch support
- Bold short headline + one-sentence visitor-framed expansion per card
- Neon icon accent per card
- Card interactivity: Claude's discretion (match existing ServiceCard pattern)

### Claude's Discretion

- "Why GloBuyers" card hover interaction (static vs subtle hover state)
- Exact background treatments for each section
- Section ordering on the page
- Icon choices for each tech badge and differentiator card

### Deferred Ideas (OUT OF SCOPE)

- Remove Twitter from footer — existing content fix, not Phase 2
- "Digital Commerce" heading text visibility improvement — existing content fix, not Phase 2
- Remove make.com / n8n references from any existing content — existing content fix, not Phase 2
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PROC-01 | New "How We Work" section with 4 steps: Discovery, Build, Launch, Support | Horizontal timeline component pattern using flex/grid with connector lines; stagger via parent variants |
| PROC-02 | Each step shows a brief deliverable description (what happens at that stage, not just a label) | Static data array in component; no special library needed |
| PROC-03 | Process steps animate in sequentially on scroll with staggered reveal | `whileInView="visible"` on parent container + `staggerChildren` in variant transition; `viewport={{ once: true }}` |
| TECH-01 | New "Tech Stack" section displays technologies grouped by category | Category grouping via static data map; always-expanded grid layout |
| TECH-02 | Each technology shown with recognizable icon + name (inline SVG or styled badge — no external image files) | `react-icons` v5.5.0 `Si` set: SiShopify, SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiFramer, SiStripe, SiGoogleanalytics — all confirmed present |
| TECH-03 | Tech stack grid animates in with staggered scroll-triggered reveal | Same parent variants + `staggerChildren` pattern as PROC-03; `viewport={{ once: true }}` |
| DIFF-01 | New "Why GloBuyers" section with 3-4 differentiator cards using visitor-POV framing | New component file; 3 cards with static data; mirror ServiceCard structure |
| DIFF-02 | Each differentiator card has a neon icon, bold short headline (2-4 words), and 1-sentence expansion | Neon icon: styled `motion.div` wrapper on `react-icons` icon; headline + expansion from static data |
| DIFF-03 | Differentiator cards animate in with staggered scroll trigger | Same `whileInView` + `staggerChildren` pattern; `delay: index * 0.1` on child transition |
</phase_requirements>

---

## Summary

Phase 2 adds three new marketing sections to `app/page.tsx`. The phase is entirely self-contained: no new routes, no new dependencies beyond `react-icons`, and no changes to existing components. All three sections follow the existing `whileInView` scroll animation pattern already established in ServiceCard and the Services section.

The dominant technical challenge is the stagger animation pattern: parent container uses Framer Motion variants with `staggerChildren` in the transition config, while children inherit variant names and animate individually. The `whileInView="visible"` prop on the parent container triggers the entire sequence when the section scrolls into view. This pattern is verified against the existing codebase's Phase 1 approach.

For tech icons, `react-icons` v5.5.0 provides the `Si` (Simple Icons) set with confirmed availability of every required brand icon. Icons render as inline React components — no external image files, no SVG file assets. This directly satisfies TECH-02's "inline SVG or styled badge — no external image files" requirement.

**Primary recommendation:** Three new section components (`HowWeWorkSection`, `TechStackSection`, `WhyGloBuyersSection`), each in `components/`, imported into `app/page.tsx`. Install `react-icons@5.5.0` as the only new dependency. Use Framer Motion variants with `whileInView` + `staggerChildren` for all three sections.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | ^12.34.0 (already installed) | Scroll-triggered stagger animations | Already in project; Phase 1 uses `whileInView` pattern |
| react-icons | 5.5.0 | Inline SVG brand icons for tech stack badges | Contains all required Si icons; tree-shakable; zero external assets |
| tailwindcss | ^4 (already installed) | Layout, spacing, responsive breakpoints | Already in project |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| No additional libraries needed | — | — | All three sections can be built with existing stack |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-icons/si | Hand-written inline SVG JSX | react-icons gives correct brand colors and shapes; hand-rolling wastes time and risks inaccurate logos |
| react-icons/si | @icons-pack/react-simple-icons | Both wrap the same Simple Icons set; react-icons is already the standard recommendation, no reason to add a second package |
| react-icons/si | Lucide-react | Lucide has no brand/tech icons (Shopify, Stripe, etc.); wrong tool for this use case |

**Installation:**
```bash
npm install react-icons
```

---

## Architecture Patterns

### Recommended Project Structure

```
components/
├── HowWeWorkSection.tsx     # 4-step process timeline
├── TechStackSection.tsx     # Badge grid grouped by category
└── WhyGloBuyersSection.tsx  # 3 differentiator cards

app/
└── page.tsx                 # Import and place the 3 new sections
```

All three are new component files. Each is a `"use client"` component with its own static data and animation variants. They are imported once into `app/page.tsx` after the Services section (or in the order chosen during planning).

### Pattern 1: Stagger on Scroll (whileInView + variants)

**What:** Parent `motion.div` holds `staggerChildren` in its variant transition. Children inherit variant names and each starts its animation delayed by `staggerChildren * index` seconds.
**When to use:** Whenever 3+ items need to animate in sequentially as a group scrolls into view.

```tsx
// Source: verified against existing ServiceCard pattern + framer-motion community docs
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// Usage in JSX:
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {/* item content */}
    </motion.div>
  ))}
</motion.div>
```

This matches the existing Phase 1 pattern in `ServiceCard.tsx`:
```tsx
// ServiceCard.tsx — existing project pattern
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5, delay: index * 0.1 }}
viewport={{ once: true }}
```

The variants approach (containerVariants + itemVariants) is preferred for 3+ items because `staggerChildren` is automatic — no manual `delay: index * 0.1` calculation needed on each child.

### Pattern 2: Horizontal Timeline (How We Work)

**What:** Flexbox row on desktop with `flex-1` steps and an SVG arrow connector between them. On mobile, `flex-col` with no connector (or simplified vertical flow).
**When to use:** Exactly this section — 4 numbered process steps.

```tsx
// Desktop: flex row, dividers between
<div className="flex flex-col md:flex-row items-start gap-0">
  {steps.map((step, i) => (
    <React.Fragment key={i}>
      <div className="flex-1 ...">
        {/* step content: number, title, description */}
      </div>
      {i < steps.length - 1 && (
        // Arrow connector — hidden on mobile
        <div className="hidden md:flex items-center text-primary/40 text-2xl px-2 self-center">
          ──▶
        </div>
      )}
    </React.Fragment>
  ))}
</div>
```

The user specified `──▶` style connectors. A simple text or SVG element between flex items works. The connector must be `hidden` on mobile, `flex` on md+.

### Pattern 3: Tech Stack Badge

**What:** Inline `react-icons` `Si` icon + text name in a pill/badge. Hover applies `neon-glow-cyan` (existing `@utility` in globals.css).
**When to use:** Each technology entry in TechStackSection.

```tsx
import { SiShopify, SiNextdotjs } from "react-icons/si";

// Badge component:
<motion.div
  variants={itemVariants}
  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10
             hover:border-primary/40 hover:neon-glow-cyan transition-all duration-300 cursor-default"
>
  <SiShopify className="text-primary text-lg flex-shrink-0" />
  <span className="text-sm font-medium text-gray-300">Shopify</span>
</motion.div>
```

The `neon-glow-cyan` utility is already defined in `globals.css` as `@utility neon-glow-cyan`. It supports `hover:` variants because Tailwind v4 `@utility` declarations get Tailwind variant prefixes (established in Phase 1 decision log).

### Pattern 4: Why GloBuyers Card (ServiceCard-mirrored)

**What:** Matches `ServiceCard`'s visual structure — glass background, border, neon hover glow. Uses a `react-icons` icon styled with neon color, a 2-4 word headline, and a 1-sentence expansion.
**When to use:** The 3 differentiator cards.

The user gave Claude's discretion on hover interaction. Recommendation: apply the same `hover:neon-glow-cyan` + `hover:border-primary/40` as ServiceCard, but omit the SpotlightCard cursor-tracking effect (that's a ServiceCard-specific premium feature; simpler cards read well here).

```tsx
<motion.div
  variants={itemVariants}
  className="relative p-8 rounded-3xl bg-white/[0.03] border border-white/10
             hover:border-primary/40 hover:neon-glow-cyan transition-all duration-300"
>
  <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 w-fit">
    <IconComponent className="text-primary text-2xl" />
  </div>
  <h3 className="text-xl font-bold text-white mb-2">{headline}</h3>
  <p className="text-gray-400 text-sm leading-relaxed">{expansion}</p>
</motion.div>
```

### Anti-Patterns to Avoid

- **`whileHover` inside staggered children:** Known framer-motion bug where `whileHover` on a child disrupts staggerChildren timing. For badge hover, use CSS hover (Tailwind `hover:` classes) not `whileHover` prop. Confirmed impacting framer-motion issue #908.
- **`animate="visible"` without `initial="hidden"` on container:** Without `initial`, items flash to visible on first render then snap to the whileInView state. Always set both on the parent.
- **`viewport={{ once: false }}`:** Causes re-animation every scroll-through; site uses `once: true` consistently (verified in ServiceCard.tsx).
- **`Math.random()` in render body for icon colors:** Project already flagged this (Phase 1 decision: `Math.random()` must live in `useEffect`). Not needed here, but worth remembering if accent colors vary.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Brand tech icons | Custom SVG JSX per icon | `react-icons/si` | Correct brand colors, standardized sizing, tree-shakable |
| Stagger delay calculation | `delay: index * 0.1` on each child | Framer Motion `staggerChildren` in parent variant | Automatic, clean, no off-by-one issues |
| Responsive timeline collapse | JS-based show/hide | Tailwind `hidden md:flex` | Zero JS, correct behavior, simpler |

**Key insight:** All three sections are pure layout + animation — no state management, no API calls, no complex logic. The risk is over-engineering. Keep data as static arrays, keep animation as variants.

---

## Common Pitfalls

### Pitfall 1: whileHover Disables staggerChildren

**What goes wrong:** Adding `whileHover={...}` to child items inside a `staggerChildren` container causes the stagger to not fire — all children animate simultaneously.
**Why it happens:** Framer Motion issue #908 — whileHover on children interferes with parent-orchestrated stagger timing.
**How to avoid:** Use CSS Tailwind hover classes (`hover:neon-glow-cyan`, `hover:border-primary/40`) for badge/card hover effects. Do not use `whileHover` prop on staggered children.
**Warning signs:** Items all appear at the same time instead of sequentially.

### Pitfall 2: Variant Names Must Match Exactly

**What goes wrong:** Parent uses `initial="hidden" whileInView="visible"` but child variants have different keys (e.g., `"show"`/`"hide"`).
**Why it happens:** Framer Motion variant propagation requires parent and child to use identical string names.
**How to avoid:** Define `containerVariants` and `itemVariants` using the same keys (`"hidden"` and `"visible"`). Children only need `variants={itemVariants}` — they inherit the parent's `initial`/`whileInView` state automatically.
**Warning signs:** Children don't animate at all, or animate on first render only.

### Pitfall 3: Connector Arrows Flex-Shrinking

**What goes wrong:** On medium screens, the `──▶` connector arrows between timeline steps get flex-squeezed and wrapped, breaking the horizontal layout.
**Why it happens:** Flex children shrink by default.
**How to avoid:** Apply `flex-shrink-0` to the connector elements. Apply `flex-1 min-w-0` to step cards.
**Warning signs:** Layout looks broken at 768px viewport.

### Pitfall 4: react-icons Breaking Change (v4 → v5)

**What goes wrong:** Importing from `react-icons/si` in v5 requires ES module-style imports. CommonJS default imports don't work.
**Why it happens:** react-icons v5 dropped CJS default exports; all icons must be named imports.
**How to avoid:** Always use named imports: `import { SiShopify } from "react-icons/si"`. This is already the standard pattern.
**Warning signs:** TypeScript error "does not contain a default export" or runtime `undefined` icon.

### Pitfall 5: SVG Icon Color Requires className or style, Not fill

**What goes wrong:** Trying to color `react-icons` Si icons with Tailwind `text-primary` or `fill-primary` — one may not work.
**Why it happens:** React Icons renders icons with `fill="currentColor"` by default. `text-primary` sets `color` CSS property which becomes `currentColor` for SVG. `fill-primary` in Tailwind v4 may not be defined.
**How to avoid:** Use `className="text-primary"` (sets `color` → `currentColor` → SVG fill). Alternatively use inline `style={{ color: '#0EA5E9' }}`.
**Warning signs:** Icons appear white/black instead of cyan.

---

## Code Examples

Verified patterns from project + framer-motion documentation:

### Section Wrapper with Stagger Reveal

```tsx
// Source: Derived from existing ServiceCard.tsx pattern + framer-motion community verified pattern
"use client";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ExampleSection() {
  return (
    <section className="py-32">
      {/* Section heading — its own whileInView, not part of stagger group */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-20"
      >
        <h2 className="text-4xl font-bold text-neon-white">Section Heading</h2>
      </motion.div>

      {/* Stagger container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {items.map((item, i) => (
          <motion.div key={i} variants={itemVariants}>
            {/* item content — NO whileHover on this element */}
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

### Tech Badge with react-icons

```tsx
// Source: react-icons v5 documentation + project globals.css utilities
import { SiShopify } from "react-icons/si";

<motion.div
  variants={itemVariants}
  className="flex items-center gap-2 px-4 py-2 rounded-full
             bg-white/5 border border-white/10
             hover:border-primary/40 hover:neon-glow-cyan
             transition-all duration-300 cursor-default"
>
  <SiShopify className="text-primary text-lg flex-shrink-0" />
  <span className="text-sm font-medium text-gray-300">Shopify</span>
</motion.div>
```

### Section Heading Pattern (Matching Existing Services Section)

```tsx
// Source: app/page.tsx existing Services section pattern
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="mb-20 max-w-2xl"
>
  <h2 className="text-4xl md:text-5xl font-bold mb-6 text-neon-white">
    Section Title
  </h2>
  <div className="h-1 w-20 bg-primary mb-6" />
  <p className="text-xl text-gray-400">
    Section subtitle copy.
  </p>
</motion.div>
```

---

## Confirmed Icon Map

Verified present in `react-icons` v5.5.0 `Si` set (confirmed via local install check):

| Technology | Icon Name | Import |
|------------|-----------|--------|
| Shopify | `SiShopify` | `react-icons/si` |
| Next.js | `SiNextdotjs` | `react-icons/si` |
| React | `SiReact` | `react-icons/si` |
| TypeScript | `SiTypescript` | `react-icons/si` |
| Tailwind CSS | `SiTailwindcss` | `react-icons/si` |
| Framer Motion | `SiFramer` | `react-icons/si` |
| Stripe | `SiStripe` | `react-icons/si` |
| Google Analytics (GA4) | `SiGoogleanalytics` | `react-icons/si` |

Note: `SiFramermotion` does NOT exist. Use `SiFramer`.

---

## Section Order Recommendation (Claude's Discretion)

The user left section ordering to Claude's discretion. Recommended order after Services:

1. **How We Work** — Builds trust by showing process; answers "how does this actually work?"
2. **Tech Stack** — Reinforces credibility after the "how"; shows the tools behind the process
3. **Why GloBuyers** — Closing argument before Contact; addresses "why you vs. anyone else?"

This creates a narrative arc: process → tools → differentiation → contact.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `delay: index * 0.1` on each child | `staggerChildren` on parent variant | framer-motion v3+ | Cleaner code, no manual index math |
| External icon font files (Font Awesome CDN) | Inline SVG via react-icons named imports | react ecosystem ~2020+ | Zero network request, tree-shakable, no render blocking |
| Tabs/filters for tech categories | Always-expanded grid | Project decision | No interaction required; all content visible |

**Deprecated/outdated:**
- `<img src="shopify-logo.png">` style tech stack icons: Out of scope per project requirements ("no external image files")
- `whileHover` on staggered children: Known bug, use CSS hover instead

---

## Open Questions

1. **Process step copy (deliverable descriptions)**
   - What we know: Steps are Discovery, Build, Launch, Support
   - What's unclear: Exact deliverable descriptions for each step — these need to match actual GloBuyers service delivery
   - Recommendation: Planner should include placeholder copy and flag for content owner review (same pattern as capability bullets in Phase 1)

2. **Differentiator card icon selection**
   - What we know: 3 cards — Shopify specialists, fast delivery, post-launch support
   - What's unclear: Which specific icons from react-icons best represent these (user left to Claude's discretion)
   - Recommendation: Use `SiShopify` for Shopify card; `FiZap` or `SiRocket` equivalent for speed; `SiHeadset` or similar for support. Planner should specify exact icon in plan or leave as implementation detail.
   - Note: Differentiator cards may use non-Si icons (e.g., Feather, Heroicons via react-icons) since they represent concepts, not brands.

3. **Background treatment for each section**
   - What we know: User left to Claude's discretion
   - What's unclear: Should sections alternate background tones or match the existing `bg-white/[0.02]` pattern?
   - Recommendation: Match existing pattern — How We Work uses `bg-background`, Tech Stack uses `bg-white/[0.02]` (alternate subtle tint), Why GloBuyers uses `bg-background`. Mirrors the current Services → Stats section alternation.

---

## Sources

### Primary (HIGH confidence)

- `/Users/Farhan/Documents/Personal/GloBuyers/Website/components/ServiceCard.tsx` — Existing `whileInView` + `viewport={{ once: true }}` pattern in this project
- `/Users/Farhan/Documents/Personal/GloBuyers/Website/app/globals.css` — Confirmed `neon-glow-cyan`, `neon-glow-purple`, `text-neon-white` utilities with `@utility` syntax
- `/Users/Farhan/Documents/Personal/GloBuyers/Website/package.json` — framer-motion ^12.34.0, Next.js 16.1.6, React 19.2.3, Tailwind v4 confirmed
- `/tmp/react-icons-check/node_modules/react-icons` — Installed v5.5.0 locally; confirmed all 8 Si icons present via `node -e` inspection

### Secondary (MEDIUM confidence)

- framer-motion stagger + whileInView pattern: Verified against multiple community sources (framerbook.com, nirajankhatiwada.com.np) consistent with existing project code
- react-icons v5 named import requirement: npm package inspection + official site confirms v5.5.0 is latest stable

### Tertiary (LOW confidence)

- framer-motion issue #908 (whileHover + staggerChildren conflict): GitHub issue — older report, may be resolved in v12; workaround (use CSS hover) is safe regardless
- Section ordering recommendation: Claude's discretion item; narrative logic not externally validated

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — installed packages confirmed, icon names verified via local install
- Architecture: HIGH — patterns verified against existing project code and framer-motion docs
- Pitfalls: MEDIUM — whileHover/stagger bug is older but workaround (CSS hover) is safe regardless of fix status

**Research date:** 2026-02-21
**Valid until:** 2026-03-23 (stable libraries; 30-day window)
