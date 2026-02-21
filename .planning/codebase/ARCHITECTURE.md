# Architecture

**Analysis Date:** 2026-02-21

## Pattern Overview

**Overall:** Next.js App Router with component-based UI composition using Framer Motion for animations

**Key Characteristics:**
- Client-side rendering strategy with "use client" directive for interactive components
- Component library pattern for reusable animated UI elements
- Tailwind CSS for styling with custom theme extensions
- Scroll-based animation synchronization using Framer Motion hooks

## Layers

**Presentation Layer:**
- Purpose: Render page layouts and visual UI with animations
- Location: `app/` and `components/`
- Contains: Page components, layout wrappers, reusable UI components
- Depends on: Framer Motion, React, Next.js, Tailwind CSS
- Used by: Browser clients

**Styling Layer:**
- Purpose: Define and manage design tokens, colors, animations, and responsive utilities
- Location: `tailwind.config.ts`, `app/globals.css`
- Contains: Color palettes, keyframes, custom utilities, CSS resets
- Depends on: Tailwind CSS v4, PostCSS
- Used by: All presentation components via className attributes

**Static Assets:**
- Purpose: Host images, logos, and SVG assets
- Location: `public/`
- Contains: Logo images, SVG icons, favicons
- Depends on: Next.js public folder serving
- Used by: Page components and layout

## Data Flow

**Page Load → Hero Section:**

1. `app/layout.tsx` renders RootLayout with Geist fonts and metadata
2. `app/page.tsx` mounts as home page with scroll container reference
3. Hero section initializes with FloatingParticles and GradientOrb animations
4. Framer Motion `useScroll` hook tracks scroll progress
5. AnimatedText component staggered word animation on mount
6. Button clicks trigger smooth scroll navigation to target sections

**Section Rendering:**

1. User scrolls → scroll progress value updates
2. Components with `whileInView` trigger enter-view animations
3. ServiceCard components animate with staggered delays based on index
4. GradientOrb components continuously animate scale/opacity

**Navigation Flow:**

1. Header buttons use `scrollIntoView` for smooth scrolling
2. `scrollToContact` function targets `#contact` element
3. `scrollToServices` targets `#services` element
4. Footer link to `/privacy-policy` navigates to privacy page

**State Management:**

- Local component state only via `useState` hooks
- No centralized state management (Redux, Context)
- Scroll state managed by Framer Motion's `useScroll` hook
- Particle generation in `FloatingParticles` uses `useEffect` to create initial state

## Key Abstractions

**Animated Components:**
- Purpose: Wrap UI elements with consistent entrance and interaction animations
- Examples: `components/AnimatedText.tsx`, `components/ServiceCard.tsx`
- Pattern: Accept `className` prop + animation-specific props, use Framer Motion variants for reusable animation definitions

**Button System:**
- Purpose: Unified interactive button with variants
- Examples: `components/GlowButton.tsx`
- Pattern: Variant-based styling (primary/secondary) with Tailwind classes, Framer Motion for scale interactions

**Background Effects:**
- Purpose: Create visual depth and atmosphere without blocking interaction
- Examples: `components/GradientOrb.tsx`, `components/FloatingParticles.tsx`
- Pattern: Absolute positioned, `pointer-events-none`, infinite loop animations

**Layout Sections:**
- Purpose: Organize content into distinct visual sections
- Pattern: Semantic HTML sections with ID anchors, padding utilities, relative positioning for contained backgrounds

## Entry Points

**Home Page:**
- Location: `app/page.tsx`
- Triggers: Direct navigation to `/` or root domain
- Responsibilities: Hero section, services grid, stats section, contact section, footer - complete landing page experience

**Privacy Policy Page:**
- Location: `app/privacy-policy/page.tsx`
- Triggers: Navigation to `/privacy-policy`
- Responsibilities: Display privacy policy content with typography styling and back navigation

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Applied to all routes
- Responsibilities: Font loading, metadata configuration, global styles injection, children rendering

## Error Handling

**Strategy:** No explicit error boundary implementation; relies on Next.js default error handling

**Patterns:**
- No try-catch blocks in components
- No error state management
- Graceful fallbacks: FloatingParticles renders null if particles array is empty (prevents render errors)
- Link navigation assumes valid routes (no 404 handling in components)

## Cross-Cutting Concerns

**Logging:** Not implemented - no logging framework

**Validation:** Not implemented - no form validation (contact link is mailto only)

**Authentication:** Not required - public marketing website

**Accessibility:** Partial implementation - missing aria labels, heading hierarchy uses semantic tags but minimal ARIA attributes

**Performance:** Optimized for LCP with:
- `Image` component from Next.js for logo optimization
- Intersection Observer pattern via Framer Motion's `whileInView` (viewport-based rendering)
- CSS animations use GPU-accelerated properties (transform, opacity)
- Scroll tracking is passive observer, not blocking

---

*Architecture analysis: 2026-02-21*
