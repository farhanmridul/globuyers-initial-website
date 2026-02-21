---
phase: 01-aesthetic-foundation
plan: 03
subsystem: ui
tags: [tailwind, framer-motion, neon-glow, css-utilities, box-shadow, text-shadow]

# Dependency graph
requires:
  - phase: 01-aesthetic-foundation plan 01
    provides: neon-glow-white, neon-glow-cyan, text-neon-white CSS utility classes in globals.css
provides:
  - GlowButton with three-layer neon hover glow (white on primary, cyan on secondary)
  - AnimatedText with persistent neon text-shadow on "The Future of" hero heading
affects:
  - 01-aesthetic-foundation (all remaining plans using GlowButton or AnimatedText)
  - phase-02 (any future button or hero text components)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@utility syntax in Tailwind v4 enables hover: and other variant prefixes on custom CSS classes"
    - "CSS transition-shadow + custom class toggling via hover: prefix (no Framer Motion animate for box-shadow)"

key-files:
  created: []
  modified:
    - components/GlowButton.tsx
    - components/AnimatedText.tsx
    - app/globals.css

key-decisions:
  - "Tailwind v4 @utility syntax required for hover: variant support on custom classes — plain .class{} definitions outside @layer utilities do not support Tailwind variant prefixes"
  - "text-neon-white applied at component level (AnimatedText), not passed via className prop — glow is a component-level visual property, not a layout concern"
  - "whileHover scale kept on GlowButton — transform-based animations are GPU-composited; only shadow hover pattern changed"

patterns-established:
  - "hover-variant-on-custom-utilities: Register CSS custom utilities with @utility so Tailwind v4 variant prefixes (hover:, focus:, etc.) apply correctly"
  - "component-owns-its-glow: Visual glow effects are applied in the component itself, not delegated to the caller via className"

requirements-completed: [AES-01, AES-02]

# Metrics
duration: 2min
completed: 2026-02-21
---

# Phase 1 Plan 03: Neon Glow Components Summary

**GlowButton upgraded to three-layer neon hover glow (white/cyan) and AnimatedText "The Future of" heading glows with neon text-shadow using Tailwind v4 @utility registered classes**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-21T00:21:51Z
- **Completed:** 2026-02-21T00:23:51Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Primary GlowButton now produces a three-layer white neon glow (5px/20px/40px opacity cascade) on hover
- Secondary GlowButton now produces a three-layer cyan neon glow on hover (previously had no glow at all)
- AnimatedText "The Future of" heading now carries a persistent white-to-cyan neon text-shadow that activates as each word animates in
- Fixed globals.css neon utility registration so Tailwind v4 hover: variant prefix actually applies the box-shadow/text-shadow

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade GlowButton.tsx with three-layer neon hover shadows** - `7c59a80` (feat)
2. **Task 2: Add neon text-shadow to AnimatedText.tsx** - `cc48af8` (feat)

**Plan metadata:** _(docs commit follows)_

## Files Created/Modified

- `components/GlowButton.tsx` - Updated variantClasses to use hover:neon-glow-white (primary) and hover:neon-glow-cyan (secondary) with transition-shadow duration-300
- `components/AnimatedText.tsx` - Updated motion.div className to `text-neon-white ${className}` so all AnimatedText instances carry neon glow
- `app/globals.css` - Converted neon-glow-* and text-neon-* classes from plain `.class{}` definitions to `@utility` blocks so Tailwind v4 variant support works

## Decisions Made

- **Tailwind v4 @utility required:** Custom CSS classes defined as `.neon-glow-white{}` outside `@layer utilities` don't get Tailwind variant support. Switching to `@utility neon-glow-white {}` syntax enables `hover:neon-glow-white` to work correctly. Verified with build output inspection.
- **text-neon-white at component level:** The plan specified applying the glow inside AnimatedText rather than passing it via className from the caller — this is correct because the glow is a visual identity of the component, not a layout/spacing concern.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Converted neon-glow utilities from .class to @utility for Tailwind v4 variant support**
- **Found during:** Task 1 (upgrading GlowButton variantClasses)
- **Issue:** The plan specifies `hover:neon-glow-white` in className strings, but the neon-glow classes were defined as plain CSS classes (`.neon-glow-white{}`). Tailwind v4 does not generate hover: variant CSS for arbitrary CSS classes outside its utility layer — `hover:neon-glow-white` would be silently ignored at runtime.
- **Fix:** Changed all five neon utility class definitions in globals.css from `.classname{}` to `@utility classname {}` blocks. This registers them as Tailwind utilities and enables all Tailwind variant prefixes (hover:, focus:, group-hover:, etc.) to work.
- **Files modified:** app/globals.css
- **Verification:** Built CSS inspection confirmed `.hover\:neon-glow-white:hover{box-shadow:...}` rules present in output
- **Committed in:** 7c59a80 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug — Tailwind v4 variant compatibility)
**Impact on plan:** Fix was essential for the hover: glow to work at all. No scope creep — the @utility syntax is a direct equivalent of the .class{} syntax for the same properties, just registered correctly with Tailwind.

## Issues Encountered

None beyond the @utility deviation documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- GlowButton and AnimatedText glow effects are complete — all CTA buttons and the "The Future of" heading now have intensified neon presence
- Remaining Plan 04 (SpotlightCard) and Plan 05 (FloatingParticles) can proceed with the same @utility pattern for any new custom utilities
- The `hover:neon-glow-*` pattern is established and reusable for any future interactive element needing neon hover effects

## Self-Check: PASSED

- FOUND: components/GlowButton.tsx
- FOUND: components/AnimatedText.tsx
- FOUND: app/globals.css
- FOUND: .planning/phases/01-aesthetic-foundation/01-03-SUMMARY.md
- FOUND commit: 7c59a80 (feat - GlowButton upgrade)
- FOUND commit: cc48af8 (feat - AnimatedText neon text-shadow)

---
*Phase: 01-aesthetic-foundation*
*Completed: 2026-02-21*
