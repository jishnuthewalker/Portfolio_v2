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
  App.jsx                  # Root: TerminalChrome → HeroBox → ProjectsSection → Footer
                           # + ProjectModal (activeProjectId state) + AboutModal (aboutOpen state)
  index.css                # Global styles, Tailwind v4 @theme, CSS custom properties
  main.jsx                 # React entry point
  components/
    TerminalChrome.jsx     # macOS-style traffic-light dots + "open to interesting things" status
    HeroBox.jsx            # Name, role, nav links, contact CTA; uses scramble hook; onAboutOpen prop
    ProjectsSection.jsx    # Typewriter header, filter tags, CSS Bento Grid layout
    ProjectTile.jsx        # Individual project card with box-draw chrome + scramble on hover
    ProjectModal.jsx       # Case study overlay (AnimatePresence); uses useModal hook
    AboutModal.jsx         # Bio + social links overlay; uses useModal hook
    Footer.jsx             # Copyright, social links (all wired)
    MasonryGrid.jsx        # UNUSED — leftover from removed MotionSection, do not use
    MotionSection.jsx      # UNUSED — removed per user request, do not re-add
  data/
    projects.js            # PROJECTS array, FILTERS array, COLOR_MAP; includes caseStudy per project
    motion.js              # UNUSED — Vimeo URLs leftover from removed MotionSection
  hooks/
    useScramble.js         # RAF-based character scramble; scrambleName (hue-sweep) + scrambleWithColor
    useModal.js            # ESC handler + body scroll lock; shared by ProjectModal and AboutModal
```

## Design System

### Token System (`@theme {}` in `index.css`)

All design values are defined as Tailwind v4 tokens in `@theme {}`, which auto-generates utility classes.

**Scale knob:** `html { font-size: 16px }` — change this one value to resize the entire UI.

**Typography tokens:**

| Token | Size | Class | Usage |
|---|---|---|---|
| `--text-2xs` | 9px | `text-2xs` | cmdk group headings |
| `--text-ui` | 15px | `text-ui` | nav, inputs, CTAs, footer |
| `--text-heading` | 21px | `text-heading` | "Founding Designer" role line |
| `--text-brand` | 23px | `text-brand` | जेदी logo in titlebar |
| `--text-tile-sm/md/lg` | 21/27/35px | via inline `var()` | ProjectTile titles by size |

Plus Tailwind built-ins: `text-xs` (12), `text-sm` (14), `text-base` (16), `text-lg` (18), `text-xl` (20).

**Foreground gray scale:** `text-ink` (#1a1a1a) · `text-ink-2` (#444) · `text-ink-3` (#555) · `text-muted` (#888) · `text-subtle` (#aaa) · `text-faint` (#bbb) · `text-ghost` (#ccc) · `text-dim` (#ddd)

**Surfaces:** `bg-bg` (#F7F4EE) · `bg-surface` (#FAF8F3) · `border-border` (#d0cdc6) · `border-border-lt` (#e0ddd6)

**Accent:** `text-accent` / `bg-accent` / `border-accent-border` / `border-accent-border-2` / `bg-accent-bg` / `bg-accent-ghost`

**Green:** `text-green` / `bg-green` / `border-green-border` / `bg-green-ghost`

**Dark surfaces (CommandPalette, ExperimentsSection):** `bg-dark` · `bg-dark-card` · `bg-dark-tag` · `border-dark-border` · `border-dark-divider` · `border-dark-border-2`

### Color Palette — Analogous purple → pink

Eight `--ana-N` hue families (`ana-1` through `ana-8`) defined in `:root` (index.css), each with variants:
`--ana-N` · `--ana-N-dark` · `--ana-N-chrome` · `--ana-N-tag` · `--ana-N-bg` · `--ana-N-border`

Accent is `--ana-1-dark` (hsl 277, 65%, 32%). Terminal green is `#28c840`.

Each project tile maps to one `ana-N` key via `COLOR_MAP` in `projects.js`. These dynamic per-tile colors are passed as inline `style` props — they cannot be tokenized since they're runtime-computed.

### Typography

- Body: JetBrains Mono, 16px (1rem), line-height 1.5
- Display (names/titles): Inter Black, tracked tight
- Main name: `clamp(60px, 8vw, 90px)` — **excluded from the rem scale, intentionally fixed**
- Background: `bg-bg` (#F7F4EE) warm off-white with 20px grid overlay

## Animations

- **Entry animations**: Framer Motion `initial/animate` on RoleLine, filter row, and all tiles (staggered by index × 0.07s, 800ms delay)
- **Typewriter**: ProjectsSection types `ls ./projects --sort=featured` at 500ms, ~18–34ms/char
- **Tile hover**: Framer Motion `animate` drives border color + dimming; arrow `↗` translates on hover via inline style
- **Name scramble**: On `HeroBox` hover — sweeps through all 7 palette hues via HSL lerp
- **Tile scramble**: On `ProjectTile` hover — scrambles title in tile's own `c.title` color
- **Cursor blink**: CSS `@keyframes blink` (step-end) used in HeroBox name and ProjectsSection typewriter
- **Status pulse**: CSS `@keyframes statusPulse` on TerminalChrome green dot
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` collapses all durations to 0.01ms

## Projects Data (projects.js)

8 projects across 3 sizes — all present in `projects.js`:
- `featured` (1): रीView (Cricket Assistant App, ui/ux)
- `half` (2): CSK Fanzone (3d/game), Mood Indigo (branding)
- `small` (5): BookMyShow (ux), Multus (vr), Seven Sands (game), GrooveGlove (hci), Prosper (game)

Filter values: `ux` · `3d` · `game` · `brand`

### Project Schema (flat — no nested caseStudy)

```js
{
  // TILE (required)
  id:        'project-id',     // kebab-case, unique
  num:       '01',
  title:     'Title',
  category:  'type · duration',
  tags:      ['tag'],          // chips shown on tile
  skills:    ['ux'],           // ux | 3d | game | brand — drives filters
  size:      'small',          // featured | half | small
  colorKey:  'ana-1',          // ana-1 through ana-12 (all pre-defined in index.css)
  desc:      null,             // optional, shown only on 'featured' tiles

  // MODAL (all optional — modal degrades gracefully)
  role:      'Designer',
  duration:  '3 weeks',
  type:      'Academic',
  brief:     'One paragraph description.',
  heroImage: '/images/projects/{id}-hero.jpg',  // null if no image
  behanceUrl:'https://www.behance.net/gallery/...',  // null if no link
}
```

### Adding a new project

1. Add entry to `PROJECTS` array using template comment at top of `projects.js`
2. Pick next available `ana-N` colorKey (`ana-9` through `ana-12` pre-provisioned)
3. Drop hero image at `public/images/projects/{id}-hero.jpg` (800×500px, JPG for photos / PNG for UI)
4. If adding a 13th project, define a new `ana-13` block in `index.css` and add to `COLOR_MAP`

## Roadmap Status

Full design spec: `docs/superpowers/specs/2026-03-11-portfolio-content-roadmap-design.md`

- ✅ Add Prosper to `projects.js` + `ana-8` color token
- ✅ Wire nav links (`work` → `#projects`, `about` → AboutModal, `blog`, `resume`)
- ✅ Fix footer links (all wired: linkedin, behance, instagram, resume)
- ✅ Build `ProjectModal` — card-expand-to-modal with layoutId animation
- ✅ Build `AboutModal` — bio + social links
- ✅ Modal redesign — lightweight brief + hero image + Behance link (2026-03-15)
- ✅ All 8 projects have real briefs, hero images, and Behance URLs
- ✅ Pre-provisioned ana-9 through ana-12 color tokens for future projects
- ✅ Design token system — full `@theme {}` migration, rem-based scale, single `html { font-size }` knob (2026-03-15)
- ❌ MotionSection removed — do not rebuild (see PROJECT_STATUS.md for context)

## Known Incomplete / TODOs

- **MotionSection**: removed entirely. `MotionSection.jsx`, `MasonryGrid.jsx`, and `src/data/motion.js` are unused dead files. If a video section is requested in future, rebuild from scratch using CSS `columns` — no JS layout math.
- **Potential new projects**: Angoor.ai (investor pitch deck, Jishnu + Laksh Rajpal) and p5.js explorations (creative coding, solo) — not yet in `projects.js`

## Content Sources

Source URLs for case study content. Behance pages are JS-rendered; content must be manually provided or scraped with a headless browser.

| Project | Source |
|---------|--------|
| रीView | https://www.behance.net/gallery/181654397/View-Cricket-Assistant-App |
| BookMyShow | https://www.behance.net/gallery/179846491/BookMyShow-Ergonomic-Study-Redesign |
| CSK Fanzone | https://www.behance.net/gallery/181680983/Chennai-Super-Kings-Interactive-Fanzone |
| Multus | https://www.behance.net/gallery/207330765/Multus-6DOF-multitasking-in-VR |
| GrooveGlove | https://www.behance.net/gallery/209854991/Groove-glove |
| Mood Indigo | https://www.behance.net/gallery/192576473/Mood-Indigo-2023-Brand-Identity (2023, 232 likes) |
| Mood Indigo (older) | https://www.behance.net/gallery/161828539/Mood-Indigo-Branding (logo, 3D launch video, merch) |
| Seven Sands | https://www.behance.net/gallery/206118149/Seven-Sands-(Board-Game) |
| Prosper | https://www.behance.net/gallery/189640719/Prosper-Game-Design |
| Angoor.ai (potential) | https://www.behance.net/gallery/212944729/Angoorai-Investor-Pitch |
| p5.js (potential) | https://www.behance.net/gallery/182161117/p5js-explorations |
| Jishnu's Framer site | https://jishnuthewalker.framer.website/ |
| Mood Indigo portal | https://ccp2k23.moodi.org/ |

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Conventions

- Named exports for all components
- **Hover effects:** use declarative Tailwind `hover:` classes (e.g. `hover:bg-accent-bg hover:translate-x-0.5`). Do NOT use `onMouseEnter/Leave` for color flips — those are all gone. Only use JS hover handlers for logic (scramble animations, Framer Motion state).
- **⌘K kbd hover:** `group` on the parent button + `group-hover:text-accent group-hover:border-accent-border-2` on each `<kbd>` — no event handlers
- **Filter buttons:** fully declarative `className` conditional — active: `bg-accent border-accent text-white` / inactive: `border-border text-muted hover:border-accent hover:text-accent hover:bg-accent-ghost`
- **Colors:** use token Tailwind classes (`text-accent`, `text-muted`, `bg-surface`, etc.) for all static values. Only use inline `style` for dynamic per-tile `c.xxx` values from COLOR_MAP or animation-specific values
- Framer Motion `animate` prop (not `whileHover`) for tile border/dimming so filter transitions are smooth
- `useScramble` hook shared across HeroBox and ProjectTile — single `rafRef` per hook instance
- `useModal(isOpen, onClose)` — shared ESC handler + body scroll lock for ProjectModal and AboutModal
- ProjectsSection grid: featured row (`grid-cols-[2.0fr_1fr]`) + small bento (`grid-flow-row-dense`)
- No TypeScript — plain `.jsx` / `.js`
- `gsap` is installed but currently unused
