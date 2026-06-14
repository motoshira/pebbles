# Pebbles

A lightweight, browser-based **3D viewer for product design review**. Drop a
`.glb`/`.gltf` model and orbit, light, and inspect it.

**Live:** https://motoshira.net/pebbles/

## Stack

- **Vite** + **React 19** + **TypeScript** (SPA)
- **react-three-fiber** + **@react-three/drei** over **three.js**
- **Zustand** for viewer state
- **Tailwind CSS v4** for UI
- **Biome** (lint/format) · **Vitest** (tests)

## Develop

```sh
pnpm install
pnpm dev        # http://localhost:5173/pebbles/
```

| Command | Purpose |
| --- | --- |
| `pnpm build` | Typecheck + production build to `dist/` |
| `pnpm preview` | Serve the production build (mirrors GitHub Pages) |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome auto-fix |
| `pnpm test` | Run tests |

## Deploy

Every push to `main` builds and publishes to GitHub Pages via GitHub Actions
(`.github/workflows/deploy.yml`). Ensure the repo's **Settings → Pages → Source**
is set to **GitHub Actions**.
