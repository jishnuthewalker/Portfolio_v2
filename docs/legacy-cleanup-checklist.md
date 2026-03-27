# Legacy Cleanup Checklist

Use this checklist only after OpenTUI is the stable default and rollback checks pass.

## Preconditions
- `mode=tui` has been default for at least one release cycle.
- No P0/P1 regressions in OpenTUI flow.
- Runtime rollback via `?mode=legacy` has been tested and documented.

## Behavior Parity Gates
- Terminal commands (`help`, `ls`, `filter`, `open`, `cd`, `whoami`, `echo`, `sudo`, `neofetch`, `clear`) verified.
- Keyboard behavior (`/`, `j/k`, arrows, `1/2/3`, `o`, input `Tab`, input history navigation) verified.
- External actions verified: project links, experiment links, resume, email.

## Accessibility Gates
- Keyboard-only navigation works across all interactive controls.
- Visible focus states present in all panes.
- Terminal output region announces updates.
- Reduced-motion sanity check complete.

## Removal Order
1. Remove legacy-only routes/components once parity report is green:
   - `src/components/HeroBox.jsx`
   - `src/components/ProjectsSection.jsx`
   - `src/components/ProjectTile.jsx`
   - `src/components/ExperimentsSection.jsx`
   - `src/components/CommandPalette.jsx`
   - `src/components/AboutModal.jsx`
   - `src/components/ProjectModal.jsx`
   - `src/components/TerminalPrompt.jsx`
   - `src/components/TerminalChrome.jsx`
2. Remove obsolete hooks no longer used by TUI:
   - `src/hooks/useTerminal.js`
   - `src/hooks/useModal.js`
   - `src/hooks/useScramble.js`
3. Remove dormant motion artifacts if still unused:
   - `src/components/MotionSection.jsx`
   - `src/components/MasonryGrid.jsx`
   - `src/data/motion.js`
4. Remove dependencies only after import scan is clean:
   - `cmdk`
   - `framer-motion`
   - `gsap` (if still unused)

## Post-Cleanup
- Re-run `npm run lint` and `npm run build`.
- Confirm chunk-size reduction after lazy-loading and cleanup.
- Update `PROJECT_STATUS.md` and migration docs.
