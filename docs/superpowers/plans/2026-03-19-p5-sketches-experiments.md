# p5.js Sketches — Experiments Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 7 p5.js sketches from `jishnuthewalker/.p5-sketches` as individual cards in the portfolio's ExperimentsSection, hosted as static files in this repo under `public/p5/`.

**Architecture:** Clone the source repo to a temp directory, copy the required folders (`sketches/`, `assets/`, `src/`) and 7 HTML files into `public/p5/`. No path changes needed in any HTML file — relative paths resolve correctly from their location. Add 7 entries to `src/data/experiments.js` with `/Portfolio_v2/p5/` prefixed URLs to match `vite.config.js base`.

**Tech Stack:** Bash file operations, Git, Vite static serving (`public/` folder), React data file

---

## Files

| Action | Path |
|--------|------|
| Create (whole folder) | `public/p5/` |
| Modify | `src/data/experiments.js` |

---

### Task 1: Clone source repo and copy static files

**Files:**
- Create: `public/p5/` (entire folder tree)

- [ ] **Step 1: Clone the p5-sketches repo to a temp directory**

```bash
git clone https://github.com/jishnuthewalker/.p5-sketches.git /tmp/p5-sketches
```

Expected: repo cloned to `/tmp/p5-sketches`

- [ ] **Step 2: Create the destination folder**

```bash
mkdir -p public/p5
```

- [ ] **Step 3: Copy the 7 HTML sketch files**

```bash
cp /tmp/p5-sketches/cube.html \
   /tmp/p5-sketches/grid.html \
   /tmp/p5-sketches/type.html \
   /tmp/p5-sketches/crystals.html \
   /tmp/p5-sketches/meteors.html \
   /tmp/p5-sketches/eye.html \
   /tmp/p5-sketches/VJ_01.html \
   public/p5/
```

- [ ] **Step 4: Copy the sketches/ folder (JS sketch files)**

```bash
cp -r /tmp/p5-sketches/sketches public/p5/sketches
```

- [ ] **Step 5: Remove the orphaned sketch_5.js**

```bash
rm public/p5/sketches/sketch_5.js
```

sketch_5.js is not referenced by any of the 7 HTML entry points — it is an orphaned experiment.

- [ ] **Step 6: Copy the assets/ folder (fonts)**

```bash
cp -r /tmp/p5-sketches/assets public/p5/assets
```

- [ ] **Step 7: Copy the src/ folder (all p5 libraries)**

```bash
cp -r /tmp/p5-sketches/src public/p5/src
```

This includes `p5.js`, `p5.sound.js`, `p5.easycam.js`, `p5.svg.js` and any other libs the sketches depend on. All HTML files reference these as `src/p5.js` relative to their own location, so no edits needed.

- [ ] **Step 8: Verify the folder structure**

```bash
ls public/p5/
ls public/p5/sketches/
ls public/p5/src/
ls public/p5/assets/
```

Expected output:
- `public/p5/` contains: `cube.html  grid.html  type.html  crystals.html  meteors.html  eye.html  VJ_01.html  sketches/  assets/  src/`
- `public/p5/sketches/` does NOT contain `sketch_5.js`
- `public/p5/src/` contains at minimum: `p5.js`

- [ ] **Step 9: Clean up temp clone**

```bash
rm -rf /tmp/p5-sketches
```

- [ ] **Step 10: Commit**

```bash
git add public/p5/
git commit -m "feat: add p5.js sketch static files to public/p5"
```

---

### Task 2: Add experiment entries to experiments.js

**Files:**
- Modify: `src/data/experiments.js`

- [ ] **Step 1: Open `src/data/experiments.js` and append 7 new entries**

The existing array looks like:
```js
export const EXPERIMENTS = [
  { id: 'wiggle',  ... },
  { id: 'sorting', ... },
]
```

Add the 7 p5 entries after the existing two:

```js
export const EXPERIMENTS = [
  {
    id: 'wiggle',
    title: 'Wiggle',
    description: 'Physics-based spring animation playground. Tune stiffness, damping, and mass — copy the curve.',
    url: 'https://wiggle.jishnuthewalker.com',
    tags: ['animation', 'tool'],
    year: '2024',
  },
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Sorting algorithm visualizer. Watch bubble, merge, and quick sort race in real time.',
    url: 'https://sorting.jishnuthewalker.com',
    tags: ['algorithms', 'viz'],
    year: '2024',
  },
  {
    id: 'p5-cube',
    title: 'Cube',
    description: 'Interactive 3D cube — RGB sliders + free-orbit camera.',
    url: '/Portfolio_v2/p5/cube.html',
    tags: ['3d', 'webgl'],
    year: '2024',
  },
  {
    id: 'p5-grid',
    title: 'Grid',
    description: 'Mouse-driven generative drawing with clear toggle.',
    url: '/Portfolio_v2/p5/grid.html',
    tags: ['interactive', 'generative'],
    year: '2024',
  },
  {
    id: 'p5-type',
    title: 'Type',
    description: '3D kinetic typography in WEBGL with parametric controls.',
    url: '/Portfolio_v2/p5/type.html',
    tags: ['type', 'webgl'],
    year: '2024',
  },
  {
    id: 'p5-crystals',
    title: 'Crystals',
    description: 'Tap-to-regenerate layered crystal compositions.',
    url: '/Portfolio_v2/p5/crystals.html',
    tags: ['generative', 'svg'],
    year: '2024',
  },
  {
    id: 'p5-meteors',
    title: 'Meteors',
    description: 'Mic-reactive noise curves that respond to ambient sound.',
    url: '/Portfolio_v2/p5/meteors.html',
    tags: ['audio', 'generative'],
    year: '2024',
  },
  {
    id: 'p5-eye',
    title: 'Eye',
    description: 'An eye that follows your cursor across a crimson canvas.',
    url: '/Portfolio_v2/p5/eye.html',
    tags: ['interactive'],
    year: '2024',
  },
  {
    id: 'p5-vj',
    title: 'VJ 01',
    description: 'Perlin noise visual experiment, mouse-controlled.',
    url: '/Portfolio_v2/p5/VJ_01.html',
    tags: ['vj', 'generative'],
    year: '2024',
  },
]
```

- [ ] **Step 2: Run the dev server and verify**

```bash
npm run dev
```

Open the portfolio in a browser. Scroll to the Experiments section. Confirm:
- 9 cards total are visible (2 existing + 7 new)
- Each new card shows the correct title, description, tags, and year
- Clicking a card opens the sketch in a new tab at `http://localhost:5173/p5/{name}.html`

Note: In dev, Vite serves from `/` (no `/Portfolio_v2/` prefix), so the links will 404 in the browser when clicking — the sketches themselves will still be accessible at `http://localhost:5173/p5/cube.html` directly. This is expected. In production the prefixed URLs work correctly.

> **Optional dev workaround:** temporarily change `base: '/'` in `vite.config.js` to test the full click flow locally. If you do this, revert it (`base: '/Portfolio_v2/'`) before Step 3 — a forgotten base change will break the production deploy.

- [ ] **Step 3: Commit**

```bash
git add src/data/experiments.js
git commit -m "feat: add 7 p5.js sketch cards to experiments section"
```

---

## Done

All 7 p5 sketches are now hosted at `public/p5/` and appear as experiment cards. No component changes were made. Deploy via the existing GitHub Actions workflow to verify production links.
