# Project Research Summary

**Project:** GloBuyers Website — Dark Neon Aesthetic Enhancement + New Sections
**Domain:** Dark neon digital commerce agency marketing site (Next.js + Framer Motion)
**Researched:** 2026-02-21
**Confidence:** HIGH

## Executive Summary

GloBuyers is a Shopify and custom software agency whose marketing site already has a correct dark neon foundation — Next.js 16, React 19, Framer Motion 12, Tailwind CSS 4, TypeScript 5 — but needs three new content sections ("How We Work", "Tech Stack", "Why GloBuyers") and a significant visual intensity upgrade to its existing neon aesthetic. Research across all four areas converges on one clear finding: the existing architecture and techniques are the right approach, and the improvement path is intensification and extension of what is already there, not replacement. No new core dependencies are required. The entire milestone is achievable purely with CSS upgrades, new Framer Motion technique patterns, and new section components that follow the established conventions.

The recommended approach has two parallel tracks that must be sequenced carefully. First, establish baseline improvements that affect the entire codebase before adding new sections: add `MotionConfig reducedMotion="user"` to `layout.tsx` (accessibility, currently missing), upgrade `.glass-card` and `.text-glow` CSS classes, and implement the `SpotlightCard` hover pattern. Second, build three new section components in `components/sections/` following the self-contained section pattern — each component owns its own data, animation variants, and `whileInView` logic, making `app/page.tsx` a clean composition file. ProcessSection first (establishes the directory and pattern), then TechStackSection (requires sourcing SVG logos — the only external dependency), then DifferentiatorsSection.

The primary risks are performance and accessibility, not feature scope. The existing codebase has no `prefers-reduced-motion` support (a confirmed WCAG 2.1 gap), infinite animations running off-screen (confirmed CPU drain), and the danger of accumulating too many `backdrop-filter` elements as new glass cards are added. These are not blocking issues — each has a straightforward fix documented in PITFALLS.md — but they must be addressed in the first phase, not deferred to the end. Visual discipline is equally important: the neon glow aesthetic only works when glow is scarce. The design rule is one dominant glowing element per visible viewport at any time.

---

## Key Findings

### Recommended Stack

The existing stack requires no changes. All 10 visual techniques identified in STACK.md are implementable using Framer Motion 12, Tailwind CSS 4 arbitrary values, and native CSS — no new packages. The upgrade path in priority order: layered `box-shadow` neon glow via Tailwind arbitrary values (highest impact, lowest risk), `SpotlightCard` hover via `useMotionValue`/`useMotionTemplate` (proven recipe from official sources), three-layer `text-shadow` upgrade, `@property` + `conic-gradient` animated border, staggered section reveals, and `MotionConfig reducedMotion="user"` in layout. The CSS `@property` technique for animated gradient borders has ~95% browser coverage (Chrome 85+, Firefox 120+, Safari 16.4+) and is GPU-accelerated.

**Core technologies and their roles:**
- **Framer Motion 12.34.0:** `useMotionValue` + `useMotionTemplate` for spotlight hover; `variants` + `staggerChildren` for scroll-triggered cascades; `useInView` for pausing infinite animations off-screen; `MotionConfig` for reduced-motion compliance
- **Tailwind CSS v4:** `@theme` directive for defining reusable `--shadow-glow-*` tokens; arbitrary shadow syntax `shadow-[...]` for multi-layer neon glow; `@property` support for animated conic-gradient borders
- **CSS `@property`:** Enables smooth rotation of gradient angle variable — runs on compositor thread, zero JavaScript, safe for 10-15 cards simultaneously
- **Next.js 16 / React 19:** All new section components require `"use client"` directive (Framer Motion requirement); `Math.random()` must be deferred to `useEffect` to avoid Next.js 16 hydration hard errors

### Expected Features

The three new sections represent the complete feature scope for this milestone. All are P1 — they deliver the core trust-building content that converts agency site visitors into leads. The two highest-impact copy decisions are: including deliverables per process step (makes value concrete) and including approximate time estimates per step (reduces timeline anxiety, the most common client objection).

**Must have (table stakes):**
- 4-step "How We Work" section — numbered, icon + title + 1-line description + deliverable per step (Discovery, Build, Launch, Support)
- "Tech Stack" logo/name grid grouped by category — Frontend, Ecommerce, Backend, Integrations
- "Why GloBuyers" differentiator cards — 3-4 bold claims with 1-sentence visitor-POV framing
- Time estimates (approximate weeks) on each process step
- Anchor navigation from header/hero to all new sections
- Scroll-triggered stagger animations consistent with existing `whileInView` pattern

**Should have (competitive differentiators):**
- Vertical timeline with glowing connector line between process steps (memorable, suits neon aesthetic)
- Tech stack logos with neon glow on hover (signals technical sophistication)
- Contrast framing in differentiators: visitor-outcome language ("you ship in weeks") not internal virtue language ("we move fast")
- Category labels on tech stack (shows full-service breadth, prevents "do you do X?" questions)

**Defer to future milestone:**
- Testimonials and case studies (explicitly out of scope per PROJECT.md)
- Interactive process with expanded sub-step detail
- Pricing transparency (creates premature objections for custom software)
- "Our Values" or "Our Culture" section (does not convert ecommerce brand owners)

### Architecture Approach

The architectural pattern is straightforward and already implied by the existing codebase: extract each new section into its own `"use client"` component in a new `components/sections/` subdirectory. Each section is fully self-contained — it owns its content arrays, animation variants, and `whileInView` triggers. It accepts no animation props from `app/page.tsx`. The page file becomes a clean composition index under ~100 lines. The hero section stays inline because it uses page-level `scrollYProgress` motion values.

**Major components:**
1. **`app/page.tsx`** — Composition only. Imports sections, owns hero scroll transform (`useScroll`/`useTransform`), stays under 100 lines
2. **`components/sections/ProcessSection.tsx`** — NEW. 4 process steps, stagger-via-variants, establishes the `sections/` directory pattern
3. **`components/sections/TechStackSection.tsx`** — NEW. Logo grid by category (4 groups, 10-14 logos), hover glow, stagger reveal
4. **`components/sections/DifferentiatorsSection.tsx`** — NEW. 3-4 differentiator cards reusing ServiceCard visual pattern
5. **Shared components** (`GradientOrb`, `AnimatedText`, `GlowButton`) — unchanged; can be composed into new sections where appropriate

**Key patterns to follow:**
- Stagger via variants (parent container carries `staggerChildren`, children carry only `variants={itemVariants}` — no mixing with direct `initial`/`animate` props)
- `viewport={{ once: true, amount: 0.2 }}` on every `whileInView` — project-wide rule
- Two-phase section reveal: heading animates independently, then content grid staggers separately (prevents waiting for full section to be visible)
- `useScroll` reserved for hero only — all other sections use `whileInView` (Intersection Observer, not scroll listener)

### Critical Pitfalls

1. **Animated `box-shadow`/`filter` triggers repaints** — Never animate `boxShadow` or `filter` via Framer Motion's `animate`/`whileHover`. Use CSS `transition-shadow` via Tailwind `hover:shadow-[...]` classes. Framer Motion `whileHover={{ boxShadow }}` causes paint on every frame; this is the most common performance mistake in neon UIs.

2. **`backdrop-filter` accumulation across sections** — The header already consumes one "slot." Budget only 1-2 more `backdrop-filter` elements across the visible viewport. New section cards default to semi-transparent background without `backdrop-filter`; reserve it for the single most prominent element per section. Mobile Safari is the critical failure mode.

3. **`Math.random()` in render body causes hydration hard errors** — Next.js 16 treats this as a hard error (white-screen). All procedurally-generated values (particles, star positions) must live inside `useEffect`. Use `dynamic(() => import('./Component'), { ssr: false })` as a safe default for any new animated component with procedural generation.

4. **Infinite animations running off-screen drain CPU/battery** — `FloatingParticles` and `GradientOrb` run infinite loops even when scrolled off-screen. Fix: wrap with `useInView` from Framer Motion and conditionally set `animate` to `false` when not in view. Establish this pattern in Phase 1 before adding more infinite animations.

5. **Missing `prefers-reduced-motion` support** — Currently confirmed absent in the codebase (noted in CONCERNS.md). Add `MotionConfig reducedMotion="user"` to `app/layout.tsx` and `useReducedMotion()` checks in `FloatingParticles`. This is a WCAG 2.1 AA issue. Must be in Phase 1, not retrofitted.

---

## Implications for Roadmap

Based on combined research, three phases are the correct structure. Phase 1 establishes baseline correctness (accessibility + performance foundations + visual upgrades to existing components). Phases 2 and 3 build the new sections in dependency order. This sequencing is required because new sections inherit the visual and animation patterns — building them before the patterns are upgraded would mean retrofitting the upgrades into every new section later.

### Phase 1: Baseline + Aesthetic Upgrade

**Rationale:** Two confirmed gaps in the existing codebase must be closed before adding more animation complexity: no `prefers-reduced-motion` support, and infinite animations running off-screen. These compound as new sections add more animated elements. Simultaneously, upgrading the existing CSS (`.glass-card`, `.text-glow`, `.cyber-grid`) and implementing `SpotlightCard` gives new sections a higher-fidelity visual baseline to inherit.

**Delivers:** Accessibility compliance, performance baseline, upgraded visual vocabulary for all subsequent sections

**Specific work:**
- Add `MotionConfig reducedMotion="user"` to `app/layout.tsx`
- Add `useReducedMotion()` check to `FloatingParticles` (returns null when true)
- Add `useInView` pause logic to `FloatingParticles` and `GradientOrb` (stop infinite loops off-screen)
- Upgrade `.glass-card` CSS: add `saturate(1.5)`, stronger border tint
- Upgrade `.text-glow` to three-layer `text-shadow`
- Define `--shadow-glow-*` tokens in `@theme` block
- Implement `SpotlightCard` component (useMotionValue + useMotionTemplate spotlight hover)
- Upgrade `GlowButton` and `ServiceCard` with layered box-shadow via CSS hover classes
- Enhance `.cyber-grid` CSS for crisper grid lines

**Avoids:** WCAG violation (Pitfall 9), CPU drain from off-screen animations (Pitfall 4), animated box-shadow performance trap (Pitfall 1)

**Research flag:** SKIP — all patterns are well-documented with verified code samples in STACK.md and PITFALLS.md.

---

### Phase 2: New Content Sections

**Rationale:** ProcessSection is built first because it establishes the `components/sections/` directory and the self-contained section component pattern. TechStackSection and DifferentiatorsSection follow the same pattern. TechStackSection requires sourcing SVG logos (Shopify, Next.js, React, Tailwind, Klaviyo, Stripe) — the only external dependency in the entire milestone. Building all three sections in one phase keeps page.tsx reorganization as a single atomic change.

**Delivers:** Three complete marketing sections ("How We Work", "Tech Stack", "Why GloBuyers"), anchor navigation to all sections, page.tsx refactored to clean composition under ~100 lines

**Specific work:**
- Create `components/sections/` subdirectory
- Build `ProcessSection.tsx` — 4 steps, stagger-via-variants, vertical layout with neon number accent, deliverable and time estimate per step
- Source SVG logos for 10-14 technologies (Shopify, Next.js, React, TypeScript, Tailwind, Node.js, Klaviyo, Stripe, etc.)
- Build `TechStackSection.tsx` — 4-category grid (Frontend/Ecommerce/Backend/Integrations), hover glow on logos
- Build `DifferentiatorsSection.tsx` — 3-4 cards with bold claim + visitor-POV framing + neon icon accent
- Wire anchor IDs (`#process`, `#stack`, `#why`) and update header navigation
- Integrate `GradientOrb` into `DifferentiatorsSection` for atmospheric depth

**Implements:** Self-contained section pattern, stagger-via-variants, two-phase section reveal, `viewport={{ once: true, amount: 0.2 }}`

**Avoids:** `backdrop-filter` accumulation (limit glass cards per section, Pitfall 2), stagger animations all firing on load (use `whileInView` not `animate`, Pitfall 8), neon glow overuse (one dominant glow per viewport, Pitfall 5)

**Research flag:** SKIP for ProcessSection and DifferentiatorsSection (standard Framer Motion patterns, verified architecture). LIGHT RESEARCH for TechStackSection if a scrolling marquee is chosen over a static grid (CSS marquee animation is simple but has a few implementation variants to evaluate).

---

### Phase 3: Visual Polish + Animated Border Accents

**Rationale:** The animated gradient border (`@property` + `conic-gradient`) and gradient orb intensity upgrades are deferred to Phase 3 because they are enhancements, not foundations. Building them after the sections are complete allows targeted placement decisions — e.g., the animated border on the contact CTA card specifically, not sprayed across all cards. Particle system expansion (20 to 35 particles, color variety) is also here because it should be calibrated against the full page's performance budget, not added in isolation.

**Delivers:** Maximum neon aesthetic intensity — animated border accent, intensified gradient orbs, expanded particle system, hero text glow pulse

**Specific work:**
- Add `@property --border-angle` and `neon-border` CSS class to `globals.css`
- Apply animated border to contact CTA card or one hero accent element
- Upgrade `GradientOrb` opacity from 0.20 to 0.35 baseline
- Add scroll-linked parallax to hero orbs (`useTransform(scrollY, ...)`)
- Expand `FloatingParticles`: 20 to 35 particles, add purple/pink color variants, horizontal drift
- Add pulsing `textShadow` animation to hero headline (one element max)
- Final performance audit: DevTools CPU throttle 4x, Safari `backdrop-filter` test, axe-core contrast check

**Avoids:** `will-change` overuse (apply only to continuously animating elements, Pitfall 12), particle count ceiling at 35 (Pitfall 9 tech debt note), animated gradient border conflicting with Tailwind `border-*` utilities (Pitfall 3 — use `neon-border` CSS class, not Tailwind border utilities on same element)

**Research flag:** SKIP — all techniques have verified implementations in STACK.md with working code samples.

---

### Phase Ordering Rationale

- **Accessibility before content:** Phase 1 closes WCAG gaps before Phase 2 adds more animated components that would need the same fixes
- **Pattern before instances:** ProcessSection (Phase 2, first) establishes the section component pattern that TechStack and Differentiators follow — building one first prevents three separate approaches emerging
- **Content before polish:** Polish effects (Phase 3) are applied with knowledge of the full page layout, preventing over-concentration of effects in any area
- **Logo sourcing is the only external dependency:** TechStackSection logo assets must be sourced before that section can be built — this is the one task that cannot be parallelized with code work

### Research Flags

Phases needing deeper research during planning:
- **None identified.** All three phases use documented patterns with verified code samples. No experimental APIs, no undocumented integrations, no third-party services requiring API research.

Phases with standard patterns (skip research-phase):
- **Phase 1, Phase 2, Phase 3:** All techniques are verified against official Motion docs, Tailwind v4 official blog, and MDN. The existing codebase confirms the patterns work in this exact stack version.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All 10 techniques verified against official sources (motion.dev, tailwindcss.com/blog, MDN). Version compatibility confirmed for framer-motion 12.34.0 + Tailwind v4 + Next.js 16 + React 19. No experimental or community-only patterns. |
| Features | MEDIUM | Feature research based on competitor analysis and agency site pattern research — solid industry consensus but no single canonical spec. Section structure recommendations are well-grounded; specific copy (process step descriptions, differentiator claims) will need content validation with stakeholder. |
| Architecture | HIGH | Based on direct codebase analysis of the existing project files plus official Framer Motion and Next.js documentation. The self-contained section pattern is confirmed by the existing `ServiceCard` usage. |
| Pitfalls | HIGH | Performance claims verified against official Motion docs, Next.js hydration error docs, and MDN. Accessibility claims verified against WCAG 2.1 specification and official Framer Motion accessibility docs. Existing codebase confirms the `prefers-reduced-motion` gap is real. |

**Overall confidence:** HIGH

### Gaps to Address

- **SVG logo assets for TechStackSection:** Logos for Shopify, Next.js, React, TypeScript, Tailwind CSS, Node.js, Klaviyo, Stripe, and others must be sourced from official brand asset pages before TechStackSection can be built. These are freely available but require a sourcing step. Confirm license terms for each logo (all are standard "free to use in context of the technology" licenses).

- **Process step copy finalization:** The four-step structure (Discovery, Build, Launch, Support) and the deliverable per step are research recommendations. The specific wording, time estimates, and deliverable descriptions need stakeholder validation against actual GloBuyers service delivery to ensure they match what is actually offered.

- **Animated connector line in ProcessSection:** Research identifies this as a P2 feature (medium complexity, medium visitor value). A CSS/SVG vertical connector line between process steps is straightforward but requires design judgment on exact treatment. Flag during Phase 2 planning.

- **Bento grid height for expanded ServiceCard content:** PITFALLS.md identifies that `auto-rows-[300px]` clips content if service card descriptions are added. If PROJECT.md requires adding capability bullets to existing service cards, this must be resolved before or during Phase 2 (service card enhancement is a dependency).

---

## Sources

### Primary (HIGH confidence)
- [Motion (Framer Motion) Official Docs](https://motion.dev/docs/react-animation) — animation API, `useMotionValue`, `useMotionTemplate`, `MotionConfig`, `useInView`, stagger patterns
- [Motion accessibility docs](https://motion.dev/docs/react-motion-config) — `reducedMotion="user"` implementation
- [Tailwind CSS v4 Official Blog](https://tailwindcss.com/blog/tailwindcss-v4) — `@theme`, `@property`, `color-mix()`, arbitrary shadow syntax
- [buildui.com Spotlight recipe](https://buildui.com/recipes/spotlight) — `useMotionValue` + `useMotionTemplate` spotlight pattern
- [codetv.dev — Animated CSS gradient borders](https://codetv.dev/blog/animated-css-gradient-border) — `@property` + `conic-gradient` animated border, border-radius compatibility
- [Next.js hydration error docs](https://nextjs.org/docs/messages/react-hydration-error) — `Math.random()` in SSR guidance
- [Next.js next-prerender-random-client](https://nextjs.org/docs/messages/next-prerender-random-client) — Next.js 16 specific `Math.random()` hard error
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — accessibility media query
- [MDN — backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter) — browser support and compositing behavior
- [WebAIM Contrast Checker](https://webaim.org/articles/contrast/) — WCAG contrast ratios
- Direct codebase analysis — `app/page.tsx`, all `components/*.tsx` (confirmed existing patterns)

### Secondary (MEDIUM confidence)
- [Shopify: Top Ecommerce Agencies](https://www.shopify.com/blog/ecommerce-agency) — agency site feature expectations
- [Brand Vision: Web Design Agency Process 2026](https://www.brandvm.com/post/web-design-agency-2026) — process section patterns
- [Marketer Milk: 32 Best SaaS Websites](https://www.marketermilk.com/blog/best-saas-websites) — dark SaaS visual patterns
- [Huemor: Best Agency Website Designs](https://huemor.rocks/blog/best-agency-website-designs/) — agency site structure analysis
- [Pope Tech Blog — Accessible animation 2025](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) — WCAG 2.3.3 guidance
- [CSS GPU Acceleration: will-change guide (2025)](https://www.lexo.ch/blog/2025/01/boost-css-performance-with-will-change-and-transform-translate3d-why-gpu-acceleration-matters/) — `will-change` overuse consequences

### Tertiary (LOW confidence)
- [Webflow dark SaaS templates](https://brixtemplates.com/templates/dark-mode-saas-tech-webflow-template) — visual reference only
- [Dark Glassmorphism UI Design 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f) — trend analysis, partially paywalled

---

*Research completed: 2026-02-21*
*Ready for roadmap: yes*
