# Portfolio Build Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Jishnu Diwakar's personal portfolio as a production-ready React + Vite + Tailwind + Framer Motion single-page application, faithfully implementing the approved `prototype-v1.html` design.

**Architecture:** Single-page app with no routing. All content is static — no CMS, no backend. Components map 1:1 to the prototype sections: `Terminal Chrome → Hero → Projects → Footer`. Design tokens live in `tailwind.config.js` and CSS custom properties in `index.css`.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 4, Framer Motion 11, Google Fonts (JetBrains Mono + Inter 900), no state management library needed.

**Prototype reference:** `D:/my_stuff/developer/Developer/Developer/portfolio/.superpowers/brainstorm/117-1773140128/prototype-v1.html`

---

## Chunk 1: Project scaffold + design tokens

### Task 1: Bootstrap Vite + React project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [ ] Delete stale `package-lock.json` from root
- [ ] Scaffold with Vite:
  ```bash
  cd "D:/my_stuff/developer/Developer/Developer/portfolio"
  rm package-lock.json
  npm create vite@latest . -- --template react
  ```
  Answer prompts: framework = React, variant = JavaScript
- [ ] Install dependencies:
  ```bash
  npm install
  npm install framer-motion
  npm install -D tailwindcss @tailwindcss/vite
  ```
- [ ] Verify dev server starts:
  ```bash
  npm run dev
  ```
  Expected: server at `http://localhost:5173`, React default page visible

---

### Task 2: Configure Tailwind + design tokens

**Files:**
- Create: `tailwind.config.js`
- Modify: `vite.config.js`
- Modify: `src/index.css`

- [ ] Add Tailwind plugin to `vite.config.js`:
  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'
  import tailwindcss from '@tailwindcss/vite'

  export default defineConfig({
    plugins: [react(), tailwindcss()],
  })
  ```
- [ ] Write `tailwind.config.js` with full token set:
  ```js
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
      extend: {
        fontFamily: {
          mono: ['"JetBrains Mono"', '"Courier New"', 'monospace'],
          display: ['"Inter"', 'sans-serif'],
        },
        colors: {
          bg: '#F7F4EE',
          grid: '#e0ddd6',
          border: '#d0cdc6',
          text: '#1a1a1a',
          dim: '#888',
          dimmer: '#bbb',
          dimmest: '#ddd',
          'terminal-green': '#28c840',
          'tile-bg': '#FAF8F3',
          // Analogous palette
          ana: {
            1:       'hsl(277, 67.5%, 67%)',
            '1-dark':'hsl(277, 65%, 32%)',
            2:       'hsl(258, 72.6%, 31.8%)',
            3:       'hsl(264, 45%, 41.1%)',
            '4-dark':'hsl(290, 50%, 28%)',
            '5-dark':'hsl(307, 52%, 32%)',
            '6-dark':'hsl(333, 60%, 32%)',
            '7-dark':'hsl(320, 52%, 28%)',
          },
        },
        fontSize: {
          '2xs': ['7px', { lineHeight: '1.4' }],
          xs:    ['8px', { lineHeight: '1.5' }],
          sm:    ['8.5px', { lineHeight: '1.5' }],
          base:  ['11px', { lineHeight: '1.5' }],
          md:    ['12px', { lineHeight: '1.4' }],
          lg:    ['13px', { lineHeight: '1.4' }],
          xl:    ['15px', { lineHeight: '1.2' }],
          '2xl': ['18px', { lineHeight: '1.1' }],
          '3xl': ['20px', { lineHeight: '1.1' }],
        },
      },
    },
  }
  ```
- [ ] Write `src/index.css` with CSS custom properties and base styles:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@400;700;900&display=swap');
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  :root {
    /* Analogous palette */
    --ana-1:        hsl(277, 67.5%, 67%);
    --ana-1-dark:   hsl(277, 65%, 32%);
    --ana-1-chrome: hsl(277, 38%, 70%);
    --ana-1-tag:    hsl(277, 33%, 56%);
    --ana-1-bg:     hsl(277, 52%, 93%);
    --ana-1-border: hsl(277, 42%, 80%);

    --ana-2:        hsl(258, 72.6%, 31.8%);
    --ana-2-chrome: hsl(258, 32%, 62%);
    --ana-2-tag:    hsl(258, 30%, 48%);
    --ana-2-bg:     hsl(258, 38%, 93%);
    --ana-2-border: hsl(258, 38%, 78%);

    --ana-3:        hsl(264, 45%, 41.1%);
    --ana-3-chrome: hsl(264, 28%, 62%);
    --ana-3-tag:    hsl(264, 26%, 48%);
    --ana-3-bg:     hsl(264, 33%, 93%);
    --ana-3-border: hsl(264, 33%, 78%);

    --ana-4:        hsl(290, 42%, 49.8%);
    --ana-4-dark:   hsl(290, 50%, 28%);
    --ana-4-chrome: hsl(290, 26%, 64%);
    --ana-4-tag:    hsl(290, 28%, 48%);
    --ana-4-bg:     hsl(290, 30%, 93%);
    --ana-4-border: hsl(290, 33%, 78%);

    --ana-5:        hsl(307, 44.6%, 68.9%);
    --ana-5-dark:   hsl(307, 52%, 32%);
    --ana-5-chrome: hsl(307, 28%, 64%);
    --ana-5-tag:    hsl(307, 30%, 50%);
    --ana-5-bg:     hsl(307, 33%, 93%);
    --ana-5-border: hsl(307, 36%, 80%);

    --ana-6:        hsl(333, 75.4%, 92.1%);
    --ana-6-dark:   hsl(333, 60%, 32%);
    --ana-6-chrome: hsl(333, 34%, 68%);
    --ana-6-tag:    hsl(333, 36%, 52%);
    --ana-6-bg:     hsl(333, 52%, 95%);
    --ana-6-border: hsl(333, 42%, 84%);

    --ana-7:        hsl(320, 46%, 54%);
    --ana-7-dark:   hsl(320, 52%, 28%);
    --ana-7-chrome: hsl(320, 30%, 66%);
    --ana-7-tag:    hsl(320, 32%, 50%);
    --ana-7-bg:     hsl(320, 36%, 93%);
    --ana-7-border: hsl(320, 38%, 80%);

    --accent:          var(--ana-1-dark);
    --accent-tint-04:  hsl(277, 65%, 32%, 0.04);
    --accent-tint-08:  hsl(277, 65%, 32%, 0.08);
    --accent-tint-30:  hsl(277, 65%, 32%, 0.30);
    --accent-tint-35:  hsl(277, 65%, 32%, 0.35);
    --terminal-green:  #28c840;
  }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    background-color: #F7F4EE;
    background-image:
      linear-gradient(#e0ddd6 1px, transparent 1px),
      linear-gradient(90deg, #e0ddd6 1px, transparent 1px);
    background-size: 20px 20px;
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 13px;
    line-height: 1.5;
    color: #1a1a1a;
    min-height: 100vh;
    padding: 34px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- [ ] Verify Tailwind classes work and CSS vars are accessible in browser DevTools

---

## Chunk 2: Static layout components

### Task 3: TerminalChrome component

**Files:**
- Create: `src/components/TerminalChrome.jsx`

The three traffic-light dots + path + status indicator at the top of the page.

- [ ] Create `src/components/TerminalChrome.jsx`:
  ```jsx
  export function TerminalChrome() {
    return (
      <div className="flex items-center gap-1.5 mb-5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="text-[9px] text-[#aaa] ml-2 font-mono">~/jishnu/portfolio — zsh</span>
        <span className="ml-auto text-[9px] text-[var(--terminal-green)] flex items-center gap-1.5">
          <StatusDot />
          open to interesting things
        </span>
      </div>
    )
  }

  function StatusDot() {
    return (
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--terminal-green)] animate-[statusPulse_2s_ease_infinite]" />
    )
  }
  ```
- [ ] Add `statusPulse` keyframe to `index.css`:
  ```css
  @keyframes statusPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(40, 200, 64, 0.5); }
    50%       { box-shadow: 0 0 0 5px rgba(40, 200, 64, 0); }
  }
  ```
- [ ] Import and render in `App.jsx`, verify it displays correctly

---

### Task 4: HeroBox static structure

**Files:**
- Create: `src/components/HeroBox.jsx`

The main card: titlebar with जेदी + nav, name, role, hero footer with CTA.

- [ ] Create `src/components/HeroBox.jsx` with static markup (no animations yet):
  ```jsx
  export function HeroBox() {
    return (
      <div className="border border-[#d0cdc6] rounded-sm mb-6 overflow-hidden bg-[#FAF8F3]">
        <HeroTitlebar />
        <div className="px-7 pt-6 pb-5">
          <BigName />
          <RoleLine />
          <HeroFooter />
        </div>
      </div>
    )
  }

  function HeroTitlebar() {
    return (
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#d0cdc6] text-[9px]">
        <span className="text-[13px] font-bold tracking-wide text-[var(--accent)]">जेदी</span>
        <nav className="flex gap-4 items-center">
          {['work', 'about', 'resume', 'blog'].map(item => (
            <a key={item} href="#" className="text-[#bbb] no-underline text-[8.5px] hover:text-[var(--accent)] transition-colors duration-150">{item}</a>
          ))}
          <a href="https://nudgenow.com" target="_blank" rel="noreferrer"
             className="text-[8.5px] text-[var(--accent)] border border-[var(--accent-tint-35)] px-2 py-0.5 rounded-[2px] hover:bg-[var(--accent-tint-08)] transition-colors duration-150">
            nudge ↗
          </a>
        </nav>
      </div>
    )
  }

  function BigName() {
    return (
      <div className="font-display font-black text-[clamp(50px,7vw,76px)] leading-[0.88] tracking-[-4px] text-[#1a1a1a] mb-4 cursor-default select-none inline-block">
        JISHNU<br />DIWAKAR
      </div>
    )
  }

  function RoleLine() {
    return (
      <div className="flex items-center gap-2.5 mb-3.5 text-xs">
        <span className="font-bold text-[var(--accent)]">Founding Designer</span>
        <span className="text-[#ddd]">·</span>
        <span className="text-[9.5px] text-[#888]">Nudge · IIT Bombay · Bangalore</span>
      </div>
    )
  }

  function HeroFooter() {
    return (
      <div className="border-t border-[#e0ddd6] pt-3 flex items-center gap-3 text-[9px] text-[#bbb]">
        <span className="text-[var(--terminal-green)]">❯</span>
        <span>crafting experiences that just feel right</span>
        <a href="mailto:jishnu@example.com"
           className="ml-auto text-[9px] text-[var(--accent)] border border-[var(--accent-tint-30)] px-3 py-1 rounded-[2px] hover:bg-[var(--accent-tint-08)] hover:translate-x-0.5 transition-all duration-150">
          let's chat ↗
        </a>
      </div>
    )
  }
  ```
- [ ] Import into `App.jsx`, verify static layout matches prototype

---

### Task 5: ProjectsHeader + FilterTags

**Files:**
- Create: `src/components/ProjectsSection.jsx`
- Create: `src/data/projects.js`

- [ ] Create `src/data/projects.js` with all 7 project entries:
  ```js
  export const PROJECTS = [
    {
      id: 'review',
      num: '01',
      category: 'ui/ux',
      duration: '3 weeks',
      title: 'रीView',
      desc: 'Cricket Assistant App — conflict resolution & interactive scoring for semi-pro players and umpires.',
      tags: ['academic', 'research', 'rapid prototyping'],
      skills: ['ux'],
      size: 'featured',   // spans full left col
      colorKey: 'ana-1',
    },
    {
      id: 'csk',
      num: '02',
      category: '3d · client',
      duration: '2 months',
      title: 'CSK Fanzone',
      desc: 'Interactive 3D platform for Chennai Super Kings.',
      tags: ['game design', '3d interaction'],
      skills: ['3d', 'game'],
      size: 'half',
      colorKey: 'ana-2',
    },
    {
      id: 'mood-indigo',
      num: '03',
      category: 'branding',
      duration: '2 months',
      title: 'Mood Indigo',
      desc: 'Brand identity for IIT Bombay\'s cultural fest. 232 appreciations.',
      tags: ['identity', 'design system', 'micro-interactions'],
      skills: ['brand'],
      size: 'half',
      colorKey: 'ana-3',
    },
    {
      id: 'bookmyshow',
      num: '04',
      category: 'ux',
      duration: null,
      title: 'BookMyShow',
      desc: null,
      tags: ['heuristic redesign'],
      skills: ['ux'],
      size: 'small',
      colorKey: 'ana-4',
    },
    {
      id: 'multus',
      num: '05',
      category: 'vr',
      duration: null,
      title: 'Multus',
      desc: null,
      tags: ['vr menus', '6dof'],
      skills: ['3d'],
      size: 'small',
      colorKey: 'ana-5',
    },
    {
      id: 'seven-sands',
      num: '06',
      category: 'game',
      duration: null,
      title: 'Seven Sands',
      desc: null,
      tags: ['strategy', 'thematic'],
      skills: ['game'],
      size: 'small',
      colorKey: 'ana-6',
    },
    {
      id: 'grooveglove',
      num: '07',
      category: 'hci',
      duration: null,
      title: 'GrooveGlove',
      desc: null,
      tags: ['gesture', 'hci'],
      skills: ['ux', '3d'],
      size: 'small',
      colorKey: 'ana-7',
    },
  ]

  export const FILTERS = [
    { label: '■ ui/ux',       value: 'ux' },
    { label: '■ motion',      value: 'motion' },
    { label: '■ 3d + vr',     value: '3d' },
    { label: '■ game design', value: 'game' },
    { label: '■ branding',    value: 'brand' },
  ]
  ```
- [ ] Add `COLOR_MAP` to `projects.js` exporting the per-key CSS vars:
  ```js
  export const COLOR_MAP = {
    'ana-1': { bg: 'var(--ana-1-bg)', border: 'var(--ana-1-border)', chrome: 'var(--ana-1-chrome)', tag: 'var(--ana-1-tag)', title: 'var(--ana-1-dark)' },
    'ana-2': { bg: 'var(--ana-2-bg)', border: 'var(--ana-2-border)', chrome: 'var(--ana-2-chrome)', tag: 'var(--ana-2-tag)', title: 'var(--ana-2)'      },
    'ana-3': { bg: 'var(--ana-3-bg)', border: 'var(--ana-3-border)', chrome: 'var(--ana-3-chrome)', tag: 'var(--ana-3-tag)', title: 'var(--ana-3)'      },
    'ana-4': { bg: 'var(--ana-4-bg)', border: 'var(--ana-4-border)', chrome: 'var(--ana-4-chrome)', tag: 'var(--ana-4-tag)', title: 'var(--ana-4-dark)' },
    'ana-5': { bg: 'var(--ana-5-bg)', border: 'var(--ana-5-border)', chrome: 'var(--ana-5-chrome)', tag: 'var(--ana-5-tag)', title: 'var(--ana-5-dark)' },
    'ana-6': { bg: 'var(--ana-6-bg)', border: 'var(--ana-6-border)', chrome: 'var(--ana-6-chrome)', tag: 'var(--ana-6-tag)', title: 'var(--ana-6-dark)' },
    'ana-7': { bg: 'var(--ana-7-bg)', border: 'var(--ana-7-border)', chrome: 'var(--ana-7-chrome)', tag: 'var(--ana-7-tag)', title: 'var(--ana-7-dark)' },
  }
  ```
- [ ] Verify data file has no syntax errors: `node src/data/projects.js` (or check in browser)

---

### Task 6: ProjectTile component (static)

**Files:**
- Create: `src/components/ProjectTile.jsx`

- [ ] Create `src/components/ProjectTile.jsx`:
  ```jsx
  import { COLOR_MAP } from '../data/projects'

  export function ProjectTile({ project, dimmed }) {
    const c = COLOR_MAP[project.colorKey]
    const boxTop = `┌─ [${project.num}] ${project.category}${project.duration ? ` · ${project.duration}` : ''} ${'─'.repeat(Math.max(2, 18 - project.category.length))}┐`
    const boxBot = `└${'─'.repeat(boxTop.length - 2)}┘`

    return (
      <div
        style={{
          background: c.bg,
          borderColor: c.border,
          '--tile-chrome': c.chrome,
          '--tile-tag': c.tag,
          '--tile-title': c.title,
        }}
        className={[
          'border rounded-sm p-3.5 relative cursor-pointer transition-all duration-200',
          dimmed ? 'opacity-20 grayscale' : '',
        ].join(' ')}
      >
        <span className="absolute top-3 right-3.5 text-[11px] text-[var(--tile-chrome)] transition-transform duration-200">↗</span>
        <div className="text-[8px] leading-none mb-2" style={{ color: 'var(--tile-chrome)' }}>{boxTop}</div>
        <span className="block font-display font-black tracking-tight leading-tight mb-1"
              style={{ color: 'var(--tile-title)', fontSize: project.size === 'featured' ? '20px' : project.size === 'half' ? '15px' : '12px' }}>
          {project.title}
        </span>
        {project.desc && (
          <div className="text-[8.5px] text-[#888] leading-relaxed mb-1.5">{project.desc}</div>
        )}
        <div className="text-[8px] mt-1.5" style={{ color: 'var(--tile-tag)' }}>
          {project.tags.join(' · ')}
        </div>
        <div className="text-[8px] leading-none mt-2" style={{ color: 'var(--tile-chrome)' }}>{boxBot}</div>
      </div>
    )
  }
  ```
- [ ] Verify tile renders with correct colors for each project

---

### Task 7: Projects grid layout

**Files:**
- Modify: `src/components/ProjectsSection.jsx`

- [ ] Write full `ProjectsSection.jsx`:
  ```jsx
  import { useState } from 'react'
  import { PROJECTS, FILTERS } from '../data/projects'
  import { ProjectTile } from './ProjectTile'

  export function ProjectsSection() {
    const [activeFilter, setActiveFilter] = useState(null)

    function toggleFilter(value) {
      setActiveFilter(prev => prev === value ? null : value)
    }

    function isDimmed(project) {
      if (!activeFilter) return false
      return !project.skills.includes(activeFilter)
    }

    const featured = PROJECTS.filter(p => p.size === 'featured')
    const half     = PROJECTS.filter(p => p.size === 'half')
    const small    = PROJECTS.filter(p => p.size === 'small')

    return (
      <section>
        {/* Typewriter header — static for now, animated in Task 10 */}
        <div className="text-[9.5px] text-[#888] mb-3 whitespace-nowrap overflow-hidden">
          <span className="text-[var(--terminal-green)]">❯</span>{' '}
          <span>ls ./projects --sort=featured</span>
        </div>

        {/* Filter tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => toggleFilter(f.value)}
              className={[
                'text-[8.5px] border px-2 py-0.5 rounded-[2px] cursor-pointer transition-all duration-150 bg-[#F7F4EE]',
                activeFilter === f.value
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'border-[#d0cdc6] text-[#888] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-tint-04)]'
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Featured row: रीView left, CSK + Mood Indigo stacked right */}
        <div className="grid gap-2.5 mb-2.5" style={{ gridTemplateColumns: '1.8fr 1fr' }}>
          {featured.map(p => (
            <ProjectTile key={p.id} project={p} dimmed={isDimmed(p)} />
          ))}
          <div className="flex flex-col gap-2.5">
            {half.map(p => (
              <ProjectTile key={p.id} project={p} dimmed={isDimmed(p)} />
            ))}
          </div>
        </div>

        {/* Small tiles row */}
        <div className="grid grid-cols-4 gap-2.5">
          {small.map(p => (
            <ProjectTile key={p.id} project={p} dimmed={isDimmed(p)} />
          ))}
        </div>
      </section>
    )
  }
  ```
- [ ] Import into `App.jsx` and verify grid layout matches prototype

---

### Task 8: Footer

**Files:**
- Create: `src/components/Footer.jsx`

- [ ] Create `src/components/Footer.jsx`:
  ```jsx
  export function Footer() {
    return (
      <footer className="mt-8 pt-4 border-t border-[#d0cdc6] flex justify-between items-center text-[8.5px] text-[#bbb]">
        <span>
          © 2026 Jishnu Diwakar ·{' '}
          <span style={{ color: 'var(--terminal-green)' }}>जेदी</span>
          {' · Founding Designer @ '}
          <a href="https://nudgenow.com" target="_blank" rel="noreferrer"
             style={{ color: 'var(--terminal-green)' }} className="no-underline">
            Nudge
          </a>
        </span>
        <div className="flex gap-4">
          {[
            { label: 'linkedin', href: 'https://linkedin.com/in/jishnu-diwakar-b02a37160' },
            { label: 'behance',  href: 'https://behance.net/jishnuthewalker' },
            { label: 'instagram', href: '#' },
            { label: 'resume ↗', href: '#' },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer"
               className="text-[#bbb] no-underline hover:text-[var(--accent)] transition-colors duration-150">
              {label}
            </a>
          ))}
        </div>
      </footer>
    )
  }
  ```
- [ ] Verify footer renders at bottom of page

---

## Chunk 3: Micro-interactions

### Task 9: Scramble hook + name interaction

**Files:**
- Create: `src/hooks/useScramble.js`
- Modify: `src/components/HeroBox.jsx`

The scramble animation: unrevealed characters show random chars in the element's color, sweeping left-to-right. Name variant sweeps the palette hues.

- [ ] Create `src/hooks/useScramble.js`:
  ```js
  import { useCallback, useRef } from 'react'

  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/\\[]{}}'
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Sweeps through palette hues during scramble
  const PALETTE_HSL = [
    [277, 65, 32],
    [258, 73, 32],
    [264, 45, 41],
    [290, 50, 28],
    [307, 52, 32],
    [333, 60, 32],
    [320, 52, 28],
  ]

  function lerpHSL(a, b, t) {
    let dh = b[0] - a[0]
    if (dh > 180) dh -= 360
    if (dh < -180) dh += 360
    return `hsl(${Math.round(a[0] + dh * t)},${Math.round(a[1] + (b[1]-a[1])*t)}%,${Math.round(a[2] + (b[2]-a[2])*t)}%)`
  }

  export function useScramble() {
    const rafRef = useRef(null)

    const scramble = useCallback((el, target, duration, getColor) => {
      if (!el) return
      if (REDUCED) { el.textContent = target; return }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)

      let start = null
      const lines = target.split('\n')

      function frame(ts) {
        if (!start) start = ts
        const p = Math.min((ts - start) / duration, 1)
        const color = getColor(p)
        let html = ''
        lines.forEach((line, li) => {
          const revealed = Math.floor(p * line.length)
          for (let i = 0; i < line.length; i++) {
            if (line[i] === ' ') { html += ' '; continue }
            if (i < revealed) html += line[i]
            else html += `<span style="color:${color};opacity:0.65">${CHARS[Math.floor(Math.random() * CHARS.length)]}</span>`
          }
          if (li < lines.length - 1) html += '<br>'
        })
        el.innerHTML = html
        if (p < 1) rafRef.current = requestAnimationFrame(frame)
        else el.innerHTML = target.replace('\n', '<br>')
      }
      rafRef.current = requestAnimationFrame(frame)
    }, [])

    const scrambleWithColor = useCallback((el, target, color, duration = 550) => {
      scramble(el, target, duration, () => color)
    }, [scramble])

    const scrambleName = useCallback((el, target, duration = 700) => {
      const steps = PALETTE_HSL.length - 1
      scramble(el, target, duration, p => {
        const scaled = p * steps
        const idx = Math.min(Math.floor(scaled), steps - 1)
        return lerpHSL(PALETTE_HSL[idx], PALETTE_HSL[idx + 1], scaled - idx)
      })
    }, [scramble])

    return { scrambleWithColor, scrambleName }
  }
  ```
- [ ] Wire name scramble into `BigName` in `HeroBox.jsx` using `useRef` + `onMouseEnter`
- [ ] Verify: hover over name → characters scramble through palette hues → resolve to JISHNU / DIWAKAR

---

### Task 10: Tile title scramble

**Files:**
- Modify: `src/components/ProjectTile.jsx`

- [ ] Add `useRef` to title span in `ProjectTile`
- [ ] Add `onMouseEnter` to the tile div that calls `scrambleWithColor(titleRef.current, project.title, c.title)`
- [ ] Use a `running` ref to debounce (don't restart while mid-animation)
- [ ] Verify: hover over any tile → title scrambles in that tile's color → resolves

---

### Task 11: Entry animations

**Files:**
- Modify: `src/components/HeroBox.jsx`
- Modify: `src/components/ProjectsSection.jsx`
- Modify: `src/App.jsx`

All animations start in parallel with small offsets (not chained). Tiles cascade 300ms after typewriter starts.

- [ ] In `HeroBox.jsx`, use Framer Motion `motion.div` with `initial={{ opacity: 0, y: 6 }}` / `animate={{ opacity: 1, y: 0 }}` for `RoleLine` and `HeroFooter` with `delay: 0.3` and `delay: 0.45`
- [ ] Cursor block: animate blink on mount, fade out at 1s:
  ```jsx
  // Use useEffect + setTimeout to set opacity: 0 at 1000ms, then remove
  ```
- [ ] In `ProjectsSection.jsx`, wrap `ProjectTile` with `motion.div` for staggered entry:
  ```jsx
  // FilterRow appears at delay 0.5
  // Each tile: delay = 0.5 + index * 0.07
  // initial: { opacity: 0, y: 8 } → animate: { opacity: 1, y: 0 }
  ```
- [ ] Typewriter: use `useEffect` to type `ls ./projects --sort=featured` char by char at 18+random*16ms
- [ ] Footer fades in at delay 1.2s
- [ ] Verify full page load animation sequence feels like prototype

---

### Task 12: Hover micro-interactions on tiles

**Files:**
- Modify: `src/components/ProjectTile.jsx`

- [ ] Convert tile wrapper to `motion.div`
- [ ] On hover, transition `borderColor` to hovered variant (slightly brighter than resting)
- [ ] Arrow `↗` translates `(2px, -2px)` and changes color to `--tile-title` on hover
- [ ] Status dot (tiny circle next to title) fades in with `statusPulse` animation on hover
- [ ] `whileHover` should NOT re-trigger scramble — scramble is on `onMouseEnter` with debounce

---

### Task 13: Filter tag interaction

**Files:**
- Modify: `src/components/ProjectsSection.jsx`
- Modify: `src/components/ProjectTile.jsx`

- [ ] Active tag: `motion.button` with `whileTap={{ scale: 0.95 }}`
- [ ] Dimmed tiles: `animate={{ opacity: 0.2, filter: 'grayscale(1)' }}`, undimmed: `animate={{ opacity: 1, filter: 'grayscale(0)' }}`
- [ ] Transition: `{ duration: 0.25 }`
- [ ] Verify: click filter → non-matching tiles dim smoothly → click same → all restore

---

## Chunk 4: Polish + deploy-ready

### Task 14: Responsive + font loading

**Files:**
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] Add `<link rel="preconnect">` tags to `index.html`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  ```
- [ ] Add breakpoint: at `<640px`, `grid-cols-4` collapses to `grid-cols-2`:
  ```css
  @media (max-width: 640px) {
    .grid-bottom { grid-template-columns: repeat(2, 1fr); }
    body { padding: 16px; }
  }
  ```
- [ ] Verify at 375px viewport: tiles still readable, no overflow

---

### Task 15: Final wiring in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] `App.jsx` final structure:
  ```jsx
  import { TerminalChrome } from './components/TerminalChrome'
  import { HeroBox }        from './components/HeroBox'
  import { ProjectsSection } from './components/ProjectsSection'
  import { Footer }          from './components/Footer'
  import './index.css'

  export default function App() {
    return (
      <main className="max-w-4xl mx-auto">
        <TerminalChrome />
        <HeroBox />
        <ProjectsSection />
        <Footer />
      </main>
    )
  }
  ```
- [ ] Do a final visual check against `prototype-v1.html` — open both side by side
- [ ] Check DevTools: no console errors, no layout shifts after fonts load, animations play correctly
- [ ] Run `npm run build` — verify output with no errors:
  ```bash
  npm run build
  npm run preview
  ```
  Expected: production build at `http://localhost:4173`, identical to dev

---

## Notes for implementor

- **`zoom: 1.2` is intentionally absent** — all sizes in this plan are the correct final values (prototype used zoom as a hack; we author the right values directly).
- **Box-draw character widths** — `JetBrains Mono` renders these at exactly 1ch each. The top/bottom strings must have identical character counts per tile. Use the same strings from the prototype.
- **`innerHTML` in scramble hook** — this is intentional and safe. All scramble targets are hardcoded strings from `projects.js`, never user input.
- **Framer Motion `animate` prop on dimmed tiles** — don't use CSS `opacity` + `filter` directly. Use Framer's `animate` so the transition is interruptible (clicking a different filter mid-fade should work cleanly).
- **No test suite needed** — this is a static portfolio. Visual verification against the prototype is the acceptance criterion for each task.
