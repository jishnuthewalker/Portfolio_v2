# Accordion Sections Design

**Date:** 2026-03-27
**Scope:** `ProjectsSection`, `ExperimentsSection`
**Status:** Approved

---

## Summary

Both the Projects and Experiments sections become collapsible accordions, collapsed by default. Each section collapses to a compact terminal-style bar. Sections are independently togglable. Reveal animation is inspired by the existing `ProjectModal` scanline wipe.

---

## Accordion Bar

Each section is headed by a full-width clickable bar:

```
❯ ./projects — 8 projects · ux · 3d · game · brand          ▾
❯ ./experiments — 2 experiments                              ▸
```

**Visual spec:**
- Same border/background as the existing section shell (`border-border`, `bg-surface`)
- `❯` in `text-green`, path in `text-accent`, metadata in `text-muted`, chevron in `text-faint`
- Chevron `▸` rotates to `▾` on expand via Framer Motion `animate={{ rotate: isOpen ? 90 : 0 }}`, duration 0.2s

**Typewriter on load:**
- On mount, the path text types itself once using the existing typewriter pattern (18–34ms/char, starting at 0ms for projects, 400ms staggered delay for experiments)
- Types just the path: `./projects` and `./experiments` (no `--sort` flag — bar format is condensed)
- After typing completes, cursor blinks briefly then fades out (same as HeroBox BigName)
- Static after first type — no re-animation on open/close

**Interaction:**
- Entire bar row is clickable (button element)
- Hover: subtle `hover:bg-accent-ghost` tint
- Both sections are independently togglable — no mutual exclusion

---

## Expand / Collapse Animation

### Expand (closed → open)

Two-layer animation, same structure as `ProjectModal`:

1. **Container wipe** — `motion.div` wrapping the section body:
   - `clipPath: 'inset(0 0 100% 0)'` → `'inset(0 0 0% 0)'`
   - Duration: 0.45s, ease: `[0.4, 0, 0.2, 1]` (same as modal)
   - `overflow: hidden` to prevent layout bleed during wipe

2. **Scan head** — thin absolutely-positioned `motion.div` inside the container:
   - `height: 6px`, `background: linear-gradient(transparent, hsl(277,65%,80%), transparent)`
   - Animates `top: 0% → 105%` in sync with the wipe (same 0.45s, same ease)
   - `aria-hidden`, `pointer-events: none`

3. **Tile entry** — after the wipe, tiles stagger in:
   - `opacity: 0, y: 8` → `opacity: 1, y: 0`, duration 0.35s
   - Stagger delay: `index × 0.07s` (same as current entry animation)
   - Triggered by resetting `tilesVisible` to `false` on close and `true` (with 50ms delay) on open — ensures stagger replays on every expand

### Collapse (open → closed)

- Reverse clipPath: `'inset(0 0 0% 0)'` → `'inset(0 0 100% 0)'`, duration 0.25s (faster than expand)
- No scan head on collapse
- `AnimatePresence` handles unmounting cleanly

### Reduced motion

Both the wipe and tile stagger durations collapse to `0.01ms` via the existing `@media (prefers-reduced-motion: reduce)` rule. No code changes needed — Framer Motion respects CSS motion media queries when `useReducedMotion()` is used, or durations can be conditionally set to `0.01`.

---

## Component Changes

### `ProjectsSection`

- Add `isOpen` state, default `false`
- Replace existing typewriter `<div>` with `<AccordionBar>` component
- Wrap filter tags + all grid content in `AnimatePresence` + collapsible `motion.div`
- `tilesVisible` logic: set `false` on close, set `true` with 50ms delay on open (replaces current mount-based 800ms timer)
- Anchor auto-expand: `useEffect` on mount checks `window.location.hash === '#projects'` and sets `isOpen = true`

### `ExperimentsSection`

- Add `isOpen` state, default `false`
- Replace `<div>` header with `<AccordionBar>`
- Wrap dark container body in `AnimatePresence` + collapsible `motion.div`
- `ExperimentCard` entry animations replay on each expand (cards are unmounted when closed, re-mount triggers their `initial/animate`)
- Anchor auto-expand: same hash check for `#experiments`

### `AccordionBar` (new shared component)

Props: `{ label, meta, isOpen, onToggle, typeDelay }`

- `label`: path string (`./projects`, `./experiments`)
- `meta`: summary string (`8 projects · ux · 3d · game · brand`)
- `isOpen`: boolean
- `onToggle`: callback
- `typeDelay`: ms before typewriter starts (0 for projects, 400 for experiments)

Encapsulates: typewriter logic, cursor fade, chevron rotation. No external state needed.

### No changes to

- `ProjectTile`, `ExperimentCard`, `App.jsx`, `useModal`, `useScramble`
- Filter state management stays in `App.jsx` (passed through as today)

---

## Fixes

1. **`#projects` / `#experiments` anchor** — auto-expand on mount if hash matches
2. **`tilesVisible` tied to open state** — resets on close, re-triggers stagger on every expand
3. **Typewriter in bar only** — inner command row removed from ProjectsSection
4. **Staggered bar typewriters** — projects at 0ms, experiments at 400ms delay
