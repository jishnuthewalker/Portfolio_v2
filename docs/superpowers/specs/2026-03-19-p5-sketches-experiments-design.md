# Design: Add p5.js Sketches to Experiments Section

**Date:** 2026-03-19
**Status:** Approved

## Summary

Add 7 p5.js sketches from the `.p5-sketches` GitHub repo as individual experiment cards in the portfolio's ExperimentsSection. Files are hosted directly in this repo under `public/p5/` so they're served as static assets by Vite.

## Source

Repo: https://github.com/jishnuthewalker/.p5-sketches
7 sketches: cube, grid, type, crystals, meteors, eye, VJ_01

## File Structure

```
public/
  p5/
    cube.html
    grid.html
    type.html
    crystals.html
    meteors.html
    eye.html
    VJ_01.html
    sketches/
      sketch_0.js    ← grid
      sketch_2.js    ← cube
      sketch_3.js    ← type
      sketch_4.js    ← crystals
      meteors.js
      eye_03.js
      VJ_01.js
      helpers/       ← copy as-is
    assets/
      IBMPlexMono-Bold.ttf
      (any other fonts referenced by sketches)
    src/
      p5.js
      p5.sound.js
      p5.easycam.js
      p5.svg.js
      (all other libs from repo's src/)
```

All relative paths in the HTML files stay unchanged — no edits to the sketch HTML files needed.

Note: `sketch_5.js` is NOT copied. It is an orphaned file not referenced by any HTML entry point.

### URL prefix

`vite.config.js` sets `base: '/Portfolio_v2/'`. Vite serves `public/` files under that base in production. All experiment URLs must be prefixed accordingly. Browser resolves HTML-internal relative paths (e.g. `src/p5.js`) from the HTML file's own URL, so sketch assets are unaffected — only the React data URLs need the prefix.

## Data Changes

Add 7 entries to `src/data/experiments.js`:

```js
{ id: 'p5-cube',     title: 'Cube',     description: 'Interactive 3D cube — RGB sliders + free-orbit camera.',         url: '/Portfolio_v2/p5/cube.html',     tags: ['3d', 'webgl'],              year: '2024' },
{ id: 'p5-grid',     title: 'Grid',     description: 'Mouse-driven generative drawing with clear toggle.',              url: '/Portfolio_v2/p5/grid.html',     tags: ['interactive', 'generative'], year: '2024' },
{ id: 'p5-type',     title: 'Type',     description: '3D kinetic typography in WEBGL with parametric controls.',        url: '/Portfolio_v2/p5/type.html',     tags: ['type', 'webgl'],            year: '2024' },
{ id: 'p5-crystals', title: 'Crystals', description: 'Tap-to-regenerate layered crystal compositions.',                 url: '/Portfolio_v2/p5/crystals.html', tags: ['generative', 'svg'],         year: '2024' },
{ id: 'p5-meteors',  title: 'Meteors',  description: 'Mic-reactive noise curves that respond to ambient sound.',        url: '/Portfolio_v2/p5/meteors.html',  tags: ['audio', 'generative'],      year: '2024' },
{ id: 'p5-eye',      title: 'Eye',      description: 'An eye that follows your cursor across a crimson canvas.',        url: '/Portfolio_v2/p5/eye.html',      tags: ['interactive'],              year: '2024' },
{ id: 'p5-vj',       title: 'VJ 01',    description: 'Perlin noise visual experiment, mouse-controlled.',               url: '/Portfolio_v2/p5/VJ_01.html',    tags: ['vj', 'generative'],         year: '2024' },
```

Cards link to `/Portfolio_v2/p5/{name}.html` — served as static files by Vite from `public/`. URLs include the `/Portfolio_v2/` base prefix required by `vite.config.js`.

### target="_blank" on sketch links

ExperimentCard hardcodes `target="_blank"` for all entries. The sketch pages are same-origin but full-screen p5.js canvases — opening in a new tab keeps the portfolio visible while the user interacts with the sketch. This is intentional product behaviour, not an oversight.

## No Component Changes

ExperimentsSection and ExperimentCard components require no changes. Cards already support external and internal URLs (they use `href` on an `<a>` tag). The `target="_blank"` will open the sketch in a new tab, which is the desired behaviour.

## Scope

- Copy files from source repo into this repo
- Add 7 data entries to experiments.js
- No component code changes
- No new dependencies
