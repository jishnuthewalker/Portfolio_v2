# Portfolio Content Roadmap Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build out all portfolio content: project case study modals for 8 projects, About modal, Motion Showcase section, wired nav/footer links.

**Architecture:** State lifted to App.jsx (activeProjectId, aboutOpen). Modal overlays share a common backdrop/close pattern via `useModal` hook. MotionSection is a new standalone component below ProjectsSection.

**Tech Stack:** React 19, Framer Motion 12, Tailwind CSS v4, Vite 7. No test framework — verify via `npm run dev` + browser.

**Spec:** `docs/superpowers/specs/2026-03-11-portfolio-content-roadmap-design.md`

---

## Chunk 1: Foundation — Data, Colors, Nav, Footer

### Task 1: Add `--ana-8` color token for Prosper

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Add ana-8 CSS custom properties to `:root`**

  Open `src/index.css`. After the `--ana-7` block (line 57), add:

  ```css
  --ana-8:        hsl(346, 48%, 56%);
  --ana-8-dark:   hsl(346, 55%, 28%);
  --ana-8-chrome: hsl(346, 28%, 64%);
  --ana-8-tag:    hsl(346, 30%, 50%);
  --ana-8-bg:     hsl(346, 36%, 93%);
  --ana-8-border: hsl(346, 38%, 80%);
  ```

---

### Task 2: Add `COLOR_MAP` entry + Prosper project to `projects.js`

**Files:**
- Modify: `src/data/projects.js`

- [ ] **Step 1: Add `ana-8` to `COLOR_MAP`**

  In `src/data/projects.js`, after the `'ana-7'` entry in `COLOR_MAP`, add:

  ```js
  'ana-8': { bg: 'var(--ana-8-bg)', border: 'var(--ana-8-border)', chrome: 'var(--ana-8-chrome)', tag: 'var(--ana-8-tag)', title: 'var(--ana-8-dark)', borderRest: 'hsl(346, 38%, 80%)', borderHover: 'hsl(346, 55%, 28%)' },
  ```

- [ ] **Step 2: Add Prosper to `PROJECTS` array**

  At the end of the `PROJECTS` array, before the closing `]`, add:

  ```js
  {
    id: 'prosper',
    num: '08',
    category: 'game · 1 month',
    title: 'Prosper',
    desc: null,
    tags: ['board game', 'educational', 'strategy'],
    skills: ['game'],
    size: 'small',
    colorKey: 'ana-8',
  },
  ```

- [ ] **Step 3: Remove `motion` from `FILTERS` array**

  Delete the `{ label: '■ motion', value: 'motion' }` entry from the `FILTERS` array. Result should be 4 filters: `ux`, `3d`, `game`, `brand`.

- [ ] **Step 4: Verify in browser**

  Run `npm run dev`. Small tile grid should now show 5 tiles (4 existing + Prosper). Motion filter button should be gone. Confirm no console errors.

- [ ] **Step 5: Commit both Tasks 1 and 2 together**

  ```bash
  git add src/index.css src/data/projects.js
  git commit -m "feat: add Prosper project and ana-8 color token, remove motion filter"
  ```

---

### Task 3: Wire nav links in HeroBox + fix footer

**Files:**
- Modify: `src/components/ProjectsSection.jsx`
- Modify: `src/components/HeroBox.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Add `id="projects"` anchor to `ProjectsSection` wrapper**

  Open `src/components/ProjectsSection.jsx`. Change the opening `<section>` tag to:

  ```jsx
  <section id="projects">
  ```

- [ ] **Step 2: Update nav links in `HeroBox.jsx`**

  In `HeroBoxTitlebar`, replace the nav link map. The `work` link needs smooth scroll. `about` needs an `onClick` prop (passed from parent). `blog` and `resume` need real hrefs.

  First, update `HeroTitlebar` to accept an `onAboutOpen` prop:

  ```jsx
  function HeroTitlebar({ onAboutOpen }) {
  ```

  Replace the nav links map with individual links:

  ```jsx
  <nav className="flex gap-4 items-center">
    <a
      href="#projects"
      className="text-[#bbb] no-underline text-[8.5px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
    >
      work
    </a>
    <button
      type="button"
      onClick={onAboutOpen}
      className="text-[#bbb] text-[8.5px] font-mono transition-colors duration-150 hover:text-[var(--accent)] bg-transparent border-0 cursor-pointer p-0"
    >
      about
    </button>
    <a
      href="https://blog.jishnuthewalker.com"
      target="_blank"
      rel="noreferrer"
      className="text-[#bbb] no-underline text-[8.5px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
    >
      blog
    </a>
    <a
      href="#"
      target="_blank"
      rel="noreferrer"
      className="text-[#bbb] no-underline text-[8.5px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
      id="resume-link"
    >
      resume
    </a>
    <a
      href="https://nudgenow.com"
      target="_blank"
      rel="noreferrer"
      className="text-[8.5px] font-mono px-2 py-0.5 rounded-[2px] transition-colors duration-150"
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
  ```

  Then update `HeroBox` to accept and forward `onAboutOpen`. Change only the function signature and the `<HeroTitlebar>` line — keep `<HeroTitlebar onAboutOpen={onAboutOpen} />` and leave the rest of the JSX (BigName, RoleLine, HeroFooter) exactly as-is:

  ```jsx
  export function HeroBox({ onAboutOpen }) {
    return (
      <div className="border border-[#d0cdc6] rounded-sm mb-6 overflow-hidden bg-[#FAF8F3]">
        <HeroTitlebar onAboutOpen={onAboutOpen} />
        <div className="px-7 pt-6 pb-5">
          <BigName />
          <RoleLine />
          <HeroFooter />
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 3: Fix footer links**

  Open `src/components/Footer.jsx`. Update `LINKS` array:

  ```js
  const LINKS = [
    { label: 'linkedin',  href: 'https://linkedin.com/in/jishnu-diwakar-b02a37160' },
    { label: 'behance',   href: 'https://behance.net/jishnuthewalker' },
    { label: 'instagram', href: 'https://instagram.com/jishnuthewalker/' },
    { label: 'resume ↗', href: '#' },  // user will provide URL — leave as # for now
  ]
  ```

- [ ] **Step 4: Verify in browser**

  - Clicking `work` should smooth-scroll to the projects section
  - Clicking `blog` should open `blog.jishnuthewalker.com` in new tab
  - Instagram footer link should open `instagram.com/jishnuthewalker/`
  - `about` button doesn't work yet (no modal) — that's fine, no errors

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/HeroBox.jsx src/components/Footer.jsx src/components/ProjectsSection.jsx
  git commit -m "feat: wire nav links and fix footer social links"
  ```

---

## Chunk 2: Modal Infrastructure

### Task 4: Create `useModal` hook

**Files:**
- Create: `src/hooks/useModal.js`

- [ ] **Step 1: Write the hook**

  Create `src/hooks/useModal.js`:

  ```js
  import { useEffect, useCallback } from 'react'

  /**
   * Shared modal behaviour: Escape key close, body scroll lock.
   * @param {boolean} isOpen
   * @param {() => void} onClose
   */
  export function useModal(isOpen, onClose) {
    const handleKeyDown = useCallback((e) => {
      if (e.key === 'Escape') onClose()
    }, [onClose])

    useEffect(() => {
      if (!isOpen) return
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleKeyDown)
      }
    }, [isOpen, handleKeyDown])
  }
  ```

- [ ] **Step 2: Verify no import errors**

  The hook isn't wired anywhere yet. Just confirm the file is syntactically valid — dev server should still compile cleanly.

---

### Task 5: Add modal state to `App.jsx` and wire `HeroBox`

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add modal state to App**

  Replace `src/App.jsx` with the following. `MotionSection`, `ProjectModal`, and `AboutModal` will be added in later tasks — they are intentionally absent here:

  ```jsx
  import { useState } from 'react'
  import { TerminalChrome }  from './components/TerminalChrome'
  import { HeroBox }         from './components/HeroBox'
  import { ProjectsSection } from './components/ProjectsSection'
  import { Footer }          from './components/Footer'

  export default function App() {
    const [activeProjectId, setActiveProjectId] = useState(null)
    const [aboutOpen, setAboutOpen] = useState(false)

    return (
      <main className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh_-_68px)]">
        <TerminalChrome />
        <HeroBox onAboutOpen={() => setAboutOpen(true)} />
        <ProjectsSection onOpenProject={setActiveProjectId} />
        <div className="flex-1" />
        <Footer />
      </main>
    )
  }
  ```

- [ ] **Step 2: Thread `onOpenProject` through `ProjectsSection` to `ProjectTile`**

  Open `src/components/ProjectsSection.jsx`. Add `onOpenProject` prop:

  ```jsx
  export function ProjectsSection({ onOpenProject }) {
  ```

  Pass it to every `<ProjectTile>`:

  ```jsx
  <ProjectTile project={p} dimmed={isDimmed(p)} onOpen={() => onOpenProject(p.id)} />
  ```

  (Do this for all three grid sections: featured, half, small.)

- [ ] **Step 3: Wire `onClick` in `ProjectTile`**

  Open `src/components/ProjectTile.jsx`. Add `onOpen` prop to `ProjectTile`:

  ```jsx
  export function ProjectTile({ project, dimmed = false, onOpen }) {
  ```

  Add `onClick` and fix `onKeyDown` on the `motion.div`:

  ```jsx
  onClick={onOpen}
  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen?.() }}
  ```

- [ ] **Step 4: Verify in browser**

  Open dev tools console. Click a tile — no modal yet, but no errors should appear. To confirm state is updating, open the React DevTools browser extension and inspect the `App` component's `activeProjectId` state — it should change on each tile click.

- [ ] **Step 5: Commit**

  ```bash
  git add src/App.jsx src/components/ProjectsSection.jsx src/components/ProjectTile.jsx src/hooks/useModal.js
  git commit -m "feat: add modal state to App, wire tile onClick, add useModal hook"
  ```

---

## Chunk 3: Project Modal

### Task 6: Add `caseStudy` data stubs to all 8 projects

**Files:**
- Modify: `src/data/projects.js`

- [ ] **Step 1: Add `caseStudy` field to each project**

  Add a `caseStudy` field to every project object. रीView and BookMyShow get real content (provided in this step below). Others get stubs for now.

  **Stub template** (use for all 6: CSK Fanzone, Mood Indigo, Multus, Seven Sands, GrooveGlove, Prosper):
  ```js
  caseStudy: {
    role: 'Designer',
    duration: '— weeks',
    type: '—',
    problem: { text: 'Coming soon.', images: [] },
    process: { text: 'Coming soon.', images: [] },
    outcome: { text: 'Coming soon.', images: [] },
  },
  ```

  **रीView** — port from live site `/review` page content:
  ```js
  caseStudy: {
    role: 'UX Researcher & Designer',
    duration: '3 weeks',
    type: 'Academic',
    problem: {
      text: 'Cricket at semi-professional levels suffers from frequent scoring disputes and umpiring errors. Players and umpires lack tools to resolve conflicts quickly and accurately during live matches.',
      images: [],
    },
    process: {
      text: 'Conducted user research with semi-pro players and umpires. Ran rapid prototyping sprints to explore conflict resolution flows and interactive scoring interfaces. Iterated on low and high-fidelity prototypes based on feedback.',
      images: [],
    },
    outcome: {
      text: 'Review — a Cricket Assistant App that provides real-time scoring, conflict resolution prompts, and umpire decision support. Designed for quick, one-handed use during live play.',
      images: [],
    },
  },
  ```

  **BookMyShow** — port from live site `/bms` page content:
  ```js
  caseStudy: {
    role: 'UX Designer',
    duration: '2 weeks',
    type: 'Academic · Heuristic Redesign',
    problem: {
      text: 'BookMyShow\'s existing app has ergonomic issues — key actions are hard to reach, information hierarchy is cluttered, and the booking flow has unnecessary friction.',
      images: [],
    },
    process: {
      text: 'Applied Nielsen\'s 10 usability heuristics to audit the existing app. Identified the top pain points and redesigned the core booking flow with improved thumb-zone targeting and cleaner visual hierarchy.',
      images: [],
    },
    outcome: {
      text: 'A redesigned BookMyShow experience with improved ergonomics, clearer information architecture, and a streamlined seat-selection and checkout flow.',
      images: [],
    },
  },
  ```

- [ ] **Step 2: Verify no console errors in dev server**

  No visual change yet. Dev server should still compile cleanly.

---

### Task 7: Build `ProjectModal` component

**Files:**
- Create: `src/components/ProjectModal.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `ProjectModal.jsx`**

  Create `src/components/ProjectModal.jsx`:

  ```jsx
  import { useCallback } from 'react'
  import { motion, AnimatePresence } from 'framer-motion'
  import { PROJECTS, COLOR_MAP } from '../data/projects'
  import { useModal } from '../hooks/useModal'

  export function ProjectModal({ projectId, onClose }) {
    const project = PROJECTS.find(p => p.id === projectId)
    const isOpen = !!project

    useModal(isOpen, onClose)

    if (!project) return null

    const c = COLOR_MAP[project.colorKey]
    const cs = project.caseStudy

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Modal panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} case study`}
              className="fixed inset-x-4 top-8 bottom-8 z-50 overflow-y-auto rounded-sm md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
              style={{ background: '#FAF8F3', border: `1px solid ${c.borderHover}` }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[8px] font-mono mb-1.5" style={{ color: c.chrome }}>
                      {`┌─ [${project.num}] ${project.category} `}
                    </div>
                    <h2
                      className="font-display font-black leading-tight tracking-tight"
                      style={{ color: c.title, fontSize: 'clamp(28px, 5vw, 40px)' }}
                    >
                      {project.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[9px] font-mono text-[#bbb] hover:text-[#555] transition-colors duration-150 ml-4 mt-1 flex-shrink-0"
                  >
                    ✕ close
                  </button>
                </div>

                {/* Metadata chips */}
                <div className="flex gap-2 flex-wrap mb-6">
                  {[
                    { label: 'ROLE', value: cs.role },
                    { label: 'DURATION', value: cs.duration },
                    { label: 'TYPE', value: cs.type },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="text-[8px] font-mono px-2.5 py-1.5 rounded-[2px]"
                      style={{ background: c.bg, border: `1px solid ${c.borderRest}` }}
                    >
                      <div style={{ color: c.chrome }} className="mb-0.5">{label}</div>
                      <div style={{ color: c.title }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Sections */}
                {[
                  { key: 'problem', label: 'problem' },
                  { key: 'process', label: 'process' },
                  { key: 'outcome', label: 'outcome' },
                ].map(({ key, label }) => (
                  <div key={key} className="mb-6">
                    <div
                      className="flex items-center gap-2 text-[9px] font-mono font-bold mb-2"
                      style={{ color: c.title }}
                    >
                      <span style={{ color: 'var(--terminal-green)' }}>❯</span>
                      {label}
                    </div>
                    <p className="text-[11px] font-mono text-[#555] leading-relaxed">
                      {cs[key].text}
                    </p>
                    {cs[key].images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {cs[key].images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt=""
                            className="w-full rounded-[2px] object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Tags footer */}
                <div className="text-[8px] font-mono mt-4 pt-4 border-t" style={{ borderColor: c.borderRest, color: c.tag }}>
                  {project.tags.join(' · ')}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }
  ```

- [ ] **Step 2: Add `ProjectModal` to `App.jsx`**

  Update `App.jsx` to import and render the modal:

  ```jsx
  import { useState } from 'react'
  import { TerminalChrome }   from './components/TerminalChrome'
  import { HeroBox }          from './components/HeroBox'
  import { ProjectsSection }  from './components/ProjectsSection'
  import { Footer }           from './components/Footer'
  import { ProjectModal }     from './components/ProjectModal'

  export default function App() {
    const [activeProjectId, setActiveProjectId] = useState(null)
    const [aboutOpen, setAboutOpen] = useState(false)

    return (
      <main className="max-w-4xl mx-auto flex flex-col min-h-[calc(100vh_-_68px)]">
        <TerminalChrome />
        <HeroBox onAboutOpen={() => setAboutOpen(true)} />
        <ProjectsSection onOpenProject={setActiveProjectId} />
        <div className="flex-1" />
        <Footer />
        <ProjectModal
          projectId={activeProjectId}
          onClose={() => setActiveProjectId(null)}
        />
      </main>
    )
  }
  ```

- [ ] **Step 3: Verify in browser**

  - Click any project tile → modal should slide up with the project's color scheme
  - Click `✕ close` → modal should close
  - Press `Escape` → modal should close
  - Click backdrop → modal should close
  - Tab through modal content (keyboard navigation should work)
  - Check on mobile width (< 640px) — modal should fill the screen

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/ProjectModal.jsx src/App.jsx
  git commit -m "feat: add ProjectModal with structured case study layout for all 8 projects"
  ```

---

## Chunk 4: About Modal

### Task 8: Build `AboutModal` component

**Files:**
- Create: `src/components/AboutModal.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `AboutModal.jsx`**

  Create `src/components/AboutModal.jsx`:

  ```jsx
  import { motion, AnimatePresence } from 'framer-motion'
  import { useModal } from '../hooks/useModal'

  const SOCIAL_LINKS = [
    { label: 'linkedin',  href: 'https://linkedin.com/in/jishnu-diwakar-b02a37160/' },
    { label: 'instagram', href: 'https://instagram.com/jishnuthewalker/' },
    { label: 'behance',   href: 'https://behance.net/jishnuthewalker' },
    { label: 'vimeo',     href: 'https://vimeo.com/showcase/6308449' },
    { label: 'email',     href: 'mailto:jishnu@hey.com' },
  ]

  const BIO = [
    "I'm Jishnu— a little awkward, definitely quirky, and always curious. I enjoy stepping out of my comfort zone—trying new things (like salsa dancing!), meeting new people, and learning whatever sparks my interest.",
    "I'm a designer and tech enthusiast who loves creating experiences that just feel right. Whether it's UI/UX design, 3D animation, motion graphics, or game design, I'm always exploring how to combine creativity and functionality to make something that truly connects with people.",
    "When I'm not creating, you'll probably find me trekking, watching anime, vibing to Indian hip-hop, or enjoying some quiet time with nature and a strong cup of coffee.",
  ]

  export function AboutModal({ isOpen, onClose }) {
    useModal(isOpen, onClose)

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
            />

            {/* Modal panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="About Jishnu"
              className="fixed inset-x-4 top-8 bottom-8 z-50 overflow-y-auto rounded-sm md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl"
              style={{
                background: '#FAF8F3',
                border: '1px solid var(--ana-1-border)',
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar — replace src with actual photo path when available */}
                    <div
                      className="w-14 h-14 rounded-[2px] flex-shrink-0 overflow-hidden"
                      style={{ border: '1px solid var(--ana-1-border)', background: 'var(--ana-1-bg)' }}
                    >
                      <img
                        src="/avatar.jpg"
                        alt="Jishnu Diwakar"
                        className="w-full h-full object-cover"
                        onError={e => { e.currentTarget.style.display = 'none' }}
                      />
                    </div>
                    <div>
                      <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--ana-1-chrome)' }}>
                        ┌─ about ──────────────
                      </div>
                      <h2
                        className="font-display font-black leading-tight tracking-tight"
                        style={{ color: 'var(--accent)', fontSize: 'clamp(22px, 4vw, 30px)' }}
                      >
                        जेदी
                      </h2>
                      <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--ana-1-tag)' }}>
                        Founding Designer @ Nudge · IIT Bombay · Bangalore
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[9px] font-mono text-[#bbb] hover:text-[#555] transition-colors duration-150 ml-4 mt-1 flex-shrink-0"
                  >
                    ✕ close
                  </button>
                </div>

                {/* Bio */}
                <div className="space-y-3 mb-6">
                  {BIO.map((para, i) => (
                    <p key={i} className="text-[11px] font-mono text-[#555] leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Social links */}
                <div
                  className="border-t pt-4"
                  style={{ borderColor: 'var(--ana-1-border)' }}
                >
                  <div className="text-[8px] font-mono mb-3" style={{ color: 'var(--ana-1-chrome)' }}>
                    ❯ find me on
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SOCIAL_LINKS.map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target={href.startsWith('mailto') ? undefined : '_blank'}
                        rel="noreferrer"
                        className="text-[8.5px] font-mono px-2.5 py-1 rounded-[2px] no-underline transition-all duration-150"
                        style={{
                          color: 'var(--accent)',
                          border: '1px solid var(--accent-tint-30)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-tint-08)'}
                        onMouseLeave={e => e.currentTarget.style.background = ''}
                      >
                        {label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    )
  }
  ```

- [ ] **Step 2: Add `AboutModal` to `App.jsx`**

  ```jsx
  import { AboutModal } from './components/AboutModal'
  ```

  Add inside the return, after `<ProjectModal .../>`:

  ```jsx
  <AboutModal isOpen={aboutOpen} onClose={() => setAboutOpen(false)} />
  ```

- [ ] **Step 3: Verify in browser**

  - Click `about` in the nav → modal slides up with bio and social links
  - Press `Escape` → closes
  - Click backdrop → closes
  - All social links should open correct URLs

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/AboutModal.jsx src/App.jsx
  git commit -m "feat: add AboutModal with bio and social links"
  ```

---

## Chunk 5: Motion Showcase Section

### Task 9: Create motion video data

**Files:**
- Create: `src/data/motion.js`

- [ ] **Step 1: Collect video embed URLs from live Framer site**

  Visit `https://jishnuthewalker.framer.website/` and note the iframe `src` URLs in the Motion Showcase section. These are Instagram Reels or Vimeo embed URLs.

  **Before creating the file:** Visit `https://jishnuthewalker.framer.website/`, open DevTools → Elements, and locate each `<iframe>` in the Motion Showcase section. Copy its `src` attribute — these are the real embed URLs. Only create `src/data/motion.js` once you have the actual URLs. Do not commit placeholder strings.

  Structure (fill in actual URLs):

  ```js
  export const MOTION_VIDEOS = [
    { id: 'motion-1', embedUrl: '<REAL_EMBED_URL>', platform: 'instagram', title: '<TITLE>' },
    { id: 'motion-2', embedUrl: '<REAL_EMBED_URL>', platform: 'instagram', title: '<TITLE>' },
    // one entry per video found on the live site
  ]
  ```

  **Note:** Instagram embed URLs follow the pattern `https://www.instagram.com/p/<POST_ID>/embed/`. Vimeo: `https://player.vimeo.com/video/<VIDEO_ID>`.

- [ ] **Step 2: Verify no placeholder strings remain**

  Run the following — it must return no output (zero matches):

  ```bash
  grep -n "PLACEHOLDER\|<REAL_EMBED\|<TITLE>" src/data/motion.js
  ```

  If any matches appear, replace them with real URLs before proceeding.

---

### Task 10: Build `MotionSection` component

**Files:**
- Create: `src/components/MotionSection.jsx`
- Modify: `src/index.css`
- Modify: `src/App.jsx`

- [ ] **Step 1: Add masonry CSS to `index.css`**

  Add after the `@media (max-width: 640px)` block. Uses `grid-template-rows: masonry` (CSS Grid Level 3, supported in Firefox with flag and Safari TP) as the primary path, with `column-count` as the broad-support fallback:

  ```css
  /* Motion section masonry grid — column-count fallback */
  .motion-masonry {
    columns: 3;
    column-gap: 10px;
  }

  .motion-masonry-item {
    break-inside: avoid;
    margin-bottom: 10px;
  }

  /* Native CSS masonry where supported */
  @supports (grid-template-rows: masonry) {
    .motion-masonry {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: masonry;
      gap: 10px;
      columns: unset;
      column-gap: unset;
    }

    .motion-masonry-item {
      break-inside: unset;
      margin-bottom: 0;
    }
  }

  @media (max-width: 640px) {
    .motion-masonry { columns: 2; }
    @supports (grid-template-rows: masonry) {
      .motion-masonry { grid-template-columns: repeat(2, 1fr); columns: unset; }
    }
  }
  ```

- [ ] **Step 2: Create `MotionSection.jsx`**

  Create `src/components/MotionSection.jsx`:

  ```jsx
  import { useState, useEffect } from 'react'
  import { motion } from 'framer-motion'
  import { MOTION_VIDEOS } from '../data/motion'

  export function MotionSection() {
    const [typedCmd, setTypedCmd] = useState('')
    const [showCursor, setShowCursor] = useState(true)
    const [visible, setVisible] = useState(false)

    const CMD = 'ls ./motion --type=reel'

    useEffect(() => {
      let cancelled = false
      const tileTimer = setTimeout(() => setVisible(true), 300)
      const startTimer = setTimeout(() => {
        let i = 0
        function type() {
          if (cancelled) return
          if (i < CMD.length) {
            setTypedCmd(CMD.slice(0, ++i))
            setTimeout(type, 18 + Math.random() * 16)
          } else {
            setShowCursor(false)
          }
        }
        type()
      }, 200)
      return () => {
        cancelled = true
        clearTimeout(tileTimer)
        clearTimeout(startTimer)
      }
    }, [])

    return (
      <section className="mt-8">
        {/* Typewriter header */}
        <div className="text-[9.5px] text-[#888] mb-3 whitespace-nowrap overflow-hidden font-mono">
          <span style={{ color: 'var(--terminal-green)' }}>❯</span>{' '}
          <span>{typedCmd}</span>
          {showCursor && (
            <span style={{ color: 'hsl(277,65%,32%)', animation: 'blink 1s step-end infinite' }}>█</span>
          )}
        </div>

        {/* Masonry grid */}
        <motion.div
          className="motion-masonry"
          initial={{ opacity: 0 }}
          animate={visible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {MOTION_VIDEOS.map(video => (
            <div key={video.id} className="motion-masonry-item">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full rounded-[2px]"
                style={{
                  border: '1px solid var(--ana-1-border)',
                  aspectRatio: video.platform === 'instagram' ? '9/16' : '16/9',
                  display: 'block',
                }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </section>
    )
  }
  ```

- [ ] **Step 3: Add `MotionSection` to `App.jsx`**

  Add the import and usage:

  ```jsx
  import { MotionSection } from './components/MotionSection'
  ```

  In the return:

  ```jsx
  <ProjectsSection onOpenProject={setActiveProjectId} />
  <MotionSection />
  <div className="flex-1" />
  ```

- [ ] **Step 4: Verify in browser**

  - Motion section should appear below project tiles
  - Typewriter header types out the command
  - Video grid appears in masonry layout
  - On mobile (< 640px) grid collapses to 2 columns
  - Videos load lazily (check Network tab — iframes shouldn't all load at once)

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/MotionSection.jsx src/data/motion.js src/index.css src/App.jsx
  git commit -m "feat: add MotionSection with masonry video grid"
  ```

---

## Chunk 6: Final Wiring & Resume Link

### Task 11: Wire resume link when URL is provided

**Files:**
- Modify: `src/components/HeroBox.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Update resume `href` in `HeroBox.jsx`**

  Find the resume link (currently `href="#"` with `id="resume-link"`). Replace `href="#"` with the actual resume URL provided by the user. Remove the `id` attribute.

- [ ] **Step 2: Update resume `href` in `Footer.jsx`**

  In the `LINKS` array, replace `href: '#'` on the `resume ↗` entry with the actual URL. Add `target: '_blank'` attribute in the link map:

  ```jsx
  {...(href !== '#' ? { target: '_blank', rel: 'noreferrer' } : {})}
  ```

  (This is already in the existing Footer link map — it will automatically apply once `#` is replaced.)

- [ ] **Step 3: Verify in browser**

  Resume link in nav and footer both open the resume in a new tab.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/HeroBox.jsx src/components/Footer.jsx
  git commit -m "feat: wire resume link in nav and footer"
  ```

---

## Final Verification Checklist

Run through this in the browser before considering the work done:

- [ ] All 8 project tiles clickable — modal opens with correct color scheme
- [ ] Escape key closes any open modal
- [ ] Backdrop click closes any open modal
- [ ] `work` nav link smooth-scrolls to projects
- [ ] `about` nav link opens About modal with bio
- [ ] `blog` nav link opens `blog.jishnuthewalker.com` in new tab
- [ ] `resume` nav link opens resume in new tab
- [ ] Footer Instagram link opens `instagram.com/jishnuthewalker/`
- [ ] Footer resume link works
- [ ] Motion section visible below projects with masonry video grid
- [ ] Prosper tile appears in small grid with correct color
- [ ] Motion filter button is gone from filter row
- [ ] `npm run build` completes with no errors
- [ ] Mobile layout (360px width) — all modals fill screen cleanly

---

## Notes

- **Resume URL**: awaiting from user — Task 11 blocked until provided
- **Case study images**: stubs use empty `images: []` arrays. Add image paths to `caseStudy.*.images` in `projects.js` as assets become available — `ProjectModal` renders them automatically
- **Motion video URLs**: must be collected manually from live Framer site — Task 10 is blocked until Task 9 Step 1 is completed
- **Mood Indigo**: currently stubbed as "Coming soon" but has real content available at `jishnuthewalker.framer.website` and Behance. First candidate to upgrade after BookMyShow
- **Prosper, CSK, Multus, Seven Sands, GrooveGlove**: stubbed — content to be ported from Behance galleries
- **About modal avatar**: `src="/avatar.jpg"` — place a square photo at `public/avatar.jpg`. The `onError` handler hides the img if the file is missing, so the modal degrades gracefully until the photo is added
