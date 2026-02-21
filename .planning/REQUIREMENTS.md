# Requirements: GloBuyers Website

**Defined:** 2026-02-21
**Core Value:** Visitors finish scrolling and feel excited to work with GloBuyers — confident, energized, ready to reach out.

## v1 Requirements

### Aesthetic Upgrades

- [x] **AES-01**: Site uses three-layer neon box-shadow on buttons, cards, and accent elements for dramatic glow effect
- [x] **AES-02**: Headings and gradient text use neon text-shadow to intensify the futuristic look
- [x] **AES-03**: ServiceCards use SpotlightCard interactive hover — card feels physically illuminated as cursor moves over it
- [x] **AES-04**: `MotionConfig reducedMotion="user"` is added to `app/layout.tsx` so animations respect OS accessibility settings
- [x] **AES-05**: FloatingParticles and GradientOrb animations pause when scrolled off-screen (useInView)

### How We Work Section

- [x] **PROC-01**: New "How We Work" section with 4 steps: Discovery, Build, Launch, Support
- [x] **PROC-02**: Each step shows a brief deliverable description (what happens at that stage, not just a label)
- [x] **PROC-03**: Process steps animate in sequentially on scroll with staggered reveal

### Tech Stack Section

- [x] **TECH-01**: New "Tech Stack" section displays technologies as a flat badge grid (ungrouped, no category labels)
- [x] **TECH-02**: Each technology shown with recognizable icon + name (inline SVG or styled badge — no external image files)
- [x] **TECH-03**: Tech stack grid animates in with staggered scroll-triggered reveal

### Why GloBuyers Section

- [x] **DIFF-01**: New "Why GloBuyers" section with 3-4 differentiator cards using visitor-POV framing
- [x] **DIFF-02**: Each differentiator card has a neon icon, bold short headline (2-4 words), and 1-sentence expansion
- [x] **DIFF-03**: Differentiator cards animate in with staggered scroll trigger

### Services Enhancement

- [x] **SERV-01**: Each service card in the existing bento grid shows brief capability bullets describing what we actually do (what we automate, what APIs we connect, what Shopify apps we build, what custom apps we deliver)

### Footer

- [x] **FOOT-01**: Footer Privacy link connects to the existing `/privacy-policy` page (not `#`)

## v2 Requirements

### Visual Polish

- Animated gradient borders via CSS `@property` + `conic-gradient` on select cards
- Expanded particle system with variable speeds and sizes
- Intensified GradientOrb scale and color range

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multiple pages | Single-page website only |
| Photos or real images | Objects and animations only — no external image assets |
| Contact form | Email link CTA only |
| Blog or case studies | Not requested |
| Testimonials | Not requested |
| Mobile app section | Not a current service |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AES-01 | Phase 1 — Aesthetic Foundation | Complete |
| AES-02 | Phase 1 — Aesthetic Foundation | Complete |
| AES-03 | Phase 1 — Aesthetic Foundation | Complete |
| AES-04 | Phase 1 — Aesthetic Foundation | Complete |
| AES-05 | Phase 1 — Aesthetic Foundation | Complete |
| SERV-01 | Phase 1 — Aesthetic Foundation | Complete |
| FOOT-01 | Phase 1 — Aesthetic Foundation | Complete |
| PROC-01 | Phase 2 — New Content Sections | Complete |
| PROC-02 | Phase 2 — New Content Sections | Complete |
| PROC-03 | Phase 2 — New Content Sections | Complete |
| TECH-01 | Phase 2 — New Content Sections | Complete |
| TECH-02 | Phase 2 — New Content Sections | Complete |
| TECH-03 | Phase 2 — New Content Sections | Complete |
| DIFF-01 | Phase 2 — New Content Sections | Complete |
| DIFF-02 | Phase 2 — New Content Sections | Complete |
| DIFF-03 | Phase 2 — New Content Sections | Complete |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-02-21*
*Last updated: 2026-02-21 after roadmap creation*
