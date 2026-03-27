# codex.md

Repo context file for Codex sessions in `portfolio/`.
Last verified: 2026-03-18.

## Purpose

Use this as the first-stop context map for this folder.  
If this file conflicts with older docs, trust runtime code first.

## Source-of-Truth Order

1. `src/App.jsx` and its imports (actual runtime path)
2. Current files under `src/`
3. `PROJECT_STATUS.md`, `CLAUDE.md`, and docs under `docs/`

## Current Runtime Reality

- Active entry: `src/main.jsx` -> `src/App.jsx`
- `src/App.jsx` currently lazy-loads only `LegacyPortfolioApp`
- `src/app/OpenTuiApp.jsx` is currently absent
- `PROJECT_STATUS.md` still references OpenTUI-first behavior and is partially stale

## Architecture Map

### App shell and flow

- `src/app/LegacyPortfolioApp.jsx`
  - Owns page-level UI state:
    - `activeProjectId`
    - `aboutOpen`
    - `paletteOpen`
    - `activeFilter`
  - Composes:
    - `TerminalChrome`
    - `HeroBox`
    - `ProjectsSection`
    - `ExperimentsSection`
    - `Footer`
    - `ProjectModal`
    - `AboutModal`
    - `CommandPalette`

### Interactive terminal + commands

- `src/components/TerminalPrompt.jsx`: prompt UI and history display
- `src/hooks/useTerminal.js`: command engine + autocomplete + side effects
- Commands include: `help`, `ls`, `filter`, `open`, `cd`, `whoami`, `clear`, `echo`, `sudo`, `neofetch`

### Projects and modal

- `src/components/ProjectsSection.jsx`: typewriter heading, filter row, grid sections
- `src/components/ProjectTile.jsx`: card rendering/hover behavior
- `src/components/ProjectModal.jsx`: modal animation + project details
- `src/data/projects.js`: `PROJECTS`, `FILTERS`, `COLOR_MAP`

### Experiments and command palette

- `src/components/ExperimentsSection.jsx`: dark-card experiments grid
- `src/components/CommandPalette.jsx`: Cmd/Ctrl+K global palette
- `src/data/experiments.js`: experiment entries

### Shared behavior and styling

- `src/hooks/useScramble.js`: text scrambling effects
- `src/hooks/useModal.js`: ESC-close + body scroll lock
- `src/index.css`: Tailwind v4 tokens, palette, typography, global styles

### Legacy/dead candidates (verify before using)

- `src/components/MotionSection.jsx`
- `src/components/MasonryGrid.jsx`
- `src/data/motion.js`

## Edit Guide (Where to Change What)

- Add/edit a project: `src/data/projects.js` (+ image in `public/images/projects/`)
- Change filtering behavior: `src/components/ProjectsSection.jsx` and `src/hooks/useTerminal.js`
- Change terminal command behavior: `src/hooks/useTerminal.js`
- Change modal content/layout: `src/components/ProjectModal.jsx`
- Change hero/nav links: `src/components/HeroBox.jsx`
- Change global theme/tokens/colors/type scale: `src/index.css`

## Fast Commands (PowerShell)

- List all source files:
  - `Get-ChildItem -Recurse -File src | Select-Object -ExpandProperty FullName`
- Find where a component/hook is used:
  - `Get-ChildItem src -Recurse | Select-String -Pattern "ProjectsSection|useTerminal|ProjectModal"`
- Re-check runtime path quickly:
  - `Get-Content src/App.jsx -TotalCount 120`
  - `Get-Content src/app/LegacyPortfolioApp.jsx -TotalCount 220`

## Working Rules for Future Sessions

- Do not assume docs are current; confirm with imports and active code.
- Do not remove legacy mode support unless explicitly requested.
- Keep edits localized: data changes in `data/*`, UI behavior in `components/*`, command logic in `useTerminal.js`, tokens in `index.css`.
- If architecture changes, update this file in the same task.
