# Excalidraw Canvas Integration — Design Spec

**Date:** 2026-03-23
**Status:** Ready for implementation
**Author:** Jishnu Diwakar (brainstormed with Claude)

---

## Overview

Add two canvas surfaces to the portfolio using Excalidraw — an ephemeral free-draw playground inline on the main page, and a full-screen curated moodboard overlay authored in Figma. Both are gated behind a feature flag and lazy-loaded so they have zero cost when disabled.

---

## Goals

- Give visitors an interactive canvas to draw on freely (playground)
- Let Jishnu present a richer, spatial view of his work — projects, process notes, mood boards, and an about-me — on an infinite canvas (overlay)
- Keep the authoring workflow in Figma: design in Figma → Figma-to-Excalidraw plugin → commit JSON → done
- Zero performance impact when the feature is off
- Easily togglable in deployment without a code change

---

## Library Choice

**Excalidraw** (`@excalidraw/excalidraw`)

Chosen over tldraw (proprietary license, mandatory watermark) and Konva (no Figma authoring workflow). The hand-drawn aesthetic is accepted. The `initialData` prop + `viewModeEnabled` cover both use cases. The Figma-to-Excalidraw plugin enables a visual authoring workflow without writing JSON by hand.

---

## Feature Flag

All canvas surfaces are gated behind a single environment variable.

```
# .env.example  (committed — documents the variable; copy to .env.local to enable)
VITE_CANVAS_ENABLED=false

# .env.local  (gitignored — override locally)
VITE_CANVAS_ENABLED=true
```

> **Note:** `.env` is gitignored in this project (see `c7d2843`). Commit the default to `.env.example` instead. Copy `.env.example` to `.env.local` and set `=true` to enable locally.

Feature config:

```js
// src/config/features.js
export const FEATURES = {
  canvas: import.meta.env.VITE_CANVAS_ENABLED === 'true',
}
```

- Vite statically replaces `import.meta.env.*` at build time — when false, the dead branch is tree-shaken
- `=== 'true'` is required; env vars are always strings in Vite
- `React.lazy` factory only executes when the component renders — if `FEATURES.canvas` is false, the factory never fires and Excalidraw's bundle is never loaded
- To enable in production: set `VITE_CANVAS_ENABLED=true` in the Vercel/Netlify environment dashboard, no code change or commit needed

---

## Architecture

Two new components added to `src/app/LegacyPortfolioApp.jsx`:

```
src/components/
  CanvasPlayground.jsx   # inline section — free draw, ephemeral
  CanvasOverlay.jsx      # full-screen overlay — curated moodboard, read-only
src/config/
  features.js            # FEATURES.canvas flag
public/
  canvas/
    snapshot.json        # Excalidraw-format moodboard (authored via Figma plugin)
```

Page layout (updated):

```
TerminalChrome
HeroBox
ProjectsSection
ExperimentsSection
CanvasPlayground      ← new (rendered only when FEATURES.canvas)
Footer

[CanvasOverlay]       ← new overlay, rendered last in DOM (above all other modals)
[floating ✏ button]  ← always visible when FEATURES.canvas, z-30
```

State additions to `src/app/LegacyPortfolioApp.jsx`:

```jsx
const [canvasOpen, setCanvasOpen] = useState(false)
```

Lazy loading (both components use named exports — `export function CanvasPlayground` / `export function CanvasOverlay` — matching the project's convention):

```jsx
const CanvasPlayground = lazy(() =>
  import('./components/CanvasPlayground').then(m => ({ default: m.CanvasPlayground }))
)
const CanvasOverlay = lazy(() =>
  import('./components/CanvasOverlay').then(m => ({ default: m.CanvasOverlay }))
)
```

Each wrapped in its own `<Suspense>` at point of use — never relies on the outer App.jsx Suspense boundary:

```jsx
{FEATURES.canvas && (
  <Suspense fallback={<div className="h-[480px] border border-border-lt rounded-sm" />}>
    <CanvasPlayground />
  </Suspense>
)}

{FEATURES.canvas && (
  <Suspense fallback={null}>
    <CanvasOverlay isOpen={canvasOpen} onClose={() => setCanvasOpen(false)} />
  </Suspense>
)}
```

---

## Component: CanvasPlayground

### Purpose
Inline section below `ExperimentsSection`. Visitors can freely draw on it. Resets on page refresh (ephemeral — no persistence). Acts as a live signal that tldraw/canvas tooling is part of Jishnu's world.

### Layout
- Fixed height: `h-[480px]`
- Matches the `ExperimentsSection` visual language: dark container, terminal header
- Terminal header: `❯ open ./canvas --mode=draw`
- `isolation: isolate` on the wrapper div to contain Excalidraw's CSS

### Mobile activation overlay
Excalidraw sets `touch-action: none` on its container, which hijacks page scroll on mobile the moment a finger touches the canvas. Solution: show an activation overlay on touch devices that only mounts `<Excalidraw>` after the user deliberately taps in.

```jsx
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
const [activated, setActivated] = useState(!isTouchDevice)

if (!activated) {
  return (
    <div className="h-full flex items-center justify-center cursor-pointer ..."
         onClick={() => setActivated(true)}>
      <span className="text-muted text-sm font-mono">tap to draw</span>
    </div>
  )
}
return <Excalidraw ... />
```

### Excalidraw config
```jsx
<Excalidraw
  excalidrawAPI={/* optional ref */}
  initialData={{ elements: [], appState: { viewBackgroundColor: 'transparent' } }}
  // No persistenceKey — ensures fresh canvas every load
/>
```

---

## Component: CanvasOverlay

### Purpose
Full-screen overlay presenting Jishnu's curated canvas: project cards, process notes, sticky notes, and visual about-me content. Read-only zoom/pan — visitors explore but cannot edit.

### Open/close
- Opened by floating `✏` button (bottom-right of page)
- Closed by ESC key, backdrop click, or explicit close button
- Uses `useModal` hook for ESC handling and body scroll lock

### useModal scroll lock fix
The existing `useModal` hook sets `document.body.style.overflow = 'hidden'` inline. Excalidraw also manipulates body overflow, causing a race condition on close. Fix: update `useModal` to use a CSS class instead:

```css
/* index.css */
body.modal-open {
  overflow: hidden !important;
}
```

```js
// useModal.js — replace inline style with class toggle
document.body.classList.add('modal-open')
// cleanup:
document.body.classList.remove('modal-open')
```

The `!important` wins over Excalidraw's inline overflow manipulation regardless of effect cleanup order.

### Snapshot loading
Fetch on first open, cached at module level (no re-fetch on subsequent opens):

```js
let snapshotCache = null

async function loadSnapshot() {
  if (snapshotCache) return snapshotCache
  const res = await fetch(`${import.meta.env.BASE_URL}canvas/snapshot.json`)
  if (!res.ok) throw new Error(`snapshot fetch failed: ${res.status}`)
  snapshotCache = await res.json()
  return snapshotCache
}
```

`import.meta.env.BASE_URL` is required — hardcoding `/canvas/snapshot.json` will 404 when the app is deployed under a sub-path.

### Loading and error states
Mount `<Excalidraw>` only after the snapshot resolves:

```jsx
const [snapshot, setSnapshot] = useState(null)
const [error, setError] = useState(null)

useEffect(() => {
  if (!isOpen) return
  loadSnapshot().then(setSnapshot).catch(setError)
}, [isOpen])

// Inline error state — no separate component needed:
if (error) return (
  <div className="h-full flex items-center justify-center bg-dark border border-dark-border rounded-sm">
    <span className="text-muted text-sm font-mono">couldn't load canvas</span>
  </div>
)
// Inline loading state:
if (!snapshot) return (
  <div className="h-full flex items-center justify-center bg-dark border border-dark-border rounded-sm">
    <span className="text-muted text-sm font-mono">loading canvas...</span>
  </div>
)
return <Excalidraw viewModeEnabled initialData={snapshot} ... />
```

### Excalidraw config
```jsx
<Excalidraw
  viewModeEnabled={true}
  initialData={snapshot}   // { elements, appState, files }
/>
```

### Floating button
```jsx
{FEATURES.canvas && (
  <button
    onClick={() => setCanvasOpen(true)}
    aria-label="Open canvas moodboard"
    className="fixed bottom-6 right-6 z-30 ..."
  >
    ✏
  </button>
)}
```

- `z-30` — below all modal backdrops (`z-40`) so it naturally disappears behind any open modal
- Styled to match the portfolio: `font-mono`, terminal green accent, dark background
- Rendered in `src/app/LegacyPortfolioApp.jsx` directly (not inside CanvasOverlay)

### DOM order
`CanvasOverlay` is rendered last in `src/app/LegacyPortfolioApp.jsx` — after `ProjectModal`, `AboutModal`, `CommandPalette`. This ensures it stacks above all other overlays when open.

---

## Snapshot Authoring Workflow

1. Design the moodboard in Figma (project cards, sticky notes, process flows, about-me)
2. Run the **"Figma to Excalidraw"** Figma Community plugin
3. Copy the exported JSON
4. Save to `public/canvas/snapshot.json` and commit
5. To update: repeat — no code changes needed

### Raster image caveat
The Figma plugin does not export embedded raster images (PNG/JPG assets in the Figma file). If the moodboard contains screenshots or mockup images, those will be missing from the export. Options:
- **Preferred:** Author the snapshot natively in Excalidraw (add images directly in Excalidraw's UI, export via File → Save to disk). The output format is identical.
- Re-add images manually in Excalidraw after the Figma export.

Test the specific moodboard through the plugin before committing to the Figma-first workflow.

### Snapshot JSON shape
```json
{
  "elements": [ /* ExcalidrawElement[] */ ],
  "appState": {
    "viewBackgroundColor": "#1a1a1a",
    "zoom": { "value": 0.8 },
    "scrollX": 0,
    "scrollY": 0
  },
  "files": { /* embedded image data, if any */ }
}
```

---

## Installation

```bash
npm install @excalidraw/excalidraw --legacy-peer-deps
```

Add React overrides to `package.json` to force all of Excalidraw's sub-deps to resolve to the project's React 19 instance (prevents duplicate-React runtime errors):

```json
"overrides": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

**Pre-implementation gate:** Before writing any integration code, verify Excalidraw renders correctly in this React 19 + Vite 7 environment. Run a smoke test:
```bash
# In a throwaway branch or minimal repro:
npm install @excalidraw/excalidraw --legacy-peer-deps
# Render <Excalidraw /> and confirm no console errors, draw tool works
```

If the smoke test fails, investigate `ReactDOM.render` removal issues in Excalidraw's internals before proceeding.

---

## CSS Isolation

Both components use `isolation: isolate` on their wrapper `<div>` to create a new stacking context and reduce Excalidraw's CSS from bleeding into the surrounding page:

```jsx
<div style={{ isolation: 'isolate' }} className="...">
  <Excalidraw ... />
</div>
```

### Known interaction
`html { font-size: 16px }` (the portfolio's scale knob) affects Excalidraw's `rem`-based UI. This is acceptable — Excalidraw scales with the rest of the page. Do not change the scale knob without re-testing canvas layout.

`body { font-family: var(--font-mono) }` may cause drawn text in Excalidraw to render in JetBrains Mono. Test and confirm this is intentional before shipping.

---

## What Is Out of Scope

- **Persistence** — visitor drawings are ephemeral. No backend, no localStorage. Designed so persistence can be added later without architecture changes (add `persistenceKey` prop to `<Excalidraw>` in `CanvasPlayground`).
- **Multiplayer / collaboration** — not considered.
- **Custom Excalidraw toolbar** — using Excalidraw's default toolbar. No custom tool UI.
- **MotionSection** — do not rebuild. This feature does not replace it.

---

## Checklist for Implementation

- [ ] Smoke test: Excalidraw renders in React 19 + Vite 7 without errors
- [ ] Install `@excalidraw/excalidraw` with `overrides` in package.json
- [ ] Create `src/config/features.js`
- [ ] Commit `VITE_CANVAS_ENABLED=false` to `.env.example`
- [ ] Update `useModal.js` — body class toggle instead of inline overflow style
- [ ] Build `CanvasPlayground.jsx` with mobile activation overlay
- [ ] Build `CanvasOverlay.jsx` with fetch + cache + loading/error states
- [ ] Add floating button to `LegacyPortfolioApp.jsx` (z-30, aria-label)
- [ ] Add `canvasOpen` state + lazy imports + Suspense wrappers to `LegacyPortfolioApp.jsx`
- [ ] Add `VITE_CANVAS_ENABLED=true` to `.env.local` and test locally
- [ ] Author first snapshot (test Figma plugin; fall back to native Excalidraw if images don't export)
- [ ] Commit `public/canvas/snapshot.json`
- [ ] Test on mobile: scroll past playground, tap to activate, scroll away
- [ ] Test overlay: open, pan/zoom, ESC closes, backdrop click closes
- [ ] Test with feature flag off: no bundle cost, no UI, page unchanged
