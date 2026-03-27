---
name: portfolio-navigation
description: Use when working in this portfolio repo and you need to quickly locate features, trace runtime flow, or resolve stale docs vs current code.
---

# Portfolio Navigation

## Overview

This skill is a repo-specific map for `portfolio/`. Use it to find the right files quickly and avoid trusting outdated docs.

Trust order:
1. Runtime entry and imports (`src/App.jsx`, `src/app/LegacyPortfolioApp.jsx`)
2. Current source files under `src/`
3. Status/docs (`PROJECT_STATUS.md`, `CLAUDE.md`, `docs/*`)

## Quick Start

1. Confirm runtime path first:
   - `Get-Content src/App.jsx -TotalCount 120`
2. Trace the active app root:
   - `Get-Content src/app/LegacyPortfolioApp.jsx -TotalCount 220`
3. Open feature area by intent using the map below.

## Current Runtime Reality (2026-03-18)

- `src/App.jsx` currently lazy-loads only `LegacyPortfolioApp`.
- `src/app/OpenTuiApp.jsx` is not present.
- `PROJECT_STATUS.md` still describes OpenTUI-first flow and is stale relative to current code.

## File Map By Task

### Entry and composition

- App entry: `src/main.jsx`
- Runtime chooser (currently legacy-only): `src/App.jsx`
- Main page composition and state wiring: `src/app/LegacyPortfolioApp.jsx`

### Hero and terminal interactions

- Hero shell, nav links, title animation trigger: `src/components/HeroBox.jsx`
- Inline terminal UI: `src/components/TerminalPrompt.jsx`
- Terminal command engine/autocomplete/history: `src/hooks/useTerminal.js`
- Scramble animation logic: `src/hooks/useScramble.js`

### Projects and modals

- Project grid + filtering + typewriter: `src/components/ProjectsSection.jsx`
- Tile rendering: `src/components/ProjectTile.jsx`
- Project modal behavior and visuals: `src/components/ProjectModal.jsx`
- About modal: `src/components/AboutModal.jsx`
- Shared modal escape + scroll lock: `src/hooks/useModal.js`
- Projects data and color mapping: `src/data/projects.js`

### Command palette and experiments

- Cmd+K palette UI + actions: `src/components/CommandPalette.jsx`
- Experiments section UI: `src/components/ExperimentsSection.jsx`
- Experiments data source: `src/data/experiments.js`

### Styling and tokens

- Tailwind v4 token system, palette, globals: `src/index.css`
- Tailwind plugin config: `tailwind.config.js`

### Contracts and migration leftovers

- Shared data contracts: `src/shared/contracts/project.contract.js`, `src/shared/contracts/experiment.contract.js`
- Legacy/dead candidates to verify before touching:
  - `src/components/MotionSection.jsx`
  - `src/components/MasonryGrid.jsx`
  - `src/data/motion.js`

## Fast Navigation Commands (PowerShell)

- List source files:
  - `Get-ChildItem -Recurse -File src | Select-Object -ExpandProperty FullName`
- Find component usage:
  - `Get-ChildItem src -Recurse | Select-String -Pattern "ComponentName"`
- Find command behavior:
  - `Get-ChildItem src -Recurse | Select-String -Pattern "case 'open'|case 'filter'|case 'cd'"`
- Check docs drift:
  - `Get-Content CLAUDE.md -TotalCount 220`
  - `Get-Content PROJECT_STATUS.md -TotalCount 220`

## Guardrails

- Do not assume docs are current; verify against imports and runtime files.
- Before editing a feature, trace from `LegacyPortfolioApp` into the concrete component and its data file.
- Treat `PROJECT_STATUS.md` as historical unless it matches live code.
