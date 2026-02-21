# Technology Stack

**Analysis Date:** 2026-02-21

## Languages

**Primary:**
- TypeScript 5 - All application code (components, pages, configuration)
- JSX/TSX - React component definitions

**Secondary:**
- CSS3 - Tailwind-generated styles via PostCSS
- JavaScript (ES modules) - Configuration files (postcss.config.mjs, eslint.config.mjs)

## Runtime

**Environment:**
- Node.js (version not pinned in project, typically LTS versions supported by Next.js 16)

**Package Manager:**
- npm (used for scripts and dependency management)
- Lockfile: `package-lock.json` present (v3)

## Frameworks

**Core:**
- Next.js 16.1.6 - React framework with App Router, server-side rendering, static generation, and optimized image/font serving
- React 19.2.3 - UI library for building components
- React DOM 19.2.3 - React rendering for browser

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework for styling
- PostCSS 4 (via @tailwindcss/postcss) - CSS processing pipeline for Tailwind compilation

**Animation:**
- Framer Motion 12.34.0 - Animation library for React components, used for entrance animations, scroll effects, and interactive motion

**Development/Linting:**
- ESLint 9 - Code linting and quality checks
- eslint-config-next 16.1.6 - Next.js and Core Web Vitals ESLint configuration
- TypeScript 5 - Static type checking and compilation

## Key Dependencies

**Critical:**
- `framer-motion` ^12.34.0 - Powers all animations (page transitions, particle effects, button hovers, scroll-based transformations). Used extensively in `app/page.tsx` and component files
- `next` 16.1.6 - Framework runtime, handles App Router, image optimization, font loading, and deployment

**Development:**
- `@types/react` ^19 - Type definitions for React
- `@types/react-dom` ^19 - Type definitions for React DOM
- `@types/node` ^20 - Type definitions for Node.js APIs
- `eslint-config-next` 16.1.6 - Includes Next.js best practices, Core Web Vitals, and TypeScript rules

## Configuration Files

**Build & Dev:**
- `next.config.ts` - Next.js configuration (currently minimal, default behavior)
- `tsconfig.json` - TypeScript compiler options with strict mode enabled, ES2017 target, bundler module resolution
- `postcss.config.mjs` - PostCSS pipeline configuration for Tailwind CSS v4
- `tailwind.config.ts` - Tailwind CSS theme customization (colors, animations, gradients)
- `eslint.config.mjs` - ESLint rule configuration using new flat config format

**Environment:**
- No `.env` files tracked in git
- Environment variables for secrets are configured at deployment (Railway, Vercel)

## Build & Runtime Behavior

**Development:**
- Command: `npm run dev`
- Runs Next.js development server with hot module reloading on port 3000

**Production Build:**
- Command: `npm run build`
- Outputs optimized bundle to `.next/` directory
- Creates static assets and server-side rendering code

**Production Start:**
- Command: `npm start`
- Runs Next.js production server serving optimized bundle

**Linting:**
- Command: `npm run lint`
- Runs ESLint on all source files

## Platform Requirements

**Development:**
- Node.js (LTS or current version compatible with Next.js 16)
- npm 9+ (for lockfile v3 support)
- Modern browser for testing (supports ES2017+)

**Production:**
- Node.js 18+ (Next.js 16 minimum requirement)
- Deployment to Vercel, Railway, or compatible Node.js hosting
- 512MB+ memory recommended for Next.js server

## Asset Management

**Images:**
- Next.js Image component optimization used throughout (`app/page.tsx`, footer)
- Images stored in `public/` directory
- Google Fonts integration via `next/font/google` (Geist font family)

**Static Assets:**
- `public/` directory contains SVG assets and logo directory
- Geist and Geist Mono fonts loaded via Next.js font optimization

---

*Stack analysis: 2026-02-21*
