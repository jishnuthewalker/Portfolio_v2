# Excalidraw Canvas Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an ephemeral free-draw playground section and a full-screen curated moodboard overlay to the portfolio, both powered by Excalidraw and gated behind a feature flag.

**Architecture:** Two lazy-loaded React components (`CanvasPlayground` inline below `ExperimentsSection`, `CanvasOverlay` as a full-screen modal) share a single `VITE_CANVAS_ENABLED` feature flag. When the flag is false, neither component loads and Excalidraw's ~700KB bundle is never fetched. The overlay loads a pre-authored Excalidraw JSON snapshot from `public/canvas/snapshot.json` authored via the Figma-to-Excalidraw plugin.

**Tech Stack:** React 19, Vite 7, Tailwind v4, `@excalidraw/excalidraw`, Framer Motion 12 (existing)

**Spec:** `docs/superpowers/specs/2026-03-23-excalidraw-canvas-integration-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/config/features.js` | **Create** | `FEATURES.canvas` flag — reads `VITE_CANVAS_ENABLED` |
| `.env.example` | **Create** | Documents `VITE_CANVAS_ENABLED=false` as the committed default |
| `.env.local` | **Create (gitignored)** | Local override: `VITE_CANVAS_ENABLED=true` |
| `src/hooks/useModal.js` | **Modify** | Replace inline `body.style.overflow` with CSS class toggle |
| `src/index.css` | **Modify** | Add `body.modal-open { overflow: hidden !important }` |
| `src/components/CanvasPlayground.jsx` | **Create** | Inline free-draw section, mobile activation overlay |
| `src/components/CanvasOverlay.jsx` | **Create** | Full-screen read-only moodboard, snapshot fetch + cache |
| `src/app/LegacyPortfolioApp.jsx` | **Modify** | Add `canvasOpen` state, lazy imports, Suspense wrappers, floating button, `CanvasOverlay` |
| `public/canvas/snapshot.json` | **Create** | Placeholder empty snapshot (real content authored in Figma later) |
| `package.json` | **Modify** | Add `overrides` for React 19 deduplication, then install Excalidraw |

---

## Task 1: Smoke test — verify Excalidraw works in this environment

Before touching the portfolio codebase, confirm Excalidraw renders correctly under React 19 + Vite 7. This is a pre-implementation gate.

**Files:**
- Create (temp): `src/components/_ExcalidrawSmokeTest.jsx` — deleted after passing

- [ ] **Step 1: Add React overrides to `package.json`**

Open `package.json`. Add an `"overrides"` key at the top level (alongside `"dependencies"`):

```json
"overrides": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

This forces all of Excalidraw's sub-dependencies to resolve to the project's single React 19 instance, preventing duplicate-React runtime errors.

- [ ] **Step 2: Install Excalidraw**

```bash
npm install @excalidraw/excalidraw --legacy-peer-deps
```

Expected: installs successfully with peer dependency warnings about React 18 (acceptable — the overrides handle runtime deduplication). If it errors hard (not warnings), check the npm version and retry with `--force` instead of `--legacy-peer-deps`.

- [ ] **Step 3: Create smoke test component**

Create `src/components/_ExcalidrawSmokeTest.jsx`:

```jsx
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'

export function ExcalidrawSmokeTest() {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Excalidraw />
    </div>
  )
}
```

- [ ] **Step 4: Mount smoke test temporarily in App**

Open `src/App.jsx`. Temporarily add the smoke test above the `LegacyPortfolioApp` lazy import:

```jsx
import { ExcalidrawSmokeTest } from './components/_ExcalidrawSmokeTest'

// inside return, above <Suspense>:
<ExcalidrawSmokeTest />
```

- [ ] **Step 5: Run dev server and verify**

```bash
npm run dev
```

Open the browser. Check:
- [ ] Excalidraw canvas renders (toolbar visible, white canvas)
- [ ] You can draw a line — pick the pencil tool, drag on canvas
- [ ] No console errors (especially no "Invalid hook call" or "ReactDOM.render is not a function")

If you see **"Invalid hook call"**: the `overrides` didn't deduplicate React. Run `npm ls react` — you should see only one version. If there are two, delete `node_modules`, clear the npm cache (`npm cache clean --force`), and reinstall.

If you see **"ReactDOM.render is not a function"**: Excalidraw is calling a removed React 18 API internally. This is a known risk. Check the installed Excalidraw version (`npm ls @excalidraw/excalidraw`) and try installing `@excalidraw/excalidraw@0.17.x` instead — the last version confirmed React 18 compatible.

- [ ] **Step 6: Revert App.jsx smoke test changes**

Remove the `ExcalidrawSmokeTest` import and usage from `src/App.jsx`. Delete `src/components/_ExcalidrawSmokeTest.jsx`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add excalidraw with react 19 overrides"
```

---

## Task 2: Feature flag infrastructure

**Files:**
- Create: `src/config/features.js`
- Create: `.env.example`
- Create: `.env.local` (gitignored, not committed)

- [ ] **Step 1: Create `src/config/features.js`**

```bash
mkdir -p src/config
```

Create `src/config/features.js`:

```js
// Feature flags — driven by environment variables.
// Set VITE_CANVAS_ENABLED=true in .env.local or deployment dashboard to enable canvas.
export const FEATURES = {
  canvas: import.meta.env.VITE_CANVAS_ENABLED === 'true',
}
```

- [ ] **Step 2: Create `.env.example`**

Create `.env.example` in the project root:

```
# Copy this file to .env.local and set values to enable features locally.
# Never commit .env.local — it is gitignored.

# Set to true to enable the Excalidraw canvas section + overlay
VITE_CANVAS_ENABLED=false
```

- [ ] **Step 3: Create `.env.local`**

Create `.env.local` in the project root (this file is already gitignored):

```
VITE_CANVAS_ENABLED=true
```

- [ ] **Step 4: Verify flag works**

In `src/config/features.js`, temporarily add a `console.log`:

```js
console.log('[features] canvas:', import.meta.env.VITE_CANVAS_ENABLED === 'true')
```

Run `npm run dev`, open browser console — confirm it logs `[features] canvas: true`.

Remove the `console.log` after confirming.

- [ ] **Step 5: Commit**

```bash
git add src/config/features.js .env.example
git commit -m "feat: add feature flag infrastructure for canvas"
```

---

## Task 3: Fix `useModal` scroll lock

Excalidraw also manipulates `document.body.style.overflow`. If both `useModal` and Excalidraw set it as an inline style, there's a race condition on close. Fix: use a CSS class with `!important` instead — it wins regardless of order.

**Files:**
- Modify: `src/hooks/useModal.js`
- Modify: `src/index.css`

- [ ] **Step 1: Add `body.modal-open` rule to `src/index.css`**

Open `src/index.css`. Find the `@theme {` block. Add the following **before** the `@theme` block (as a plain CSS rule, not inside `@theme`):

```css
/* Scroll lock for modals — uses !important to win over Excalidraw's inline overflow */
body.modal-open {
  overflow: hidden !important;
}
```

- [ ] **Step 2: Update `src/hooks/useModal.js`**

The current file (lines 13–21) sets `document.body.style.overflow`. Replace the body of the `useEffect` to use a class toggle instead:

```js
useEffect(() => {
  if (!isOpen) return
  document.body.classList.add('modal-open')
  document.addEventListener('keydown', handleKeyDown)
  return () => {
    document.body.classList.remove('modal-open')
    document.removeEventListener('keydown', handleKeyDown)
  }
}, [isOpen, handleKeyDown])
```

The full updated file:

```js
import { useEffect, useCallback } from 'react'

/**
 * Shared modal behaviour: Escape key close, body scroll lock.
 * Uses a CSS class (not inline style) so it wins over Excalidraw's
 * own body overflow manipulation via !important.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 */
export function useModal(isOpen, onClose) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('modal-open')
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])
}
```

- [ ] **Step 3: Verify existing modals still work**

```bash
npm run dev
```

Open the portfolio. Test:
- [ ] Click a project tile → ProjectModal opens, page scroll is locked
- [ ] Press ESC → modal closes, page scroll resumes
- [ ] Click "About" → AboutModal opens and closes correctly
- [ ] Open ⌘K palette → opens and closes correctly

No visible change in behaviour expected — this is a like-for-like refactor.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useModal.js src/index.css
git commit -m "fix: use CSS class for modal scroll lock to avoid Excalidraw conflict"
```

---

## Task 4: Placeholder snapshot

The `CanvasOverlay` will fetch `public/canvas/snapshot.json` on open. Create a valid placeholder now so the overlay renders something (a blank canvas) before the real moodboard is authored.

**Files:**
- Create: `public/canvas/snapshot.json`

- [ ] **Step 1: Create placeholder snapshot**

Create `public/canvas/snapshot.json`:

```json
{
  "elements": [],
  "appState": {
    "viewBackgroundColor": "#1a1a1a",
    "zoom": { "value": 0.8 },
    "scrollX": 0,
    "scrollY": 0
  },
  "files": {}
}
```

This is a valid Excalidraw snapshot — an empty canvas with a dark background. It will be replaced when the real moodboard is authored via the Figma plugin.

- [ ] **Step 2: Commit**

```bash
git add public/canvas/snapshot.json
git commit -m "chore: add placeholder excalidraw snapshot"
```

---

## Task 5: Build `CanvasPlayground`

**Files:**
- Create: `src/components/CanvasPlayground.jsx`

- [ ] **Step 1: Create `CanvasPlayground.jsx`**

Create `src/components/CanvasPlayground.jsx`:

```jsx
import { useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'

export function CanvasPlayground() {
  // On touch devices, Excalidraw's touch-action:none hijacks page scroll.
  // Only mount Excalidraw after the user deliberately taps into the section.
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const [activated, setActivated] = useState(!isTouchDevice)

  return (
    <section id="canvas" className="mt-6 mb-6">
      {/* Header — matches ExperimentsSection terminal aesthetic */}
      <div className="text-base font-mono mb-3 flex items-center gap-2">
        <span className="text-green">❯</span>
        <span className="text-accent">open ./canvas --mode=draw</span>
      </div>

      {/* Canvas container — dark, fixed height, isolated stacking context */}
      <div
        className="rounded-sm overflow-hidden bg-dark border border-dark-border"
        style={{ height: '480px', isolation: 'isolate' }}
      >
        {activated ? (
          <Excalidraw
            initialData={{
              elements: [],
              appState: { viewBackgroundColor: 'transparent' },
            }}
            // No persistenceKey — fresh canvas on every page load (ephemeral).
            // To add persistence later: persistenceKey="portfolio-canvas-playground"
          />
        ) : (
          // Activation overlay — only shown on touch devices before first tap
          <div
            className="h-full flex flex-col items-center justify-center cursor-pointer gap-3"
            onClick={() => setActivated(true)}
          >
            <span className="text-2xl">✏️</span>
            <span className="text-muted text-sm font-mono">tap to draw</span>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Mount in `LegacyPortfolioApp.jsx` temporarily (without flag) to test**

Open `src/app/LegacyPortfolioApp.jsx`. Add a direct (non-lazy) import temporarily:

```jsx
import { CanvasPlayground } from '../components/CanvasPlayground'
```

Add `<CanvasPlayground />` between `<ExperimentsSection />` and `<div className="flex-1" />`:

```jsx
<ExperimentsSection />
<CanvasPlayground />
<div className="flex-1" />
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Check:
- [ ] Canvas section appears below experiments with correct header (`❯ open ./canvas --mode=draw`)
- [ ] Dark container, correct height
- [ ] You can draw on the canvas (pencil tool works)
- [ ] Refresh page — canvas is blank (ephemeral confirmed)
- [ ] On a touch device (or DevTools mobile emulation): activation overlay shows first, drawing works after tapping in, page scrolls normally outside the canvas

- [ ] **Step 4: Remove the temporary direct import from `LegacyPortfolioApp.jsx`**

Remove the `import { CanvasPlayground }` line and the `<CanvasPlayground />` JSX you added in Step 2. The proper wiring with the feature flag happens in Task 7.

- [ ] **Step 5: Commit**

```bash
git add src/components/CanvasPlayground.jsx
git commit -m "feat: add CanvasPlayground component"
```

---

## Task 6: Build `CanvasOverlay`

**Files:**
- Create: `src/components/CanvasOverlay.jsx`

- [ ] **Step 1: Create `CanvasOverlay.jsx`**

Create `src/components/CanvasOverlay.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { useModal } from '../hooks/useModal'

// Module-level cache — snapshot is fetched once and reused across opens.
let snapshotCache = null

async function loadSnapshot() {
  if (snapshotCache) return snapshotCache
  const res = await fetch(`${import.meta.env.BASE_URL}canvas/snapshot.json`)
  if (!res.ok) throw new Error(`snapshot fetch failed: ${res.status}`)
  snapshotCache = await res.json()
  return snapshotCache
}

export function CanvasOverlay({ isOpen, onClose }) {
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState(null)

  useModal(isOpen, onClose)

  // Fetch snapshot on first open; subsequent opens use the module-level cache.
  useEffect(() => {
    if (!isOpen) return
    setError(null)
    loadSnapshot().then(setSnapshot).catch(setError)
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col"
      onClick={onClose}
    >
      {/* Panel — stops click propagation so backdrop click works */}
      <div
        className="relative flex-1 m-4 rounded-sm overflow-hidden"
        style={{ isolation: 'isolate' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close canvas"
          className="absolute top-3 right-3 z-10 text-muted hover:text-ink font-mono text-sm bg-dark border border-dark-border rounded-sm px-2 py-1"
        >
          ✕ close
        </button>

        {/* Loading state */}
        {!snapshot && !error && (
          <div className="h-full flex items-center justify-center bg-dark border border-dark-border rounded-sm">
            <span className="text-muted text-sm font-mono">loading canvas...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="h-full flex items-center justify-center bg-dark border border-dark-border rounded-sm">
            <span className="text-muted text-sm font-mono">couldn't load canvas</span>
          </div>
        )}

        {/* Canvas — only mounted after snapshot resolves */}
        {snapshot && (
          <Excalidraw
            viewModeEnabled={true}
            initialData={snapshot}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Mount in `LegacyPortfolioApp.jsx` temporarily (without flag) to test**

Open `src/app/LegacyPortfolioApp.jsx`. Add temporary state and direct import:

```jsx
import { CanvasOverlay } from '../components/CanvasOverlay'

// inside LegacyPortfolioApp:
const [canvasOpen, setCanvasOpen] = useState(false)
```

Add a temporary test button inside `<main>` (e.g. above `<Footer />`):

```jsx
<button onClick={() => setCanvasOpen(true)} className="text-sm font-mono text-accent">
  test: open canvas overlay
</button>
```

Add `CanvasOverlay` after `CommandPalette` (last in the DOM):

```jsx
<CanvasOverlay isOpen={canvasOpen} onClose={() => setCanvasOpen(false)} />
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Check:
- [ ] Clicking "test: open canvas overlay" opens a full-screen dark overlay
- [ ] Shows "loading canvas..." briefly, then renders a dark blank Excalidraw canvas (from the placeholder snapshot)
- [ ] Canvas is read-only — toolbar is visible but drawing is disabled (`viewModeEnabled`)
- [ ] Can zoom and pan
- [ ] Clicking the backdrop (outside the panel) closes the overlay
- [ ] Pressing ESC closes the overlay
- [ ] "✕ close" button closes the overlay
- [ ] Page scroll is locked while overlay is open, resumes on close
- [ ] Open the overlay, close it, open again — second open is instant (cached snapshot, no fetch)

- [ ] **Step 4: Remove temporary imports and test button from `LegacyPortfolioApp.jsx`**

Remove the `import { CanvasOverlay }`, the `canvasOpen` state, the test button, and the `<CanvasOverlay>` JSX you added. The proper wiring happens in Task 7.

- [ ] **Step 5: Commit**

```bash
git add src/components/CanvasOverlay.jsx
git commit -m "feat: add CanvasOverlay component with snapshot loading"
```

---

## Task 7: Wire everything into `LegacyPortfolioApp` with feature flag

This is the final integration step — replace the temporary direct imports with lazy-loaded, flag-gated wiring.

**Files:**
- Modify: `src/app/LegacyPortfolioApp.jsx`

- [ ] **Step 1: Update `LegacyPortfolioApp.jsx`**

Replace the full file with:

```jsx
import { useState, useEffect, lazy, Suspense } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome } from '../components/TerminalChrome'
import { HeroBox } from '../components/HeroBox'
import { ProjectsSection } from '../components/ProjectsSection'
import { ExperimentsSection } from '../components/ExperimentsSection'
import { Footer } from '../components/Footer'
import { ProjectModal } from '../components/ProjectModal'
import { AboutModal } from '../components/AboutModal'
import { CommandPalette } from '../components/CommandPalette'
import { FEATURES } from '../config/features'

// Lazy-loaded — Excalidraw's ~700KB bundle is only fetched when canvas is enabled
// and the component first renders. When FEATURES.canvas is false, these factories
// never execute.
const CanvasPlayground = FEATURES.canvas
  ? lazy(() => import('../components/CanvasPlayground').then(m => ({ default: m.CanvasPlayground })))
  : null

const CanvasOverlay = FEATURES.canvas
  ? lazy(() => import('../components/CanvasOverlay').then(m => ({ default: m.CanvasOverlay })))
  : null

export function LegacyPortfolioApp() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [canvasOpen, setCanvasOpen] = useState(false)

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <LayoutGroup>
      <main className="max-w-[1280px] mx-auto flex flex-col min-h-[calc(100vh_-_128px)]">
        <TerminalChrome />
        <HeroBox
          onAboutOpen={() => setAboutOpen(true)}
          onFilterChange={setActiveFilter}
          onOpenProject={setActiveProjectId}
          onPaletteOpen={() => setPaletteOpen(true)}
        />
        <ProjectsSection
          onOpenProject={setActiveProjectId}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <ExperimentsSection />

        {FEATURES.canvas && CanvasPlayground && (
          <Suspense fallback={<div className="h-[480px] border border-border-lt rounded-sm mt-6 mb-6" />}>
            <CanvasPlayground />
          </Suspense>
        )}

        <div className="flex-1" />
        <Footer />

        <ProjectModal
          projectId={activeProjectId}
          onClose={() => setActiveProjectId(null)}
        />
        <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
        <CommandPalette
          isOpen={paletteOpen}
          onClose={() => setPaletteOpen(false)}
          onOpenProject={setActiveProjectId}
          onOpenAbout={() => setAboutOpen(true)}
          onFilterChange={setActiveFilter}
        />

        {/* Canvas overlay — rendered last so it stacks above all other modals */}
        {FEATURES.canvas && CanvasOverlay && (
          <Suspense fallback={null}>
            <CanvasOverlay isOpen={canvasOpen} onClose={() => setCanvasOpen(false)} />
          </Suspense>
        )}
      </main>

      {/* Floating canvas button — outside <main> so it's fixed to viewport, not max-width container */}
      {FEATURES.canvas && (
        <button
          onClick={() => setCanvasOpen(true)}
          aria-label="Open canvas moodboard"
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-sm font-mono text-sm bg-dark border border-dark-border text-green hover:bg-dark-card hover:border-green-border transition-colors duration-200"
        >
          ✏ canvas
        </button>
      )}
    </LayoutGroup>
  )
}
```

- [ ] **Step 2: Verify with flag ON**

Confirm `.env.local` has `VITE_CANVAS_ENABLED=true`. Run:

```bash
npm run dev
```

Check:
- [ ] Canvas playground section appears below experiments
- [ ] Floating "✏ canvas" button visible in bottom-right
- [ ] Clicking the button opens `CanvasOverlay`
- [ ] All existing modals still work (ProjectModal, AboutModal, CommandPalette)
- [ ] Floating button disappears behind modal backdrop when any modal is open (z-30 vs z-40)

- [ ] **Step 3: Verify with flag OFF**

Set `VITE_CANVAS_ENABLED=false` in `.env.local` (or delete the line). Restart the dev server:

```bash
npm run dev
```

Check:
- [ ] No canvas section visible
- [ ] No floating button visible
- [ ] Network tab in DevTools: no requests to Excalidraw chunks
- [ ] All existing functionality unchanged

Restore `.env.local` to `VITE_CANVAS_ENABLED=true` after verifying.

- [ ] **Step 4: Commit**

```bash
git add src/app/LegacyPortfolioApp.jsx
git commit -m "feat: wire canvas feature flag, lazy loading, and floating button"
```

---

## Task 8: Snapshot authoring (manual step — Jishnu)

This task is done by Jishnu in Figma, not by the implementing agent. Documented here for completeness.

- [ ] **Step 1: Design the moodboard in Figma**

Build the curated canvas in Figma. Include:
- Project cards (title, category, brief)
- Process/behind-the-scenes sticky notes
- Mood boards
- Visual about-me section

Keep in mind: **raster images (PNG/JPG) will not export via the Figma plugin.** Use vector shapes and text for anything that must appear in the export. Images can be added directly in Excalidraw after the initial export.

- [ ] **Step 2: Test the Figma-to-Excalidraw plugin**

In Figma: Plugins → Community → search "Figma to Excalidraw" → Run.

Select your moodboard frame and export. Check the output JSON to confirm:
- `elements` array has content
- No important visual elements are missing

If images are missing (expected — the plugin doesn't export rasters): open [excalidraw.com](https://excalidraw.com), load the exported JSON (File → Open), then add images directly in Excalidraw's UI. Re-export from Excalidraw (File → Save to disk) to get the complete snapshot with embedded image data.

- [ ] **Step 3: Replace the placeholder snapshot**

Save the final JSON to `public/canvas/snapshot.json`, replacing the empty placeholder.

- [ ] **Step 4: Verify in the portfolio**

Run `npm run dev`, open the canvas overlay, confirm your moodboard appears and is zoomable/pannable.

- [ ] **Step 5: Commit**

```bash
git add public/canvas/snapshot.json
git commit -m "content: add initial canvas moodboard snapshot"
```

---

## Task 9: Final verification

- [ ] **Step 1: Full feature flag off test**

Set `VITE_CANVAS_ENABLED=false` in `.env.local`. Run `npm run build && npm run preview`.

Verify:
- [ ] No canvas UI anywhere on the page
- [ ] Open browser DevTools → Network → filter by JS: no Excalidraw chunk loaded
- [ ] Build output size is the same as before this feature was added (±5KB for the features.js module)

- [ ] **Step 2: Full feature flag on test**

Set `VITE_CANVAS_ENABLED=true`. Run `npm run build && npm run preview`.

Verify:
- [ ] Canvas playground renders below experiments
- [ ] Floating "✏ canvas" button visible
- [ ] Clicking button opens overlay with moodboard
- [ ] Read-only: can zoom/pan, cannot draw
- [ ] ESC, backdrop click, and close button all close the overlay
- [ ] Playground: can draw freely, refresh resets it
- [ ] Mobile (or DevTools emulation): scroll past playground without hijack, tap to activate, draw works

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: excalidraw canvas integration complete"
```
