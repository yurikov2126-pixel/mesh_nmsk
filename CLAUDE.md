# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MeshWorks Wiki — a Russian-language Docusaurus 3 documentation site about Meshtastic, LoRa mesh networks, and MeshWorks infrastructure. Deployed at https://wiki.meshworks.ru.

## Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run check` | Typecheck + MDX lint + build (same as CI) |
| `npm run lint` | `tsc --noEmit` + MDX linting |
| `npm run lint:mdx` | Lint only markdown files |
| `npm run typecheck` | TypeScript compilation check (`tsc`) |
| `npm test` | Run Vitest unit tests |
| `npm run clear` | Clear Docusaurus cache (`.docusaurus/`) |

Always run `npm run check` before pushing — it mirrors CI.

## Architecture

**Framework**: Docusaurus 3.9.2, React 19, TypeScript 5.6
**Docs route**: `/` (not `/docs/`) — configured via `routeBasePath: '/'`
**Sidebar**: Auto-generated from `docs/` folder structure; ordering and labels come from frontmatter (`sidebar_position`, `sidebar_label`)
**Blog**: Disabled

### Key directories

- `docs/` — Main documentation content (Markdown). Sections: `introduction/`, `devices/`, `node-setup/`, `antennas/`, `troubleshooting/`
- `static-pages/` — Extra pages (home, about, wiki guide) served via a second `plugin-content-pages` instance
- `src/components/` — React components organized by feature: `homepage/`, `portable-catalog/`, `sponsors/`, `icons/`
- `src/css/` — `custom.css` (global overrides), `theme-tokens.css` (CSS custom properties / design system)
- `src/theme/` — Swizzled Docusaurus components: `Navbar/`, `Admonition/Type/Favorite.tsx`, `NotFound/`, `SearchPage/`
- `src/lib/utils.ts` — Shared utilities (`cn`, `shuffle`, `pickRandom`, etc.)
- `src/data/` — JSON data files (`sponsors.json`, `apps.json`, `links.json`)
- `src/hooks/` — Custom hooks (`useDocusaurusTheme` / `useTheme`)
- `scripts/` — Build utilities (image optimization, broken image checks)

### Path aliases

- `@/*` → `src/*` (webpack alias + tsconfig paths)
- `@site/*` → project root

### Styling

Pure CSS — no Tailwind, no SCSS. Uses CSS custom properties defined in `theme-tokens.css`.
Brand accent color: `--mesh-accent: #c6fd50`.
Component styles use CSS Modules (`.module.css` files).
Dark/light mode via `[data-theme='light']` / `[data-theme='dark']` selectors.

### Plugins (configured in `docusaurus.config.ts`)

- `@easyops-cn/docusaurus-search-local` — Local search (not Algolia)
- `@docusaurus/plugin-ideal-image` — Image optimization
- `@docusaurus/plugin-pwa` — PWA (production only)
- `@docusaurus/plugin-google-gtag` — Analytics
- Custom webpack alias plugin for `@/` imports

### Testing

Vitest with jsdom environment. Tests live alongside components (e.g., `PortableCopyCatalog.test.tsx`). Run a single test file: `npx vitest run path/to/file.test.tsx`.

## Content Conventions

- **Language**: Russian only (locale: `ru`)
- **Frontmatter required**: `title`, `description`, `slug`, `sidebar_label`, `sidebar_position`
- **Broken links**: `onBrokenLinks: 'throw'` — the build will fail on broken internal links
- **Images**: Place in `static/img/<topic>/`, reference as `/img/<topic>/file.png`, keep width ≤ 1600px
- **Custom admonition**: `:::favorite` (in addition to standard `tip`, `info`, `warning`, `note`)
- **Style**: Narrative, no jargon (see CONTRIBUTING.md for full guide)

## CI/CD

- **CI** (`.github/workflows/ci.yml`): Runs `npm run check` on PRs and pushes to `main`
- **Deploy** (`.github/workflows/deploy.yml`): Builds and rsyncs to production server, reloads nginx via Docker
