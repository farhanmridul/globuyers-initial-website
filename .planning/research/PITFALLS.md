# Pitfalls Research

**Domain:** Heavy-animation dark neon agency website (Framer Motion + CSS glow effects)
**Researched:** 2026-02-21
**Confidence:** HIGH (performance and accessibility claims verified against official Motion docs and MDN; visual design patterns verified against multiple community sources)

---

## Critical Pitfalls

### Pitfall 1: Animating `filter: blur()` and `box-shadow` Instead of Transform/Opacity

**What goes wrong:**
Adding neon glow effects via animated `box-shadow` or `filter: blur()` causes the browser to repaint on every frame instead of GPU-compositing. At high blur radii (the `blur-3xl` Tailwind class = `blur(64px)`), the GPU work scales exponentially. With multiple orbs and particles animating simultaneously, this drops below 60fps on mid-range mobile devices.

The existing `GradientOrb.tsx` already does this: it animates `scale` and `opacity` on a `blur-3xl` element. The blur itself is static (good) but the animated element has a huge composited blur layer, which the GPU must resize on every frame during the `scale` keyframe animation.

**Why it happens:**
Developers reach for CSS glow utilities (`.glow-cyan`, `.glow-purple`, `blur-3xl`) because they look correct immediately. The performance cost is invisible in Chrome DevTools unless you profile with CPU throttling enabled.

**How to avoid:**
- Animate **only `transform` and `opacity`** on elements that carry blur or box-shadow. Never animate `box-shadow`, `filter`, or `backdrop-filter` directly.
- For orbs: keep `blur-3xl` static. Animate `scale` and `opacity` using Framer Motion — this is acceptable because the blur layer itself is not being recalculated, just scaled. However, verify with DevTools that GPU layers are not fragmenting.
- For neon glows on hover: use CSS `transition` on `box-shadow` at low blur radius (≤20px) rather than animating with JS. Framer Motion's `whileHover` with `boxShadow` changes are particularly expensive — use a CSS class swap via `group-hover:` instead.
- Keep `filter: blur()` values under 20px for animated elements. Static (non-animated) blurs can be larger.

```tsx
// BAD: Animating box-shadow with Framer Motion
<motion.div whileHover={{ boxShadow: "0 0 40px rgba(0,212,255,0.8)" }} />

// GOOD: CSS transition via Tailwind group-hover class swap
<div className="transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.5)]" />
```

**Warning signs:**
- Chrome DevTools Performance panel shows "Paint" and "Composite" taking >2ms per frame during scroll
- Dropped frames visible when hovering service cards
- Safari on iPhone shows flickering on any element with both blur and animation
- DevTools Layers panel shows dozens of compositor layers (more than 10-15 is a red flag)

**Phase to address:** Every phase that adds new animated elements. Establish this rule before adding the "How We Work" steps and "Tech Stack" sections, as those will likely introduce more orbs and glowing badges.

---

### Pitfall 2: `backdrop-filter: blur()` on Multiple Overlapping Elements

**What goes wrong:**
The floating header uses `backdrop-blur-md` (`backdrop-filter: blur(12px)`). The existing glass card style also uses `backdrop-filter: blur(10px)`. When new sections stack these (e.g., a glassmorphism "How We Work" card behind a GradientOrb), you can have 3-5 elements simultaneously requiring `backdrop-filter` compositing. Mobile Safari has documented severe performance issues with `backdrop-filter` — it creates a new stacking context and composites the entire subtree behind it on every frame.

**Why it happens:**
`backdrop-filter: blur()` is visually beautiful for glass UI and is a reflexive choice when building dark neon UIs. The `glass-card` class in `globals.css` makes it trivially easy to apply to new components.

**How to avoid:**
- Limit `backdrop-filter` to **at most 2-3 simultaneously visible elements** at any scroll position.
- The header is permanent — that's slot 1. Budget only 1-2 more across the full visible viewport.
- For new section cards, use a semi-transparent background color (`bg-white/[0.03]`) without `backdrop-filter` as the default, and reserve `backdrop-filter` only for the single most prominent element per section.
- On mobile, consider removing `backdrop-filter` entirely via `@supports` fallback:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@supports (backdrop-filter: blur(10px)) {
  .glass-card {
    backdrop-filter: blur(10px);
  }
}
```

**Warning signs:**
- Scrolling feels laggy specifically on iOS Safari
- Chrome DevTools shows "GPU memory" approaching 60MB+ when multiple glass cards are visible
- Any section with 3+ `backdrop-blur` elements simultaneously visible

**Phase to address:** New sections ("How We Work", "Why GloBuyers") — design these sections before defaulting to `glass-card` on every card.

---

### Pitfall 3: `Math.random()` in Components That Are Server-Rendered (Hydration Mismatch)

**What goes wrong:**
The existing `FloatingParticles.tsx` uses `Math.random()` inside `useEffect` with an empty dependency array — this is currently safe because it runs only on the client. But if any new component calls `Math.random()` during render (not inside `useEffect`), or if the component is accidentally server-rendered without the `"use client"` directive, Next.js will throw a hydration mismatch. In Next.js 16, this error is now a hard error (not just a warning) and can white-screen the app.

This is especially risky for new visual components that generate random star positions, tech stack badge layouts, or particle effects for new sections.

**Why it happens:**
Developers copy the particle pattern but forget that random values must be deferred to client-side. Next.js 16 also introduced stricter pre-rendering rules that flag `Math.random()` in Client Components without a Suspense fallback.

**How to avoid:**
- Always generate random values inside `useEffect`, never in the render body or during `useState` initialization.
- For any new animated component with procedural generation, use `dynamic(() => import('./Component'), { ssr: false })` as a safe default.
- Add `useMemo` with a stable seed if deterministic randomness is needed for SSR.

```tsx
// BAD: Math.random() in render
const particles = Array.from({ length: 20 }, () => ({ x: Math.random() * 100 }));

// GOOD: Math.random() deferred to useEffect
const [particles, setParticles] = useState<Particle[]>([]);
useEffect(() => {
  setParticles(Array.from({ length: 20 }, () => ({ x: Math.random() * 100 })));
}, []);
if (particles.length === 0) return null;
```

**Warning signs:**
- "Hydration failed" console error on initial page load
- Component renders blank on first SSR pass then "pops in"
- Next.js build warning: "Cannot access `Math.random()` from a Client Component without a fallback UI"

**Phase to address:** Any phase adding new procedurally-generated visual components (star fields, grid patterns, badge arrangements).

---

### Pitfall 4: Infinite Animations Running Off-Screen Drain CPU/Battery

**What goes wrong:**
`FloatingParticles` runs 20 particles with `repeat: Infinity` animations. `GradientOrb` runs an 8-second infinite loop. When the user scrolls down to services or contact sections, these hero animations continue running full speed even though they are completely off-screen. On a full scroll through the page, the hero animations run the entire time. When new sections add their own infinite animations (e.g., a pulsing glow ring, animated tech stack icons), CPU usage compounds.

Browsers throttle `requestAnimationFrame` in background tabs, but not for off-screen elements in the same tab. This causes measurable battery drain on mobile.

**Why it happens:**
`repeat: Infinity` is the default pattern for ambient background effects. Developers don't connect off-screen rendering to battery cost because DevTools shows smooth FPS until a mobile user reports heat or drain.

**How to avoid:**
- Use `useInView` from `framer-motion` to pause infinite animations when their container leaves the viewport:

```tsx
import { useInView } from "framer-motion";
import { useRef } from "react";

const ref = useRef(null);
const isInView = useInView(ref, { margin: "0px 0px -100px 0px" });

<motion.div
  ref={ref}
  animate={isInView ? { scale: [1, 1.2, 1] } : false}
  transition={{ repeat: Infinity, duration: 8 }}
/>
```

- Alternatively, add `visibility: hidden` via CSS when section is off-screen (browser skips paint for hidden elements).
- For the `FloatingParticles` component specifically: pass the `isInView` state as a prop and conditionally set `animate` to a frozen state when false.

**Warning signs:**
- Chrome Task Manager shows CPU at 20%+ while page is idle and user has scrolled past hero
- Mobile device heats up after 2-3 minutes on the page
- 20+ Framer Motion animation subscribers shown in React DevTools

**Phase to address:** Hero section enhancement. Establish the `useInView` pause pattern here before it proliferates to new sections.

---

## Moderate Pitfalls

### Pitfall 5: Neon Glow Overuse Destroys Visual Hierarchy

**What goes wrong:**
When every section gets a glow accent — cyan headlines, purple borders, pink orbs, glowing icons, glowing CTA buttons — the eye has no resting point. The page looks "maximum" but communicates nothing. Ecommerce brand owners evaluating an agency need to scan services quickly; glow-as-hierarchy only works when it's scarce.

The specific risk: "How We Work" process steps, "Tech Stack" badges, and "Why GloBuyers" differentiators all being built with the same glow-everything approach turns a page meant to impress into a page that exhausts.

**Prevention:**
- Apply the rule: **one glowing element per visible viewport at any time**. The primary CTA or current section heading gets the glow; everything else is muted.
- Use glow for state changes (hover, active) not as a default resting state for all elements.
- Text glow (`text-shadow`) should be reserved for the single most important headline per section, not sub-headings or body text.
- "Why GloBuyers" differentiators: use restrained icon treatment (small colored dot or thin line accent) rather than glowing cards.

**Warning signs:**
- Squinting at the full-page screenshot and being unable to identify the most important element
- More than 3 distinct `text-glow`, `.glow-cyan`, or `.glow-purple` elements visible at once when scrolling through any section

**Phase to address:** Design decisions during new section implementation ("How We Work", "Tech Stack", "Why GloBuyers").

---

### Pitfall 6: Neon Text Fails WCAG Contrast and Halation on Dark Backgrounds

**What goes wrong:**
The existing `.text-glow` class uses `text-shadow: 0 0 10px rgba(0,212,255,0.8)`. For users with astigmatism (approximately 50% of the population), bright text on a very dark background (`#050505`) causes halation — the text appears to bleed outward, making it harder to read. WCAG 2.0 AA requires 4.5:1 contrast for body text. A neon-cyan `#00D4FF` on `#050505` passes contrast (high luminance), but with a glow halo the effective background becomes lighter, and body text in `text-gray-400` (`#9CA3AF`) on `#050505` sits right at the edge of compliance.

**Prevention:**
- Never apply `text-glow` to body text or descriptions — only to headline accent text (large text has a lower WCAG threshold of 3:1).
- After adding glows, validate contrast with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) using the visual background color, not just `#050505`.
- Gray body text: `text-gray-400` (`#9CA3AF`) on `#050505` has a contrast ratio of approximately 5.8:1 — passes AA but fails AAA. Do not darken body text further (e.g., `text-gray-500`) as new content is added.
- Keep gradient text (used on "Digital Commerce" headline) purely decorative — never the only carrier of meaningful information.

**Warning signs:**
- Body copy or description text using the `text-glow` class
- Text color classes below `text-gray-400` on dark backgrounds (e.g., `text-gray-500`, `text-gray-600`)
- Running axe-core in browser DevTools finds contrast violations after new sections are added

**Phase to address:** All sections. Run a contrast audit after each new section is built, not at the end.

---

### Pitfall 7: `useScroll` on the Container Causes React Re-renders

**What goes wrong:**
`app/page.tsx` uses `useScroll` on `containerRef` to drive hero section parallax (`opacity` and `scale` via `useTransform`). Framer Motion's `useScroll` returns motion values, which by design do not trigger React re-renders — they update styles via the WAAPI/direct DOM manipulation. This is currently correct. However, if any developer adds `useState` listeners to scroll position (e.g., `const [scrolled, setScrolled] = useState(false)`) for conditional rendering or class switching, that pattern fires React re-renders on every scroll event at 60fps.

**Why it happens:**
Developers unfamiliar with Framer Motion's motion values reach for `useState` for scroll-triggered class changes because it's the familiar React pattern.

**Prevention:**
- For all scroll-triggered visual changes: use Framer Motion's `useScroll` + `useTransform` + `motion.div style={...}` to keep updates off the React render cycle.
- For conditional class changes driven by scroll position: use `useMotionValueEvent` (Framer Motion's subscribe API) or `useInView` instead of `useState`.
- Never do: `window.addEventListener('scroll', () => setState(...))`.

```tsx
// BAD: useState scroll listener - re-renders on every scroll event
const [scrolled, setScrolled] = useState(false);
useEffect(() => {
  window.addEventListener('scroll', () => setScrolled(window.scrollY > 100));
}, []);

// GOOD: motion value - zero React re-renders
const { scrollY } = useScroll();
const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
<motion.div style={{ opacity: headerOpacity }} />
```

**Warning signs:**
- React DevTools Profiler shows the root `Home` component re-rendering while scrolling
- `useState` being used with scroll position values anywhere in the component tree
- `window.addEventListener('scroll', ...)` patterns in any component

**Phase to address:** Header enhancement and any section that changes visual state based on scroll position (e.g., sticky nav highlighting, progress indicators).

---

### Pitfall 8: Staggered Entrance Animations Firing Together on Page Load

**What goes wrong:**
The bento grid `ServiceCard` components use `delay: index * 0.1` to stagger, but this only works because `whileInView` defers them until scroll. New sections ("How We Work" steps, "Tech Stack" badges) may use `initial`/`animate` instead of `whileInView`, causing all entrance animations to fire simultaneously on page load — the hero plays while services stagger while process steps cascade while tech badges pop. Total animation duration can reach 3-4 seconds before the page feels settled. Visitors waiting for animations to complete before reading content will leave.

**Prevention:**
- Every new section's entrance animation must use `whileInView={{ ... }} viewport={{ once: true }}`. No exceptions for below-the-fold content.
- For above-the-fold content (hero), use `initial`/`animate` but keep total duration under 800ms.
- Stagger delays should cap at 0.4-0.5 seconds total (e.g., 5 items × 0.08s = 0.4s max stagger).

```tsx
// GOOD: whileInView pattern for all below-the-fold sections
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: index * 0.08 }}
  viewport={{ once: true, margin: "0px 0px -50px 0px" }}
/>
```

**Warning signs:**
- Page feels "busy" or jittery for more than 1 second after load
- Multiple sections animating simultaneously when first visiting the page
- New components using `animate` prop instead of `whileInView` for below-the-fold content

**Phase to address:** Every phase adding new sections. Review animation triggers during code review.

---

### Pitfall 9: Missing `prefers-reduced-motion` Support

**What goes wrong:**
The current codebase has no `prefers-reduced-motion` handling (confirmed in `CONCERNS.md`). Users with vestibular disorders who set "Reduce Motion" in their OS settings still experience 20 looping particles, pulsing orbs, parallax hero, and staggered section reveals. This is a WCAG 2.1 Level AA violation (Success Criterion 2.3.3 in AAA, 2.2.2 in AA). Beyond compliance, motion sickness is a real user experience concern for this category of visitor.

**Prevention:**
Wrap the entire app with `MotionConfig` from Framer Motion in `layout.tsx`. The `reducedMotion="user"` setting automatically disables transform animations and respects the OS preference:

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

Note: `reducedMotion="user"` disables transform/layout animations but preserves opacity transitions (which are less problematic for vestibular disorders). For the `FloatingParticles` component, add a `useReducedMotion()` check and return null if true — the MotionConfig does not suppress the component from mounting.

```tsx
import { useReducedMotion } from "framer-motion";

export default function FloatingParticles() {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return null;
  // ... rest of component
}
```

**Warning signs:**
- OS "Reduce Motion" enabled → page still shows looping particles and parallax hero
- No `MotionConfig` in `layout.tsx` or root component
- No `useReducedMotion()` checks in infinite-loop components

**Phase to address:** First phase (baseline improvements). This should be in place before adding more animations, not retrofitted at the end.

---

## Minor Pitfalls

### Pitfall 10: Bento Grid Layout Breaks When Service Card Content Grows

**What goes wrong:**
The 3-column bento grid uses `auto-rows-[300px]` with fixed heights and `md:row-span-2` on the main service card. If capability descriptions are added to service cards (an active requirement in PROJECT.md), the fixed height clips content or forces overflow. The card's `overflow-hidden` on the inner div will silently truncate bullet points.

**Prevention:**
- Switch `auto-rows-[300px]` to `auto-rows-[minmax(300px,auto)]` when adding content to cards — allows rows to grow beyond 300px if content requires it.
- Test all cards at minimum content AND maximum content length before finalizing.
- Set an explicit `min-h-[300px]` on cards rather than a fixed height.

**Warning signs:**
- Text visible in component preview but clipped at the `300px` boundary in browser
- Service card descriptions appear cut off without a "..." truncation indicator

**Phase to address:** Service card enhancement phase.

---

### Pitfall 11: Emoji Icons Break on Some Platforms and Have No Accessibility Semantics

**What goes wrong:**
The service cards use emoji as icons (`🚀`, `🛍️`, `⚡`, `🔌`). Emoji render differently across OS and browser versions (different shapes, colors, even different Unicode support). They also have no `aria-label` or `role="img"` applied, so screen readers announce the literal emoji description ("Rocket", "Shopping Bags", etc.) rather than the service intent.

**Prevention:**
- Replace emoji with SVG icons (from a library like `lucide-react`, already a candidate for this stack) or with inline SVG.
- If emoji are kept for any reason, wrap them: `<span role="img" aria-label="Custom software development">🚀</span>`.

**Warning signs:**
- Icons appear as boxes on Windows 7 / older Android
- Screen reader announces "Rocket. Custom Software Development" instead of the expected semantics

**Phase to address:** Service card enhancement (coincides with adding capability descriptions).

---

### Pitfall 12: `will-change` Applied Globally or Permanently Wastes GPU Memory

**What goes wrong:**
As animation complexity increases, developers sometimes add `will-change: transform` to many elements as a premature optimization. Each element with `will-change` gets promoted to its own GPU compositor layer. With 20 particles + 3 orbs + staggered section entries + new elements, the compositor layer count can exceed 50, fragmenting GPU memory and paradoxically making performance worse.

The `CONCERNS.md` already notes "add `will-change: transform` CSS class" as an improvement — this is correct, but only when applied surgically, not broadly.

**Prevention:**
- Apply `will-change: transform` only to elements that animate continuously (the GradientOrb infinite loops) — not to elements that animate once on scroll entry.
- Remove `will-change` after one-shot animations complete using an `onAnimationComplete` callback.
- Never apply `will-change` via a shared CSS class — apply it only in the specific component's style when the animation is active.

**Warning signs:**
- Chrome DevTools Layers panel shows 30+ compositor layers
- GPU memory usage above 100MB on a marketing site page

**Phase to address:** Performance audit after each new section is added.

---

### Pitfall 13: Key Prop Using Array Index on Animated Lists

**What goes wrong:**
`FloatingParticles` and `AnimatedText` use array index as `key` (`key={index}`). This is acceptable when the array is static and never reorders. However, if any new component generates dynamic lists that can reorder or update (e.g., animated tech stack badges that filter/sort), using index as key causes Framer Motion's animation state to be applied to the wrong element during re-renders, producing glitched animations where elements snap instead of transitioning.

**Prevention:**
- For static lists (particles, words), index keys are acceptable — the array never changes.
- For any animated list that can be filtered, sorted, or updated: use stable unique IDs as keys.
- Tech stack badges that might be grouped by category and toggled should use the tech name as key.

**Warning signs:**
- Animated items "jump" or snap when the list changes
- Framer Motion exit animations fire on wrong elements

**Phase to address:** Tech Stack section implementation.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Hardcoded particle count (20) | Simple code | Frame drops on low-end mobile when sections add more infinite animations | Only acceptable if total infinite-loop animation count stays below 25 across entire page |
| CSS `blur-3xl` on animated elements | Easy visual effect | Expensive GPU layer; scales poorly as more orbs added | Acceptable if animation is only `opacity`/`scale`, never `filter` or position |
| No `LazyMotion` / using full `motion` import | Simple imports | Full Framer Motion bundle (~34kb) loaded even for sections below fold | Acceptable for current page size; revisit if total JS bundle exceeds 200kb |
| `Math.random()` in `useEffect` without seed | Simple randomness | Hydration mismatch if directive omitted; different layout every load | Acceptable with `"use client"` directive always present |
| Inline `scrollToSection` with `document.getElementById` | Quick implementation | Silently fails if ID renamed; not refactor-safe | Never acceptable for new code — use React refs |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Animating `box-shadow` with Framer Motion | Hover on service cards causes visible lag | Use CSS `transition` + `box-shadow` via Tailwind instead of Framer Motion | At 3+ simultaneously hovered elements |
| Multiple simultaneous `backdrop-filter` elements | Scroll lag on iOS Safari; janky header | Limit to 2-3 per viewport | At 3+ overlapping backdrop-blur elements |
| `blur-3xl` on elements that animate `scale` | Heavy GPU layer resizing on each frame | Static blur, or reduce blur radius to ≤20px on animated elements | On mobile devices with <4GB RAM |
| 20+ particles with `repeat: Infinity` while page is scrolled | CPU at 15-20% with idle page | Pause animations with `useInView` when container off-screen | Immediately on page load for users who scroll quickly |
| `useTransform` with `boxShadow` strings | Animated glow looks right but tanks scroll performance | Avoid `boxShadow` in Framer Motion; use static CSS glows with CSS transitions | At any scale on mobile |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Glow on every element simultaneously | Eye fatigue; no clear CTA hierarchy; brand looks "tryhard" | Reserve strongest glow for 1 primary action per section |
| Long stagger delays on process steps | User reads step 1 and waits for steps 2-4 to appear | Cap total stagger at 400ms; show content faster than decoration |
| Parallax hero fades entire headline to 0 opacity on scroll | Users who scroll quickly miss the headline entirely | Keep `opacity` minimum at 0.1, not 0; or shorten the fade distance |
| Text glow on body copy | Halation makes small text unreadable for users with astigmatism | Text glow on headings only (≥32px) |
| Scroll-to-section anchors with no keyboard support | Keyboard users cannot activate "Our Expertise" and "Let's Talk" buttons | Ensure `GlowButton` passes `onClick` keyboard events (currently uses `motion.button` which is accessible) |

---

## "Looks Done But Isn't" Checklist

- [ ] **Reduced Motion:** `MotionConfig reducedMotion="user"` in `layout.tsx` — verify by enabling OS Reduce Motion and checking that particles and orbs stop
- [ ] **Contrast compliance:** Run axe-core after each new section — check body text specifically (not just headlines)
- [ ] **Infinite animations paused off-screen:** Verify with Chrome DevTools Performance tab that CPU usage drops after scrolling past hero
- [ ] **Mobile performance:** Test on Chrome DevTools with CPU 4x throttle — service card hover and scroll should maintain 50+ fps
- [ ] **Safari backdrop-filter:** Open in Safari and scroll through all sections — no flickering or blank areas on glass cards
- [ ] **Hydration check:** New random/dynamic components must use `"use client"` directive and defer randomness to `useEffect`
- [ ] **Footer links wired:** Privacy and Terms links must point to real routes (not `#`) before launch
- [ ] **Stagger triggers:** All below-the-fold section animations use `whileInView` with `viewport={{ once: true }}`

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Animated box-shadow on 5+ elements | LOW | Replace `whileHover={{ boxShadow }}` with Tailwind `hover:shadow-[...]` CSS classes; 30 min per component |
| 5+ backdrop-filter elements causing Safari lag | LOW-MEDIUM | Remove `backdrop-filter` from all but header and 1 hero element; test in Safari; 1 hour |
| Hydration mismatch from Math.random() | LOW | Add `"use client"` directive + move randomness into `useEffect`; 15 min per component |
| No reduced-motion support discovered post-build | LOW | Add `MotionConfig reducedMotion="user"` to `layout.tsx` and `useReducedMotion()` check in `FloatingParticles`; 1 hour total |
| WCAG contrast failures post-launch | MEDIUM | Audit with axe-core, bump text colors from `gray-500` to `gray-400` minimum; 2-4 hours |
| Bento grid clips content after service descriptions added | MEDIUM | Replace fixed `auto-rows-[300px]` with `auto-rows-[minmax(300px,auto)]`; requires layout regression testing; 2-3 hours |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Animated blur/box-shadow triggers repaint | Neon aesthetic enhancement | DevTools Performance profile: no Paint events during hover/scroll |
| Multiple backdrop-filter elements | New section implementation (How We Work, Why GloBuyers) | Safari manual test; layer count in DevTools |
| Math.random() hydration mismatch | Any new procedural visual component | Next.js build output: no hydration warnings; hard reload test |
| Infinite animations running off-screen | Hero section enhancement | Chrome Task Manager: CPU <5% when hero scrolled off |
| prefers-reduced-motion not respected | First phase (baseline) | OS Reduce Motion toggle test; particles must stop |
| Neon overuse / no visual hierarchy | Design review before each new section | Screenshot squint test: 1 dominant element per viewport |
| WCAG contrast failure | All sections | axe-core browser extension after each section |
| useScroll with useState re-renders | Header/scroll-triggered state | React DevTools Profiler: root component must not re-render on scroll |
| Fixed bento grid height clips content | Service card enhancement | Test at maximum content length before committing |
| Stagger animations all fire on load | All new sections | Load page cold: only hero section animates immediately |

---

## Sources

- [Motion: Web Animation Performance Tier List](https://motion.dev/magazine/web-animation-performance-tier-list) — tier list of CSS properties by compositing cost
- [Motion: reduce-bundle-size docs](https://motion.dev/docs/react-reduce-bundle-size) — LazyMotion / domAnimation optimization (HIGH confidence)
- [Motion: inView docs](https://motion.dev/docs/inview) — viewport-triggered animations with `once: true` (HIGH confidence)
- [MDN: backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter) — browser support and compositing behavior
- [MDN: CSS filter effects](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Filter_effects) — filter performance characteristics
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) — media query specification (HIGH confidence)
- [Next.js: Hydration error docs](https://nextjs.org/docs/messages/react-hydration-error) — official guidance on Math.random() and SSR (HIGH confidence)
- [Next.js: next-prerender-random-client](https://nextjs.org/docs/messages/next-prerender-random-client) — specific Next.js 16 Math.random() error (HIGH confidence)
- [Framer Motion issue #985: Filter blur glitch](https://github.com/framer/motion/issues/985) — documented blur animation artifact in Chromium
- [Framer Motion issue #625: AnimatePresence memory leak](https://github.com/framer/motion/issues/625) — documented memory leak pattern (MEDIUM confidence)
- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/) — WCAG contrast ratios (HIGH confidence)
- [How not to use box shadows](https://dgerrells.com/blog/how-not-to-use-box-shadows) — box-shadow performance analysis
- [CSS GPU Acceleration: will-change guide (2025)](https://www.lexo.ch/blog/2025/01/boost-css-performance-with-will-change-and-transform-translate3d-why-gpu-acceleration-matters/) — will-change overuse consequences (MEDIUM confidence)
- [Framer: A Guide to Not Overdoing Framer Effects](https://framer.university/blog/a-guide-to-not-overdoing-framer-effects) — visual design restraint guidance (MEDIUM confidence)
- [Design accessible animation and movement (2025)](https://blog.pope.tech/2025/12/08/design-accessible-animation-and-movement/) — accessibility implementation patterns
- [When browsers throttle requestAnimationFrame](https://motion.dev/blog/when-browsers-throttle-requestanimationframe) — browser throttling behavior for infinite animations

---

*Pitfalls research for: GloBuyers dark neon agency website (Framer Motion 12 + Tailwind CSS 4 + Next.js 16)*
*Researched: 2026-02-21*
