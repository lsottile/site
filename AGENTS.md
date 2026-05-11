# Code Review Rules — lucianosottile.xyz

## Stack
- Astro (SSG + ISR via Vercel adapter)
- TypeScript (strict)
- Tailwind CSS v4 with CSS custom properties
- Notion as CMS, Cloudinary for images

## TypeScript
- Use `interface` for data shapes and component props; `type` for unions
- Use `import type` for type-only imports
- No `any` — use `unknown` and narrow, or define the shape
- Explicit return types on exported functions
- Nullable fields as `T | null`, never `T | undefined` unless semantically distinct
- Environment variables via `import.meta.env`, not `process.env`

## Astro Components
- Props interface declared in the frontmatter with `interface Props { ... }`
- Destructure props from `Astro.props` immediately after the interface
- Scoped `<style>` block in every component — no global class leakage
- Vanilla JS only in `<script>` blocks — no frameworks
- `is:inline` only for critical scripts that must run before paint (e.g. theme init)
- Layouts live in `src/layouts/`, reusable UI in `src/components/`

## CSS
- Never use hardcoded colors — always `var(--color-*)`
- Never use hardcoded font sizes — always `var(--text-*)`
- Spacing uses rem; layout uses CSS custom properties from the theme
- Class naming: BEM-adjacent — `.block`, `.block-element`, `.block--modifier`
- Hover transitions: `0.15s` ease on `color` and `border-color`
- Mobile-first; add breakpoints only when strictly necessary

## Accessibility
- All interactive elements need `aria-label` when the label isn't visible text
- Use `aria-current="page"` on active nav links
- Custom lists (`<ul role="list">`) when CSS removes default list semantics
- Semantic HTML over divs: `<nav>`, `<article>`, `<figure>`, `<figcaption>`, `<header>`
- Images must have descriptive `alt` text

## Performance
- Images: always `loading="lazy"` and `decoding="async"` (use `loading="eager"` only for LCP images above the fold)
- Fonts: self-hosted via `@fontsource` — never external Google Fonts requests
- No render-blocking external stylesheets or scripts in `<head>`

## CMS / Data Layer
- One file per entity in `src/lib/cms/` (e.g. `photos.ts`, `bio.ts`)
- Use the shared mappers (`plainText`, `plainTextOrNull`, `dateISO`, `selectOrNull`, `checkbox`) from `map.ts`
- Throw on missing required env vars immediately — fail fast
- Warn and skip on malformed rows — never crash the build over one bad entry
- Top-level `try/catch` in pages with a graceful fallback, never a blank crash

## Commits
- Conventional commits only: `feat`, `fix`, `style`, `perf`, `refactor`, `docs`, `chore`
- No AI attribution in commit messages
