# Stack Research: Dark Neon Glow Aesthetic

**Domain:** Dark neon agency website — animation and visual effects techniques
**Researched:** 2026-02-21
**Confidence:** HIGH (verified via official Motion docs, Tailwind v4 official blog, multiple implementation sources)

---

## Context: Existing Stack

The site runs on Next.js 16.1.6, React 19.2.3, Framer Motion 12.34.0, Tailwind CSS 4, TypeScript 5. This research prescribes techniques that slot into this stack without new frameworks. No new core dependencies are needed — only technique upgrades.

The existing codebase already uses:
- `box-shadow` via inline globals (`.glow-cyan`, `.glow-purple`, `.text-glow`)
- Gradient orbs with `blur-3xl`
- `whileInView` with `once: true` for scroll reveals
- `whileHover` with basic `scale` transforms
- CSS custom grid pattern via `.cyber-grid`
- Simple `FloatingParticles` using absolute-positioned `motion.div` elements

Research finding: The existing patterns are correct foundations. The upgrade path is **intensification** of existing techniques, not replacement.

---

## Recommended Techniques

### 1. Layered Box-Shadow Neon Glow (Tailwind Arbitrary Values)

**What it creates:** The defining characteristic of neon — light bleeding outward in concentric rings, simulating actual light emission.

**Why it works:** Real neon signs emit light with an intense bright core surrounded by a dimmer atmospheric bloom. The two-layer shadow (tight spread + wide spread) replicates this physics. A single shadow looks flat; two or three layers create believable depth.

**Confidence:** HIGH — verified via Tailwind CSS v4 official docs.

**Tailwind v4 syntax (arbitrary values):**
```tsx
// Cyan neon glow — the exact color is #00d4ff (existing primary)
<div className="shadow-[0_0_15px_rgba(0,212,255,0.8),0_0_40px_rgba(0,212,255,0.4),0_0_80px_rgba(0,212,255,0.15)]" />

// Purple neon glow — existing secondary
<div className="shadow-[0_0_15px_rgba(168,85,247,0.8),0_0_40px_rgba(168,85,247,0.4),0_0_80px_rgba(168,85,247,0.15)]" />

// Hover upgrade for ServiceCard
<div className="hover:shadow-[0_0_20px_rgba(0,212,255,0.6),0_0_60px_rgba(0,212,255,0.2)] transition-shadow duration-500" />
```

**Tailwind v4 `@theme` approach (define once, use everywhere):**
```css
/* globals.css — extends existing @theme block */
@theme {
  --shadow-glow-cyan: 0 0 15px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4), 0 0 80px rgba(0,212,255,0.15);
  --shadow-glow-purple: 0 0 15px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4), 0 0 80px rgba(168,85,247,0.15);
  --shadow-glow-subtle: 0 0 10px rgba(0,212,255,0.3), 0 0 30px rgba(0,212,255,0.1);
}
```

**Performance:** box-shadow is CPU-composited. For static glow on cards it is acceptable. For animated glow transitions, set `transition-shadow duration-300` rather than animating with Framer Motion to keep it in CSS compositor. Add `will-change: box-shadow` only to elements that animate box-shadow — not globally.

---

### 2. Framer Motion Spotlight Card Effect (useMotionValue + useMotionTemplate)

**What it creates:** A radial gradient "spotlight" that follows the cursor across a card, revealing a neon-tinted light source wherever the user's mouse is. This is the single most impactful interactive effect for the neon aesthetic.

**Why it works:** It simulates a point light source moving over a surface — a physically grounded effect that makes cards feel tangible and alive, not flat. The cyan color at ~15% opacity on the dark `#050505` background is exactly readable.

**Confidence:** HIGH — verified via official Motion docs and buildui.com recipe, which confirms API compatibility with current Framer Motion versions.

**Implementation pattern (verified recipe):**
```tsx
// components/SpotlightCard.tsx
"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent, ReactNode } from "react";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(0, 212, 255, 0.15)"
}

export function SpotlightCard({ children, className = "", glowColor = "rgba(0, 212, 255, 0.15)" }: SpotlightCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useMotionTemplate`radial-gradient(
    600px circle at ${mouseX}px ${mouseY}px,
    ${glowColor},
    transparent 80%
  )`;

  return (
    <div
      className={`group relative ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      {children}
    </div>
  );
}
```

**Performance:** useMotionValue updates outside React's render cycle — zero re-renders. The gradient update is a direct DOM style mutation. This is Motion's most performant pattern for interactive effects. No `will-change` needed.

**Integration into existing ServiceCard:** Wrap the `motion.div` inside `SpotlightCard`. The existing hover `y: -5` and gradient blob can coexist.

---

### 3. Animated Gradient Border via @property + conic-gradient

**What it creates:** A border that rotates a neon gradient around the card perimeter — making it look like electricity running along the edge. Works on hover or as a persistent ambient animation.

**Why it works:** Rotating conic gradients simulate electrical discharge and neon tube light. The `@property` syntax enables CSS engine interpolation of the angle, producing smooth rotation without JavaScript.

**Confidence:** HIGH — verified via official codetv.dev article and MDN. `@property` supports all modern browsers (Chrome 85+, Firefox 120+, Safari 16.4+). Tailwind v4 uses `@property` internally.

**Compatible with border-radius: YES** (confirmed — uses `background-origin: border-box` approach, not pseudo-elements).

**Implementation:**
```css
/* globals.css */
@property --border-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@keyframes border-spin {
  to { --border-angle: 360deg; }
}

.neon-border {
  background:
    linear-gradient(#050505, #050505) padding-box,
    conic-gradient(
      from var(--border-angle),
      #00d4ff 0%,
      #a855f7 25%,
      #00d4ff 50%,
      transparent 75%
    ) border-box;
  border: 1px solid transparent;
  animation: border-spin 4s linear infinite paused;
}

.neon-border:hover {
  animation-play-state: running;
}
```

**In TSX (via className):**
```tsx
<div className="neon-border rounded-3xl p-8">
  Card content
</div>
```

**Performance:** CSS `@keyframes` on a `@property` value runs on the compositor thread. GPU-accelerated. No JavaScript involved. Safe to use on up to 10–15 cards simultaneously.

**Caution:** Do not combine with Tailwind's `border-*` utilities on the same element — they will override the `border: 1px solid transparent` required for this technique.

---

### 4. Text Glow — Multi-layer text-shadow

**What it creates:** Glowing neon text that appears self-luminous, as if backlit.

**Why it works:** Multiple `text-shadow` layers mimic the photon scatter from a real neon tube: a tiny bright core, a medium bloom, and a wide atmospheric halo.

**Confidence:** HIGH — straightforward CSS, existing `.text-glow` class already exists in globals.css (but uses only two layers).

**Upgraded version (three-layer):**
```css
/* globals.css — upgrade existing .text-glow */
.text-glow-cyan {
  text-shadow:
    0 0 4px #fff,
    0 0 10px rgba(0, 212, 255, 1),
    0 0 25px rgba(0, 212, 255, 0.8),
    0 0 50px rgba(0, 212, 255, 0.4);
}

.text-glow-purple {
  text-shadow:
    0 0 4px #fff,
    0 0 10px rgba(168, 85, 247, 1),
    0 0 25px rgba(168, 85, 247, 0.8),
    0 0 50px rgba(168, 85, 247, 0.4);
}
```

**Framer Motion animated text glow (pulse effect):**
```tsx
// For section headings — pulsing glow to draw attention
<motion.h2
  animate={{
    textShadow: [
      "0 0 10px rgba(0,212,255,0.8), 0 0 30px rgba(0,212,255,0.4)",
      "0 0 20px rgba(0,212,255,1), 0 0 60px rgba(0,212,255,0.6)",
      "0 0 10px rgba(0,212,255,0.8), 0 0 30px rgba(0,212,255,0.4)",
    ],
  }}
  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
>
  Digital Commerce
</motion.h2>
```

**Performance:** `text-shadow` is GPU-composited for opacity and blur changes. The animate on `textShadow` does cause repaints. Limit pulsing text-shadow animation to ONE hero element maximum. For secondary headings, use static CSS class.

---

### 5. Dark Glassmorphism Cards

**What it creates:** Cards that appear to float on a frosted-glass surface, with dark translucency showing the gradient orb backgrounds through. The neon glow on the border amplifies the glass effect.

**Why it works:** The `backdrop-filter: blur()` creates visual depth by blurring content behind the card. Combined with a very low-opacity dark background, the neon orbs bleed through subtly, making cards feel like illuminated panels.

**Confidence:** HIGH — `backdrop-filter` has ~95% browser support (2025). The existing `.glass-card` class already uses this approach.

**Upgraded formula:**
```css
/* globals.css — upgrade existing .glass-card */
.glass-card {
  background: rgba(5, 5, 5, 0.6);           /* Darker: 60% opaque base */
  backdrop-filter: blur(16px) saturate(1.5); /* Add saturation for neon bleed-through */
  -webkit-backdrop-filter: blur(16px) saturate(1.5);
  border: 1px solid rgba(0, 212, 255, 0.08); /* Subtle cyan tint on border */
}

.glass-card:hover {
  background: rgba(5, 5, 5, 0.7);
  border-color: rgba(0, 212, 255, 0.25);
  box-shadow: 0 0 20px rgba(0, 212, 255, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4);
}
```

**Fallback for no backdrop-filter support:**
```css
@supports not (backdrop-filter: blur(1px)) {
  .glass-card {
    background: rgba(15, 15, 20, 0.92); /* Solid dark fallback */
  }
}
```

**Performance:** `backdrop-filter` promotes the element to its own GPU layer. Use sparingly — maximum 6–8 blurred elements simultaneously visible. The existing ServiceCard already uses this. New sections should not stack more than 3 glass cards in the same viewport.

---

### 6. Framer Motion Staggered Section Reveals

**What it creates:** Section content that cascades in with a slight delay between each element — creating a choreographed feel that makes the page feel dynamic rather than static.

**Why it works:** Stagger creates rhythm and guides the eye through content. It makes each reveal feel intentional, which reinforces the futuristic, engineered aesthetic.

**Confidence:** HIGH — verified via official Motion stagger documentation.

**Standard container + children variant pattern:**
```tsx
// Reusable variants — define once, use everywhere
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Usage in a section
<motion.div
  variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-80px" }}
>
  <motion.h2 variants={itemVariants}>How We Work</motion.h2>
  <motion.p variants={itemVariants}>Description text</motion.p>
  {steps.map((step) => (
    <motion.div key={step.id} variants={itemVariants}>
      <StepCard {...step} />
    </motion.div>
  ))}
</motion.div>
```

**Performance:** `once: true` ensures animations only fire on scroll-in (not on scroll-out). The `margin: "-80px"` triggers animation slightly before elements enter viewport, preventing jarring late-loads. Animating only `opacity` and `y` (transform) keeps everything GPU-accelerated.

---

### 7. Gradient Orb Upgrades — Increased Intensity + Mouse Parallax

**What it creates:** The existing GradientOrb is good but subtle (opacity 20–40%). The upgraded version is more intense and can have subtle mouse parallax to create a sense of depth.

**Why it works:** Intense ambient light blobs at the edges of sections create the "light source outside the frame" effect characteristic of cyberpunk design. Parallax on scroll or mouse movement makes them feel three-dimensional.

**Confidence:** HIGH — pattern uses existing Motion hooks.

**Upgraded GradientOrb (intensify existing component):**
```tsx
// Modified constants for GradientOrb
const colorClasses = {
  cyan: "bg-gradient-radial from-cyan-400/60 via-cyan-600/30 to-transparent",
  purple: "bg-gradient-radial from-purple-500/60 via-purple-700/30 to-transparent",
  pink: "bg-gradient-radial from-pink-500/60 via-pink-700/30 to-transparent",
};

// Higher base opacity — 0.35 instead of 0.20
animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }}
```

**Scroll-linked parallax (adds depth without extra library):**
```tsx
// In page.tsx — for hero orbs
const { scrollY } = useScroll();
const orbY = useTransform(scrollY, [0, 500], [0, -80]);

<motion.div style={{ y: orbY }}>
  <GradientOrb color="cyan" size="lg" />
</motion.div>
```

**Performance:** The existing GradientOrb animation (scale + opacity) is GPU-accelerated. Adding `y` transform from scroll is also GPU-accelerated via Motion's `useTransform`. No issues.

---

### 8. Cyber Grid Enhancement

**What it creates:** The existing `.cyber-grid` uses a dot-grid pattern that fades at the bottom. The enhancement adds a more dramatic perspective-foreshortened grid that looks like a receding 3D floor plane.

**Why it works:** A perspective grid creates the classic synthwave/cyberpunk horizon effect, implying infinite space behind the UI.

**Confidence:** MEDIUM — CSS technique verified; exact pixel values are artistic judgment calls.

**Enhanced cyber-grid:**
```css
/* globals.css — replace existing .cyber-grid */
.cyber-grid {
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: linear-gradient(to bottom, black 0%, black 40%, transparent 100%);
}

/* Optional: perspective variant for hero */
.cyber-grid-perspective {
  background-image:
    linear-gradient(rgba(0, 212, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.06) 1px, transparent 1px);
  background-size: 60px 60px;
  transform: perspective(500px) rotateX(30deg);
  transform-origin: center top;
  mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
}
```

**Performance:** Pure CSS background-image patterns are extremely cheap — no GPU layer needed, no paint operations beyond initial render.

---

### 9. Floating Particle System Upgrade

**What it creates:** The existing `FloatingParticles` (20 particles, cy an, rising and fading) is correct but thin. The upgrade adds color variety, size variation, and occasional "shooting" particles.

**Why it works:** More diverse particles create the sense of an active, alive environment. Color mixing between cyan and purple matches the site palette.

**Confidence:** HIGH — extends existing pattern, no new libraries.

**Upgraded FloatingParticles pattern:**
```tsx
// Increase particle count: 20 → 35
// Add color variety
const colorOptions = [
  "bg-cyan-400/40",
  "bg-purple-400/30",
  "bg-cyan-300/20",
  "bg-pink-400/20",
];

// Add horizontal drift
animate={{
  y: [0, -120, 0],
  x: [0, particle.drift, 0],  // drift: Math.random() * 40 - 20
  opacity: [0, 0.8, 0],
}}

// Occasional "shooting" particle (5% of particles)
// For those: faster duration (3-5s), larger size, linear ease
```

**Performance concern:** 35 Framer Motion `motion.div` elements each with repeating animations. This is the performance ceiling. Do NOT use tsParticles or canvas-based solutions — they add 40-100KB bundle weight for minimal visual gain over the existing approach. The existing approach is correct. Cap particles at 35. If performance is a concern on low-end devices, add `{particles.slice(0, isMobile ? 15 : 35).map(...)}`.

---

### 10. Framer Motion Accessible Animation Config

**What it creates:** Automatic animation disabling for users with `prefers-reduced-motion: reduce` set in their OS.

**Why it's required:** Motion-related accessibility concerns affect 70M+ people (vestibular disorders, epilepsy, etc.). WCAG 2.1 Success Criterion 2.3.3 requires animation from interactions to be disableable.

**Confidence:** HIGH — verified via official Motion accessibility docs.

**Implementation (wrap in root layout):**
```tsx
// app/layout.tsx
import { MotionConfig } from "framer-motion";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
```

**What `reducedMotion="user"` does:** All transform and layout animations are automatically disabled. Opacity and color animations are preserved (non-vestibular). No per-component changes needed. The glowing orbs and static gradients remain visible — only movement stops.

---

## Techniques NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Animating `box-shadow` with Framer Motion `animate` prop | box-shadow triggers layout recalculation on every frame — causes jank, especially on mobile | Use CSS `transition-shadow` for hover states; static shadows for ambient glow |
| `filter: blur()` on animated elements | blur() forces GPU layer promotion AND triggers repaint on every frame change — very expensive | Use `blur-3xl` only on static GradientOrb elements; not on animating content |
| tsParticles / react-particles | Adds 40-100KB bundle; canvas setup overhead; overkill for ambient floating dots | Extend the existing Framer Motion FloatingParticles component |
| Three.js / WebGL for glow effects | 500KB+ bundle for what CSS box-shadow does in 200 bytes | CSS multi-layer box-shadow + Framer Motion transforms |
| Animating `background-position` for gradient movement | Not GPU-accelerated; causes repaint on every frame | Use `@property` with conic-gradient and `@keyframes` for animated borders |
| `will-change: transform` applied globally | Promotes every element to GPU layer, exhausting VRAM on mobile | Apply `will-change` only immediately before animation, remove after |
| Glitch/scanline effects with JavaScript intervals | CPU-bound, causes jank, violates reduced-motion | Use CSS `@keyframes` with `steps()` timing; wrap in `@media (prefers-reduced-motion: no-preference)` |
| `backdrop-filter` on more than 8 elements simultaneously | Each blurred element creates a GPU compositing layer; memory pressure on mobile | Maximum 6-8 glass cards visible at once; use solid dark bg for off-screen cards |

---

## Supporting Libraries

No new libraries are needed. The existing stack handles everything:

| Need | Solution | Notes |
|------|----------|-------|
| Neon box-shadow | Tailwind arbitrary values `shadow-[...]` | Verified for Tailwind v4 |
| Animated borders | CSS `@property` + `conic-gradient` | No JS, no new dependencies |
| Spotlight card hover | `useMotionValue` + `useMotionTemplate` | Already in framer-motion |
| Staggered reveals | `variants` + `staggerChildren` | Already in framer-motion |
| Scroll-linked parallax | `useScroll` + `useTransform` | Already used in page.tsx |
| Particle system | Extend `FloatingParticles.tsx` | No new library needed |
| Reduced motion | `MotionConfig reducedMotion="user"` | Built into framer-motion |
| Gradient text | Tailwind `bg-gradient-to-r bg-clip-text text-transparent` | Already used in hero |

---

## Tailwind CSS 4 Specific Notes

Tailwind CSS v4 key capabilities for this project (verified via official v4 announcement):

| Feature | How to Use for Neon | Confidence |
|---------|-------------------|------------|
| `@theme` directive | Define `--shadow-glow-*` once, reference everywhere | HIGH |
| `@property` support | Enables animating custom CSS properties (gradient angle) | HIGH |
| `color-mix()` | Opacity-adjust CSS variables: `color-mix(in oklch, var(--color-cyan-400) 50%, transparent)` | HIGH |
| Arbitrary shadow `shadow-[...]` | Full neon multi-layer shadows without config | HIGH |
| `inset-shadow-*` | Inset glow inside elements (neon well effect) | HIGH |
| `ring-*` utilities | Subtle neon outline rings on focused/active elements | HIGH |
| Radial gradient `bg-radial-[at_X%_Y%]` | Position gradient orbs precisely | HIGH |
| Conic gradient `bg-conic` | Spinner/loading neon ring effects | MEDIUM |

**Key Tailwind v4 syntax difference from v3:** Custom shadows use CSS variables in `@theme` block instead of `tailwind.config.ts`. The existing project already uses `@theme inline` correctly.

---

## Version Compatibility

| Package | Version | Compatibility Notes |
|---------|---------|---------------------|
| framer-motion | 12.34.0 | `useMotionTemplate`, `useMotionValue`, `useSpring` all verified for this version. `MotionConfig.reducedMotion` available since v11. |
| tailwindcss | v4 (exact ver from postcss setup) | `@property` support built-in. `@theme` replaces `tailwind.config.js` for theme extension. Arbitrary shadow syntax `shadow-[...]` fully supported. |
| next.js | 16.1.6 | React Server Components require `"use client"` on all components that use Framer Motion. Existing components already have this. |
| react | 19.2.3 | No issues with Framer Motion 12. Motion improved concurrent rendering support for React 19 in v12. |
| CSS `@property` | — | Chrome 85+, Firefox 120+, Safari 16.4+. Covers ~95% of users. Provide static gradient fallback for the 5%. |

---

## Implementation Priority Order

For the milestone (enhancing existing site to more dramatic neon):

1. **Layered box-shadow glow** — Apply to existing ServiceCards, GlowButton, stats bar. Immediate visual impact, zero risk. (Technique #1)
2. **SpotlightCard hover effect** — Replace ServiceCard hover with SpotlightCard wrapper. High impact, proven pattern. (Technique #2)
3. **Text glow upgrade** — Apply three-layer text-shadow to hero heading and section titles. Quick win. (Technique #4)
4. **Dark glassmorphism upgrade** — Enhance `.glass-card` CSS with `saturate()` and stronger blur. (Technique #5)
5. **Staggered reveals for new sections** — Apply container/children variants to "How We Work", "Tech Stack", "Why GloBuyers". (Technique #6)
6. **Animated gradient border** — Apply `neon-border` class to one hero CTA card or the contact section. (Technique #3)
7. **MotionConfig reducedMotion** — Add to layout.tsx. Non-visual, but required. (Technique #10)
8. **Cyber grid enhancement** — Upgrade `.cyber-grid` CSS for crisper lines. (Technique #8)
9. **Particle system upgrade** — Extend FloatingParticles for more particles + color variety. (Technique #9)
10. **Gradient orb intensity** — Increase opacity values in GradientOrb.tsx. (Technique #7)

---

## Sources

- [Motion (Framer Motion) Official Docs — Animation](https://motion.dev/docs/react-animation) — useMotionValue, useMotionTemplate, variants, stagger patterns. HIGH confidence.
- [Motion — MotionConfig accessibility](https://motion.dev/docs/react-motion-config) — reducedMotion="user" option. HIGH confidence.
- [Tailwind CSS v4.0 Official Blog](https://tailwindcss.com/blog/tailwindcss-v4) — @theme, @property, color-mix(), gradient APIs, inset-shadow. HIGH confidence.
- [Tailwind CSS box-shadow docs](https://tailwindcss.com/docs/box-shadow) — Arbitrary value syntax `shadow-[...]`, multi-layer glow examples. HIGH confidence.
- [buildui.com — Spotlight recipe](https://buildui.com/recipes/spotlight) — Verified useMotionValue + useMotionTemplate spotlight pattern code. HIGH confidence.
- [codetv.dev — Animated CSS gradient borders](https://codetv.dev/blog/animated-css-gradient-border) — @property + conic-gradient animated border, border-radius compatibility confirmed. HIGH confidence.
- [Framer Motion Scroll Animations Guide](https://jb.desishub.com/blog/framer-motion) — useScroll, useTransform scroll parallax patterns. MEDIUM confidence.
- [Dark Glassmorphism UI Design 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f) — Glassmorphism + neon trend analysis. MEDIUM confidence (behind paywall, summarized via search).
- [Motion Changelog](https://motion.dev/changelog) — Version 12 features. HIGH confidence.
- [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) — Accessibility media query. HIGH confidence.
- [Pope Tech Blog — Accessible animation 2025](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) — WCAG 2.3.3 guidance for motion accessibility. HIGH confidence.
- [CSS Glow Effects — freefrontend.com](https://freefrontend.com/css-glow-effects/) — box-shadow neon patterns. MEDIUM confidence (community source).

---

*Stack research for: GloBuyers dark neon aesthetic enhancement*
*Researched: 2026-02-21*
