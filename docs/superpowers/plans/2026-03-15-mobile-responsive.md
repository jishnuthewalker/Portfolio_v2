# Mobile Responsive Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the entire portfolio site fully responsive from 320px phones up through desktop, with clean mobile layouts and no horizontal overflow.

**Architecture:** Use Tailwind v4 responsive prefixes (`sm:`, `lg:`) throughout — mobile-first. Body padding is already partially handled (`padding: 4rem` desktop, `padding: 24px` mobile via existing max-width media query). The fixes are surgical per-component changes: reduce paddings at narrow widths, hide decorative overflow elements, collapse grids, and stack flex rows vertically.

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4 (CSS-first `@theme {}`), Framer Motion 12

---

## Chunk 1: Body padding + TerminalChrome + Footer

### Task 1: Responsive body padding (mobile-first CSS rewrite)

**Files:**
- Modify: `src/index.css:169-205`

The current CSS has `body { padding: 4rem }` (desktop default) then overrides with `@media (max-width: 640px) { padding: 24px }`. This leaves a gap: 640px–1023px tablets still get 4rem = 64px padding each side which can be too tight. Convert to mobile-first: default `1.5rem`, then bump up at `sm` and `lg`.

- [ ] **Step 1: Update body padding to mobile-first**

Replace in `src/index.css`:

```css
body {
  background-color: var(--color-bg);
  background-image:
    linear-gradient(var(--color-border-lt) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border-lt) 1px, transparent 1px);
  background-size: 20px 20px;
  font-family: var(--font-mono);
  font-size: 1rem;   /* inherits from html — 16px at default scale */
  line-height: 1.5;
  color: var(--color-ink);
  min-height: 100vh;
  padding: 1.5rem;
}

@media (min-width: 640px) {
  body { padding: 2.5rem; }
}

@media (min-width: 1024px) {
  body { padding: 4rem; }
}
```

Remove the old `@media (max-width: 640px)` block (lines 200–205 approx):
```css
/* REMOVE this entire block: */
/* Responsive: collapse 4-col to 2-col on small screens */
@media (max-width: 640px) {
  body {
    padding: 24px;
  }
}
```

- [ ] **Step 2: Verify no horizontal scroll on 375px**

Open `http://localhost:5173` in dev tools mobile view (375×812). Confirm no horizontal scrollbar on the page at any scroll position.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "fix: mobile-first body padding (1.5rem → 2.5rem → 4rem)"
```

---

### Task 2: TerminalChrome — hide path text and status on mobile

**Files:**
- Modify: `src/components/TerminalChrome.jsx`

On 375px with 24px body padding, available width is ~327px. The path text "~/jishnu/portfolio — zsh" (~25 chars × 8.4px = ~210px) plus the status "open to interesting things" (~25 chars × 8.4px = ~210px) together with "जेदी" overflow the row. Hide both text spans on mobile, show on sm+.

- [ ] **Step 1: Update TerminalChrome**

Replace the full content of `src/components/TerminalChrome.jsx`:

```jsx
export function TerminalChrome() {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      <div className="w-2.5 h-2.5 rounded-full bg-dot-red" />
      <div className="w-2.5 h-2.5 rounded-full bg-dot-yellow" />
      <div className="w-2.5 h-2.5 rounded-full bg-green" />
      <span className="text-base text-subtle ml-2 font-mono hidden sm:inline">~/jishnu/portfolio — zsh</span>
      <span className="ml-auto text-base hidden sm:flex items-center gap-1.5 text-green">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-green"
          style={{
            animation: 'statusPulse 2s ease infinite'
          }}
        />
        open to interesting things
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

At 375px: only traffic lights visible (3 colored dots). At 640px+: path text and status appear.

- [ ] **Step 3: Commit**

```bash
git add src/components/TerminalChrome.jsx
git commit -m "fix: hide terminal path and status text on mobile"
```

---

### Task 3: Footer — stack vertically on mobile

**Files:**
- Modify: `src/components/Footer.jsx:12-44`

Current `flex justify-between items-center` puts copyright and 4 links on one row. At 375px this overflows badly (copyright text ~220px + 4 links ~240px + gaps > 327px). Stack them on mobile with `flex-col`.

- [ ] **Step 1: Update Footer layout**

In `src/components/Footer.jsx`, change the `motion.footer` className from:
```jsx
className="mt-8 pt-4 border-t border-border flex justify-between items-center text-ui text-faint font-mono"
```
to:
```jsx
className="mt-8 pt-4 border-t border-border flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-ui text-faint font-mono"
```

- [ ] **Step 2: Verify**

At 375px: copyright on top, links below (stacked column). At 640px+: side by side.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.jsx
git commit -m "fix: stack footer vertically on mobile"
```

---

## Chunk 2: HeroBox responsive

### Task 4: HeroTitlebar — hide overflow nav items on mobile

**Files:**
- Modify: `src/components/HeroBox.jsx:23-86`

The nav has 6 items: work, about, blog, resume, ⌘K button, nudge ↗. At 375px, available width after "जेदी" label (~76px) is ~235px. All 6 nav items with gap-4 total ~371px — massive overflow. Solution: hide blog, resume, and ⌘K on mobile. Reduce gap to `gap-2 sm:gap-4`.

- [ ] **Step 1: Update HeroTitlebar nav**

Replace the `HeroTitlebar` function in `src/components/HeroBox.jsx`:

```jsx
function HeroTitlebar({ onAboutOpen, onPaletteOpen }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border text-base">
      <span className="text-brand font-bold tracking-wide font-mono text-accent">
        जेदी
      </span>
      <nav className="flex gap-2 sm:gap-4 items-center">
        <a
          href="#projects"
          className="text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
        >
          work
        </a>
        <button
          type="button"
          onClick={onAboutOpen}
          className="text-faint text-ui font-mono transition-colors duration-150 hover:text-accent bg-transparent border-0 cursor-pointer p-0"
        >
          about
        </button>
        <a
          href="https://blog.jishnuthewalker.com"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
        >
          blog
        </a>
        <a
          href="https://drive.google.com/file/d/1RIVWbv4fpKQe4n8QgOEw5IhPWOxXeInc/view?pli=1"
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
        >
          resume
        </a>
        {/* ⌘K / Ctrl+K hint — opens command palette */}
        <button
          type="button"
          onClick={onPaletteOpen}
          className="hidden sm:flex items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0 group"
          title="Open command palette"
        >
          {[/Mac|iPhone|iPad/i.test(typeof navigator !== 'undefined' ? navigator.platform : '') ? '⌘' : 'Ctrl', 'K'].map((k, i) => (
            <kbd
              key={i}
              className="text-sm font-mono px-1 py-0.5 rounded-[2px] leading-none bg-kbd-bg border border-border-lt text-faint group-hover:text-accent group-hover:border-accent-border-2 transition-colors duration-150"
            >
              {k}
            </kbd>
          ))}
        </button>
        <a
          href="https://nudgenow.com"
          target="_blank"
          rel="noreferrer"
          className="text-ui font-mono px-2 py-0.5 rounded-[2px] text-accent border border-accent-border-2 transition-colors duration-150 hover:bg-accent-bg"
        >
          nudge ↗
        </a>
      </nav>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

At 375px: nav shows work, about, nudge ↗ — no overflow. At 640px+: all 6 items visible.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroBox.jsx
git commit -m "fix: hide blog/resume/cmdk nav items on mobile, reduce nav gap"
```

---

### Task 5: HeroBox inner padding + RoleLine flex-wrap

**Files:**
- Modify: `src/components/HeroBox.jsx:8-20` (HeroBox outer), `src/components/HeroBox.jsx:134-149` (RoleLine)

**Issue 1 — Inner padding:** `px-7 pt-6 pb-5` = 28px horizontal on both sides. At 375px this leaves 271px. The name fits (it uses `clamp(60px, 8vw, 90px)` and DIWAKAR 7 chars × ~36px = 252px). But reducing to `px-4 sm:px-7` gives more breathing room.

**Issue 2 — RoleLine overflow:** "Founding Designer · Nudge · IIT Bombay · Bangalore" in a non-wrapping flex row overflows at mobile widths. "Founding Designer" alone is ~227px at text-heading (21px mono). Add `flex-wrap` and hide the separator dot on mobile.

- [ ] **Step 1: Update HeroBox inner padding**

In `HeroBox` function, change:
```jsx
<div className="px-7 pt-6 pb-5">
```
to:
```jsx
<div className="px-4 pt-5 pb-4 sm:px-7 sm:pt-6 sm:pb-5">
```

- [ ] **Step 2: Update RoleLine to flex-wrap**

Replace the `RoleLine` function:

```jsx
function RoleLine() {
  return (
    <motion.div
      className="flex items-center flex-wrap gap-x-2.5 gap-y-1 mb-3.5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <span className="text-heading font-bold font-mono text-accent">
        Founding Designer
      </span>
      <span className="text-dim hidden sm:inline">·</span>
      <span className="text-base text-muted font-mono">Nudge · IIT Bombay · Bangalore</span>
    </motion.div>
  )
}
```

- [ ] **Step 3: Verify**

At 375px: "Founding Designer" on line 1, "Nudge · IIT Bombay · Bangalore" on line 2. No separator dot visible on mobile. At 640px+: single line with dot separator.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroBox.jsx
git commit -m "fix: responsive HeroBox padding and RoleLine flex-wrap for mobile"
```

---

## Chunk 3: ProjectTile + ProjectsSection + TerminalPrompt

### Task 6: ProjectTile — reduce padding, fix box chrome overflow

**Files:**
- Modify: `src/components/ProjectTile.jsx:52` (padding), `src/components/ProjectTile.jsx:76,93` (box chrome)

**Issue 1 — Padding:** `p-7` = 28px each side. At 375px with 2-col bento grid (Task 7): each tile is ~(327 - 12) / 2 = 157px wide. With p-7 that's only 101px content — too tight. With `p-4` = 16px each side: 125px content. Workable.

**Issue 2 — Box chrome overflow:** ASCII box top/bot lines (`┌─ [01] ux ──┐`) are fixed-length strings designed for desktop widths. On mobile they overflow. Add `whitespace-nowrap overflow-hidden` — the line clips cleanly at the tile edge rather than wrapping.

- [ ] **Step 1: Reduce padding and fix box chrome**

In `src/components/ProjectTile.jsx`, change:

Line 52 — tile container className, change `p-7` to `p-4 sm:p-7`:
```jsx
className="rounded-sm p-4 sm:p-7 relative cursor-pointer h-full flex flex-col"
```

Line 76 — box top div, add `whitespace-nowrap overflow-hidden`:
```jsx
<div className="text-sm leading-none mb-2 font-mono whitespace-nowrap overflow-hidden" style={{ color: 'var(--tile-chrome)' }}>{top}</div>
```

Line 93 — box bottom div, add `whitespace-nowrap overflow-hidden`:
```jsx
<div className="text-sm leading-none mt-2 font-mono whitespace-nowrap overflow-hidden" style={{ color: 'var(--tile-chrome)' }}>{bot}</div>
```

- [ ] **Step 2: Verify**

At 375px 2-col bento: tiles have comfortable padding, box chrome lines clip neatly at tile edge (no wrapping, no horizontal scroll). At desktop: identical to before.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectTile.jsx
git commit -m "fix: responsive tile padding (p-4 mobile, p-7 sm+) and nowrap box chrome"
```

---

### Task 7: ProjectsSection — bento grid responsive

**Files:**
- Modify: `src/components/ProjectsSection.jsx:129`

Current bento is `grid grid-cols-3 gap-3`. At 375px, 3 cols = ~(327-24)/3 = 101px per tile — far too narrow for any readable content. Use `grid-cols-2` on mobile.

- [ ] **Step 1: Update bento grid**

In `src/components/ProjectsSection.jsx` line 129, change:
```jsx
<div className="grid grid-cols-3 gap-3 mb-3 grid-flow-row-dense">
```
to:
```jsx
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 grid-flow-row-dense">
```

- [ ] **Step 2: Verify**

At 375px: bento shows 2 columns (~157px each). At 640px+: 3 columns as before. Featured row is already `grid-cols-1 sm:grid-cols-[2.0fr_1fr]` — no change needed.

- [ ] **Step 3: Commit**

```bash
git add src/components/ProjectsSection.jsx
git commit -m "fix: bento grid 2-cols on mobile, 3-cols on sm+"
```

---

### Task 8: TerminalPrompt — reduce padding, hide hint bar on mobile

**Files:**
- Modify: `src/components/TerminalPrompt.jsx:28,95`

`px-7` inner padding matches HeroBox's inner area. Change to `px-4 sm:px-7`. The hint bar (`↑ ↓ history | tab cycle | → accept | esc blur`) is keyboard-only UI — useless on touch devices. Hide on mobile.

- [ ] **Step 1: Update TerminalPrompt padding and hint bar**

In `src/components/TerminalPrompt.jsx`:

Line 28 — outer div className, change `px-7` to `px-4 sm:px-7`:
```jsx
<div
  className="border-t border-border-lt px-4 sm:px-7 py-3 font-mono text-ui cursor-text"
  onClick={() => inputRef.current?.focus()}
>
```

Line 95 — hint bar div, add `hidden sm:flex` (it already uses `flex` via inline layout):
```jsx
<div className="hidden sm:flex items-center gap-3 mt-1.5 select-none text-ghost">
```

- [ ] **Step 2: Verify**

At 375px: terminal prompt shows ❯ input + "let's chat ↗" CTA, no hint bar. At 640px+: hint bar visible. Input area has comfortable 16px horizontal padding on mobile.

- [ ] **Step 3: Commit**

```bash
git add src/components/TerminalPrompt.jsx
git commit -m "fix: reduce TerminalPrompt padding on mobile, hide hint bar"
```

---

## Chunk 4: Modals polish

### Task 9: ProjectModal — tighter wrapper padding on mobile

**Files:**
- Modify: `src/components/ProjectModal.jsx:93,121`

The centering wrapper has `p-5` (20px) — fine for most screens. On very small phones (320px) the modal has 280px content width. Change to `p-3 sm:p-5`. Also bump max-height slightly for mobile.

- [ ] **Step 1: Update centering wrapper**

In `src/components/ProjectModal.jsx`:

Line 93 — change `p-5` to `p-3 sm:p-5`:
```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none">
```

Line 121 — update max-h for mobile:
```jsx
<div className="overflow-y-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)]">
```

- [ ] **Step 2: Update modal title clamp for mobile**

Line 133 — reduce minimum clamp size so long project titles don't overflow on small phones:
```jsx
style={{ color: c.title, fontSize: 'clamp(1.875rem, 6.75vw, 3.9375rem)' }}
```

The original `clamp(2.625rem, 6.75vw, 3.9375rem)` has a 42px minimum. On 320px with 6px padding, a title like "BookMyShow" (10 chars) at 42px × ~0.55 char ratio = ~231px would overflow the ~300px panel. New minimum 30px (1.875rem) gives 10 chars × ~16.5px = 165px — fits comfortably. Only the minimum changes; preferred value `6.75vw` and maximum `3.9375rem` are unchanged so desktop rendering is unaffected.

- [ ] **Step 3: Verify**

At 320px: modal opens with comfortable margins, long project titles fit without overflow. Content scrolls properly.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectModal.jsx
git commit -m "fix: tighter modal wrapper padding on mobile, smaller title clamp minimum"
```

---

## Final verification checklist

After all tasks:

- [ ] **375px (iPhone SE):** No horizontal scroll anywhere. Nav shows work/about/nudge only. RoleLine wraps cleanly. Bento is 2 cols. Footer stacks. Terminal prompt has no hint bar. Modals open without overflow.
- [ ] **640px (tablet):** All nav items visible. Bento 3 cols. Footer side-by-side. Hint bar visible.
- [ ] **1280px (desktop):** Identical to before — all changes are mobile-only via responsive prefixes.
- [ ] **320px (smallest):** Modal titles fit. No overflow.
- [ ] Run `npm run build` to confirm no build errors.
