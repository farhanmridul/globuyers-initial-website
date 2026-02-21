# Coding Conventions

**Analysis Date:** 2026-02-21

## Naming Patterns

**Files:**
- PascalCase for component files: `AnimatedText.tsx`, `ServiceCard.tsx`, `GlowButton.tsx`, `GradientOrb.tsx`, `FloatingParticles.tsx`
- camelCase for route files: `page.tsx`, `layout.tsx`
- Files and directories use descriptive names matching exported component or functionality

**Functions:**
- React components use PascalCase as default exports: `export default function Home()`, `export default function AnimatedText()`
- Event handlers use camelCase with action prefix: `scrollToContact`, `onClick`
- Utility functions follow camelCase pattern

**Variables:**
- camelCase for local variables and constants: `containerRef`, `scrollYProgress`, `particles`, `variantClasses`
- UPPERCASE for enum-like objects containing variant mappings: Used in pattern objects like `variantClasses` (lowercase), but style variations stored in mapped objects
- TypeScript interfaces use PascalCase with `Props` suffix for component props: `AnimatedTextProps`, `ServiceCardProps`, `GlowButtonProps`, `GradientOrbProps`

**Types:**
- Interface names use PascalCase: `AnimatedTextProps`, `ServiceCardProps`
- Union types for variants: `variant?: "primary" | "secondary"`
- Generic type parameters preserved from libraries: `Variants` from framer-motion, `ReactNode`

## Code Style

**Formatting:**
- Tool: ESLint with Next.js config (eslint-config-next core-web-vitals and typescript)
- Config file: `eslint.config.mjs`
- No explicit formatter configured (no Prettier config detected), relies on ESLint defaults
- 2-space indentation (observed across all files)
- Import statements at top of file, below "use client" directive when present

**Linting:**
- Tool: ESLint 9.x
- Configuration: Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Run command: `npm run lint` (maps to `eslint`)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Import Organization

**Order:**
1. Third-party libraries (React, Next.js, external packages): `import { motion } from "framer-motion"`, `import Image from "next/image"`
2. React/hooks from React: `import { useRef, useState, useEffect } from "react"`
3. Next.js specific: `import type { Metadata } from "next"`, `import Link from "next/link"`
4. Local components/utilities with path aliases: `import GradientOrb from "@/components/GradientOrb"`

**Path Aliases:**
- `@/*` maps to project root (configured in `tsconfig.json`)
- Used for component imports: `@/components/GradientOrb`
- Improves readability and refactoring safety

## Error Handling

**Patterns:**
- Safe optional chaining: `document.getElementById("contact")?.scrollIntoView()`
- Conditional rendering with null checks: `{particles.length === 0} return null`
- No try-catch blocks observed in components (error handling deferred to Next.js/React boundaries)
- TypeScript strict mode enabled for compile-time safety

## Logging

**Framework:** console (standard browser API)

**Patterns:**
- No explicit logging framework integrated
- Errors handled through React error boundaries (not explicitly shown in current code)
- Browser console available for debugging in development

## Comments

**When to Comment:**
- Minimal comments used; code is self-documenting through clear naming
- Section dividers used in JSX: `{/* Floating Header */}`, `{/* Hero Section */}`, `{/* Services Section */}`
- Comments explain intent for complex sections only

**JSDoc/TSDoc:**
- TypeScript interfaces are self-documenting (no JSDoc observed)
- Parameter descriptions inferred from type definitions
- Function/component purpose clear from naming and context

## Function Design

**Size:** Functions kept small and focused
- Component functions: 50-140 lines (reasonable for React components with JSX)
- Utility functions: Short, single-responsibility (e.g., `scrollToContact` is 2 lines)
- Animation variant definitions: Grouped as objects for reusability

**Parameters:**
- Props destructured in function signature: `function ServiceCard({ icon, title, description, index, className = "" })`
- Default values provided: `className = ""`, `variant = "primary"`, `color = "cyan"`, `size = "md"`
- Optional parameters marked with `?` in interfaces: `onClick?: () => void`, `className?: string`

**Return Values:**
- JSX components return motion-wrapped elements or fragments
- TypeScript infers return types; explicit return type annotations not used for components
- Null returns explicit when conditionally rendering: `if (particles.length === 0) return null`

## Module Design

**Exports:**
- Default exports for all components: `export default function ComponentName()`
- Single component per file (one export per file)
- No barrel exports observed in components directory

**Barrel Files:**
- Not used in current structure; each component imported directly by path

## HTML/JSX Structure

**Attribute Ordering:**
- className attributes early in props list
- Event handlers (onClick, animate props) later
- Data attributes and ARIA attributes included where needed

**Tailwind CSS Usage:**
- Tailwind classes used inline: `className="min-h-screen bg-background text-white"`
- Custom theme values from config: `bg-primary`, `text-accent-cyan`, `border-glass-border`
- Responsive prefixes used: `md:col-span-2`, `sm:flex-row`, `md:px-12`
- Arbitrary values for specific values: Not observed in current code

**Motion/Animation:**
- Framer Motion variants pattern: Define as objects then reference in component
- Props spread pattern: `{...motionProps}` not used; props listed explicitly
- Transition objects inline for one-off animations, reusable variants defined separately

## Client-Side Marker

**"use client" Directive:**
- Used at top of all interactive components: `AnimatedText.tsx`, `ServiceCard.tsx`, `GlowButton.tsx`, `FloatingParticles.tsx`, `GradientOrb.tsx`, `page.tsx`, `privacy-policy/page.tsx`
- Not needed for Server Components (layout.tsx)
- Marks components that use hooks, event handlers, or browser APIs

## Type Safety

**TypeScript Configuration:**
- `target: "ES2017"` - Modern JavaScript target
- `strict: true` - All strict type-checking options enabled
- `noEmit: true` - Type checking only, compilation by Next.js
- `jsx: "react-jsx"` - New JSX runtime

**Typing Practices:**
- Props interfaces defined at component start: `interface AnimatedTextProps { ... }`
- React types imported: `import { ReactNode } from "react"`
- Type annotations for complex state: `useState<Array<{id, x, y, size, duration, delay}>>()`

---

*Convention analysis: 2026-02-21*
