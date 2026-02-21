# Roadmap: GloBuyers Website

## Overview

The existing site has a solid dark neon foundation. This milestone intensifies it. Phase 1 closes performance and accessibility gaps, upgrades the visual vocabulary across the existing components, and handles the two quick additions (service card bullets and footer link). Phase 2 builds the three new marketing sections — How We Work, Tech Stack, and Why GloBuyers — on top of the upgraded baseline. When both phases complete, visitors see a denser, more professional, undeniably futuristic agency site that makes them want to reach out.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Aesthetic Foundation** - Upgrade existing components with deeper neon glow, accessibility fixes, and performance baseline (completed 2026-02-21)
- [ ] **Phase 2: New Content Sections** - Build How We Work, Tech Stack, and Why GloBuyers sections

## Phase Details

### Phase 1: Aesthetic Foundation
**Goal**: The existing site looks dramatically more intense and polished — deeper neon, interactive cards, accessible animations, and no wasted CPU
**Depends on**: Nothing (first phase)
**Requirements**: AES-01, AES-02, AES-03, AES-04, AES-05, SERV-01, FOOT-01
**Success Criteria** (what must be TRUE):
  1. Buttons, service cards, and accent elements have a visible multi-layer neon glow that is noticeably more dramatic than before
  2. Heading and gradient text have an intensified text-shadow that makes them read as futuristic without becoming illegible
  3. Hovering a service card produces a smooth spotlight effect — the card feels physically illuminated by the cursor
  4. Running the site in an OS with reduced-motion enabled causes animations to stop; no motion plays that the OS has asked to suppress
  5. Service cards show brief capability bullets, and the footer Privacy link navigates to /privacy (not a hash anchor)
**Plans**: 5 plans

Plans:
- [x] 01-01-PLAN.md — Neon CSS utilities in globals.css + MotionConfig accessibility wrapper
- [x] 01-02-PLAN.md — FloatingParticles and GradientOrb off-screen animation pause (useInView)
- [x] 01-03-PLAN.md — GlowButton three-layer neon glow + AnimatedText text-shadow upgrade
- [x] 01-04-PLAN.md — ServiceCard SpotlightCard effect + capability bullets + page.tsx heading glows + Privacy link fix
- [ ] 01-05-PLAN.md — Human visual verification of all Phase 1 changes

### Phase 2: New Content Sections
**Goal**: Three new marketing sections exist on the page — visitors can see how GloBuyers works, what technologies it uses, and why they should choose it over alternatives
**Depends on**: Phase 1
**Requirements**: PROC-01, PROC-02, PROC-03, TECH-01, TECH-02, TECH-03, DIFF-01, DIFF-02, DIFF-03
**Success Criteria** (what must be TRUE):
  1. Scrolling the page reveals a "How We Work" section with 4 numbered process steps (Discovery, Build, Launch, Support), each with a deliverable description — steps animate in sequentially as they scroll into view
  2. A "Tech Stack" section displays technologies grouped into categories (Frontend, Ecommerce, Automation, Integrations) using icon + name badges that glow on hover
  3. A "Why GloBuyers" section shows 3-4 differentiator cards with bold short headlines and one-sentence visitor-framed expansions, with neon icon accents
  4. All three new sections animate in with staggered scroll-triggered reveals consistent with the existing whileInView pattern
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Aesthetic Foundation | 5/5 | Complete   | 2026-02-21 |
| 2. New Content Sections | 0/? | Not started | - |
