---
phase: 02-new-content-sections
plan: 01
subsystem: ui
tags: [framer-motion, react, tailwindcss, animation, timeline]

# Dependency graph
requires:
  - phase: 01-aesthetic-foundation
    provides: neon-glow-cyan @utility, text-neon-white @utility, whileInView pattern, bg-primary color token
provides:
  - HowWeWorkSection component with 4-step horizontal process timeline
affects:
  - 02-02 (TechStackSection — same stagger pattern)
  - 02-03 (WhyGloBuyersSection — same stagger pattern)
  - page-integration plan (imports HowWeWorkSection into app/page.tsx)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - containerVariants/itemVariants stagger pattern with whileInView parent
    - CSS-only hover on staggered children (no whileHover — avoids framer-motion stagger conflict)
    - React.Fragment key pattern for interleaved connectors in flex timeline

key-files:
  created:
    - components/HowWeWorkSection.tsx
  modified: []

key-decisions:
  - "No whileHover on staggered step cards — CSS hover:neon-glow-cyan used instead to avoid framer-motion stagger conflict (issue #908)"
  - "flex-shrink-0 on connector arrows + flex-1 min-w-0 on step cards prevents layout squash at md breakpoints"
  - "React.Fragment with key=step.number wraps each step+connector pair cleanly"
  - "Process step copy flagged TODO for content owner review — same pattern as Phase 1 capability bullets"

patterns-established:
  - "Stagger pattern: containerVariants (staggerChildren: 0.15, delayChildren: 0.1) + itemVariants (y: 24 → 0, duration: 0.5) with whileInView='visible' on parent"
  - "Section heading block: motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} — matches Services section exactly"

requirements-completed: [PROC-01, PROC-02, PROC-03]

# Metrics
duration: 1min
completed: 2026-02-21
---

# Phase 2 Plan 01: How We Work Section Summary

**4-step horizontal process timeline with staggered scroll reveal using containerVariants/itemVariants and CSS-only hover effects**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-21T14:05:47Z
- **Completed:** 2026-02-21T14:06:43Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- Built `HowWeWorkSection` — a 4-step (Discovery, Build, Launch, Support) horizontal process timeline
- Implemented staggered scroll-reveal with Framer Motion `containerVariants`/`itemVariants` pattern using `whileInView` parent trigger
- Responsive layout: desktop flex-row with `──▶` arrow connectors (`hidden md:flex`), mobile flex-col stack
- CSS-only hover effects (`hover:neon-glow-cyan hover:border-primary/40`) — no `whileHover` to avoid stagger conflict
- Build passes with zero TypeScript errors (98 lines, min 60 required)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build HowWeWorkSection component** - `04fa992` (feat)

**Plan metadata:** _(created after this summary)_

## Files Created/Modified
- `components/HowWeWorkSection.tsx` - 4-step process timeline component with stagger animations and responsive layout

## Decisions Made
- No `whileHover` on staggered step cards — CSS hover classes used instead (framer-motion issue #908 workaround: `whileHover` on staggered children disables stagger timing)
- `flex-shrink-0` on connector arrows + `flex-1 min-w-0` on step cards prevents squash at md breakpoints (per research pitfall 3)
- `React.Fragment key={step.number}` to interleave connectors between step cards without invalid DOM nesting
- Process step copy flagged with `// TODO` comment for content owner validation — same pattern as Phase 1 capability bullets

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `components/HowWeWorkSection.tsx` is production-ready, awaiting import into `app/page.tsx` (Plan 03 or dedicated integration plan)
- Same `containerVariants`/`itemVariants` pattern ready to be reused in Plan 02 (TechStackSection) and Plan 03 (WhyGloBuyersSection)
- Pending: process step copy needs validation against actual GloBuyers service delivery (flagged in STATE.md Pending Todos)

## Self-Check: PASSED

- `components/HowWeWorkSection.tsx` — FOUND
- `02-01-SUMMARY.md` — FOUND
- Commit `04fa992` — FOUND

---
*Phase: 02-new-content-sections*
*Completed: 2026-02-21*
