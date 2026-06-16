# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Pebbles is a browser-based 3D viewer for **product design review** — you load a
model and orbit/inspect it. It is a reference viewer, not an authoring or
sketching tool. The whole project (UI strings, code, comments, identifiers) is
in English by deliberate convention; keep it that way.

## Working in this repo

**Never commit or push directly to `main`.** All changes land via a pull request:
branch off `main`, push the branch, and open a PR (`gh pr create --base main`).
`main` is the deploy branch — merging a PR publishes to GitHub Pages — and is
protected by a "changes must be made through a pull request" rule. Let the user
review and merge; do not merge on their behalf unless asked.

## Commands

This project uses **pnpm** (pinned via the `packageManager` field). Run from the repo root.

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` — serves at `http://localhost:5173/pebbles/` |
| Production build | `pnpm build` — `tsc -b` typecheck then `vite build` into `dist/` |
| Preview the prod build | `pnpm preview` — serves `dist/` at `/pebbles/`, mirrors GitHub Pages exactly |
| Typecheck only | `pnpm typecheck` |
| Lint + format check | `pnpm lint` (Biome) |
| Auto-fix format/lint | `pnpm format` |
| Run tests once | `pnpm test` (Vitest) |
| Watch tests | `pnpm test:watch` |
| Single test file | `pnpm test src/lib/openModelFile.test.ts` |
| Single test by name | `pnpm test -t "loads a supported file"` |

## Architecture

A Vite + React 19 + TypeScript SPA. Rendering is **react-three-fiber** (R3F)
over three.js, with **@react-three/drei** helpers. UI state lives in **Zustand**.
Styling is **Tailwind CSS v4** (configured via the `@tailwindcss/vite` plugin and
`@import "tailwindcss"` in `src/styles.css` — there is no `tailwind.config.js`).

The single source of truth for viewer state is `src/store/useViewerStore.ts`
(Zustand). Both the DOM UI (`Toolbar`, `App`) and the WebGL scene (`Viewer`)
read from and write to this store — they never talk to each other directly. This
is the key boundary: **the React/DOM tree and the R3F/Canvas tree are separate
React reconcilers that communicate only through the store.** When adding a
feature, decide whether it is DOM chrome or scene content, then wire it through
the store rather than passing props across the boundary.

Data flow for loading a model:
1. A file arrives via drag-drop (`App.tsx`) or the file picker (`Toolbar.tsx`).
2. `src/lib/openModelFile.ts` validates the extension, creates a `blob:` object
   URL, and calls `loadModel` on the store. It returns an error string (not a
   thrown exception) for unsupported files.
3. The store owns the object URL's lifecycle: `loadModel`/`clearModel`
   **revoke the previous URL** before replacing it. Anything that swaps the
   model must go through the store so URLs are not leaked.
4. `Viewer.tsx` reacts to `model` and renders `<Model url={...}>`, which calls
   drei's `useGLTF`. `<Stage>` auto-centers/frames the model and supplies
   image-based lighting; `key={model.url}` forces a clean remount per model.

### Things that will bite you

- **GitHub Pages base path.** `vite.config.ts` sets `base: "/pebbles/"`
  unconditionally so dev, preview, and production are identical. If the repo is
  ever renamed, this string and the URLs in this file must change together.
  Reference static assets through Vite imports or `import.meta.env.BASE_URL`,
  never with a hardcoded leading-slash path, or they break under the base.
- **GLB vs glTF.** Only `.glb` and `.gltf` are accepted. GLB is self-contained
  and reliable; a `.gltf` that references external buffers/textures will fail
  because it is loaded from a `blob:` URL with no sibling files to resolve.
  External absolute URIs embedded in a model are deliberately blocked — see
  `src/lib/safeResourceUrl.ts` (wired via `loader.manager.setURLModifier` in
  `Model.tsx`) — so a malicious file cannot beacon out when opened.
- **Everything is self-hosted; no external runtime origins.** The app is fully
  same-origin by design so the CSP in `index.html` can forbid external fetches:
  - Environment HDRIs are vendored in `public/hdri/`; `src/lib/environmentPresets.ts`
    maps a preset to a same-origin URL. drei's CDN path is NOT used.
  - The Draco decoder is vendored in `public/draco/`; `src/lib/configureLoaders.ts`
    calls `useGLTF.setDecoderPath(...)` (imported for side effect in `main.tsx`)
    to override drei's default gstatic CDN.
  - **Do not** reintroduce a CDN-loaded asset without also widening the CSP. The
    `public/draco/*.js` files are vendored third-party minified code and are
    excluded from Biome (`biome.json` `files.includes`) — don't run `format` on them.
- **CSP.** `index.html` ships a strict `<meta>` CSP (`'self'` + `blob:`/`data:`,
  plus `wasm-unsafe-eval` for Draco and `'unsafe-inline'` styles for three's
  canvas). GitHub Pages cannot set real headers, so `frame-ancestors`/HSTS are
  not enforceable here. If you add a feature that loads from a new origin or uses
  a new wasm/worker, update the CSP or it will silently break in the browser.
- **Bundle size.** three.js makes the JS chunk ~1.2 MB (gzip ~345 kB); vendored
  HDRIs (~6.4 MB) and the Draco decoder (~0.8 MB) are static assets fetched
  on demand, not part of the JS bundle. The Vite 500 kB chunk warning is
  expected, not a regression.

## Testing

Vitest with jsdom. `src/test/setup.ts` loads `@testing-library/jest-dom` and
polyfills `URL.createObjectURL`/`revokeObjectURL` (absent in jsdom) — store and
file-loading logic depend on these. Prefer testing store/lib logic directly;
R3F scene components can be exercised with `@react-three/test-renderer` when
needed, but plain DOM/logic tests are the default.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs
`pnpm lint` + `pnpm test` + `pnpm build` and publishes `dist/` to GitHub Pages
via the official `upload-pages-artifact` / `deploy-pages` actions (no Jekyll, so
no `.nojekyll` needed). The Pages source must be set to "GitHub Actions" in repo
settings. The account uses a custom domain, so the live URL is
https://motoshira.net/pebbles/ (github.io redirects there). The base path is
still `/pebbles/` regardless of domain.
