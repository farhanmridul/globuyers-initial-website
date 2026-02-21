# Architecture Research

**Domain:** Single-page agency marketing site with scroll animation sections
**Researched:** 2026-02-21
**Confidence:** HIGH (based on direct codebase analysis + verified Framer Motion docs)

---

## Standard Architecture

### System Overview

```
app/page.tsx  (Composition Only — no animation logic, no JSX markup beyond section imports)
    │
    ├── HeroSection            (existing, inline in page.tsx — leave as-is)
    │
    ├── ServicesSection        (existing, inline — refactor candidate later)
    │
    ├── ProcessSection         (NEW — components/sections/ProcessSection.tsx)
    │
    ├── TechStackSection       (NEW — components/sections/TechStackSection.tsx)
    │
    ├── DifferentiatorsSection (NEW — components/sections/DifferentiatorsSection.tsx)
    │
    ├── StatsSection           (existing, inline — leave as-is, small)
    │
    └── ContactSection         (existing, inline — leave as-is)

components/
    ├── AnimatedText.tsx        (existing, shared)
    ├── GlowButton.tsx          (existing, shared)
    ├── GradientOrb.tsx         (existing, shared)
    ├── FloatingParticles.tsx   (existing, shared)
    ├── ServiceCard.tsx         (existing, shared)
    └── sections/               (NEW subdirectory for full-section components)
        ├── ProcessSection.tsx
        ├── TechStackSection.tsx
        └── DifferentiatorsSection.tsx
```

### Component Responsibilities

| Component | Responsibility | Animation Owner |
|-----------|----------------|-----------------|
| `app/page.tsx` | Import and compose sections. Owns containerRef and hero scroll transform only. | `useScroll`, `useTransform` for hero |
| `HeroSection` (inline) | Full-screen hero. Stays inline — it tightly couples with page-level `scrollYProgress`. | `opacity`, `scale` from page scroll |
| `ProcessSection.tsx` | "How We Work" — 4 process steps with sequential reveal. Self-contained. | `whileInView` stagger on step cards |
| `TechStackSection.tsx` | Tech logo/name grid. Self-contained. | `whileInView` stagger on grid items |
| `DifferentiatorsSection.tsx` | "Why GloBuyers" — 3-4 differentiator points. Self-contained. | `whileInView` stagger on items |
| `ServiceCard.tsx` | Individual service card (shared, reusable). Owns its own entrance animation. | `whileInView` on card, `whileHover` |

---

## Recommended Project Structure

The minimal change that achieves clean page.tsx:

```
components/
├── AnimatedText.tsx          (existing — unchanged)
├── FloatingParticles.tsx     (existing — unchanged)
├── GlowButton.tsx            (existing — unchanged)
├── GradientOrb.tsx           (existing — unchanged)
├── ServiceCard.tsx           (existing — unchanged)
└── sections/                 (NEW — full-page-section components)
    ├── ProcessSection.tsx
    ├── TechStackSection.tsx
    └── DifferentiatorsSection.tsx

app/
└── page.tsx                  (imports new sections; stays under ~100 lines of composition)
```

### Structure Rationale

- **`components/` (flat):** Atomic/shared components that can appear in any section. Follows existing project convention — PascalCase TSX, "use client", TypeScript props interface.
- **`components/sections/`:** Full-page sections are NOT shared — they belong to a specific page. Grouping them in `sections/` makes it obvious they are page-level composition units, not reusable atoms. This is the `_components/` co-location pattern but without modifying App Router structure.
- **`app/page.tsx`:** Becomes an index file — imports sections, renders them in order. Zero animation logic lives here except the existing hero scroll transform which is page-scoped.

---

## Architectural Patterns

### Pattern 1: Self-Contained Section Component

**What:** Each new section is a standalone `"use client"` component in `components/sections/`. It owns its own data (content arrays), animation variants, and `whileInView` logic. It accepts no animation props from the parent — it manages its own reveal.

**When to use:** Any content section that is a distinct visual block (has a heading, body content, and a visual treatment). All three new sections qualify.

**Trade-offs:** Slightly more files, but page.tsx stays clean and each section is independently modifiable.

**Example (ProcessSection.tsx skeleton):**
```typescript
"use client";

import { motion } from "framer-motion";

const steps = [
  { number: "01", title: "Discovery", description: "..." },
  { number: "02", title: "Build", description: "..." },
  { number: "03", title: "Launch", description: "..." },
  { number: "04", title: "Support", description: "..." },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function ProcessSection() {
  return (
    <section id="process" className="relative py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section heading — whileInView on heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">How We Work</h2>
          <div className="h-1 w-20 bg-primary mb-6" />
          <p className="text-xl text-gray-400">...</p>
        </motion.div>

        {/* Step cards — stagger via variants on container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {steps.map((step) => (
            <motion.div key={step.number} variants={itemVariants}>
              {/* card content */}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

---

### Pattern 2: Stagger-via-Variants (Container + Children)

**What:** The parent `motion.div` carries `variants={containerVariants}` with `staggerChildren` in its transition. Child `motion.div`s carry `variants={itemVariants}` with only their `hidden`/`visible` states — no delay prop on children. Framer Motion propagates the stagger automatically.

**When to use:** Any grid or list where multiple elements should animate in sequence — process steps, tech grid items, differentiator bullets. This is the correct pattern for scroll-triggered stagger.

**Trade-offs:** Requires both parent AND child to use `variants`. Cannot mix `initial`/`animate` props directly on children or the stagger breaks.

**Critical:** The `viewport` prop goes on the parent container only. Children inherit the animation trigger automatically through the variants system.

**Example:**
```typescript
// Parent — controls timing
const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

// Child — controls motion
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// JSX
<motion.ul
  variants={container}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
>
  {items.map((item) => (
    <motion.li key={item.id} variants={item}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

---

### Pattern 3: Heading + Body Stagger (Two-Phase Section Reveal)

**What:** Section heading animates first (`initial={{ opacity: 0, y: 30 }}`, `whileInView`, `viewport={{ once: true }}`). Then the content grid uses the container/children stagger pattern as a separate `whileInView` element below it. Two independent `whileInView` triggers, not coordinated.

**When to use:** All three new sections follow this pattern — heading fades in first, then items stagger in as the user scrolls further. This is the exact pattern already used in the Services section in page.tsx (heading block then ServiceCard grid).

**Trade-offs:** The heading and grid trigger independently, which is correct. If they used a single parent container, the heading and all cards would wait for the entire section to enter the viewport before animating.

---

### Pattern 4: viewport={{ once: true, amount: 0.2 }} as Default

**What:** Always use `once: true` on all `whileInView` animations. Use `amount: 0.2` (20% of element visible) as the trigger threshold for sections, `amount: 0.1` for large grids.

**When to use:** Every `whileInView` in this codebase. Confirmed by PROJECT.md constraint: "use `whileInView` with `once: true`".

**Why `amount: 0.2` not default "some":** "some" is equivalent to `amount: 0` (any pixel visible). On desktop with tall sections, sections can enter viewport before the user expects the animation, making it feel premature. `0.2` ensures the section is meaningfully visible before revealing.

---

## Data Flow

### Scroll Animation Flow

```
User scrolls page
    ↓
Framer Motion IntersectionObserver (built into whileInView)
    ↓
Section enters viewport (amount threshold crossed)
    ↓
Container motion.div variant switches: "hidden" → "visible"
    ↓
staggerChildren: 0.15 distributes delay across child elements
    ↓
Each child motion.div animates opacity: 0→1, y: 30→0
    ↓
viewport.once: true — observer disconnects, animation locked
```

### page.tsx Composition Flow (target state)

```tsx
// app/page.tsx — target shape after adding 3 sections

export default function Home() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: [...] });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // Hero scroll helpers
  const scrollToContact = () => ...;

  return (
    <div ref={containerRef} ...>
      <Header />              {/* existing inline */}
      <HeroSection />         {/* existing inline */}
      <ServicesSection />     {/* existing inline */}
      <ProcessSection />      {/* NEW import */}
      <TechStackSection />    {/* NEW import */}
      <DifferentiatorsSection /> {/* NEW import */}
      <StatsSection />        {/* existing inline */}
      <ContactSection />      {/* existing inline */}
      <Footer />              {/* existing inline */}
    </div>
  );
}
```

The hero section stays inline because it uses `opacity` and `scale` derived from page-level `scrollYProgress`. Extracting it would require passing motion values as props, which adds complexity for no benefit.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1-5 sections (current) | Inline sections in page.tsx — acceptable |
| 6-10 sections (target) | Extract new sections to `components/sections/` — this is the right move now |
| 10+ sections | Consider splitting into multiple routes or using React lazy() per section |

### Scaling Priorities

1. **First concern (now):** page.tsx becomes unwieldy. Fix: the `components/sections/` extraction approach documented above.
2. **Second concern (later):** Animation jank from too many Framer Motion observers active at once. Fix: Only use `whileInView` (Intersection Observer, efficient). Avoid `useScroll` per-section (scroll listener, expensive).

---

## Build Order for New Sections

Build in this order. Each section is independent and non-blocking:

**Phase 1 — ProcessSection** (simplest, linear layout)
- 4 cards in a row, stagger reveal
- No complex layout — 1 row, 4 columns on desktop
- Establishes the `components/sections/` directory and section component pattern

**Phase 2 — TechStackSection** (grid, highest visual density)
- Logo icons + tech names in a grid (6-12 items)
- Use `motion.div` grid with stagger on each icon pill
- Icon treatment: text/emoji OR simple SVG paths (no image files per constraints)

**Phase 3 — DifferentiatorsSection** (alternating or column layout)
- 3-4 differentiator points with glow accent marks
- Can reuse `itemVariants` pattern from ProcessSection

This order matters because ProcessSection establishes the file/directory pattern that TechStack and Differentiators follow.

---

## Anti-Patterns

### Anti-Pattern 1: Animation Logic in page.tsx

**What people do:** Add `motion.div`, `variants`, and `whileInView` blocks directly inside `app/page.tsx` for each new section.

**Why it's wrong:** page.tsx already has 233 lines. Adding 3 more sections inline will push it to 400+ lines. Finding and editing a specific section becomes painful. The Services section inline in page.tsx is already pushing this limit.

**Do this instead:** Create `components/sections/ProcessSection.tsx`, `TechStackSection.tsx`, `DifferentiatorsSection.tsx`. Import them as single-line JSX in page.tsx. Each section manages its own animation.

---

### Anti-Pattern 2: Mixing Variant and Direct Props on Children

**What people do:** Set `variants={itemVariants}` on children but also add `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}` directly — mixing both systems.

**Why it's wrong:** When a parent uses `whileInView` with variants to trigger children, children must use `variants` only. Direct `initial`/`animate` props on children override the parent's variant propagation, breaking the stagger.

**Do this instead:** Children use only `variants={itemVariants}` with no `initial` or `animate` props. The parent handles triggering via `whileInView="visible"` and `initial="hidden"`.

---

### Anti-Pattern 3: viewport={{ once: false }} on Repeated Scroll

**What people do:** Omit `once: true` or explicitly set `once: false` so animations replay every time the section enters view.

**Why it's wrong:** For a marketing site, replaying animations on scroll-back creates visual noise and makes the page feel unstable. It also keeps Intersection Observers active for every section permanently. PROJECT.md explicitly specifies `once: true`.

**Do this instead:** Always set `viewport={{ once: true }}` on every `whileInView` element.

---

### Anti-Pattern 4: useScroll Per-Section (scroll listener for each section)

**What people do:** Add `useScroll({ target: sectionRef })` inside each section component to drive parallax or reveal.

**Why it's wrong:** `useScroll` registers a scroll event listener per component. With 8+ sections, this creates multiple scroll listeners. `whileInView` uses a single shared IntersectionObserver — it is significantly cheaper.

**Do this instead:** Use `whileInView` for all section reveals. Reserve `useScroll`/`useTransform` for the hero section only (where it already exists in page.tsx), which is the appropriate scope for scroll-linked transforms.

---

### Anti-Pattern 5: "use client" on app/page.tsx Without Reason

**What people do:** Keep the `"use client"` directive on page.tsx and bloat the client bundle with all section content.

**Why this applies here:** page.tsx already has `"use client"` because it uses `useRef` and `useScroll` for the hero. This is correct. The extracted section components should each have their own `"use client"` directive since they use Framer Motion. Do not try to make section components Server Components — Framer Motion requires client-side rendering.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| page.tsx ↔ ProcessSection | Import only, no props needed | Section is fully self-contained |
| page.tsx ↔ TechStackSection | Import only, no props needed | Tech list is static, lives inside component |
| page.tsx ↔ DifferentiatorsSection | Import only, no props needed | Differentiator copy is static |
| ServiceCard ↔ ServicesSection | Props: icon, title, description, index, className | Existing pattern — follow for any new card primitives |
| GradientOrb ↔ any section | Props: color, size, className | Orbs can be dropped into new sections for background depth |

### Reusing Existing Components in New Sections

The new section components should use the existing shared components where appropriate:

- `GradientOrb` — Drop one or two inside `DifferentiatorsSection` for atmospheric glow (follow existing pattern: absolute, `pointer-events-none`, low opacity)
- `AnimatedText` — Can be used for section headings if dramatic word-by-word reveal is desired (use sparingly — currently only in hero)
- `GlowButton` — Not needed in new sections (no CTAs in process/tech/differentiators)

---

## Sources

- Direct codebase analysis: `/Users/Farhan/Documents/Personal/GloBuyers/Website/app/page.tsx`, all `components/*.tsx` (HIGH confidence)
- PROJECT.md constraint `whileInView with once: true` (HIGH confidence — project document)
- Framer Motion whileInView, viewport, staggerChildren API: [motion.dev scroll animations](https://motion.dev/docs/react-scroll-animations), [LogRocket scroll animations guide](https://blog.logrocket.com/react-scroll-animations-framer-motion/) (HIGH confidence — consistent with existing codebase usage)
- framer-motion npm v12.34.0 (no breaking changes in v12): [npm package](https://www.npmjs.com/package/framer-motion), [Motion upgrade guide](https://motion.dev/docs/react-upgrade-guide) (HIGH confidence — confirmed by search results)
- Section extraction pattern (Next.js App Router): [pronextjs.dev](https://www.pronextjs.dev/where-should-i-put-my-components-in-the-app-router), [makerkit.dev](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure) (MEDIUM confidence — community best practice)
- `whileInView` + `staggerChildren` incompatibility with mixed direct props: Framer Motion variants documentation (HIGH confidence — verified by existing AnimatedText.tsx implementation in codebase)

---

*Architecture research for: GloBuyers agency website — scroll-animated section components*
*Researched: 2026-02-21*
