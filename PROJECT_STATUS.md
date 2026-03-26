# Portfolio Project Status (For AI Agents)

## Current Architecture Snapshot (2026-03-17)
This repository is OpenTUI-first with an optional legacy mode toggle for nostalgia/fun.

### 1. Active App Modes
- **Default:** OpenTUI.
- **Optional:** Legacy portfolio mode.
- **Entry:** `src/App.jsx` lazy-loads both `src/app/OpenTuiApp.jsx` and `src/app/LegacyPortfolioApp.jsx`.
- **Mode selection:**
  - Query override: `?mode=tui` or `?mode=legacy`
  - Persisted override: `localStorage['portfolio:app-mode']`
  - Env fallback: `VITE_OPEN_TUI_MODE`

### 2. OpenTUI Stack
- State layer: `src/app/state/uiReducer.js` + `src/app/providers/UIStateProvider.jsx`
- Command layer: `src/app/commandEngine.js`
- Data contracts:
  - `src/shared/contracts/project.contract.js`
  - `src/shared/contracts/experiment.contract.js`

### 3. Legacy Mode Scope
- Legacy components/hooks are retained strictly for optional mode support.
- Do not add new feature work to legacy mode.
- New feature work should target OpenTUI only.

### 4. Migration/Decommissioning Docs
- `docs/open-tui-migration-plan.md`
- `docs/open-tui-parity-contract.md`
- `docs/legacy-cleanup-checklist.md`

## AI Instructions
1. Preserve `?mode=legacy` support unless the user explicitly asks to remove it.
2. Keep OpenTUI as the default runtime path.
3. Maintain parity of command and keyboard behavior as documented.
