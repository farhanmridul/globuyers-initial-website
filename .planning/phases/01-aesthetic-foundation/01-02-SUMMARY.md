---
phase: 01-aesthetic-foundation
plan: 02
subsystem: ui
tags: [framer-motion, useInView, IntersectionObserver, animation, performance, react]

# Dependency graph
requires: []
provides:
  - FloatingParticles with useInView-gated animations (pauses when off-screen)
  - GradientOrb with useInView-gated animations (pauses when off-screen)
affects: [02-content-sections]

# Tech tracking
tech-stack:
  added: []
  patterns: [useInView from framer-motion gates looping animate prop; animate=false stops and resets animation]

key-files:
  created: []
  modified:
    - components/FloatingParticles.tsx
    - components/GradientOrb.tsx

key-decisions:
  - "animate={false} chosen over animate={{}} — false stops the loop and returns to initial values; empty object freezes at current position"
  - "containerRef attached to outermost wrapper div in FloatingParticles so IntersectionObserver measures the full container bounding rect"
  - "GradientOrb transition prop left static — it only fires when animate is active, no conditional needed"

patterns-established:
  - "useInView gate pattern: import useInView + useRef, attach ref to container, gate animate prop with ternary (keyframes when true, false when off-screen)"

requirements-completed: [AES-05]

# Metrics
duration: 2min
completed: 2026-02-21
---

# Phase 1 Plan 02: Aesthetic Foundation — useInView Animation Gates Summary

**looping animations in FloatingParticles (20 particles) and GradientOrb (3 instances) pause via useInView when scrolled off-screen, eliminating idle CPU cost with zero UX impact**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-21T13:18:16Z
- **Completed:** 2026-02-21T13:20:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- FloatingParticles.tsx: added useRef and useInView; containerRef on outer div; animate prop conditionally stops all 20 particle loops when hero is off-screen
- GradientOrb.tsx: added useRef and useInView; ref on motion.div; animate prop stops scale+opacity pulse per instance when respective section scrolled off-screen
- Build passes cleanly (npm run build — Compiled successfully, 5/5 static pages generated, no TypeScript errors)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add useInView pause gate to FloatingParticles** - `3ed91f1` (feat)
2. **Task 2: Add useInView pause gate to GradientOrb** - `6cf8c51` (feat)

## Files Created/Modified
- `components/FloatingParticles.tsx` - Added useRef + useInView; containerRef on wrapper div; animate/transition props gated on isInView
- `components/GradientOrb.tsx` - Added useRef + useInView; ref on motion.div; animate prop gated on isInView

## Decisions Made
- Used `animate={false}` (not `animate={{}}`) to stop looping animations — framer-motion returns element to initial values when false, which is the correct halt behavior for repeating keyframe sequences
- Kept `transition` prop conditional in FloatingParticles (particle-specific duration/delay when in view, `duration: 0` when off) to ensure clean transitions
- Kept `transition` prop static in GradientOrb — it only takes effect when animate fires, so no conditional required
- containerRef on outermost `<div className="absolute inset-0">` in FloatingParticles to ensure IntersectionObserver measures the full container height, not an individual particle

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both animation components now have off-screen pause behavior — AES-05 satisfied
- FloatingParticles and GradientOrb are ready as optimized building blocks for all sections that use them
- No blockers for subsequent plans in Phase 1

---
*Phase: 01-aesthetic-foundation*
*Completed: 2026-02-21*
