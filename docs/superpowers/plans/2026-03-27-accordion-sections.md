# Accordion Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make ProjectsSection and ExperimentsSection collapsible accordions, collapsed by default, with a scanline-wipe reveal animation matching the existing ProjectModal style.

**Architecture:** A new shared `AccordionBar` component handles the typewriter-on-load header and chevron toggle. Each section holds its own `isOpen` state. The collapsible body uses Framer Motion `AnimatePresence` + `clipPath` wipe with a scan head, matching `ProjectModal`'s entrance exactly.

**Tech Stack:** React 19, Framer Motion 12, Tailwind v4, JetBrains Mono

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| **Create** | `src/components/AccordionBar.jsx` | New shared component — typewriter, chevron, toggle button |
| **Modify** | `src/components/ProjectsSection.jsx` | Add `isOpen` state, swap header for `<AccordionBar>`, wrap content in collapsible wipe, fix `tilesVisible` |
| **Modify** | `src/components/ExperimentsSection.jsx` | Add `isOpen` state, swap header for `<AccordionBar>`, wrap dark container in collapsible wipe |

---

### Task 1: AccordionBar component

**Files:**
- Create: `src/components/AccordionBar.jsx`

- [ ] **Step 1: Create the file**

```jsx
// src/components/AccordionBar.jsx
import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * AccordionBar — clickable section header with one-shot typewriter on load.
 *
 * Props:
 *   label      — path string, e.g. './projects'
 *   meta       — summary string shown after typing, e.g. '8 projects · ux · 3d'
 *   isOpen     — boolean controlled by parent
 *   onToggle   — callback to flip isOpen
 *   typeDelay  — ms before typewriter starts (default 0)
 */
export function AccordionBar({ label, meta, isOpen, onToggle, typeDelay = 0 }) {
  const [typedLabel, setTypedLabel] = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [metaVisible, setMetaVisible] = useState(false)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    const startTimer = setTimeout(() => {
      if (cancelledRef.current) return
      setShowCursor(true)
      let i = 0

      function type() {
        if (cancelledRef.current) return
        if (i < label.length) {
          setTypedLabel(label.slice(0, ++i))
          setTimeout(type, 18 + Math.random() * 16)
        } else {
          // blink for 800ms then fade cursor, show meta
          setTimeout(() => {
            if (cancelledRef.current) return
            setShowCursor(false)
            setMetaVisible(true)
          }, 800)
        }
      }

      type()
    }, typeDelay)

    return () => {
      cancelledRef.current = true
      clearTimeout(startTimer)
    }
  }, [label, typeDelay])

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-2 text-base font-mono mb-3 bg-transparent border-0 cursor-pointer text-left px-0 py-1 rounded-[2px] hover:opacity-75 transition-opacity duration-150"
    >
      <span className="text-green">❯</span>
      <span className="text-accent">{typedLabel}</span>

      {showCursor && (
        <span
          className="inline-block bg-accent"
          style={{
            width: '7px',
            height: '0.9em',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}

      {metaVisible && meta && (
        <span className="text-muted text-sm">— {meta}</span>
      )}

      <motion.span
        className="text-faint text-sm ml-auto"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-block' }}
      >
        ▸
      </motion.span>
    </button>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open `http://localhost:5173`. The page should render normally (AccordionBar not yet used anywhere — no visible change).

- [ ] **Step 3: Commit**

```bash
git add src/components/AccordionBar.jsx
git commit -m "feat: add AccordionBar component with typewriter and chevron"
```

---

### Task 2: Update ProjectsSection

**Files:**
- Modify: `src/components/ProjectsSection.jsx`

- [ ] **Step 1: Replace the file contents**

```jsx
// src/components/ProjectsSection.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, FILTERS } from '../data/projects'
import { ProjectTile } from './ProjectTile'
import { AccordionBar } from './AccordionBar'

export function ProjectsSection({ onOpenProject, activeFilter, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tilesVisible, setTilesVisible] = useState(false)

  // auto-expand if user navigated directly to #projects
  useEffect(() => {
    if (window.location.hash === '#projects') {
      setIsOpen(true)
    }
  }, [])

  // reset + re-trigger stagger every time section opens
  useEffect(() => {
    if (!isOpen) {
      setTilesVisible(false)
      return
    }
    const timer = setTimeout(() => setTilesVisible(true), 50)
    return () => clearTimeout(timer)
  }, [isOpen])

  function toggleFilter(value) {
    onFilterChange(activeFilter === value ? null : value)
  }

  function isDimmed(project) {
    if (!activeFilter) return false
    return !project.skills.includes(activeFilter)
  }

  const featured = PROJECTS.filter(p => p.size === 'featured')
  const half     = PROJECTS.filter(p => p.size === 'half')
  const small    = PROJECTS.filter(p => p.size === 'small')

  const meta = `${PROJECTS.length} projects · ${FILTERS.map(f => f.value).join(' · ')}`

  return (
    <section id="projects">
      <AccordionBar
        label="./projects"
        meta={meta}
        isOpen={isOpen}
        onToggle={() => setIsOpen(o => !o)}
        typeDelay={0}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="projects-body"
            className="relative overflow-hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Scan head — sweeps top→bottom on open */}
            <motion.div
              aria-hidden="true"
              className="absolute left-0 w-full pointer-events-none z-10"
              style={{
                height: '6px',
                background: 'linear-gradient(transparent, hsl(277,65%,80%), transparent)',
              }}
              initial={{ top: '0%', opacity: 1 }}
              animate={{ top: '105%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Filter tags */}
            <motion.div
              className="flex gap-1.5 flex-wrap mb-3"
              initial={{ opacity: 0 }}
              animate={tilesVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {FILTERS.map(f => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => toggleFilter(f.value)}
                  className={`text-ui font-mono px-2.5 py-1 rounded-[2px] border transition-all duration-150 cursor-pointer ${
                    activeFilter === f.value
                      ? 'bg-accent border-accent text-white'
                      : 'border-border text-muted hover:border-accent hover:text-accent hover:bg-accent-ghost'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </motion.div>

            {/* Featured row */}
            <div className="grid gap-3 mb-3 grid-cols-1 sm:grid-cols-[2.0fr_1fr]">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                >
                  <ProjectTile
                    project={p}
                    dimmed={isDimmed(p)}
                    onOpen={() => onOpenProject(p.id)}
                  />
                </motion.div>
              ))}
              <div className="flex flex-col gap-3">
                {half.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, delay: (featured.length + i) * 0.07 }}
                  >
                    <ProjectTile
                      project={p}
                      dimmed={isDimmed(p)}
                      onOpen={() => onOpenProject(p.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 grid-flow-row-dense">
              {small.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: (featured.length + half.length + i) * 0.07 }}
                >
                  <ProjectTile
                    project={p}
                    dimmed={isDimmed(p)}
                    onOpen={() => onOpenProject(p.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open `http://localhost:5173`.
- Projects section shows just `❯ ./projects` typewriter bar on load, collapsed
- Clicking the bar reveals projects with scanline wipe + tile stagger
- Clicking again collapses (fade out)
- Filter tags appear inside the expanded section
- `❯` is green, `./projects` is accent purple, meta text is muted

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectsSection.jsx
git commit -m "feat: accordion collapse for ProjectsSection with scanline wipe"
```

---

### Task 3: Update ExperimentsSection

**Files:**
- Modify: `src/components/ExperimentsSection.jsx`

- [ ] **Step 1: Replace the file contents**

```jsx
// src/components/ExperimentsSection.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIMENTS } from '../data/experiments'
import { AccordionBar } from './AccordionBar'

export function ExperimentsSection() {
  const [isOpen, setIsOpen] = useState(false)

  // auto-expand if user navigated directly to #experiments
  useEffect(() => {
    if (window.location.hash === '#experiments') {
      setIsOpen(true)
    }
  }, [])

  const meta = `${EXPERIMENTS.length} experiment${EXPERIMENTS.length !== 1 ? 's' : ''}`

  return (
    <section id="experiments" className="mt-6 mb-6">
      <AccordionBar
        label="./experiments"
        meta={meta}
        isOpen={isOpen}
        onToggle={() => setIsOpen(o => !o)}
        typeDelay={400}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="experiments-body"
            className="relative overflow-hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Scan head */}
            <motion.div
              aria-hidden="true"
              className="absolute left-0 w-full pointer-events-none z-10"
              style={{
                height: '6px',
                background: 'linear-gradient(transparent, hsl(277,65%,80%), transparent)',
              }}
              initial={{ top: '0%', opacity: 1 }}
              animate={{ top: '105%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Dark container */}
            <div className="rounded-sm overflow-hidden p-5 sm:p-6 bg-dark border border-dark-border">
              <div className="text-sm font-mono mb-5 text-ink-2">
                tools and explorations — side projects, interactive essays, visual experiments
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXPERIMENTS.map((exp, i) => (
                  <ExperimentCard key={exp.id} experiment={exp} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ExperimentCard({ experiment, index }) {
  return (
    <motion.a
      href={experiment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[2px] p-4 no-underline bg-dark-card border border-dark-border hover:border-green-border hover:bg-green-ghost transition-colors duration-200"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-mono text-ink-2">{experiment.year}</span>
        <span className="text-base font-mono text-green">↗</span>
      </div>

      <div
        className="font-display font-black text-white mb-1.5 leading-tight"
        style={{ fontSize: 'clamp(1.6875rem, 3.75vw, 2.25rem)' }}
      >
        {experiment.title}
      </div>

      <p className="text-ui font-mono leading-relaxed mb-3 text-ink-3">
        {experiment.description}
      </p>

      <div className="flex gap-1.5 flex-wrap">
        {experiment.tags.map(tag => (
          <span
            key={tag}
            className="text-xs font-mono px-1.5 py-0.5 rounded-[2px] bg-dark-tag text-ink-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
```

- [ ] **Step 2: Verify in browser**

Run `npm run dev`. Open `http://localhost:5173`.
- Experiments bar appears below projects bar, shows `❯ ./experiments` typing in with 400ms delay after projects finishes
- Clicking reveals dark card grid with scanline wipe
- Experiment cards stagger in (each 80ms apart)
- Both sections independently open/close without affecting each other
- Opening both at once works fine

- [ ] **Step 3: Verify anchor links**

Open `http://localhost:5173/#projects` in a fresh tab — projects section should be pre-expanded. Open `http://localhost:5173/#experiments` — experiments section pre-expanded.

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperimentsSection.jsx
git commit -m "feat: accordion collapse for ExperimentsSection with scanline wipe"
```

---

### Task 4: Final verification and deploy

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: `✓ built in Xs` with no errors. The chunk size warning for `index.js` is pre-existing (excalidraw) and expected.

- [ ] **Step 2: Smoke-test the build**

```bash
npm run preview
```

Open `http://localhost:4173`. Check:
- Both sections collapsed on load
- Typewriters play in sequence (projects first, experiments 400ms later)
- Both meta strings appear after cursor fades: `— 8 projects · ux · 3d · game · brand` and `— N experiments`
- Expand/collapse animates correctly in both sections
- Filter tags work inside expanded projects
- Project modal still opens from tiles
- No console errors

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "feat: accordion sections — projects and experiments collapse with scanline wipe"
git push origin main
```
