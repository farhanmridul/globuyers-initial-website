# Testing Patterns

**Analysis Date:** 2026-02-21

## Test Framework

**Runner:**
- Not configured - No test framework present
- No jest.config.js, vitest.config.ts, or test runner configuration files detected

**Assertion Library:**
- None installed or configured

**Run Commands:**
- Not applicable - No test infrastructure configured
- `package.json` contains only: `"lint": "eslint"` (no test scripts)

## Test File Organization

**Location:**
- No test files found in project
- Not applicable due to no test framework setup

**Naming:**
- Convention pattern would be: `[component].test.tsx` or `[component].spec.tsx` (not implemented)

**Structure:**
- Not established - No test files in codebase

## Test Structure

**Suite Organization:**
- Not applicable - No tests in codebase

**Patterns:**
- Not established

## Mocking

**Framework:**
- None configured or in use

**Patterns:**
- Not applicable

**What to Mock:**
- Best practices would include:
  - External API calls (none currently in codebase)
  - Next.js Image component behavior
  - Browser APIs like `document.getElementById`
  - Framer Motion animations

**What NOT to Mock:**
- Component rendering logic
- CSS/styling validation
- Basic React hooks behavior

## Fixtures and Factories

**Test Data:**
- Not applicable - No test infrastructure

**Location:**
- Pattern would be: `__tests__/fixtures/` or `tests/factories/` (not implemented)

## Coverage

**Requirements:**
- None enforced - No test configuration

**View Coverage:**
- Not applicable - No coverage tooling installed

## Test Types

**Unit Tests:**
- Not implemented
- Would be appropriate for:
  - Component prop validation
  - Animation variant calculations
  - Utility function logic

**Integration Tests:**
- Not implemented
- Would be appropriate for:
  - Multi-component interactions (e.g., ServiceCard within services grid)
  - Scroll behavior with useScroll hook
  - Navigation between pages

**E2E Tests:**
- Not implemented (Playwright, Cypress, or Selenium not installed)
- Would be appropriate for:
  - Hero section animations on load
  - Scroll-to-contact functionality
  - Privacy policy page rendering
  - Responsive behavior across breakpoints

## Common Patterns

**Async Testing:**
- Not applicable - No test framework
- Would handle:
  - Animation completion
  - useEffect hook behavior in components like FloatingParticles

**Error Testing:**
- Not applicable - No test framework
- Would test:
  - Missing image handling (Image component with fallback)
  - DOM query failures (getElementById safeguards)

## Testing Opportunities

**High Priority Areas:**

1. **Component Behavior:**
   - `FloatingParticles`: useEffect generates 20 particles; verify array length and animation properties
   - `AnimatedText`: Word splitting and stagger animation timing
   - `GlowButton`: Variant style application (primary vs secondary)
   - `ServiceCard`: Index-based delay calculation for staggered animations

2. **Interaction Testing:**
   - `scrollToContact()` and `scrollToExplore` scroll behavior
   - Button click handlers trigger correct scroll targets
   - Mobile responsive layout switches at breakpoints

3. **Motion/Animation:**
   - Framer Motion variants apply correct transform/opacity values
   - Transition timing matches configuration
   - Stagger delays calculate correctly: `delay: index * 0.1`

4. **Next.js Features:**
   - Image component optimization and lazy loading
   - Metadata export in layout.tsx
   - Client component hydration for "use client" marked files

## Recommended Setup

**To add testing:**

1. **Install test framework:** Vitest (lighter, better Next.js/TypeScript support)
   ```bash
   npm install --save-dev vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom
   ```

2. **Create vitest.config.ts:**
   ```typescript
   import { defineConfig } from "vitest/config";
   import react from "@vitejs/plugin-react";
   import path from "path";

   export default defineConfig({
     plugins: [react()],
     test: {
       environment: "happy-dom",
       globals: true,
       setupFiles: ["./vitest.setup.ts"],
     },
     resolve: {
       alias: {
         "@": path.resolve(__dirname, "."),
       },
     },
   });
   ```

3. **Test file location pattern:** `[feature]/[component].test.tsx`
   - Example: `components/AnimatedText.test.tsx`

4. **Example test structure for components:**
   ```typescript
   import { describe, it, expect, vi } from "vitest";
   import { render, screen } from "@testing-library/react";
   import AnimatedText from "@/components/AnimatedText";

   describe("AnimatedText", () => {
     it("splits text into words", () => {
       render(<AnimatedText text="The Future" />);
       expect(screen.getByText("The")).toBeInTheDocument();
       expect(screen.getByText("Future")).toBeInTheDocument();
     });

     it("applies className prop", () => {
       const { container } = render(
         <AnimatedText text="Test" className="custom-class" />
       );
       expect(container.querySelector(".custom-class")).toBeInTheDocument();
     });
   });
   ```

---

*Testing analysis: 2026-02-21*
