# Phase 1: Aesthetic Foundation - Research

**Researched:** 2026-02-21
**Domain:** CSS neon glow effects, Framer Motion accessibility & performance, React cursor-tracking patterns
**Confidence:** HIGH

---

## Summary

Phase 1 is a pure enhancement pass on an already-working Next.js 16 / React 19 / Framer Motion 12 site. There are no new routes, no new pages, and no new dependencies required. Every requirement is satisfied through edits to existing files: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, and the five components in `components/`.

The two conceptually heaviest tasks are the SpotlightCard hover effect (AES-03) and the reduced-motion + off-screen pause pair (AES-04, AES-05). Both are solved patterns in the installed version of Framer Motion — no third-party packages needed. The spotlight effect uses `useMotionValue` + `useMotionTemplate` to build a live radial-gradient without triggering React re-renders. The off-screen pause uses `useInView` returning a boolean that gates the `animate` prop on looping `motion.div` elements.

The remaining requirements (AES-01, AES-02, SERV-01, FOOT-01) are straightforward CSS/JSX edits with no architectural risk. The main pitfall to watch is the `Math.random()` hydration error already documented in STATE.md — FloatingParticles already correctly guards random values inside `useEffect`, so the pattern must be preserved when adding the `useInView` gate. The privacy link fix (FOOT-01) is a one-line change: replace `href="#"` with `href="/privacy-policy"` to match the existing App Router page at `app/privacy-policy/page.tsx`.

**Primary recommendation:** Make all changes in-place on existing files. The only structural addition is wrapping `{children}` in `app/layout.tsx` with `<MotionConfig reducedMotion="user">`. No new packages. No new components needed — SpotlightCard logic lives inside the upgraded `ServiceCard.tsx`.

---

## Standard Stack

### Core (already installed — no new installs)

| Library | Version (installed) | Purpose | Why Standard |
|---------|---------------------|---------|--------------|
| framer-motion | ^12.34.0 | Animations, motion values, MotionConfig | Already in use; v12 ships all needed APIs |
| next | 16.1.6 | App Router, file-based routing | Project framework |
| react | 19.2.3 | Hooks (useRef, useEffect, useState) | Project framework |
| tailwindcss | ^4 | Utility classes, CSS variables | Already in use |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS `box-shadow` (multi-layer) | N/A — browser native | Three-layer neon glow on elements | AES-01: buttons, cards, accent elements |
| CSS `text-shadow` (multi-layer) | N/A — browser native | Intensified neon text glow | AES-02: headings and gradient spans |
| `useMotionValue` / `useMotionTemplate` | Included in framer-motion | Cursor-relative radial gradient | AES-03: SpotlightCard |
| `useInView` | Included in framer-motion | Boolean visibility gate | AES-05: pause FloatingParticles, GradientOrb off-screen |
| `MotionConfig` | Included in framer-motion | Global reducedMotion setting | AES-04: layout.tsx wrapper |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useMotionValue` + `useMotionTemplate` | CSS custom properties + JS mouse event | useMotionValue avoids re-renders; CSS-only cannot animate framer styles |
| `useInView` from framer-motion | `IntersectionObserver` manually | framer-motion's hook is already imported; no reason to hand-roll |
| Inline `style` box-shadow on `motion.div` | Tailwind arbitrary value | Inline style is clearer for multi-layer neon values; Tailwind arbitrary syntax is verbose for 3+ shadows |

**Installation:**
```bash
# No new packages required
```

---

## Architecture Patterns

### Recommended Project Structure (no changes to structure)

```
app/
├── layout.tsx          # ADD: MotionConfig wrapper (AES-04)
├── page.tsx            # EDIT: footer Privacy link (FOOT-01)
├── globals.css         # ADD: neon box-shadow / text-shadow utility classes (AES-01, AES-02)
└── privacy-policy/
    └── page.tsx        # EXISTING: target of the fixed Privacy link
components/
├── ServiceCard.tsx     # REPLACE: add SpotlightCard cursor effect + capability bullets (AES-03, SERV-01)
├── FloatingParticles.tsx  # EDIT: add useInView gate (AES-05)
├── GradientOrb.tsx     # EDIT: add useInView gate (AES-05)
├── GlowButton.tsx      # EDIT: upgrade to multi-layer neon box-shadow (AES-01)
└── AnimatedText.tsx    # EDIT: add neon text-shadow to gradient spans (AES-02)
```

### Pattern 1: MotionConfig Global Reduced Motion (AES-04)

**What:** Wrapping all children in `MotionConfig` with `reducedMotion="user"` makes every downstream `motion.*` component automatically skip transform/layout animations when the OS has "Reduce Motion" enabled. The `"user"` value reads `prefers-reduced-motion` media query. Values like `opacity` and `backgroundColor` are preserved even under reduced motion.

**When to use:** Once, at the root layout. All child components benefit automatically — no per-component changes needed.

**Type confirmed from installed package:**
```typescript
// node_modules/framer-motion/dist/types/index.d.ts
type ReducedMotionConfig = "always" | "never" | "user";

interface MotionConfigProps extends Partial<MotionConfigContext> {
  children?: React.ReactNode;
  reducedMotion?: ReducedMotionConfig;
  // ...
}
```

**Example (app/layout.tsx):**
```tsx
// Source: framer-motion type definitions + official MotionConfig docs
import { MotionConfig } from "framer-motion";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
```

**Important:** `app/layout.tsx` is a Server Component by default. `MotionConfig` from `framer-motion` is a Client Component. Adding it here will trigger a Next.js error unless the import happens inside a `"use client"` wrapper component. The recommended pattern is a thin `<Providers>` client component:

```tsx
// components/Providers.tsx  (new small file — acceptable)
"use client";
import { MotionConfig } from "framer-motion";
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

Then in `layout.tsx` (stays as Server Component):
```tsx
import { Providers } from "@/components/Providers";
// ...
<body ...>
  <Providers>{children}</Providers>
</body>
```

**Alternatively:** Add `"use client"` to `layout.tsx` itself. This is simpler but opts the entire layout into the client bundle. Given `page.tsx` already has `"use client"`, this is acceptable for this project size.

### Pattern 2: SpotlightCard — Cursor Radial Gradient (AES-03)

**What:** Track the mouse position relative to the card using `useMotionValue`. Use `useMotionTemplate` to compose a `radial-gradient` CSS string that moves with the cursor. Apply it to an absolutely-positioned overlay `motion.div`. The overlay is `pointer-events-none` so it does not block card interactions. Uses `opacity-0 group-hover:opacity-100` transition to show on hover only.

**Why useMotionValue:** Updates do NOT trigger React re-renders. The gradient position is updated at pointer-event frequency without component re-render overhead.

**Type confirmed from installed package:**
```typescript
// useMotionValue and useMotionTemplate are both exported from framer-motion
declare function useMotionValue<T>(init: T): MotionValue<T>;
declare function useMotionTemplate(strings: TemplateStringsArray, ...values: Array<MotionValue | string | number>): MotionValue<string>;
```

**Example (verified from buildui.com/recipes/spotlight — matches framer-motion official docs):**
```tsx
"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";

// Inside ServiceCard component:
const mouseX = useMotionValue(0);
const mouseY = useMotionValue(0);

function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
  const { left, top } = currentTarget.getBoundingClientRect();
  mouseX.set(clientX - left);
  mouseY.set(clientY - top);
}

// The spotlight gradient overlay (inside the card's outer div):
const spotlightBackground = useMotionTemplate`
  radial-gradient(
    500px circle at ${mouseX}px ${mouseY}px,
    rgba(14, 165, 233, 0.12),
    transparent 80%
  )
`;

// JSX:
<div className="group relative h-full" onMouseMove={handleMouseMove}>
  {/* Spotlight overlay */}
  <motion.div
    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
    style={{ background: spotlightBackground }}
  />
  {/* Rest of card content */}
</div>
```

**Note on radius size:** The existing card dimensions vary (300px auto-rows, some span 2 columns ~620px wide). A 500px radius circle covers the full card width comfortably on smaller cards; larger cards (main service `md:col-span-2 md:row-span-2`) will show partial coverage which creates depth. Keep radius in range 400–600px.

### Pattern 3: useInView Off-Screen Pause (AES-05)

**What:** `useInView` returns `true` when the referenced element's bounding box intersects the viewport. Pass this boolean to control the `animate` prop on looping `motion.div` elements. When `false`, passing an empty/static `animate` value stops the looping animation.

**Type confirmed from installed package:**
```typescript
interface UseInViewOptions {
  root?: RefObject<Element | null>;
  once?: boolean;                       // Only trigger once
  amount?: "some" | "all" | number;    // Intersection threshold
  initial?: boolean;                   // Initial value before first check
  margin?: string;                     // Root margin (like CSS margin)
}
declare function useInView(ref: RefObject<Element | null>, options?: UseInViewOptions): boolean;
```

**Pattern for FloatingParticles.tsx:**
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function FloatingParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(/* existing generation — keep in useEffect, not render body */);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          // ...style...
          animate={isInView ? {
            y: [0, -100, 0],
            opacity: [0, 1, 0],
          } : {
            y: 0,
            opacity: 0,
          }}
          transition={isInView ? {
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          } : { duration: 0 }}
        />
      ))}
    </div>
  );
}
```

**Pattern for GradientOrb.tsx:**
```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function GradientOrb({ color, size, className }: GradientOrbProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  // ...

  return (
    <motion.div
      ref={ref}
      className={/* existing classes */}
      animate={isInView ? {
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2],
      } : false}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
```

**Note:** When `animate={false}`, framer-motion stops the animation and returns the element to its initial values. This is the correct way to halt a looping animation without controlling a separate animation object.

### Pattern 4: Three-Layer Neon box-shadow (AES-01)

**What:** CSS `box-shadow` accepts comma-separated multiple shadows. Three layers at increasing blur radii creates a physical-depth neon glow: tight bright core → mid bloom → wide soft halo.

**Pattern:**
```css
/* Three-layer neon glow — cyan variant */
box-shadow:
  0 0 5px rgba(14, 165, 233, 0.9),     /* tight bright core */
  0 0 20px rgba(14, 165, 233, 0.6),    /* mid bloom */
  0 0 40px rgba(14, 165, 233, 0.3);    /* wide soft halo */
```

**Tailwind approach (recommended for consistency with existing codebase):**
Define utility classes in `globals.css` and apply them conditionally:
```css
.neon-glow-cyan {
  box-shadow:
    0 0 5px rgba(14, 165, 233, 0.9),
    0 0 20px rgba(14, 165, 233, 0.5),
    0 0 40px rgba(14, 165, 233, 0.25);
}

.neon-glow-purple {
  box-shadow:
    0 0 5px rgba(99, 102, 241, 0.9),
    0 0 20px rgba(99, 102, 241, 0.5),
    0 0 40px rgba(99, 102, 241, 0.25);
}
```

**Existing globals.css already defines `.glow-cyan` and `.glow-purple` with two-layer shadows.** The upgrade is to extend these to three layers and increase intensity. The existing classes can be replaced in-place.

### Pattern 5: Neon text-shadow (AES-02)

**What:** CSS `text-shadow` supports multiple comma-separated values. For gradient text that uses `bg-clip-text text-transparent`, `text-shadow` does NOT apply to the text itself — it applies to where the text "would be" but the effect is invisible because the text is transparent. This is a known CSS limitation.

**Critical constraint:** The hero heading uses `bg-gradient-to-r ... bg-clip-text text-transparent`. `text-shadow` cannot be applied to these elements because the text color is transparent. The glow effect must be applied via a different technique for gradient text:
- Use a `filter: drop-shadow(...)` on the container element (works with transparent text)
- Or use a pseudo-element with the same gradient text and blur it underneath

**For solid white headings** (e.g., "Command Center", "Ready to Upgrade?"), standard multi-layer `text-shadow` works:
```css
.text-glow-white {
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 20px rgba(0, 212, 255, 0.6),
    0 0 40px rgba(0, 212, 255, 0.3);
}
```

**For gradient text**, use `filter: drop-shadow()`:
```css
.text-glow-gradient {
  filter:
    drop-shadow(0 0 8px rgba(14, 165, 233, 0.8))
    drop-shadow(0 0 20px rgba(14, 165, 233, 0.4));
}
```

**Existing codebase:** `globals.css` already defines `.text-glow` with a two-layer `text-shadow`. This works for the solid-white AnimatedText but not for the gradient `<h1>` span. The upgrade must use `filter: drop-shadow` on gradient text elements.

### Anti-Patterns to Avoid

- **`Math.random()` in render body:** Causes Next.js 16 hydration hard errors. Already flagged in STATE.md. FloatingParticles correctly uses `useEffect` — preserve this pattern when adding useInView.
- **Animating `box-shadow` with Framer Motion `animate`:** Framer Motion animates box-shadow via JS which bypasses GPU compositing. Use CSS transitions (`transition-shadow duration-300`) for hover glow changes. Use static CSS for default glow states.
- **`text-shadow` on `bg-clip-text text-transparent` elements:** Has zero visible effect. Use `filter: drop-shadow()` instead.
- **Adding `"use client"` to layout.tsx to support MotionConfig:** Acceptable for this project. The alternative (thin `<Providers>` component) is cleaner but both work.
- **`animate={false}` vs `animate={{}}`:** When `isInView` is false, `animate={false}` stops and resets to initial; `animate={{}}` also stops but keeps current values. Use `animate={false}` for FloatingParticles (elements should disappear, not freeze mid-animation).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cursor position relative to element | manual `getBoundingClientRect` in state + re-render | `useMotionValue` + `.set()` in event handler | MotionValues update without re-render — critical for 60fps mouse tracking |
| Intersection detection | custom IntersectionObserver hook | `useInView` from framer-motion | Already imported, typed, handles SSR |
| Reduced motion detection | `window.matchMedia('(prefers-reduced-motion)')` | `MotionConfig reducedMotion="user"` | One-line global solution, handles SSR, reactive to OS change |
| Radial gradient string construction | template literal + useState + re-render | `useMotionTemplate` | Composes MotionValues into strings without triggering renders |

**Key insight:** The three hardest requirements (AES-03, AES-04, AES-05) each have a single framer-motion primitive that solves them completely. The value is in knowing which primitive maps to which requirement, not in building infrastructure.

---

## Common Pitfalls

### Pitfall 1: MotionConfig in Server Component
**What goes wrong:** `MotionConfig` is a Client Component. `app/layout.tsx` is a Server Component by default. Importing `MotionConfig` directly causes a build/runtime error: "You're importing a component that needs X. It only works in a Client Component."
**Why it happens:** Framer Motion components use React hooks internally, which requires the client boundary.
**How to avoid:** Either add `"use client"` to `layout.tsx` (simplest) or create a thin `components/Providers.tsx` with `"use client"` that wraps `MotionConfig`.
**Warning signs:** Build error or runtime error mentioning client-only hooks.

### Pitfall 2: text-shadow on transparent text
**What goes wrong:** Applying `text-shadow` or `text-glow` utility to elements with `bg-clip-text text-transparent` has no visible effect — the shadow renders where text pixels would be, but the text is transparent, so nothing shows.
**Why it happens:** CSS `text-shadow` renders based on the text fill area. When `color: transparent`, there are no colored pixels to shadow.
**How to avoid:** Audit which headings use gradient/transparent text. Apply `filter: drop-shadow()` to those elements instead.
**Warning signs:** Adding the text-shadow class and seeing no change in browser DevTools.

### Pitfall 3: Animating box-shadow via Framer Motion breaks GPU compositing
**What goes wrong:** Using `whileHover={{ boxShadow: "..." }}` in Framer Motion animates box-shadow via JavaScript, not CSS transitions. This forces the browser to repaint on every animation frame.
**Why it happens:** box-shadow is not a composited property (unlike transform/opacity).
**How to avoid:** Use CSS `transition: box-shadow 300ms ease` and class toggling (`group-hover:`), NOT Framer Motion `animate`/`whileHover` for shadow values.
**Warning signs:** DevTools Performance shows frequent paint operations during hover.

### Pitfall 4: FloatingParticles Math.random() in render
**What goes wrong:** Calling `Math.random()` during the render function produces different values on server vs client, causing a Next.js 16 hydration mismatch error.
**Why it happens:** SSR renders with one set of random values; hydration renders again with different values.
**How to avoid:** The existing code ALREADY handles this correctly (values are in `useEffect`). When editing FloatingParticles for AES-05, preserve the existing `useEffect` for particle generation and only ADD the `useInView` ref/hook.
**Warning signs:** Console error "Hydration failed because the initial UI does not match what was rendered on the server."

### Pitfall 5: useInView ref attached to invisible/zero-size element
**What goes wrong:** If `containerRef` is attached to a `div` with `position: absolute; inset: 0` but the parent has `overflow: hidden`, the IntersectionObserver may not fire correctly.
**Why it happens:** IntersectionObserver checks if the element's bounding rect intersects the viewport root.
**How to avoid:** Attach `ref` to the outermost wrapper of FloatingParticles and GradientOrb. Both components already have a concrete outer `div` (FloatingParticles) or `motion.div` (GradientOrb) — use those.
**Warning signs:** `isInView` always returns `false` or never changes.

### Pitfall 6: Privacy link route mismatch
**What goes wrong:** Fixing `href="#"` to `href="/privacy"` when the actual App Router page is at `app/privacy-policy/` (URL: `/privacy-policy`) results in a 404.
**Why it happens:** The directory name determines the URL segment in App Router.
**How to avoid:** The existing page is `app/privacy-policy/page.tsx` → URL is `/privacy-policy`. Use `href="/privacy-policy"` or use Next.js `<Link href="/privacy-policy">`. The requirement says "navigates to /privacy" — this means the existing privacy page, which is actually at `/privacy-policy`. Clarification: use the actual route `/privacy-policy`.
**Warning signs:** Clicking Privacy in footer goes to 404.

---

## Code Examples

Verified patterns from official sources and installed type definitions:

### MotionConfig in layout — Providers pattern
```tsx
// components/Providers.tsx
"use client";
import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
```

```tsx
// app/layout.tsx (stays Server Component)
import { Providers } from "@/components/Providers";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### SpotlightCard — Complete ServiceCard upgrade
```tsx
// components/ServiceCard.tsx
"use client";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { ReactNode, MouseEvent } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  bullets?: string[];   // NEW: capability bullets (SERV-01)
  index: number;
  className?: string;
}

export default function ServiceCard({ icon, title, description, bullets, index, className = "" }: ServiceCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const spotlightBackground = useMotionTemplate`
    radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(14, 165, 233, 0.1), transparent 80%)
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative group h-full ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: spotlightBackground }}
      />
      <div className="relative h-full bg-glass border border-glass-border rounded-3xl p-8 hover:border-primary/30 transition-colors duration-300 overflow-hidden neon-glow-card-hover">
        {/* ... icon, title, description ... */}
        {bullets && bullets.length > 0 && (
          <ul className="mt-4 space-y-1">
            {bullets.map((bullet, i) => (
              <li key={i} className="text-sm text-gray-500 flex items-start gap-2">
                <span className="text-primary mt-0.5">›</span>
                {bullet}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
```

### GlowButton — Three-layer neon upgrade
```tsx
// Upgrade the hover shadow in GlowButton.tsx
const variantClasses = {
  primary: "bg-white text-black hover:bg-gray-200 hover:[box-shadow:0_0_5px_rgba(255,255,255,0.9),0_0_20px_rgba(255,255,255,0.5),0_0_40px_rgba(255,255,255,0.2)]",
  secondary: "bg-transparent text-white border border-white/20 hover:border-primary/50 hover:[box-shadow:0_0_5px_rgba(14,165,233,0.8),0_0_20px_rgba(14,165,233,0.4),0_0_40px_rgba(14,165,233,0.2)]",
};
```

**Alternative:** Define `.neon-glow-white` and `.neon-glow-cyan` in `globals.css` and apply with `group-hover:` — cleaner for multi-layer values.

### globals.css neon utilities
```css
/* Three-layer neon glow utilities — upgrade existing .glow-cyan/.glow-purple */
.neon-glow-cyan {
  box-shadow:
    0 0 5px rgba(14, 165, 233, 0.9),
    0 0 20px rgba(14, 165, 233, 0.55),
    0 0 45px rgba(14, 165, 233, 0.25);
}

.neon-glow-purple {
  box-shadow:
    0 0 5px rgba(99, 102, 241, 0.9),
    0 0 20px rgba(99, 102, 241, 0.55),
    0 0 45px rgba(99, 102, 241, 0.25);
}

/* text-shadow for solid white headings */
.text-neon-white {
  text-shadow:
    0 0 8px rgba(255, 255, 255, 0.9),
    0 0 16px rgba(14, 165, 233, 0.6),
    0 0 32px rgba(14, 165, 233, 0.3);
}

/* drop-shadow for gradient (transparent) text — replaces text-shadow */
.text-neon-gradient {
  filter:
    drop-shadow(0 0 8px rgba(14, 165, 233, 0.8))
    drop-shadow(0 0 20px rgba(14, 165, 233, 0.4));
}
```

### Footer Privacy link fix
```tsx
// app/page.tsx — replace line 222
// BEFORE:
<a href="#" className="hover:text-white transition-colors">Privacy</a>

// AFTER (using Next.js Link for client-side navigation):
import Link from "next/link";
<Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual `matchMedia` for reduced motion | `MotionConfig reducedMotion="user"` | Framer Motion v5+ | Zero per-component code, reactive |
| CSS-only hover glows | CSS transitions for static glow + useMotionValue for cursor tracking | Pattern emerged ~2022 | Performance-correct separation |
| `animated boxShadow` in Framer whileHover | CSS `transition: box-shadow` + class toggle | Performance awareness | No JS per frame on non-composited property |
| `Math.random()` in render | `Math.random()` in `useEffect` (hydration fix) | Next.js SSR requirements | Eliminates hydration errors |

**Deprecated/outdated:**
- `useReducedMotion()` hook per-component: Superseded by global `MotionConfig reducedMotion="user"`. Still functional but verbose.
- `useAnimation()` for visibility-based pause: Works but `useInView` + conditional `animate` prop is simpler and more readable.

---

## Open Questions

1. **Privacy link URL: `/privacy` vs `/privacy-policy`**
   - What we know: The requirement says "navigates to /privacy"; the existing App Router page is at `app/privacy-policy/page.tsx` (URL: `/privacy-policy`)
   - What's unclear: Whether the requirement description uses a shorthand or means a different route slug
   - Recommendation: Use `href="/privacy-policy"` to match the existing page. If the URL must be `/privacy`, rename `app/privacy-policy/` to `app/privacy/` — but that is a one-line directory rename, not a new page.

2. **Service card capability bullets — content**
   - What we know: SERV-01 requires brief capability bullets for each of the 4 service cards
   - What's unclear: The actual copy for the bullets (what we automate, which APIs, which Shopify apps, what custom apps)
   - Recommendation: The planner should include placeholder bullets in the code change and flag them for copy review. The pattern and component interface need to be designed; the exact strings are content, not engineering.

3. **Neon glow on existing `.glass-card` vs ServiceCard**
   - What we know: ServiceCard does not use `.glass-card` utility class — it uses inline Tailwind classes directly
   - What's unclear: Whether the planner wants the neon glow on the ServiceCard border on hover only, or as a persistent ambient glow
   - Recommendation: Match the success criteria — "visible multi-layer neon glow that is noticeably more dramatic." Apply as a CSS `box-shadow` on the inner `div` of ServiceCard on `group-hover`, using CSS transition for performance. The SpotlightCard gradient handles the dynamic part; the border glow is the static enhancement.

---

## Phase Requirements Mapping

<phase_requirements>

| ID | Description | Research Support |
|----|-------------|-----------------|
| AES-01 | Three-layer neon box-shadow on buttons, service cards, and accent elements | Pattern 4 (Three-layer neon box-shadow); globals.css utility classes; GlowButton.tsx edit; ServiceCard.tsx border-glow |
| AES-02 | Neon text-shadow intensifying headings and gradient text | Pattern 5 (text-shadow + drop-shadow for gradient text); globals.css `.text-neon-white` and `.text-neon-gradient` utilities; critical CSS limitation documented |
| AES-03 | SpotlightCard hover — cursor illumination effect on ServiceCards | Pattern 2 (SpotlightCard); `useMotionValue` + `useMotionTemplate` + radial-gradient; full code example provided |
| AES-04 | `MotionConfig reducedMotion="user"` in layout.tsx | Pattern 1 (MotionConfig); `ReducedMotionConfig` type verified from installed package; Server Component pitfall and Providers solution documented |
| AES-05 | FloatingParticles and GradientOrb pause when scrolled off-screen | Pattern 3 (useInView); `UseInViewOptions` type verified from installed package; `animate={false}` pattern for stopping looping animations |
| SERV-01 | Service cards show brief capability bullets | `bullets?: string[]` prop addition to ServiceCard; JSX list pattern in code example; content (actual bullet copy) is an open question |
| FOOT-01 | Footer Privacy link navigates to /privacy-policy (not #) | One-line fix: replace `<a href="#">` with Next.js `<Link href="/privacy-policy">`; existing page confirmed at `app/privacy-policy/page.tsx` |

</phase_requirements>

---

## Sources

### Primary (HIGH confidence)

- Installed framer-motion 12.34.0 type definitions at `node_modules/framer-motion/dist/types/index.d.ts` — `ReducedMotionConfig`, `MotionConfigProps`, `UseInViewOptions`, `useInView`, `useMotionValue`, `useMotionTemplate` types all verified
- Codebase read: all 5 components, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/privacy-policy/page.tsx`, `tailwind.config.ts`, `package.json` — existing patterns confirmed
- buildui.com/recipes/spotlight — SpotlightCard pattern with `useMotionValue` + `useMotionTemplate` (content verified, matches type definitions)

### Secondary (MEDIUM confidence)

- WebSearch: MotionConfig `reducedMotion="user"` behavior — confirmed with official docs reference (framer.com/motion/motion-config, motion.dev/docs/react-motion-config); framer-motion docs not WebFetch-able due to client-side rendering
- WebSearch: useInView hook behavior for pausing looping animations — `animate={false}` pattern referenced from motion guides
- WebSearch: Multi-layer `box-shadow` and `text-shadow` neon techniques — standard CSS, confirmed by multiple developer sources; CSS limitation re: `text-shadow` on `bg-clip-text text-transparent` is well-known

### Tertiary (LOW confidence)

- None — all critical claims are backed by direct package inspection or verified secondary sources

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions from package.json, APIs from installed type definitions
- Architecture patterns: HIGH — patterns verified from installed package types + direct code inspection
- CSS neon techniques: HIGH — standard CSS, browser-native, multiple sources agree
- Pitfalls: HIGH — hydration pitfall from STATE.md (already encountered), others from CSS spec knowledge and framer-motion behavior

**Research date:** 2026-02-21
**Valid until:** 2026-03-21 (stable APIs — framer-motion 12 is current; Next.js 16 is current)
