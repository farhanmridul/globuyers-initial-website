# Requirements: GloBuyers Website

**Defined:** 2026-02-21
**Core Value:** Visitors finish scrolling and feel excited to work with GloBuyers — confident, energized, ready to reach out.

## v1 Requirements

### Aesthetic Upgrades

- [ ] **AES-01**: Site uses three-layer neon box-shadow on buttons, cards, and accent elements for dramatic glow effect
- [ ] **AES-02**: Headings and gradient text use neon text-shadow to intensify the futuristic look
- [ ] **AES-03**: ServiceCards use SpotlightCard interactive hover — card feels physically illuminated as cursor moves over it
- [ ] **AES-04**: `MotionConfig reducedMotion="user"` is added to `app/layout.tsx` so animations respect OS accessibility settings
- [ ] **AES-05**: FloatingParticles and GradientOrb animations pause when scrolled off-screen (useInView)

### How We Work Section

- [ ] **PROC-01**: New "How We Work" section with 4 steps: Discovery, Build, Launch, Support
- [ ] **PROC-02**: Each step shows a brief deliverable description (what happens at that stage, not just a label)
- [ ] **PROC-03**: Process steps animate in sequentially on scroll with staggered reveal

### Tech Stack Section

- [ ] **TECH-01**: New "Tech Stack" section displays technologies grouped by category (Frontend / Ecommerce / Automation / Integrations)
- [ ] **TECH-02**: Each technology shown with recognizable icon + name (inline SVG or styled badge — no external image files)
- [ ] **TECH-03**: Tech stack grid animates in with staggered scroll-triggered reveal

### Why GloBuyers Section

- [ ] **DIFF-01**: New "Why GloBuyers" section with 3-4 differentiator cards using visitor-POV framing
- [ ] **DIFF-02**: Each differentiator card has a neon icon, bold short headline (2-4 words), and 1-sentence expansion
- [ ] **DIFF-03**: Differentiator cards animate in with staggered scroll trigger

### Services Enhancement

- [ ] **SERV-01**: Each service card in the existing bento grid shows brief capability bullets describing what we actually do (what we automate, what APIs we connect, what Shopify apps we build, what custom apps we deliver)

### Footer

- [ ] **FOOT-01**: Footer Privacy link connects to the existing `/privacy` page (not `#`)

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
| AES-01 | Phase 1 — Aesthetic Foundation | Pending |
| AES-02 | Phase 1 — Aesthetic Foundation | Pending |
| AES-03 | Phase 1 — Aesthetic Foundation | Pending |
| AES-04 | Phase 1 — Aesthetic Foundation | Pending |
| AES-05 | Phase 1 — Aesthetic Foundation | Pending |
| SERV-01 | Phase 1 — Aesthetic Foundation | Pending |
| FOOT-01 | Phase 1 — Aesthetic Foundation | Pending |
| PROC-01 | Phase 2 — New Content Sections | Pending |
| PROC-02 | Phase 2 — New Content Sections | Pending |
| PROC-03 | Phase 2 — New Content Sections | Pending |
| TECH-01 | Phase 2 — New Content Sections | Pending |
| TECH-02 | Phase 2 — New Content Sections | Pending |
| TECH-03 | Phase 2 — New Content Sections | Pending |
| DIFF-01 | Phase 2 — New Content Sections | Pending |
| DIFF-02 | Phase 2 — New Content Sections | Pending |
| DIFF-03 | Phase 2 — New Content Sections | Pending |

**Coverage:**
- v1 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---
*Requirements defined: 2026-02-21*
*Last updated: 2026-02-21 after roadmap creation*
