# Portfolio Content Roadmap — Design Spec
**Date:** 2026-03-11
**Status:** Approved

## Overview

Build out content and interactivity for the portfolio site. The primary goal is adding real case study content to all project tiles, wiring up navigation, adding an About modal, and a Motion Showcase section.

---

## 1. Project Modals (8 projects)

### Pattern
All project tiles become clickable and open a **modal overlay** — the portfolio stays visible and blurred behind it. No routing or URL changes required.

### Modal Structure
```
┌─ [01] ui/ux · 3 weeks ──────────────────────────────────┐
│  ✕ close (top-right)                                      │
│                                                           │
│  TITLE (large, tile's accent color)                       │
│                                                           │
│  [ ROLE ]   [ DURATION ]   [ TYPE ]   ← metadata chips   │
│                                                           │
│  ❯ problem                                                │
│  text + optional image(s)                                 │
│                                                           │
│  ❯ process                                                │
│  text + optional image grid                               │
│                                                           │
│  ❯ outcome                                                │
│  text + optional image(s)                                 │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Data Model
Case study content added to each project in `src/data/projects.js`:
```js
caseStudy: {
  role: 'UX Researcher',
  duration: '3 weeks',
  type: 'Academic',
  problem: { text: '...', images: [] },
  process: { text: '...', images: [] },
  outcome: { text: '...', images: [] },
}
```

### Behaviour
- Triggered by click or `Enter`/`Space` keydown on tile (fixes current stub)
- Closed by `✕` button or `Escape` key
- Background scrolling locked while modal is open
- Framer Motion: slide-up entry, fade backdrop

### Content sources
| Project | Source |
|---------|--------|
| रीView | Port from live site `/review` page |
| BookMyShow | Port from live site `/bms` page |
| Mood Indigo | Port from live site + Behance |
| CSK Fanzone | Behance gallery |
| Multus | Behance gallery |
| GrooveGlove | Behance gallery |
| Seven Sands | Behance gallery |
| Prosper | Behance gallery (new project, see §2) |

---

## 2. Add Prosper to Projects

New entry added to `PROJECTS` array in `src/data/projects.js`:
- `size: 'small'`
- `num: '08'`
- `category: 'game · 1 month'`
- `title: 'Prosper'`
- `tags: ['board game', 'educational', 'strategy']`
- `skills: ['game']`
- `colorKey: 'ana-8'` — new 8th hue added to `:root` in `index.css` and `COLOR_MAP` in `projects.js`

Small tile grid goes from 4 → 5 tiles. Grid stays `grid-cols-2 sm:grid-cols-4`; the 5th tile wraps naturally.

---

## 3. Nav Links

All four links in `HeroBox` wired up:

| Link | Behaviour |
|------|-----------|
| `work` | Smooth scroll to `#projects` anchor |
| `about` | Opens About modal (see §4) |
| `blog` | `href="https://blog.jishnuthewalker.com"` — `target="_blank"` |
| `resume` | `href=<URL to be provided>` — `target="_blank"` |

---

## 4. About Modal

Same overlay/backdrop pattern as project modals. Triggered by `about` nav link.

### Layout
```
┌─ about ──────────────────────────────────────────────────┐
│  ✕ close                                                  │
│                                                           │
│  [ photo / avatar ]    JISHNU DIWAKAR                    │
│                        Founding Designer @ Nudge          │
│                                                           │
│  Bio paragraphs (ported from live site)                   │
│                                                           │
│  ── find me on ────────────────────────────────────────── │
│  LinkedIn · Instagram · Behance · Vimeo · Email           │
└───────────────────────────────────────────────────────────┘
```

### Content
Bio text and social links ported from `jishnuthewalker.framer.website` About section.

Social URLs:
- LinkedIn: `https://linkedin.com/in/jishnu-diwakar-b02a37160/`
- Instagram: `https://instagram.com/jishnuthewalker/`
- Behance: `https://behance.net/jishnuthewalker`
- Vimeo: `https://vimeo.com/showcase/6308449`
- Email: `mailto:jishnu@hey.com`

---

## 5. Motion Showcase Section

A new section added to `App.jsx` between `<ProjectsSection />` and the flex spacer div, rendered as `<MotionSection />`.

### Layout
- Typewriter header: `❯ ls ./motion --type=reel` (same style as projects header)
- **Masonry grid** of embedded video iframes (Instagram Reels / Vimeo)
- CSS masonry via `grid-template-rows: masonry` with `column-count` fallback
- Videos sourced from the live Framer site's Motion Showcase iframes

### Component location
`src/components/MotionSection.jsx`

### Data location
`src/data/motion.js` — array of `{ id, embedUrl, platform, title }`

---

## 6. Footer & Small Fixes

- **Footer Instagram link**: update from `#` → `https://instagram.com/jishnuthewalker/`
- **Footer resume link**: update from `#` → resume URL (to be provided)
- **`motion` filter tag**: currently matches no projects. Two options:
  - Add `'motion'` to skills of relevant projects (GrooveGlove has motion elements)
  - OR remove the filter until motion tiles are added to the project grid
  - **Decision**: remove `■ motion` filter from `FILTERS` array for now; the showcase section handles it

---

## Implementation Order

1. Add Prosper to `projects.js` + new color token
2. Wire nav links (work scroll, blog, resume)
3. Fix footer links
4. Build `ProjectModal` component + wire all tiles
5. Build `AboutModal` component
6. Build `MotionSection` component + `motion.js` data
7. Port case study content for रीView and BookMyShow
8. Add stub content for remaining 6 projects
