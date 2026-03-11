# Portfolio — CLAUDE.md

Personal portfolio site for Jishnu Diwakar (जेदी), Founding Designer @ Nudge.

## Stack

- **React 19** + **Vite 7** (ESM, `@vitejs/plugin-react`)
- **Tailwind CSS v4** — CSS-first config via `@theme {}` in `index.css`, no `tailwind.config.js` values needed
- **Framer Motion 12** — entry animations and tile hover states
- **JetBrains Mono** + **Inter** — loaded via Google Fonts; `--font-mono` / `--font-display` CSS vars

## Project Structure

```
src/
  App.jsx                  # Root layout: TerminalChrome → HeroBox → ProjectsSection → Footer
  index.css                # Global styles, Tailwind v4 @theme, CSS custom properties
  main.jsx                 # React entry point
  components/
    TerminalChrome.jsx     # macOS-style traffic-light dots + "open to interesting things" status
    HeroBox.jsx            # Name, role, nav links, contact CTA; uses scramble hook
    ProjectsSection.jsx    # Typewriter header, filter tags, tile grid layout
    ProjectTile.jsx        # Individual project card with box-draw chrome + scramble on hover
    Footer.jsx             # Copyright, social links (some still #placeholder)
  data/
    projects.js            # PROJECTS array, FILTERS array, COLOR_MAP
  hooks/
    useScramble.js         # RAF-based character scramble; scrambleName (hue-sweep) + scrambleWithColor
```

## Design System

### Color Palette — Analogous purple → pink

Seven `--ana-N` hue families defined in `:root` (index.css), each with variants:
`--ana-N` · `--ana-N-dark` · `--ana-N-chrome` · `--ana-N-tag` · `--ana-N-bg` · `--ana-N-border`

Accent is `--ana-1-dark` (hsl 277, 65%, 32%). Terminal green is `#28c840`.

Each project tile maps to one `ana-N` key via `COLOR_MAP` in `projects.js`.

### Typography

- Body: JetBrains Mono, 13px, line-height 1.5
- Display (names/titles): Inter Black, tracked tight
- Background: `#F7F4EE` warm off-white with 20px grid overlay

## Animations

- **Entry animations**: Framer Motion `initial/animate` on RoleLine, HeroFooter, filter row, and all tiles (staggered by index × 0.07s, 800ms delay)
- **Typewriter**: ProjectsSection types `ls ./projects --sort=featured` at 500ms, ~18–34ms/char
- **Tile hover**: Framer Motion `animate` drives border color + dimming; arrow `↗` translates on hover via inline style
- **Name scramble**: On `HeroBox` hover — sweeps through all 7 palette hues via HSL lerp
- **Tile scramble**: On `ProjectTile` hover — scrambles title in tile's own `c.title` color
- **Cursor blink**: CSS `@keyframes blink` (step-end) used in HeroBox name and ProjectsSection typewriter
- **Status pulse**: CSS `@keyframes statusPulse` on TerminalChrome green dot
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` collapses all durations to 0.01ms

## Projects Data (projects.js)

8 projects across 3 sizes (Prosper to be added):
- `featured` (1): रीView (Cricket Assistant App, ui/ux)
- `half` (2): CSK Fanzone (3d/game), Mood Indigo (branding)
- `small` (5): BookMyShow (ux), Multus (vr), Seven Sands (game), GrooveGlove (hci), Prosper (game — pending)

Filter values: `ux` · `3d` · `game` · `brand`
Note: `motion` filter removed from FILTERS — the Motion Showcase section handles motion content separately.

## Roadmap (approved — see spec)

Full design spec: `docs/superpowers/specs/2026-03-11-portfolio-content-roadmap-design.md`

Planned work in order:
1. Add Prosper to `projects.js` + `ana-8` color token
2. Wire nav links (`work` scroll, `blog`, `resume` when link provided)
3. Fix footer links (Instagram, resume)
4. Build `ProjectModal` component — all 8 tiles open structured case study overlay
5. Build `AboutModal` component — bio + social links
6. Build `MotionSection` component + `src/data/motion.js` — masonry video grid
7. Port case study content for रीView and BookMyShow from live site
8. Add stub content for remaining 6 projects

## Known Incomplete / TODOs

- **Nav links** in HeroBox (`work`, `about`, `resume`, `blog`) all point to `#`
- **Footer links**: `instagram` and `resume ↗` point to `#` (resume URL to be provided by user)
- **ProjectTile `onKeyDown`**: keyboard handler is stubbed — will be wired when ProjectModal is built
- **No project detail modals yet** — clicking tiles does nothing currently
- **Prosper** project missing from `projects.js` — to be added with `ana-8` color key

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Conventions

- Named exports for all components
- Inline `onMouseEnter/Leave` for simple hover color flips (no extra state)
- Framer Motion `animate` prop (not `whileHover`) for tile border/dimming so filter transitions are smooth
- `useScramble` hook shared across HeroBox and ProjectTile — single `rafRef` per hook instance
- CSS custom properties used for all palette colors; Tailwind utility classes for layout/spacing only
- No TypeScript — plain `.jsx` / `.js`
