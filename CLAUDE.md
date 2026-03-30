# CLAUDE.md — Frontend Website Rules

## Active Plugins

- **frontend-design** (Anthropic) — auto-applies every session, improves UI quality and code aesthetics
- **ui-ux-pro-max** (nextlevelbuilder) — auto-applies every session, provides design system database for typography, color, and UX patterns
- **magic** (21st.dev) — invoke with `/ui <description>` to generate polished components from 21st.dev's library

## Always Do First

- These plugins are user-scoped and load automatically. No manual invocation needed except for `/ui`.
- Use `/ui` for discrete components (navbars, cards, pricing tables, forms) before writing them manually.

## Reference Images

- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server

- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed locally in the project.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults

- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets

- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules

- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Project-specific: Tiger Strake Portfolio

**Tech stack:** Next.js 16 + React 19 + TypeScript + Tailwind v4 + static export

**Important Next.js 16 constraints:**
- Event handlers (`onMouseEnter`, `onMouseLeave`) cannot be on Server Component props
- Use CSS classes with `:hover` pseudo-class instead (add to globals.css)
- `"use client"` pages cannot export `metadata`
- Static export requires `generateStaticParams` on `[slug]` routes

**Serving:** `node serve.mjs` serves the `out/` directory (static export)
**Build:** `npm run build` → exports to `out/`

**Accent color:** `#C8865A` (copper/amber). To retheme: change the two `--color-accent` lines in `globals.css`

**Data layer:** All project/build-log content is in `src/data/projects.ts` and `src/data/buildLog.ts` — add content there, pages update automatically.

**Physics simulation:** `src/components/OrbitalBackground.tsx` — all tuning parameters in the `CONFIG` object at the top. Key params: `G`, `PERMANENT_MASS`, `MAX_SPEED`, `TRAIL_ALPHA`.
