# Terminal Interactions Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three layered terminal-themed interaction features to the portfolio: an inline command prompt in the HeroBox title card, a global Cmd+K command palette, and a dark Experiments grid section.

**Architecture:** Filter state is lifted from ProjectsSection into App.jsx so both the inline terminal and the Cmd+K palette can control it. The terminal prompt lives at the bottom of HeroBox; all command logic lives in a `useTerminal` hook. The Cmd+K palette wraps `cmdk` and shares the same callbacks. The Experiments section is a standalone dark-themed section rendered below ProjectsSection.

**Tech Stack:** React 19, Framer Motion 12, Tailwind CSS v4, `cmdk` (new dependency), plain RAF/JS for terminal

---

## Chunk 1: Foundation — Filter State Lift + Data + Hook

### Task 1: Lift `activeFilter` state from ProjectsSection to App.jsx

Currently `ProjectsSection` owns `const [activeFilter, setActiveFilter] = useState(null)`. Moving it to App.jsx lets the terminal and palette control it.

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/ProjectsSection.jsx`

- [ ] **Step 1: Add `activeFilter` state and `onFilterChange` prop thread in App.jsx**

Open `src/App.jsx`. Add `activeFilter` state and pass it down:

```jsx
import { useState } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome }   from './components/TerminalChrome'
import { HeroBox }          from './components/HeroBox'
import { ProjectsSection }  from './components/ProjectsSection'
import { Footer }           from './components/Footer'
import { ProjectModal }     from './components/ProjectModal'
import { AboutModal }       from './components/AboutModal'

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  return (
    <LayoutGroup>
    <main className="max-w-[1280px] mx-auto flex flex-col min-h-[calc(100vh_-_128px)]">
      <TerminalChrome />
      <HeroBox onAboutOpen={() => setAboutOpen(true)} />
      <ProjectsSection
        onOpenProject={setActiveProjectId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="flex-1" />
      <Footer />
      <ProjectModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
    </LayoutGroup>
  )
}
```

- [ ] **Step 2: Update ProjectsSection to accept `activeFilter` + `onFilterChange` props**

Replace the internal `useState` for `activeFilter` with the incoming props. The `toggleFilter` helper is replaced by calling `onFilterChange` directly. The `isDimmed` check uses the prop value.

Full replacement for `src/components/ProjectsSection.jsx`:

```jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PROJECTS, FILTERS } from "../data/projects";
import { ProjectTile } from "./ProjectTile";

export function ProjectsSection({ onOpenProject, activeFilter, onFilterChange }) {
  const [typedCmd, setTypedCmd] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [tilesVisible, setTilesVisible] = useState(false);

  const CMD = "ls ./projects --sort=featured";

  useEffect(() => {
    let cancelled = false;
    const tileTimer = setTimeout(() => setTilesVisible(true), 800);
    const startTimer = setTimeout(() => {
      let i = 0;
      function type() {
        if (cancelled) return;
        if (i < CMD.length) {
          setTypedCmd(CMD.slice(0, ++i));
          setTimeout(type, 18 + Math.random() * 16);
        } else {
          setShowCursor(false);
        }
      }
      type();
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(tileTimer);
      clearTimeout(startTimer);
    };
  }, []);

  function toggleFilter(value) {
    onFilterChange(activeFilter === value ? null : value);
  }

  function isDimmed(project) {
    if (!activeFilter) return false;
    return !project.skills.includes(activeFilter);
  }

  const featured = PROJECTS.filter((p) => p.size === "featured");
  const half = PROJECTS.filter((p) => p.size === "half");
  const small = PROJECTS.filter((p) => p.size === "small");

  return (
    <section id="projects">
      {/* Typewriter header */}
      <div className="text-[11px] text-[#888] mb-3 whitespace-nowrap overflow-hidden font-mono">
        <span style={{ color: "var(--terminal-green)" }}>❯</span>{" "}
        <span>{typedCmd}</span>
        {showCursor && (
          <span
            style={{
              color: "hsl(277,65%,32%)",
              animation: "blink 1s step-end infinite",
            }}
          >
            █
          </span>
        )}
      </div>

      {/* Filter tags */}
      <motion.div
        className="flex gap-1.5 flex-wrap mb-3"
        initial={{ opacity: 0 }}
        animate={tilesVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.value}
            onClick={() => toggleFilter(f.value)}
            className={[
              "text-[10px] font-mono border px-2 py-0.5 rounded-[2px] cursor-pointer transition-all duration-150",
              activeFilter === f.value
                ? "text-white"
                : "border-[#d0cdc6] text-[#888]",
            ].join(" ")}
            style={
              activeFilter === f.value
                ? { background: "var(--accent)", borderColor: "var(--accent)" }
                : {}
            }
            onMouseEnter={(e) => {
              if (activeFilter !== f.value) {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
                e.currentTarget.style.background = "var(--accent-tint-04)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeFilter !== f.value) {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.color = "";
                e.currentTarget.style.background = "";
              }
            }}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Featured row */}
      <div className="grid gap-[12px] mb-[12px] grid-cols-1 sm:grid-cols-[2.0fr_1fr]">
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
        <div className="flex flex-col gap-[12px]">
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
      <div className="grid grid-cols-3 gap-[12px] mb-[12px] grid-flow-row-dense">
        {small.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: 0.35,
              delay: (featured.length + half.length + i) * 0.07,
            }}
          >
            <ProjectTile
              project={p}
              dimmed={isDimmed(p)}
              onOpen={() => onOpenProject(p.id)}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify dev server — filter tags still work**

Run `npm run dev`. Click filter tags — projects should dim/undim as before. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/components/ProjectsSection.jsx
git commit -m "refactor: lift activeFilter state to App.jsx for cross-component control"
```

---

### Task 2: Create `src/data/experiments.js`

**Files:**
- Create: `src/data/experiments.js`

- [ ] **Step 1: Create experiments data file**

```js
// src/data/experiments.js
// ─── ADD A NEW EXPERIMENT ─────────────────────────────────────────────────────
// Copy this block, increment num, add to the array.
//
// {
//   id:          'kebab-case-id',
//   title:       'Display Title',
//   description: 'One sentence describing the experiment.',
//   url:         'https://experiment.jishnuthewalker.com',
//   tags:        ['tool', 'animation'],   ← short labels for the tag chips
//   year:        '2024',
// },
// ────────────────────────────────────────────────────────────────────────────

export const EXPERIMENTS = [
  {
    id: 'wiggle',
    title: 'Wiggle',
    description: 'Physics-based spring animation playground. Tune stiffness, damping, and mass — copy the curve.',
    url: 'https://wiggle.jishnuthewalker.com',
    tags: ['animation', 'tool'],
    year: '2024',
  },
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Sorting algorithm visualizer. Watch bubble, merge, and quick sort race in real time.',
    url: 'https://sorting.jishnuthewalker.com',
    tags: ['algorithms', 'viz'],
    year: '2024',
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add src/data/experiments.js
git commit -m "feat: add experiments data (wiggle, sorting)"
```

---

### Task 3: Create `src/hooks/useTerminal.js`

This hook owns all terminal state and command parsing. It is a pure logic layer — no JSX. Receives callbacks for side effects (open modal, set filter, etc.).

**Files:**
- Create: `src/hooks/useTerminal.js`

- [ ] **Step 1: Create the hook**

```js
// src/hooks/useTerminal.js
import { useState, useCallback, useRef } from 'react'
import { PROJECTS } from '../data/projects'
import { EXPERIMENTS } from '../data/experiments'

const HELP_TEXT = [
  'available commands:',
  '  ls [./projects|./experiments]  list items',
  '  filter <ux|3d|game|brand|all>  filter projects',
  '  open <name>                    open a project',
  '  cd <work|experiments|home>     navigate to section',
  '  whoami                         about me',
  '  neofetch                       system info',
  '  clear                          clear terminal',
  '  help                           show this help',
]

/**
 * useTerminal — command parser and history manager for the inline HeroBox prompt.
 *
 * @param {object} callbacks
 * @param {(tag: string|null) => void} callbacks.onFilterChange
 * @param {(id: string) => void}       callbacks.onOpenProject
 * @param {() => void}                 callbacks.onOpenAbout
 *
 * @returns {{ history, inputValue, setInputValue, handleKeyDown, inputRef }}
 */
export function useTerminal({ onFilterChange, onOpenProject, onOpenAbout }) {
  // history: array of { type: 'cmd' | 'output', text: string }
  const [history, setHistory] = useState([])
  // cmdHistory: array of previously run command strings for arrow-key recall
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const execCommand = useCallback((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setInputValue('')
    setHistoryIdx(-1)
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)])

    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)
    const arg = args.join(' ')

    let outputLines = []
    let sideEffect = null

    switch (cmd) {
      case 'help':
        outputLines = HELP_TEXT
        break

      case 'clear':
        setHistory([])
        return

      case 'ls': {
        const target = args[0] || './projects'
        if (target === './experiments' || target === 'experiments') {
          outputLines = [
            'experiments/',
            ...EXPERIMENTS.map(e => `  ${e.id.padEnd(12)}  ${e.description.slice(0, 48)}`),
          ]
        } else {
          outputLines = [
            'projects/',
            ...PROJECTS.map(p => `  ${p.id.padEnd(14)}  ${p.title}`),
          ]
        }
        break
      }

      case 'filter': {
        const tag = args[0]
        const valid = ['ux', '3d', 'game', 'brand', 'all']
        if (!tag || !valid.includes(tag)) {
          outputLines = [`usage: filter <${valid.join('|')}>`]
        } else {
          const filterVal = tag === 'all' ? null : tag
          sideEffect = () => {
            onFilterChange(filterVal)
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }
          outputLines = [tag === 'all' ? 'filter cleared — showing all projects' : `filtering by ${tag}`]
        }
        break
      }

      case 'open': {
        if (!arg) {
          outputLines = ['usage: open <project-name>', 'tip: try "ls" to see project IDs']
          break
        }
        const match = PROJECTS.find(p =>
          p.id.includes(arg) ||
          p.title.toLowerCase().includes(arg)
        )
        if (match) {
          sideEffect = () => onOpenProject(match.id)
          outputLines = [`opening ${match.title}…`]
        } else {
          outputLines = [`project not found: "${arg}"`, `try: ls ./projects`]
        }
        break
      }

      case 'cd': {
        const dest = args[0]
        const destMap = {
          work: 'projects',
          projects: 'projects',
          experiments: 'experiments',
        }
        if (!dest) {
          outputLines = ['usage: cd <work|experiments|home>']
        } else if (dest === 'home' || dest === '~' || dest === '/') {
          sideEffect = () => window.scrollTo({ top: 0, behavior: 'smooth' })
          outputLines = ['navigating to top…']
        } else if (destMap[dest]) {
          sideEffect = () =>
            document.getElementById(destMap[dest])?.scrollIntoView({ behavior: 'smooth' })
          outputLines = [`navigating to ${dest}…`]
        } else {
          outputLines = [`no such directory: ${dest}`]
        }
        break
      }

      case 'whoami':
        sideEffect = () => onOpenAbout()
        outputLines = [
          'jishnu diwakar',
          'founding designer @ nudge',
          'iit bombay · bangalore',
        ]
        break

      case 'echo':
        outputLines = [args.join(' ') || '']
        break

      case 'sudo':
        outputLines = ['nice try. 🙂']
        break

      case 'neofetch':
        outputLines = [
          '  jishnu@portfolio',
          '  ─────────────────',
          '  OS:   Figma · FigJam',
          '  WM:   React + Vite',
          '  DE:   Tailwind v4',
          '  Up:   since 2019',
          '  Role: Founding Designer',
          '  Co:   Nudge',
          '  Loc:  Bangalore, IN',
        ]
        break

      default:
        outputLines = [
          `command not found: ${cmd}`,
          `type 'help' for available commands`,
        ]
    }

    const newEntries = [
      { type: 'cmd', text: trimmed },
      ...outputLines.map(text => ({ type: 'output', text })),
    ]

    setHistory(prev => [...prev, ...newEntries].slice(-60))
    sideEffect?.()
  }, [onFilterChange, onOpenProject, onOpenAbout])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      execCommand(inputValue)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      if (next !== historyIdx) {
        setHistoryIdx(next)
        setInputValue(cmdHistory[next] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      if (next !== historyIdx) {
        setHistoryIdx(next)
        setInputValue(next === -1 ? '' : (cmdHistory[next] || ''))
      }
    } else if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }, [inputValue, execCommand, cmdHistory, historyIdx])

  return { history, inputValue, setInputValue, handleKeyDown, inputRef }
}
```

- [ ] **Step 2: Verify the file is syntactically valid**

Run `npm run lint`. Expect no errors from the new file (there are no tests to run for hooks in this project).

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useTerminal.js
git commit -m "feat: add useTerminal hook with full command parser"
```

---

## Chunk 2: Terminal Prompt + Command Palette

### Task 4: Install `cmdk`

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install cmdk**

```bash
npm install cmdk
```

Expected: `cmdk` appears in `package.json` dependencies.

- [ ] **Step 2: Add cmdk base styles to index.css**

The `cmdk` components use data attributes for styling. Add these rules at the bottom of `src/index.css` so they apply globally:

```css
/* ── cmdk (CommandPalette) ──────────────────────────────────── */
[cmdk-group-heading] {
  font-size: 9px;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  color: #444;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 12px 16px 4px;
}

[cmdk-item] {
  cursor: pointer;
  outline: none;
}

[cmdk-item][aria-selected='true'],
[cmdk-item]:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

[cmdk-input] {
  /* Completely unstyled — Tailwind classes handle it */
  all: unset;
}
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/index.css
git commit -m "chore: install cmdk, add base styles for command palette"
```

---

### Task 5: Create `src/components/TerminalPrompt.jsx`

The inline terminal that lives at the bottom of HeroBox. Shows scrollable command history above, an input row below. Clicking anywhere in the area focuses the input.

**Files:**
- Create: `src/components/TerminalPrompt.jsx`

- [ ] **Step 1: Create the component**

```jsx
// src/components/TerminalPrompt.jsx
import { useEffect, useRef } from 'react'
import { useTerminal } from '../hooks/useTerminal'

/**
 * TerminalPrompt — inline command prompt at the bottom of HeroBox.
 * Delegates all logic to useTerminal; this component is purely presentational.
 */
export function TerminalPrompt({ onFilterChange, onOpenProject, onOpenAbout }) {
  const { history, inputValue, setInputValue, handleKeyDown, inputRef } =
    useTerminal({ onFilterChange, onOpenProject, onOpenAbout })

  const historyEndRef = useRef(null)

  // Auto-scroll history to bottom when new entries arrive
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [history])

  return (
    <div
      className="border-t border-[#e0ddd6] px-7 py-3 font-mono text-[10px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Command history — max ~80px tall, scrollable */}
      {history.length > 0 && (
        <div className="mb-2 max-h-[88px] overflow-y-auto">
          {history.map((entry, i) => (
            <div
              key={i}
              className="leading-[1.6] whitespace-pre-wrap break-all"
              style={{
                color: entry.type === 'cmd' ? 'var(--accent)' : '#888',
              }}
            >
              {entry.type === 'cmd' && (
                <span style={{ color: 'var(--terminal-green)' }}>❯ </span>
              )}
              {entry.text}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <span
          className="flex-shrink-0 select-none"
          style={{ color: 'var(--terminal-green)' }}
        >
          ❯
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command… (try 'help')"
          className="flex-1 bg-transparent border-0 outline-none text-[10px] font-mono text-[#1a1a1a] placeholder-[#ccc] caret-[var(--accent)]"
          // Prevent browser autocomplete interfering with shell-like UX
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TerminalPrompt.jsx
git commit -m "feat: add TerminalPrompt component (inline HeroBox terminal)"
```

---

### Task 6: Wire TerminalPrompt into HeroBox + App.jsx

HeroBox needs to: (a) accept the new callback props, (b) render TerminalPrompt at the bottom, (c) expose `onPaletteOpen` for the `⌘K` hint button (added here for the palette in Task 7).

**Files:**
- Modify: `src/components/HeroBox.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Update HeroBox.jsx**

Full replacement:

```jsx
// src/components/HeroBox.jsx
import { useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScramble } from '../hooks/useScramble'
import { TerminalPrompt } from './TerminalPrompt'

export function HeroBox({ onAboutOpen, onFilterChange, onOpenProject, onPaletteOpen }) {
  return (
    <div className="border border-[#d0cdc6] rounded-sm mb-6 overflow-hidden bg-[#FAF8F3]">
      <HeroTitlebar onAboutOpen={onAboutOpen} onPaletteOpen={onPaletteOpen} />
      <div className="px-7 pt-6 pb-5">
        <BigName />
        <RoleLine />
        <HeroFooter />
      </div>
      <TerminalPrompt
        onFilterChange={onFilterChange}
        onOpenProject={onOpenProject}
        onOpenAbout={onAboutOpen}
      />
    </div>
  )
}

function HeroTitlebar({ onAboutOpen, onPaletteOpen }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#d0cdc6] text-[11px]">
      <span className="text-[15px] font-bold tracking-wide font-mono" style={{ color: 'var(--accent)' }}>
        जेदी
      </span>
      <nav className="flex gap-4 items-center">
        <a
          href="#projects"
          className="text-[#bbb] no-underline text-[10px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
        >
          work
        </a>
        <button
          type="button"
          onClick={onAboutOpen}
          className="text-[#bbb] text-[10px] font-mono transition-colors duration-150 hover:text-[var(--accent)] bg-transparent border-0 cursor-pointer p-0"
        >
          about
        </button>
        <a
          href="https://blog.jishnuthewalker.com"
          target="_blank"
          rel="noreferrer"
          className="text-[#bbb] no-underline text-[10px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
        >
          blog
        </a>
        <a
          href="https://drive.google.com/file/d/1RIVWbv4fpKQe4n8QgOEw5IhPWOxXeInc/view?pli=1"
          target="_blank"
          rel="noreferrer"
          className="text-[#bbb] no-underline text-[10px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
        >
          resume
        </a>
        {/* ⌘K hint button — opens command palette */}
        <button
          type="button"
          onClick={onPaletteOpen}
          className="text-[9px] font-mono border rounded-[2px] px-1.5 py-0.5 cursor-pointer transition-all duration-150"
          style={{ color: '#bbb', borderColor: '#e0ddd6' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.borderColor = 'var(--accent-tint-35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#bbb'
            e.currentTarget.style.borderColor = '#e0ddd6'
          }}
          title="Open command palette"
        >
          ⌘K
        </button>
        <a
          href="https://nudgenow.com"
          target="_blank"
          rel="noreferrer"
          className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] transition-colors duration-150"
          style={{
            color: 'var(--accent)',
            border: '1px solid var(--accent-tint-35)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-tint-08)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}
        >
          nudge ↗
        </a>
      </nav>
    </div>
  )
}

function BigName() {
  const textRef = useRef(null)
  const cursorRef = useRef(null)
  const { scrambleName } = useScramble()
  const running = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transition = 'opacity 0.4s'
        cursorRef.current.style.opacity = '0'
        setTimeout(() => {
          if (cursorRef.current) cursorRef.current.style.display = 'none'
        }, 400)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (running.current) return
    running.current = true
    scrambleName(textRef.current, 'JISHNU\nDIWAKAR')
    setTimeout(() => { running.current = false }, 800)
  }, [scrambleName])

  return (
    <div
      className="font-display font-black leading-[0.88] tracking-[-4px] text-[#1a1a1a] mb-4 cursor-default select-none inline-flex items-end"
      style={{ fontSize: 'clamp(60px, 8vw, 90px)' }}
      onMouseEnter={handleMouseEnter}
    >
      <span ref={textRef}>JISHNU<br />DIWAKAR</span>
      <span
        ref={cursorRef}
        className="inline-block ml-1 align-bottom"
        style={{
          width: 'clamp(4px, 0.5vw, 6px)',
          height: 'clamp(36px, 5.1vw, 56px)',
          background: 'var(--accent)',
          animation: 'blink 1.1s step-end infinite',
        }}
      />
    </div>
  )
}

function RoleLine() {
  return (
    <motion.div
      className="flex items-center gap-2.5 mb-3.5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <span className="text-[14px] font-bold font-mono" style={{ color: 'var(--accent)' }}>
        Founding Designer
      </span>
      <span className="text-[#ddd]">·</span>
      <span className="text-[11px] text-[#888] font-mono">Nudge · IIT Bombay · Bangalore</span>
    </motion.div>
  )
}

function HeroFooter() {
  return (
    <motion.div
      className="border-t border-[#e0ddd6] pt-3 flex items-center gap-3 text-[11px] text-[#bbb] font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.45 }}
    >
      <span style={{ color: 'var(--terminal-green)' }}>❯</span>
      <span>crafting experiences that just feel right</span>
      <a
        href="mailto:jishnu@hey.com"
        className="ml-auto text-[11px] font-mono px-3 py-1 rounded-[2px] no-underline transition-all duration-150"
        style={{
          color: 'var(--accent)',
          border: '1px solid var(--accent-tint-30)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--accent-tint-08)'
          e.currentTarget.style.transform = 'translateX(2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = ''
          e.currentTarget.style.transform = ''
        }}
      >
        let's chat ↗
      </a>
    </motion.div>
  )
}
```

- [ ] **Step 2: Update App.jsx to pass the new HeroBox props**

Add `paletteOpen` state and `onPaletteOpen` callback. Thread through to HeroBox:

```jsx
import { useState } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome }   from './components/TerminalChrome'
import { HeroBox }          from './components/HeroBox'
import { ProjectsSection }  from './components/ProjectsSection'
import { Footer }           from './components/Footer'
import { ProjectModal }     from './components/ProjectModal'
import { AboutModal }       from './components/AboutModal'

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  return (
    <LayoutGroup>
    <main className="max-w-[1280px] mx-auto flex flex-col min-h-[calc(100vh_-_128px)]">
      <TerminalChrome />
      <HeroBox
        onAboutOpen={() => setAboutOpen(true)}
        onFilterChange={setActiveFilter}
        onOpenProject={setActiveProjectId}
        onPaletteOpen={() => setPaletteOpen(true)}
      />
      <ProjectsSection
        onOpenProject={setActiveProjectId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="flex-1" />
      <Footer />
      <ProjectModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
    </main>
    </LayoutGroup>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Check:
- HeroBox bottom section shows `❯ type a command… (try 'help')` input
- Clicking in that area focuses the input
- Type `help` → press Enter → help text appears in history above
- Type `filter ux` → projects dim accordingly, page scrolls to projects
- Type `filter all` → filter clears
- Type `open review` → रीView modal opens
- Type `whoami` → About modal opens + bio prints in terminal
- `⌘K` button appears in titlebar nav (no functionality yet — palette not built)
- Arrow Up/Down cycles through command history
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroBox.jsx src/App.jsx
git commit -m "feat: wire TerminalPrompt into HeroBox, add paletteOpen state to App"
```

---

### Task 7: Create `src/components/CommandPalette.jsx` + wire into App.jsx

**Files:**
- Create: `src/components/CommandPalette.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create CommandPalette.jsx**

```jsx
// src/components/CommandPalette.jsx
import { useEffect } from 'react'
import { Command } from 'cmdk'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS } from '../data/projects'
import { EXPERIMENTS } from '../data/experiments'

/**
 * CommandPalette — ⌘K global command layer.
 * Dark floating panel, ~560px wide, positioned at 20vh from top.
 * Uses cmdk for keyboard navigation + fuzzy search.
 */
export function CommandPalette({
  isOpen,
  onClose,
  onOpenProject,
  onOpenAbout,
  onFilterChange,
}) {
  // Close on Escape (cmdk also handles this internally, belt-and-suspenders)
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  function run(fn) {
    fn()
    onClose()
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-backdrop"
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
          />

          {/* Panel */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] pointer-events-none px-5">
            <motion.div
              key="palette-panel"
              className="w-full max-w-[560px] pointer-events-auto overflow-hidden rounded-[4px]"
              style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 32px 96px rgba(0,0,0,0.7)',
              }}
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Command>
                {/* Search input row */}
                <div
                  className="flex items-center px-4 gap-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span
                    className="text-[11px] font-mono flex-shrink-0"
                    style={{ color: 'var(--terminal-green)' }}
                  >
                    ❯
                  </span>
                  <Command.Input
                    placeholder="type a command or search…"
                    className="flex-1 bg-transparent border-0 outline-none text-[13px] font-mono text-white py-4"
                    style={{
                      caretColor: 'var(--terminal-green)',
                      // override any browser default styles
                      WebkitAppearance: 'none',
                    }}
                  />
                  <kbd
                    className="text-[9px] font-mono rounded-[2px] px-1.5 py-0.5 flex-shrink-0"
                    style={{
                      color: '#444',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    esc
                  </kbd>
                </div>

                <Command.List className="py-2 max-h-[340px] overflow-y-auto">
                  <Command.Empty className="text-[11px] font-mono px-4 py-3" style={{ color: '#555' }}>
                    no results.
                  </Command.Empty>

                  {/* ── Navigate ─────────────────────────────── */}
                  <Command.Group heading="Navigate">
                    <PaletteItem
                      onSelect={() => run(() => scrollTo('projects'))}
                    >
                      <ItemIcon>↓</ItemIcon> scroll to work
                    </PaletteItem>
                    <PaletteItem
                      onSelect={() => run(() => scrollTo('experiments'))}
                    >
                      <ItemIcon>↓</ItemIcon> scroll to experiments
                    </PaletteItem>
                    <PaletteItem onSelect={() => run(onOpenAbout)}>
                      <ItemIcon>◎</ItemIcon> about me
                    </PaletteItem>
                    <PaletteItem
                      onSelect={() =>
                        run(() =>
                          window.open(
                            'https://drive.google.com/file/d/1RIVWbv4fpKQe4n8QgOEw5IhPWOxXeInc/view?pli=1',
                            '_blank'
                          )
                        )
                      }
                    >
                      <ItemIcon>↗</ItemIcon> open resume
                    </PaletteItem>
                    <PaletteItem
                      onSelect={() => run(() => window.open('mailto:jishnu@hey.com'))}
                    >
                      <ItemIcon>✉</ItemIcon> send email
                    </PaletteItem>
                  </Command.Group>

                  {/* ── Projects ─────────────────────────────── */}
                  <Command.Group heading="Projects">
                    {PROJECTS.map(p => (
                      <PaletteItem
                        key={p.id}
                        onSelect={() => run(() => onOpenProject(p.id))}
                      >
                        <ItemNum>{p.num}</ItemNum>
                        {p.title}
                      </PaletteItem>
                    ))}
                  </Command.Group>

                  {/* ── Filter ───────────────────────────────── */}
                  <Command.Group heading="Filter">
                    {['ux', '3d', 'game', 'brand'].map(tag => (
                      <PaletteItem
                        key={tag}
                        onSelect={() =>
                          run(() => {
                            onFilterChange(tag)
                            scrollTo('projects')
                          })
                        }
                      >
                        <ItemIcon>#</ItemIcon> filter by {tag}
                      </PaletteItem>
                    ))}
                    <PaletteItem
                      onSelect={() =>
                        run(() => {
                          onFilterChange(null)
                          scrollTo('projects')
                        })
                      }
                    >
                      <ItemIcon>✕</ItemIcon> clear filter
                    </PaletteItem>
                  </Command.Group>

                  {/* ── Experiments ──────────────────────────── */}
                  <Command.Group heading="Experiments">
                    {EXPERIMENTS.map(e => (
                      <PaletteItem
                        key={e.id}
                        onSelect={() => run(() => window.open(e.url, '_blank'))}
                      >
                        <ItemIcon>↗</ItemIcon> {e.title}
                      </PaletteItem>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Shared sub-components ────────────────────────────────────────────────────

function PaletteItem({ children, onSelect }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-mono cursor-pointer transition-colors duration-75"
      style={{ color: '#aaa' }}
    >
      {children}
    </Command.Item>
  )
}

function ItemIcon({ children }) {
  return (
    <span className="text-[10px] w-4 flex-shrink-0" style={{ color: '#555' }}>
      {children}
    </span>
  )
}

function ItemNum({ children }) {
  return (
    <span className="text-[9px] font-mono w-6 flex-shrink-0" style={{ color: '#555' }}>
      {children}
    </span>
  )
}
```

- [ ] **Step 2: Add global ⌘K keyboard listener + render CommandPalette in App.jsx**

Full updated `src/App.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome }   from './components/TerminalChrome'
import { HeroBox }          from './components/HeroBox'
import { ProjectsSection }  from './components/ProjectsSection'
import { Footer }           from './components/Footer'
import { ProjectModal }     from './components/ProjectModal'
import { AboutModal }       from './components/AboutModal'
import { CommandPalette }   from './components/CommandPalette'

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  // Global ⌘K / Ctrl+K shortcut to open the command palette
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <LayoutGroup>
    <main className="max-w-[1280px] mx-auto flex flex-col min-h-[calc(100vh_-_128px)]">
      <TerminalChrome />
      <HeroBox
        onAboutOpen={() => setAboutOpen(true)}
        onFilterChange={setActiveFilter}
        onOpenProject={setActiveProjectId}
        onPaletteOpen={() => setPaletteOpen(true)}
      />
      <ProjectsSection
        onOpenProject={setActiveProjectId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <div className="flex-1" />
      <Footer />
      <ProjectModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenProject={setActiveProjectId}
        onOpenAbout={() => setAboutOpen(true)}
        onFilterChange={setActiveFilter}
      />
    </main>
    </LayoutGroup>
  )
}
```

- [ ] **Step 3: Verify in browser**

Run `npm run dev`. Check:
- Press `⌘K` (Mac) or `Ctrl+K` (Windows) → dark palette panel slides in from above
- Click the `⌘K` button in the titlebar → same behaviour
- Type `review` → "01 रीView" appears in Projects group
- Press Enter or click it → modal opens, palette closes
- Type `filter ux` → auto-selects "filter by ux" item
- Press Escape → palette closes
- Click backdrop → palette closes
- All Navigation items work (scroll to work, scroll to experiments — the section doesn't exist yet, that's fine)
- No console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/CommandPalette.jsx src/App.jsx
git commit -m "feat: add CommandPalette (cmdk) with Cmd+K shortcut"
```

---

## Chunk 3: Experiments Section

### Task 8: Create `src/components/ExperimentsSection.jsx` + wire into App.jsx

**Files:**
- Create: `src/components/ExperimentsSection.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create ExperimentsSection.jsx**

```jsx
// src/components/ExperimentsSection.jsx
import { motion } from 'framer-motion'
import { EXPERIMENTS } from '../data/experiments'

/**
 * ExperimentsSection — dark grid below Projects.
 * Contrasts with the warm off-white background.
 * Each card links out to the experiment URL.
 */
export function ExperimentsSection() {
  return (
    <section id="experiments" className="mt-6 mb-6">
      {/* Header — matches ProjectsSection typewriter aesthetic */}
      <div className="text-[11px] font-mono mb-3 flex items-center gap-2">
        <span style={{ color: 'var(--terminal-green)' }}>❯</span>
        <span style={{ color: 'var(--accent)' }}>ls ./experiments</span>
      </div>

      {/* Dark container */}
      <div
        className="rounded-sm overflow-hidden p-5 sm:p-6"
        style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Sub-header inside dark zone */}
        <div className="text-[9px] font-mono mb-5" style={{ color: '#444' }}>
          tools and explorations — side projects, interactive essays, visual experiments
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp, i) => (
            <ExperimentCard key={exp.id} experiment={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ExperimentCard({ experiment, index }) {
  return (
    <motion.a
      href={experiment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[2px] p-4 no-underline"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(40,200,64,0.35)'
        e.currentTarget.style.background   = 'rgba(40,200,64,0.04)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.background   = 'rgba(255,255,255,0.04)'
      }}
    >
      {/* Year + arrow */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-[9px] font-mono" style={{ color: '#444' }}>
          {experiment.year}
        </span>
        <span
          className="text-[11px] font-mono"
          style={{ color: 'var(--terminal-green)' }}
        >
          ↗
        </span>
      </div>

      {/* Title */}
      <div
        className="font-display font-black text-white mb-1.5 leading-tight"
        style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
      >
        {experiment.title}
      </div>

      {/* Description */}
      <p className="text-[10px] font-mono leading-relaxed mb-3" style={{ color: '#555' }}>
        {experiment.description}
      </p>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        {experiment.tags.map(tag => (
          <span
            key={tag}
            className="text-[8px] font-mono px-1.5 py-0.5 rounded-[2px]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#444',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
```

- [ ] **Step 2: Add ExperimentsSection to App.jsx**

Add import and render it between `<ProjectsSection />` and `<div className="flex-1" />`. Final `src/App.jsx`:

```jsx
import { useState, useEffect } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome }       from './components/TerminalChrome'
import { HeroBox }              from './components/HeroBox'
import { ProjectsSection }      from './components/ProjectsSection'
import { ExperimentsSection }   from './components/ExperimentsSection'
import { Footer }               from './components/Footer'
import { ProjectModal }         from './components/ProjectModal'
import { AboutModal }           from './components/AboutModal'
import { CommandPalette }       from './components/CommandPalette'

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <LayoutGroup>
    <main className="max-w-[1280px] mx-auto flex flex-col min-h-[calc(100vh_-_128px)]">
      <TerminalChrome />
      <HeroBox
        onAboutOpen={() => setAboutOpen(true)}
        onFilterChange={setActiveFilter}
        onOpenProject={setActiveProjectId}
        onPaletteOpen={() => setPaletteOpen(true)}
      />
      <ProjectsSection
        onOpenProject={setActiveProjectId}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <ExperimentsSection />
      <div className="flex-1" />
      <Footer />
      <ProjectModal
        projectId={activeProjectId}
        onClose={() => setActiveProjectId(null)}
      />
      <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenProject={setActiveProjectId}
        onOpenAbout={() => setAboutOpen(true)}
        onFilterChange={setActiveFilter}
      />
    </main>
    </LayoutGroup>
  )
}
```

- [ ] **Step 3: Verify full integration in browser**

Run `npm run dev`. Full checklist:

**Experiments section:**
- Dark card grid appears below projects
- `❯ ls ./experiments` header matches Projects header aesthetic
- Both experiment cards (Wiggle, Sorting) render with year, title, description, tags
- Hovering a card turns the border terminal-green (rgba(40,200,64,0.35))
- Clicking a card opens the URL in a new tab

**Terminal → Experiments:**
- Type `cd experiments` in the HeroBox terminal → page scrolls to the dark section
- Type `ls ./experiments` → shows both experiments in history

**Palette → Experiments:**
- Press `⌘K` → Experiments group shows Wiggle + Sorting
- Selecting one opens the URL in a new tab
- `scroll to experiments` Navigation item scrolls to the dark section

**Full flow:**
- Type `filter 3d` in terminal → projects filter, palette `filter by 3d` also works
- Both filter methods sync (the shared `activeFilter` state in App.jsx)

- [ ] **Step 4: Commit**

```bash
git add src/components/ExperimentsSection.jsx src/App.jsx
git commit -m "feat: add ExperimentsSection dark grid with Wiggle + Sorting experiments"
```

---

## Final verification

- [ ] Run `npm run build` — confirm no build errors
- [ ] Run `npm run lint` — confirm no lint errors
- [ ] Smoke-test on mobile viewport (375px) — terminal prompt is usable, experiments grid collapses to 1-col, palette panel fits inside padding

---

## Files created / modified — summary

| Action | File | Purpose |
|--------|------|---------|
| Modified | `src/App.jsx` | Add `activeFilter`, `paletteOpen` state; render `ExperimentsSection`, `CommandPalette`; global ⌘K listener |
| Modified | `src/components/ProjectsSection.jsx` | Accept `activeFilter`/`onFilterChange` props (state lifted) |
| Modified | `src/components/HeroBox.jsx` | Accept `onFilterChange`, `onOpenProject`, `onPaletteOpen`; render `TerminalPrompt`; add `⌘K` button |
| Created  | `src/hooks/useTerminal.js` | Command parser, history state, arrow-key recall |
| Created  | `src/components/TerminalPrompt.jsx` | Inline terminal UI (history + input row) |
| Created  | `src/components/CommandPalette.jsx` | Global ⌘K command palette using `cmdk` |
| Created  | `src/data/experiments.js` | Experiments data array (Wiggle + Sorting) |
| Created  | `src/components/ExperimentsSection.jsx` | Dark grid section with experiment cards |
| Modified | `src/index.css` | `cmdk` base styles (`[cmdk-group-heading]`, `[cmdk-item]`, etc.) |
