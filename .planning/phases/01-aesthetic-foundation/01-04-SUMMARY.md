---
phase: 01-aesthetic-foundation
plan: "04"
subsystem: ui
tags: [framer-motion, next-js, tailwind, service-card, spotlight-effect, neon-glow]

# Dependency graph
requires:
  - phase: 01-aesthetic-foundation
    provides: neon CSS utility classes (neon-glow-cyan, text-neon-gradient, text-neon-white) from 01-01
provides:
  - ServiceCard with SpotlightCard cursor-tracking radial gradient effect (useMotionValue + useMotionTemplate)
  - ServiceCard three-layer neon border glow via hover:neon-glow-cyan
  - ServiceCard bullets?: string[] prop for capability bullets rendering
  - page.tsx with all four ServiceCards receiving capability bullets props
  - Gradient h1 heading with text-neon-gradient drop-shadow glow
  - "Command Center" and "Ready to Upgrade?" headings with text-neon-white text-shadow
  - Footer Privacy link fixed to route to /privacy-policy via Next.js Link
affects:
  - phase-02 (ServiceCard is primary interactive element visible on every scroll pass)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SpotlightCard pattern: useMotionValue(0) for mouseX/mouseY, onMouseMove calls set(), useMotionTemplate composes radial-gradient — updates at 60fps without React re-renders"
    - "Cursor-tracking spotlight: motion.div with absolute -inset-px, opacity-0 group-hover:opacity-100, style={spotlightBackground}"
    - "Hover neon glow: hover:neon-glow-cyan applies three-layer box-shadow via CSS class transition — no JS needed"
    - "Gradient text glow: text-neon-gradient uses filter drop-shadow (not text-shadow) because text-shadow is invisible on bg-clip-text transparent elements"

key-files:
  created: []
  modified:
    - components/ServiceCard.tsx
    - app/page.tsx

key-decisions:
  - "whileHover lift animation removed from ServiceCard — spotlight cursor effect provides sufficient and more premium hover feedback without jitter from combined animations"
  - "useMotionValue + useMotionTemplate for spotlight (not animated boxShadow) — updates gradient position without triggering React re-renders, critical for 60fps tracking"
  - "Spotlight motion.div uses absolute -inset-px to sit just inside card border — subtle positioning prevents border occlusion"
  - "bullets prop is optional (bullets?) — backward compatible, existing usages without bullets continue to work"
  - "Service card bullets flagged for copy review — technical specifics are directionally correct but content owner should confirm"

patterns-established:
  - "SpotlightCard: useMotionValue + useMotionTemplate radial-gradient cursor tracking — use this pattern for any future card with cursor illumination"
  - "Text glow split by type: gradient text uses text-neon-gradient (filter drop-shadow), solid text uses text-neon-white (text-shadow)"

requirements-completed: [AES-01, AES-02, AES-03, SERV-01, FOOT-01]

# Metrics
duration: 2min
completed: 2026-02-21
---

# Phase 1 Plan 04: ServiceCard SpotlightCard Effect + Bullets + Heading Glow Summary

**ServiceCard upgraded with cursor-tracking radial spotlight (useMotionValue/useMotionTemplate), three-layer neon border glow on hover, and capability bullets prop; page headings have neon glow and footer Privacy link routes to /privacy-policy**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-21T09:21:57Z
- **Completed:** 2026-02-21T09:23:29Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- ServiceCard now renders a radial gradient spotlight that follows the cursor at 60fps using framer-motion MotionValues — no React re-renders on mouse move
- All four service cards display 3-4 capability bullets, giving visitors concrete technical specifics (SERV-01)
- Gradient "Digital Commerce" heading now glows with filter drop-shadow (the correct approach for bg-clip-text transparent elements), solid headings use text-shadow (AES-02)
- Footer Privacy link changed from dead `<a href="#">` to `<Link href="/privacy-policy">` routing to the existing privacy policy page (FOOT-01)

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade ServiceCard.tsx — SpotlightCard effect + neon glow + bullets prop** - `ef10b36` (feat)
2. **Task 2: Update page.tsx — bullets, heading glow, Privacy link fix** - `93fb33e` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified
- `components/ServiceCard.tsx` - Added useMotionValue/useMotionTemplate spotlight, hover:neon-glow-cyan, optional bullets prop and rendering
- `app/page.tsx` - Added Link import, text-neon-gradient on gradient heading, text-neon-white on two solid headings, bullets prop on all four ServiceCards, Privacy link fix

## Decisions Made
- Removed `whileHover={{ y: -5 }}` lift animation — the cursor spotlight provides richer hover feedback; the lift combined with spotlight tracking feels jittery
- Used `useMotionValue + useMotionTemplate` instead of animating a state variable — avoids per-frame React re-renders, keeps spotlight updates in Framer's animation loop only
- Spotlight overlay uses `absolute -inset-px` positioning — sits just inside the border so the glow gradient stays inside the rounded card boundary
- `bullets?` optional prop preserves backward compatibility; no default value needed since the render block guards with `bullets && bullets.length > 0`

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. TypeScript check and production build both passed immediately after implementation.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- ServiceCard is now the premium interactive element the plan calls for — spotlight + neon glow + bullets complete
- All AES-01, AES-02, AES-03, SERV-01, FOOT-01 requirements satisfied
- Capability bullets marked for content owner copy review (technical patterns correct, specifics should be confirmed)
- Phase 1 remaining plans: 02, 03, 05 (this was plan 04 in wave 2)

## Self-Check: PASSED

- FOUND: components/ServiceCard.tsx
- FOUND: app/page.tsx
- FOUND: .planning/phases/01-aesthetic-foundation/01-04-SUMMARY.md
- FOUND: ef10b36 (ServiceCard upgrade commit)
- FOUND: 93fb33e (page.tsx update commit)

---
*Phase: 01-aesthetic-foundation*
*Completed: 2026-02-21*
