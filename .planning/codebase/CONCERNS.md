# Codebase Concerns

**Analysis Date:** 2026-02-21

## Tech Debt

**No explicit error boundaries:**
- Issue: React components lack error boundary wrapper for error handling in production. If any animation or component fails, entire page may white-screen.
- Files: `app/page.tsx`, `app/privacy-policy/page.tsx`, all component files in `/components`
- Impact: Production crashes from animation library issues or unexpected component failures are unhandled and visible to users
- Fix approach: Implement root-level error.tsx and client error boundaries for critical sections (header, hero, services)

**Hardcoded email contact in multiple places:**
- Issue: Email address `support@globuyers.com` is hardcoded directly in JSX in two files
- Files: `app/page.tsx` (line 200), `app/privacy-policy/page.tsx` (line 126)
- Impact: Changing email requires code changes and redeployment; prone to inconsistency if duplicated again
- Fix approach: Extract to environment variable or config file (`NEXT_PUBLIC_SUPPORT_EMAIL`)

**Animation particles re-render inefficiency:**
- Issue: FloatingParticles generates random particles on every component mount, but setParticles is called in useEffect with empty dependency array
- Files: `components/FloatingParticles.tsx` (lines 16-27)
- Impact: Particles array is stable, but component re-renders could still cause unnecessary recalculations; minor but not optimal
- Fix approach: Memoize particle generation or use useMemo to prevent re-running Math.random() unnecessarily

**Placeholder footer links unimplemented:**
- Issue: Footer privacy/terms links point to `#` with no navigation target
- Files: `app/page.tsx` (lines 222-224)
- Impact: Users clicking "Privacy" or "Terms" in footer go nowhere; Privacy Policy link on main page works but footer is inconsistent
- Fix approach: Wire footer links to actual routes (`/privacy-policy`, `/terms` if created)

**Manual date calculation in footer:**
- Issue: Footer uses `new Date().getFullYear()` in multiple places for copyright year
- Files: `app/page.tsx` (line 227), `app/privacy-policy/page.tsx` (line 134)
- Impact: Code duplication; no issue currently but creates maintenance burden if pattern spreads
- Fix approach: Extract to shared utility component or constant

**Inline Tailwind classes with hardcoded dimensions:**
- Issue: Gradient orbs and particles use hardcoded pixel sizes (w-96, h-96) mixed with Tailwind utility classes
- Files: `components/GradientOrb.tsx` (lines 16-20), `components/FloatingParticles.tsx` (lines 37-41)
- Impact: Responsive design is limited; dimensions don't scale well on very large or small screens
- Fix approach: Consider responsive variants or CSS-in-JS for dynamic sizing

## Known Bugs

**Potential hydration mismatch in FloatingParticles:**
- Symptoms: Component returns `null` on first render (line 29), then renders particles on client-side. May cause hydration warning in Next.js if server-rendered.
- Files: `components/FloatingParticles.tsx` (lines 29, 16-27)
- Trigger: Full page server-side render with FloatingParticles component
- Workaround: Component already checks `if (particles.length === 0) return null;` but should use explicit `useEffect` guard or dynamic import with `ssr: false`

**AnimatedText word splitting on whitespace only:**
- Symptoms: Words split only on space character; punctuation attached to words. "Commerce," renders as single animated unit instead of separate "Commerce" and ","
- Files: `components/AnimatedText.tsx` (line 11)
- Trigger: Text containing punctuation adjacent to words
- Workaround: Currently affects only one instance in hero ("The Future of"), which works fine visually

**Scroll anchor behavior inconsistent across browsers:**
- Symptoms: Smooth scroll behavior on anchor navigation may not work in all browsers/devices
- Files: `app/page.tsx` (lines 23, 81)
- Trigger: User clicks "Let's Talk" or "Our Expertise" buttons on mobile browsers without scroll-behavior support
- Workaround: Fallback to instant scroll if smooth scroll unavailable; no polyfill currently in place

## Security Considerations

**Privacy policy references fictitious Shopify app:**
- Risk: Privacy policy describes "Simple Bulk Operations - GB" Shopify app (line 42, `app/privacy-policy/page.tsx`), but this doesn't match stated services on marketing page
- Files: `app/privacy-policy/page.tsx` (lines 42-62)
- Current mitigation: None - policy is present but inconsistent with actual offerings
- Recommendations: Either create actual app to match policy or rewrite privacy policy to match custom software/automation services described on main page. Ensure marketing claims match legal documentation.

**Email address exposed in public HTML:**
- Risk: Support email `support@globuyers.com` is visible in page source and linked directly, exposed to email scrapers
- Files: `app/page.tsx` (line 200), `app/privacy-policy/page.tsx` (line 126)
- Current mitigation: Standard public exposure (mailto link)
- Recommendations: No urgent action needed for public marketing site, but be aware of email harvesting. Consider alternative contact forms if spam becomes issue.

**No Content Security Policy (CSP) headers:**
- Risk: No CSP headers configured to restrict script/style sources. Inline styles and styles via CDN (Google Fonts) are unrestricted.
- Files: Configuration missing (would be in `next.config.ts` or headers)
- Current mitigation: None
- Recommendations: Add CSP headers in `next.config.ts` to restrict external font sources and script execution. Implement headers configuration.

**External font loading from CDN:**
- Risk: Google Fonts and Space Grotesk font loaded from external CDN (Google) during runtime
- Files: `app/globals.css` (line 1), `app/layout.tsx` (lines 5, 10 - next/font imports)
- Current mitigation: Using Next.js font optimization (good), but Google Fonts import in CSS is unoptimized
- Recommendations: Remove CSS import on line 1 since `next/font` already handles fonts. Reduces external dependency and improves performance.

## Performance Bottlenecks

**Animation overhead on hero section:**
- Problem: Multiple simultaneous Framer Motion animations: scroll-triggered opacity/scale, particle animation loop (20 particles), gradient orb scale animation (8s loop), and scroll indicator pulse
- Files: `app/page.tsx` (lines 14-95), `components/FloatingParticles.tsx` (lines 33-54), `components/GradientOrb.tsx` (lines 31-39)
- Cause: 20 particles * continuous animation + scroll listeners + willChange not optimized = potential frame drops on lower-end devices
- Improvement path: Memoize particle count, use CSS animations for orbs instead of JS, throttle scroll listeners, add `will-change: transform` CSS class

**Scroll listener on full page:**
- Problem: useScroll listener tracking entire document scroll position (app/page.tsx line 14) triggers re-renders on every scroll event
- Files: `app/page.tsx` (lines 14-20)
- Cause: Scroll events fire hundreds of times per second; React transforms trigger re-renders of opacity/scale properties
- Improvement path: Debounce scroll events or use CSS animations instead of Framer Motion for scroll-triggered effects

**Large CSS file with multiple animations:**
- Problem: globals.css includes custom scrollbar styling, cyber-grid pattern, glass effects, and glow effects (71 lines)
- Files: `app/globals.css`
- Cause: CSS animations and effects on every page; some unused classes (glow-purple, glow-cyan, .glass-card defined but overridden by Tailwind classes)
- Improvement path: Move unused utilities to Tailwind theme or remove. Use CSS containment (`contain: paint`) on animated elements.

**Framer Motion dependency for basic animations:**
- Problem: Large animation library (12.34.0, ~50KB gzipped) imported for relatively simple animations (fade, scale, stagger)
- Files: Multiple component imports of framer-motion
- Cause: CSS keyframes or React Spring could handle many of these animations more efficiently
- Improvement path: Low priority; Framer Motion is mature. Only refactor if bundle size becomes constraint.

## Fragile Areas

**Service Card bento grid layout:**
- Files: `app/page.tsx` (lines 116-151)
- Why fragile: Grid spans different columns (md:col-span-2, md:col-span-3) with responsive rows. Changes to card count or content length cause layout shifts. Mobile view collapses to single column with no visual hierarchy for "main" vs secondary services.
- Safe modification: Add explicit min-height to grid items; test layout with different content lengths; add mobile-specific grid if needed (currently all cards equal height on mobile)
- Test coverage: No tests; layout regression risk when adding new services

**Footer link structure:**
- Files: `app/page.tsx` (lines 221-224)
- Why fragile: Links use placeholder `href="#"` - if changed later, easy to miss. No type safety or broken link detection.
- Safe modification: Use typed route constants or Next.js Link with `as` prop; add link validation in build step
- Test coverage: No E2E tests to catch broken links

**Contact button scroll behavior:**
- Files: `app/page.tsx` (lines 23, 81)
- Why fragile: Uses direct DOM queries `document.getElementById("contact")` which silently fail if ID removed or renamed
- Safe modification: Use React refs instead of DOM queries; wrap in error boundary that logs if element not found
- Test coverage: No tests; would break silently if ID changed

**AnimatedText word wrapping:**
- Files: `components/AnimatedText.tsx` (lines 43-48)
- Why fragile: Uses `overflow: "hidden"` and `flexWrap: "wrap"` with hardcoded `gap: "0.25rem"`. If parent container narrows unexpectedly, text may break at wrong points or wrap incorrectly.
- Safe modification: Add max-width constraint on parent; test at multiple viewport widths; consider using CSS Grid instead of Flexbox for better control
- Test coverage: No visual regression tests

## Scaling Limits

**Particle count fixed at 20:**
- Current capacity: 20 particles with continuous animations
- Limit: At 50+ particles, expect frame drops on low-end devices (mobile phones from 2020 or older); no optimization for different device capabilities
- Scaling path: Add device capability detection (use requestIdleCallback to measure frame budget); dynamically reduce particle count on low-end devices

**Single-page application limitation:**
- Current capacity: All content fits in one scrollable page; good for marketing site
- Limit: Adding more sections (blog, case studies, contact form) will increase page weight and scroll overhead
- Scaling path: Move heavy content (case studies, blog) to separate routes; code-split with dynamic imports

**No image optimization:**
- Current capacity: Single logo.png image used in header and footer (appears twice on each page)
- Limit: If more images added without optimization (webp, responsive sizing), page weight increases rapidly
- Scaling path: Already using Next.js Image component (good), but ensure srcSet and sizes props are used for responsive images

## Dependencies at Risk

**Framer Motion version lag:**
- Risk: Pinned to `^12.34.0` (mid-version); potential bugs in newer versions (13.x) not tested
- Impact: Security patches or breaking changes in Framer Motion require manual testing before upgrade
- Migration plan: Quarterly audit of updates; test thoroughly before upgrading to major versions

**Next.js 16 rapid release cycle:**
- Risk: Using latest Next.js (16.1.6) which may have stability issues found in minor updates
- Impact: If critical bug found in 16.x, upgrade to 17.x may require code changes
- Migration plan: Follow Next.js changelog; be ready to pin version if stability issues arise; monitor GitHub issues for 16.x

**Tailwind CSS 4 experimental:**
- Risk: Using `@tailwindcss/postcss` with Tailwind 4, which is newer. PostCSS integration may have edge cases.
- Impact: Future Tailwind versions may change CLI or build process; current setup may break
- Migration plan: Monitor Tailwind 4 release notes; avoid using experimental features; be ready to adjust postcss.config if needed

## Missing Critical Features

**No 404 or error handling page:**
- Problem: No custom 404.tsx or error.tsx in app directory. Users navigating to `/missing-page` will see Next.js default error page.
- Blocks: Professional appearance; cannot customize error messaging or provide help links
- Recommendation: Create `app/not-found.tsx` and `app/error.tsx`

**No meta tags for social sharing:**
- Problem: No Open Graph (og:image, og:description) or Twitter Card meta tags. Links shared to Facebook/Twitter show default or no preview.
- Blocks: Social media visibility; marketing impact reduced when shared
- Recommendation: Add to `app/layout.tsx` metadata with dynamic og:image generation

**No accessibility features:**
- Problem: No alt text on decorative elements; no skip-to-content link; animations not respectable to prefers-reduced-motion
- Blocks: WCAG compliance; accessibility for users with vestibular disorders or screen readers
- Recommendation: Add `<motion.div reduceMotion="user">` to animations; add proper alt text; test with axe-core

**No sitemap or robots.txt:**
- Problem: Search engines may crawl slowly or miss pages
- Blocks: SEO optimization; search engine indexing
- Recommendation: Generate sitemap.xml and robots.txt during build

## Test Coverage Gaps

**No unit tests for animations:**
- What's not tested: AnimatedText word split logic, GradientOrb size/color mapping, FloatingParticles generation
- Files: `components/AnimatedText.tsx`, `components/GradientOrb.tsx`, `components/FloatingParticles.tsx`
- Risk: Animation changes (e.g., adding new colors to GradientOrb) could introduce bugs silently; no regression protection
- Priority: Medium - animations are user-facing but don't affect functionality

**No integration tests for scroll behavior:**
- What's not tested: Scroll-triggered animations, anchor navigation, smooth scroll fallback
- Files: `app/page.tsx` (scroll hooks and navigation)
- Risk: Scroll listeners and anchor navigation could break without notice; particularly risky on mobile browsers
- Priority: Medium - core user interaction flow

**No E2E tests for page load:**
- What's not tested: Hero section renders correctly, all buttons are clickable, page doesn't crash on load
- Files: Entire app
- Risk: Critical issues (blank hero, unclickable buttons) only found by manual testing or user reports
- Priority: High - would catch the most impactful regressions

**No visual regression tests:**
- What's not tested: Layout changes, CSS changes, component appearance across viewport sizes
- Files: All components and pages
- Risk: Changes to tailwind.config.ts or CSS could break mobile layout without detection
- Priority: Medium - layout is critical but manual testing currently sufficient

---

*Concerns audit: 2026-02-21*
