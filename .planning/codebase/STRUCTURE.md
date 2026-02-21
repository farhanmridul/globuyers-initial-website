# Codebase Structure

**Analysis Date:** 2026-02-21

## Directory Layout

```
/Users/Farhan/Documents/Personal/GloBuyers/Website/
├── app/                          # Next.js App Router - page routes and layouts
│   ├── layout.tsx                # Root layout wrapper (fonts, metadata, globals)
│   ├── page.tsx                  # Home page (landing page)
│   ├── globals.css               # Global styles and custom CSS utilities
│   ├── privacy-policy/           # Privacy policy route
│   │   └── page.tsx              # Privacy policy page content
│   └── favicon.ico               # Favicon
├── components/                   # Reusable React components (all client-side)
│   ├── AnimatedText.tsx          # Staggered word animation component
│   ├── FloatingParticles.tsx     # Animated particle background
│   ├── GlowButton.tsx            # Interactive button with variants
│   ├── GradientOrb.tsx           # Animated gradient background element
│   └── ServiceCard.tsx           # Service card with hover animation
├── public/                       # Static assets served at root
│   ├── logo/
│   │   └── logo.png              # GloBuyers logo
│   ├── file.svg                  # SVG assets
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── favicon.ico (duplicate)   # Alternative favicon location
├── .planning/                    # Planning and analysis documentation
│   └── codebase/                 # Generated codebase analysis documents
├── Configuration Files:
│   ├── package.json              # Project dependencies and scripts
│   ├── package-lock.json         # Locked dependency versions
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.ts        # Tailwind CSS theme and plugin config
│   ├── next.config.ts            # Next.js build and runtime config
│   ├── eslint.config.mjs          # ESLint rules configuration
│   ├── postcss.config.mjs        # PostCSS configuration for Tailwind
│   └── next-env.d.ts             # Auto-generated Next.js TypeScript types
├── Documentation:
│   ├── README.md                 # Standard create-next-app README
│   └── RAILWAY_DEPLOY.md         # Railway platform deployment guide
├── .git/                         # Git version control (ignored in structure view)
├── .next/                        # Build output directory (ignored - auto-generated)
├── node_modules/                 # Dependencies (ignored - auto-generated)
└── .gitignore                    # Git ignore rules
```

## Directory Purposes

**app/:**
- Purpose: Next.js App Router pages and layouts - defines all routes and page hierarchy
- Contains: Page components (TSX), layout wrappers, global styles, route configuration
- Key files: `layout.tsx` (applied to all routes), `page.tsx` (home), `privacy-policy/page.tsx` (secondary route)
- Build behavior: Auto-compiled to `.next/` directory

**components/:**
- Purpose: Reusable React components - atomic/composite UI building blocks
- Contains: Client-side components only (all marked "use client")
- Key files: Button, text animation, background effects, content cards
- Naming: PascalCase filenames matching exported component names

**public/:**
- Purpose: Static asset serving at domain root
- Contains: Images, logos, favicons, SVG icons
- Build behavior: Files referenced via `/filename` in code (e.g., `/logo/logo.png`)
- No subdirectories are processed by Next.js build

**Configuration files (root):**
- Purpose: Project-level build, dependency, and tooling configuration
- TypeScript: `tsconfig.json` sets module resolution, strict mode, path aliases
- Styling: `tailwind.config.ts` defines color palette, animations, responsive breakpoints
- Build: `next.config.ts` (currently empty with placeholder)
- Linting: `eslint.config.mjs` defines code quality rules
- Package: `package.json` lists dependencies and npm scripts

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML structure, font loading, metadata configuration applied globally
- `app/page.tsx`: Home page entry point - renders hero, services, stats, contact sections
- `app/privacy-policy/page.tsx`: Secondary route for privacy policy page

**Configuration:**
- `tsconfig.json`: TypeScript compiler settings with `@/*` path alias pointing to root
- `tailwind.config.ts`: Design token configuration (colors, animations, spacing)
- `package.json`: Dependency versions and npm scripts (dev, build, start, lint)
- `next.config.ts`: Next.js-specific configuration (empty/minimal)

**Core Logic:**
- `app/page.tsx`: Scroll orchestration, section layout, component composition
- `components/GlowButton.tsx`: Button variant logic and interaction states
- `components/FloatingParticles.tsx`: Particle generation and animation state
- `components/AnimatedText.tsx`: Text animation sequencing and staggering

**Styling:**
- `app/globals.css`: Custom CSS classes (cyber-grid, glass-card, glow effects), font imports, scrollbar styling
- `tailwind.config.ts`: Tailwind theme extensions (custom colors, keyframes, utilities)

**Testing:**
- Not present - no test files or testing configuration

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `AnimatedText.tsx`, `GlowButton.tsx`)
- Pages: `page.tsx` (Next.js convention for route files)
- Layout: `layout.tsx` (Next.js convention for layout files)
- CSS: `globals.css` (single global stylesheet)
- Config: `camelCase.ts` or `.mjs` (e.g., `tailwind.config.ts`, `eslint.config.mjs`)

**Directories:**
- Feature/route-based: lowercase plural (e.g., `components/`, `app/`)
- Sub-routes: lowercase with hyphens (e.g., `privacy-policy/`)
- Asset groups: lowercase plural (e.g., `logo/`)

**TypeScript/JavaScript:**
- Interfaces: `PascalCase` with `Props` suffix (e.g., `ServiceCardProps`, `GradientOrbProps`)
- Variables: `camelCase` (e.g., `containerRef`, `scrollYProgress`, `variantClasses`)
- CSS classes: `kebab-case` from Tailwind (e.g., `bg-primary`, `text-gray-400`)
- Framer Motion variants: `camelCase` (e.g., `container`, `child`, `visible`, `hidden`)

## Where to Add New Code

**New Feature (full section):**
- Primary code: Create new file in `app/` as route-based page or section component in existing page
- Tests: Not applicable - no test structure exists
- Configuration: Update `tailwind.config.ts` if new colors/animations needed, `next.config.ts` if build changes needed

**New Component/Module:**
- Implementation: `components/[ComponentName].tsx` following existing pattern
- Pattern to follow:
  - Start with `"use client"` directive
  - Define TypeScript interface for props with descriptive names
  - Use Framer Motion for animations if interactive/visual feedback needed
  - Accept `className` prop for layout customization
  - Accept `children` prop if component contains nested content

**Utilities:**
- Shared helpers: Create as component if UI-related, or inline in page file if simple
- No dedicated utilities folder exists
- Consider adding if multiple components need same logic

**Styling:**
- Global styles: Add to `app/globals.css`
- Theme values: Add to `tailwind.config.ts` under `theme.extend`
- Component-specific: Use Tailwind className composition (avoid inline CSS)

**Pages/Routes:**
- New route: Create subdirectory in `app/` (e.g., `app/new-route/`) with `page.tsx`
- Layout changes: Apply in `app/layout.tsx` (global) or create nested `layout.tsx` files
- Metadata: Configure in `app/layout.tsx` using Next.js `Metadata` type

## Special Directories

**.next/:**
- Purpose: Build output and development cache
- Generated: Yes - auto-generated by Next.js build process
- Committed: No - listed in `.gitignore`
- Contents: Compiled pages, static assets, server functions, development server files

**node_modules/:**
- Purpose: Installed npm package dependencies
- Generated: Yes - via `npm install` from `package-lock.json`
- Committed: No - listed in `.gitignore`
- Update: Run `npm install` to regenerate

**public/:**
- Purpose: Static file serving
- Generated: No - manually managed
- Committed: Yes - logo and SVG assets are committed
- Behavior: Files accessible at root URL (e.g., `/logo/logo.png` serves `public/logo/logo.png`)

**logo/:**
- Purpose: Brand assets directory
- Duplicated in both root and public/ (consistency inconsistency - see CONCERNS.md)
- Contains: GloBuyers logo PNG file

---

*Structure analysis: 2026-02-21*
