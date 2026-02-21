---
phase: 01-aesthetic-foundation
plan: 01
subsystem: ui
tags: [css, framer-motion, tailwind, next.js, accessibility]

# Dependency graph
requires: []
provides:
  - Five neon CSS utility classes (neon-glow-cyan, neon-glow-purple, neon-glow-white, text-neon-white, text-neon-gradient)
  - Global MotionConfig with reducedMotion="user" via Providers.tsx
affects:
  - 01-02 (GlowButton upgrades use neon-glow-* classes)
  - 01-03 (AnimatedText uses text-neon-* classes)
  - All plans using Framer Motion animations (reduced-motion handled automatically)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Thin Providers client boundary pattern — wraps framer-motion client components so root layout stays a Server Component
    - Three-layer neon box-shadow pattern (tight/mid/far at 0.9/0.55/0.25 opacity)
    - filter drop-shadow instead of text-shadow for gradient (bg-clip-text transparent) headings

key-files:
  created:
    - components/Providers.tsx
  modified:
    - app/globals.css
    - app/layout.tsx

key-decisions:
  - "Used filter drop-shadow (not text-shadow) for .text-neon-gradient — text-shadow is invisible on bg-clip-text text-transparent elements"
  - "Providers.tsx as thin client boundary — keeps app/layout.tsx as Server Component while enabling MotionConfig hooks"
  - "Preserved legacy .glow-cyan, .glow-purple, .text-glow classes — may be referenced in existing components; safe to remove after audit in a later plan"

patterns-established:
  - "Three-layer neon glow: 0 0 5px (tight, ~0.9 opacity), 0 0 20px (mid, ~0.55 opacity), 0 0 45px (far, ~0.25 opacity)"
  - "Client boundary pattern: 'use client' component wrapping framer-motion APIs, imported by Server Component layout"

requirements-completed: [AES-01, AES-02, AES-04]

# Metrics
duration: 2min
completed: 2026-02-21
---

# Phase 01 Plan 01: Neon CSS Utilities and Global MotionConfig Summary

**Three-layer neon CSS utility classes plus a global MotionConfig Providers wrapper that auto-respects OS reduced-motion — shared foundation for all downstream aesthetic plans**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-21T13:18:18Z
- **Completed:** 2026-02-21T13:20:09Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Added five new neon utility classes to globals.css covering box-shadow glow (cyan, purple, white) and text effects (solid white headings, gradient transparent headings)
- Created components/Providers.tsx as a thin client boundary exporting MotionConfig with reducedMotion="user"
- Updated app/layout.tsx to wrap children in Providers — all downstream Framer Motion animations now automatically halt when OS prefers-reduced-motion is enabled

## Task Commits

Each task was committed atomically:

1. **Task 1: Add neon CSS utility classes to globals.css** - `0c426e5` (feat)
2. **Task 2: Create Providers.tsx and wire MotionConfig into layout.tsx** - `9909d86` (feat)

## Files Created/Modified

- `app/globals.css` - Added .neon-glow-cyan, .neon-glow-purple, .neon-glow-white, .text-neon-white, .text-neon-gradient; legacy classes preserved
- `components/Providers.tsx` - New "use client" wrapper exporting MotionConfig with reducedMotion="user"
- `app/layout.tsx` - Imported Providers and wrapped {children} in <Providers>; file remains a Server Component

## Decisions Made

- Used `filter: drop-shadow(...)` instead of `text-shadow` for `.text-neon-gradient` — `text-shadow` is invisible on elements using `bg-clip-text text-transparent` and filter works correctly
- Kept the Providers pattern thin (no extra state or context) — it exists solely to establish the client boundary for MotionConfig
- Legacy `.glow-cyan`, `.glow-purple`, `.text-glow` classes left intact pending an audit of current component usages in a future plan

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All neon utility classes are available for component-level upgrades in plans 01-02 through 01-05
- MotionConfig is active at the root — no per-component reduced-motion wiring needed in downstream plans
- Legacy glow classes remain; a future plan may replace/remove them after confirming component references have migrated to the new neon-glow-* names

---
*Phase: 01-aesthetic-foundation*
*Completed: 2026-02-21*
