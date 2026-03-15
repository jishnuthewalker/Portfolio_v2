# Design Token System Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all scattered hard-coded px values, hex colors, and rgba() literals across every component with a unified, semantic design token system so the entire UI can be rescaled or recolored by changing one value.

**Architecture:** All tokens are defined in `src/index.css`'s `@theme {}` block (Tailwind v4 CSS-first config), which automatically generates Tailwind utility classes from every `--text-*` and `--color-*` variable. Typography uses `rem` units anchored to `html { font-size }` as the single global scale knob. Hover effects currently handled by JS `onMouseEnter`/`onMouseLeave` event handlers are replaced with declarative Tailwind `hover:` and `group-hover:` classes wherever the hover target is the element itself (no JS logic involved).

**Tech Stack:** React 19, Vite 7, Tailwind CSS v4 (CSS-first `@theme {}`), JetBrains Mono + Inter via Google Fonts.

---

## Token Reference

Keep this section open while executing all tasks — it is the single source of truth for every replacement.

### Typography mapping

| Current arbitrary class | New Tailwind class | px @ html 16px |
|---|---|---|
| `text-[12px]` | `text-xs` | 12px |
| `text-[14px]` | `text-sm` | 14px |
| `text-[15px]` | `text-ui` | 15px |
| `text-[16px]` | `text-base` | 16px |
| `text-[18px]` | `text-lg` | 18px |
| `text-[20px]` | `text-xl` | 20px |
| `text-[21px]` | `text-heading` | 21px |
| `text-[23px]` | `text-brand` | 23px |

Tile titles (inline `fontSize` style in ProjectTile, computed from `project.size`):

| Current value | New CSS-variable value |
|---|---|
| `'35px'` | `'var(--text-tile-lg)'` |
| `'27px'` | `'var(--text-tile-md)'` |
| `'21px'` | `'var(--text-tile-sm)'` |

Display clamp values (inline `fontSize` style) — convert px endpoints to rem, keep vw unchanged:

| Current | New |
|---|---|
| `clamp(42px, 6.75vw, 63px)` | `clamp(2.625rem, 6.75vw, 3.9375rem)` |
| `clamp(39px, 6.75vw, 54px)` | `clamp(2.4375rem, 6.75vw, 3.375rem)` |
| `clamp(27px, 3.75vw, 36px)` | `clamp(1.6875rem, 3.75vw, 2.25rem)` |

**DO NOT change** `clamp(60px, 8vw, 90px)` — that is the main name display, excluded by design.

---

### Color token mapping

**Static foreground colors:**

| Current value | Token | Tailwind class |
|---|---|---|
| `#1a1a1a` | `--color-ink` | `text-ink` |
| `#444` | `--color-ink-2` | `text-ink-2` |
| `#555` | `--color-ink-3` | `text-ink-3` |
| `#888` | `--color-muted` | `text-muted` |
| `#aaa` | `--color-subtle` | `text-subtle` |
| `#bbb` | `--color-faint` | `text-faint` |
| `#ccc` | `--color-ghost` | `text-ghost` |
| `#ddd` | `--color-dim` | `text-dim` |

> **Do not conflate:** `#ddd` (`text-dim`) is only used for separator dots in HeroBox. `#ccc` (`text-ghost`) is for hint-bar labels and placeholders. `#bbb` (`text-faint`) is for nav links, kbd text, and ghost text. These are distinct grays with different semantic roles.

**Accent:**

| Current value | Token | Tailwind class |
|---|---|---|
| `var(--accent)` / `var(--ana-1-dark)` | `--color-accent` | `text-accent` / `bg-accent` |
| `var(--accent-tint-04)` | `--color-accent-ghost` | `bg-accent-ghost` |
| `var(--accent-tint-08)` | `--color-accent-bg` | `bg-accent-bg` |
| `var(--accent-tint-30)` | `--color-accent-border` | `border-accent-border` |
| `var(--accent-tint-35)` | `--color-accent-border-2` | `border-accent-border-2` |
| `hsl(277,65%,32%)` (cursor in typewriter) | same as accent | `text-accent` |

**Terminal green:**

| Current value | Token | Tailwind class |
|---|---|---|
| `var(--terminal-green)` / `#28c840` | `--color-green` | `text-green` / `bg-green` |
| `rgba(40,200,64,0.35)` | `--color-green-border` | `border-green-border` |
| `rgba(40,200,64,0.04)` | `--color-green-ghost` | `bg-green-ghost` |

**Traffic lights (TerminalChrome dots):**

| Current value | Token | Tailwind class |
|---|---|---|
| `#ff5f57` | `--color-dot-red` | `bg-dot-red` |
| `#febc2e` | `--color-dot-yellow` | `bg-dot-yellow` |

**Surfaces & borders:**

| Current value | Token | Tailwind class |
|---|---|---|
| `#F7F4EE` (body bg) | `--color-bg` | `bg-bg` |
| `#FAF8F3` (card/panel) | `--color-surface` | `bg-surface` |
| `#d0cdc6` | `--color-border` | `border-border` |
| `#e0ddd6` | `--color-border-lt` | `border-border-lt` |
| `rgba(0,0,0,0.04)` or `rgba(0,0,0,0.05)` (kbd bg) | `--color-kbd-bg` | `bg-kbd-bg` |

**Dark surfaces (CommandPalette, ExperimentsSection):**

| Current value | Token | Tailwind class | Where used |
|---|---|---|---|
| `#111` | `--color-dark` | `bg-dark` | Panel backgrounds |
| `rgba(255,255,255,0.04)` | `--color-dark-card` | `bg-dark-card` | ExperimentsSection card bg |
| `rgba(255,255,255,0.05)` | `--color-dark-tag` | `bg-dark-tag` | ExperimentsSection tag bg |
| `rgba(255,255,255,0.06)` | `--color-dark-item` | `bg-dark-item` | `[cmdk-item]` hover bg |
| `rgba(255,255,255,0.07)` | `--color-dark-border` | `border-dark-border` | ExperimentsSection borders |
| `rgba(255,255,255,0.08)` | `--color-dark-divider` | `border-dark-divider` | CommandPalette input row |
| `rgba(255,255,255,0.10)` | `--color-dark-border-2` | `border-dark-border-2` | CommandPalette panel border, esc kbd |

> **Tailwind v4 note on rgba() tokens:** Defining `--color-dark-border: rgba(255,255,255,0.07)` in `@theme {}` DOES generate the `bg-dark-border`, `border-dark-border` utilities — Tailwind v4 uses the CSS variable directly (`border-color: var(--color-dark-border)`). The only limitation is that opacity modifiers (e.g. `border-dark-border/50`) will not work, which is fine since we never use them.

---

### Hover pattern replacements

**CTA button / social link** (used in HeroBox, TerminalPrompt, AboutModal):

```jsx
// BEFORE:
<a
  className="... transition-all duration-150"
  style={{ color: 'var(--accent)', border: '1px solid var(--accent-tint-30)' }}
  onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-tint-08)'; e.currentTarget.style.transform = 'translateX(2px)' }}
  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.transform = '' }}
>

// AFTER:
<a
  className="... text-accent border border-accent-border transition-all duration-150 hover:bg-accent-bg hover:translate-x-0.5"
>
```

**Nudge / inline link button** (no translate, border-2 variant):

```jsx
// BEFORE:
<a
  style={{ color: 'var(--accent)', border: '1px solid var(--accent-tint-35)' }}
  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-tint-08)'}
  onMouseLeave={e => e.currentTarget.style.background = ''}
>

// AFTER:
<a className="text-accent border border-accent-border-2 hover:bg-accent-bg transition-colors duration-150">
```

**Nav link** (plain text, color-only hover):

```jsx
// BEFORE:
<a className="text-[#bbb] hover:text-[var(--accent)]">

// AFTER:
<a className="text-faint hover:text-accent">
```

**⌘K kbd group-hover** (parent button uses `group`, each kbd uses `group-hover:`):

```jsx
// BEFORE:
<button
  onMouseEnter={e => { e.currentTarget.querySelectorAll('kbd').forEach(k => { k.style.color = 'var(--accent)'; k.style.borderColor = 'var(--accent-tint-35)' }) }}
  onMouseLeave={e => { e.currentTarget.querySelectorAll('kbd').forEach(k => { k.style.color = '#bbb'; k.style.borderColor = '#e0ddd6' }) }}
>
  <kbd style={{ color: '#bbb', background: 'rgba(0,0,0,0.04)', border: '1px solid #e0ddd6' }}>{k}</kbd>

// AFTER:
<button className="group ..."> // add `group` class, remove ALL onMouseEnter/Leave
  <kbd className="bg-kbd-bg border border-border-lt text-faint group-hover:text-accent group-hover:border-accent-border-2 transition-colors duration-150">{k}</kbd>
```

**Filter button** (conditional class, remove onMouseEnter/Leave entirely):

```jsx
// BEFORE: mixed style prop with onMouseEnter/Leave
style={isActive ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' } : { borderColor: '#d0cdc6', color: '#888' }}
onMouseEnter={...}
onMouseLeave={...}

// AFTER: pure className, no style prop, no event handlers
className={`... ${isActive
  ? 'bg-accent border-accent text-white'
  : 'border-border text-muted hover:border-accent hover:text-accent hover:bg-accent-ghost'
}`}
```

---

## File Structure

**Modified files (no new files created):**

| File | What changes |
|---|---|
| `src/index.css` | Expand `@theme {}`, add `html` rule, update `body`, update cmdk selectors |
| `src/components/TerminalChrome.jsx` | Token classes for dots, text colors, sizes |
| `src/components/Footer.jsx` | Token classes for sizes, colors, hover |
| `src/components/HeroBox.jsx` | Comprehensive token sweep + group-hover for kbd |
| `src/components/TerminalPrompt.jsx` | Token classes, remove inline color styles, kbd tokens |
| `src/components/ProjectsSection.jsx` | Filter button declarative hover, gap-3, text tokens |
| `src/components/ProjectTile.jsx` | titleSize map to CSS vars, text/color tokens |
| `src/components/ProjectModal.jsx` | Text tokens, color tokens, rem clamp |
| `src/components/AboutModal.jsx` | Text tokens, color tokens, hover pattern, rem clamp |
| `src/components/ExperimentsSection.jsx` | Dark surface tokens, text tokens, rem clamp |
| `src/components/CommandPalette.jsx` | Dark surface tokens, text tokens |

---

## Chunk 1: Token Foundation

### Task 1: Expand `@theme {}` and update global CSS in `index.css`

**Files:**
- Modify: `src/index.css`

This is the foundation. Every subsequent task depends on the tokens defined here.

- [ ] **Step 1: Read the current file**

```bash
# Read src/index.css to confirm current state before editing
```

- [ ] **Step 2: Replace the `@theme {}` block**

Find the existing `@theme {}` block (currently only has `--font-mono` and `--font-display`) and replace it with the full token system:

```css
@theme {
  /* ── Fonts ───────────────────────────────────────────────────────────── */
  --font-mono:    "JetBrains Mono", "Courier New", monospace;
  --font-display: "Inter", sans-serif;

  /* ── Typography — additions to Tailwind's built-in scale ────────────── */
  /* Tailwind built-ins (0.75rem=xs, 0.875rem=sm, 1rem=base, 1.125rem=lg,  */
  /* 1.25rem=xl) are used as-is. Only gaps/custom sizes defined here.      */
  --text-2xs:     0.5625rem;   /* ~9px  — cmdk group headings              */
  --text-ui:      0.9375rem;   /* ~15px — nav links, inputs, CTAs, footer  */
  --text-heading: 1.3125rem;   /* ~21px — "Founding Designer" role line     */
  --text-brand:   1.4375rem;   /* ~23px — जेदी logo in titlebar             */

  /* Tile title sizes — used in ProjectTile via CSS var in inline style    */
  --text-tile-sm: 1.3125rem;   /* ~21px — project.size === 'small'         */
  --text-tile-md: 1.6875rem;   /* ~27px — project.size === 'half'          */
  --text-tile-lg: 2.1875rem;   /* ~35px — project.size === 'featured'      */

  /* ── Colors ─────────────────────────────────────────────────────────── */

  /* Foreground gray scale */
  --color-ink:     #1a1a1a;
  --color-ink-2:   #444;
  --color-ink-3:   #555;
  --color-muted:   #888;
  --color-subtle:  #aaa;
  --color-faint:   #bbb;
  --color-ghost:   #ccc;
  --color-dim:     #ddd;   /* separator dots, very light accents           */

  /* Surfaces & borders */
  --color-bg:        #F7F4EE;  /* page/body background                     */
  --color-surface:   #FAF8F3;  /* card and panel background                */
  --color-border:    #d0cdc6;  /* standard border                          */
  --color-border-lt: #e0ddd6;  /* light border, grid lines                 */
  --color-kbd-bg:    rgba(0, 0, 0, 0.05); /* kbd / hint chip background    */

  /* Accent (maps existing CSS vars to Tailwind color utilities) */
  --color-accent:          var(--ana-1-dark);
  --color-accent-ghost:    hsl(277 65% 32% / 0.04);
  --color-accent-bg:       hsl(277 65% 32% / 0.08);
  --color-accent-border:   hsl(277 65% 32% / 0.30);
  --color-accent-border-2: hsl(277 65% 32% / 0.35);

  /* Terminal green */
  --color-green:        #28c840;
  --color-green-border: rgba(40, 200, 64, 0.35); /* card hover border in dark */
  --color-green-ghost:  rgba(40, 200, 64, 0.04); /* card hover bg in dark     */

  /* Traffic light dots (TerminalChrome) */
  --color-dot-red:    #ff5f57;
  --color-dot-yellow: #febc2e;
  /* dot green reuses --color-green */

  /* Dark surfaces (CommandPalette, ExperimentsSection) */
  --color-dark:           #111;
  --color-dark-card:      rgba(255, 255, 255, 0.04);
  --color-dark-tag:       rgba(255, 255, 255, 0.05);
  --color-dark-item:      rgba(255, 255, 255, 0.06);
  --color-dark-border:    rgba(255, 255, 255, 0.07);
  --color-dark-divider:   rgba(255, 255, 255, 0.08);
  --color-dark-border-2:  rgba(255, 255, 255, 0.10);
}
```

- [ ] **Step 3: Replace `html` rule and update `body`**

The current `index.css` has a standalone `html { scroll-behavior: smooth; }` rule. **Remove it entirely** and replace it (plus the existing `body` rule) with the following two rules:

```css
html {
  font-size: 16px; /* THE global scale knob — change this one value to resize the entire UI */
  scroll-behavior: smooth;
}

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
  padding: 4rem;
}
```

**Why `font-size: 16px` on html:** The current `body { font-size: 18px }` only affects elements that inherit font-size without an explicit Tailwind class. Every component in this codebase uses explicit `text-[Xpx]` classes that override body. After migration, those become rem-based classes anchored to `html` — `text-sm` (0.875rem) = 14px at html 16px, `text-base` (1rem) = 16px, matching the current explicit px values exactly. The body 18px was effectively unused. Setting html to 16px is correct and produces no visual change for the explicitly-sized elements.

- [ ] **Step 4: Update cmdk selectors**

Find the cmdk CSS at the bottom of the file and update hardcoded values. The token-to-value mapping for reference:
- `9px` → `var(--text-2xs)` (= 0.5625rem)
- `#444` → `var(--color-ink-2)`
- `rgba(255, 255, 255, 0.06)` → `var(--color-dark-item)` (this is the `[cmdk-item]` hover/selected bg)

```css
[cmdk-group-heading] {
  font-size: var(--text-2xs);
  color: var(--color-ink-2);
  /* keep any other existing properties (letter-spacing, padding, etc.) */
}

[cmdk-item][aria-selected='true'],
[cmdk-item]:hover {
  background: var(--color-dark-item);
  color: #fff;
}
```

- [ ] **Step 5: Verify build**

```bash
cd /d/my_stuff/developer/Developer/Developer/portfolio
npm run build
```

Expected: build succeeds with no errors. Warnings about unused CSS vars are OK.

- [ ] **Step 5b: Visual spot-check (manual)**

Run `npm run dev`, open the local dev server, and verify:
1. The page background is still warm off-white with a grid pattern
2. Open the CommandPalette (Cmd/Ctrl+K) — dark panel must render with correct dark background and white text
3. Scroll to ExperimentsSection — cards must have subtle dark borders visible
4. Type in TerminalPrompt — ghost text and hint bar `kbd` chips must be visible

If any of these look broken (white-on-white, invisible borders), the rgba() token in `@theme {}` failed to generate the utility. Fix by verifying the `@theme {}` block syntax, specifically that each `--color-dark-*` value is on its own line with no trailing spaces.

- [ ] **Step 6: Commit**

```bash
git add src/index.css
git commit -m "feat: add design token system to @theme — typography, color, dark-surface tokens"
```

---

## Chunk 2: Shell Components

> **Prerequisite:** Task 1 must be complete before starting this chunk. All token utilities used below (`text-accent`, `text-muted`, `text-faint`, `text-subtle`, `text-ghost`, `text-green`, `text-dim`, `text-ui`, `text-sm`, `text-base`, `text-heading`, `text-brand`, `bg-surface`, `bg-kbd-bg`, `bg-accent-bg`, `border-border`, `border-border-lt`, `border-accent-border`, `border-accent-border-2`, `placeholder-ghost`, `caret-accent`) are generated from the `@theme {}` additions in Task 1. Applying them before Task 1 runs will produce invisible/broken styles. Also note: `text-base = 1rem = 16px` is reliable because Task 1 sets `html { font-size: 16px }`.

### Task 2: TerminalChrome + Footer

**Files:**
- Modify: `src/components/TerminalChrome.jsx`
- Modify: `src/components/Footer.jsx`

- [ ] **Step 1: Read both files**

Read `src/components/TerminalChrome.jsx` and `src/components/Footer.jsx` in full.

- [ ] **Step 2: Update TerminalChrome**

Apply these replacements:

| Find | Replace with |
|---|---|
| `bg-[#ff5f57]` | `bg-dot-red` |
| `bg-[#febc2e]` | `bg-dot-yellow` |
| `bg-[#28c840]` (dot only — NOT statusPulse animation) | `bg-green` |
| `text-[16px]` | `text-base` |
| `text-[#aaa]` | `text-subtle` |
| `style={{ color: 'var(--terminal-green)' }}` on status span | remove style prop, add `text-green` to className |
| `style={{ background: 'var(--terminal-green)', ... }}` on status dot | keep the non-color properties inline, add `bg-green` to className |

The status dot span has multiple style properties (background, width, height, borderRadius, animation). **Only move `background` to className; keep width, height, borderRadius, and `animation: 'statusPulse 2s ease infinite'` in the style prop.** The `statusPulse` keyframe is defined in `index.css` globally and is not a Tailwind utility — it must remain as an inline style.

- [ ] **Step 3: Update Footer**

Apply these replacements:

| Find | Replace with |
|---|---|
| `text-[15px]` | `text-ui` |
| `text-[#bbb]` or `color: '#bbb'` (footer text color) | `text-faint` |
| `border-[#d0cdc6]` | `border-border` |
| `color: 'var(--terminal-green)'` (जेदी and nudge) | remove style, add `text-green` to className |
| `hover:text-[var(--accent)]` (footer nav links) | `hover:text-accent` |

For Footer's "let's chat" CTA link (if present), apply the **CTA button hover pattern** from the Token Reference section above.

- [ ] **Step 4: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/TerminalChrome.jsx src/components/Footer.jsx
git commit -m "refactor: apply design tokens to TerminalChrome and Footer"
```

---

### Task 3: HeroBox

**Files:**
- Modify: `src/components/HeroBox.jsx`

HeroBox is the most complex component in this migration. Read it fully before editing.

- [ ] **Step 1: Read the file**

Read `src/components/HeroBox.jsx` in full.

- [ ] **Step 2: Update the outer HeroBox container**

```jsx
// BEFORE:
<div className="border border-[#d0cdc6] rounded-sm mb-6 overflow-hidden bg-[#FAF8F3]">

// AFTER:
<div className="border border-border rounded-sm mb-6 overflow-hidden bg-surface">
```

- [ ] **Step 3: Update HeroTitlebar**

```jsx
// BEFORE:
<div className="flex items-center justify-between px-4 py-2 border-b border-[#d0cdc6] text-[11px]">
  <span className="text-[15px] font-bold tracking-wide font-mono" style={{ color: 'var(--accent)' }}>
    जेदी
  </span>

// AFTER:
<div className="flex items-center justify-between px-4 py-2 border-b border-border text-base">
  <span className="text-brand font-bold tracking-wide font-mono text-accent">
    जेदी
  </span>
```

Note: `text-[11px]` on the titlebar div was sizing metadata, now `text-base` on the div sets context. The जेदी span uses `text-brand` (23px) and `text-accent`.

- [ ] **Step 4: Update nav links**

For each nav `<a>` and `<button>` in the nav:

```jsx
// BEFORE:
className="text-[#bbb] no-underline text-[10px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"

// AFTER:
className="text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
```

Apply same to the `about` button and `blog`/`resume` links.

- [ ] **Step 5: Update the ⌘K kbd button — group-hover pattern**

```jsx
// BEFORE:
<button
  type="button"
  onClick={onPaletteOpen}
  className="flex items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0 group"
  title="Open command palette"
>
  {[...].map((k, i) => (
    <kbd
      key={i}
      className="text-[9px] font-mono px-1 py-0.5 rounded-[2px] leading-none transition-all duration-150"
      style={{ color: '#bbb', background: 'rgba(0,0,0,0.04)', border: '1px solid #e0ddd6' }}
      onMouseEnter={e => { e.currentTarget.parentElement.querySelectorAll('kbd').forEach(k => { k.style.color = 'var(--accent)'; k.style.borderColor = 'var(--accent-tint-35)' }) }}
      onMouseLeave={e => { e.currentTarget.parentElement.querySelectorAll('kbd').forEach(k => { k.style.color = '#bbb'; k.style.borderColor = '#e0ddd6' }) }}
    >
      {k}
    </kbd>
  ))}
</button>

// AFTER: (note: button already has `group` class — keep it. Remove ALL onMouseEnter/Leave from kbd elements)
<button
  type="button"
  onClick={onPaletteOpen}
  className="flex items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0 group"
  title="Open command palette"
>
  {[...].map((k, i) => (
    <kbd
      key={i}
      className="text-sm font-mono px-1 py-0.5 rounded-[2px] leading-none bg-kbd-bg border border-border-lt text-faint group-hover:text-accent group-hover:border-accent-border-2 transition-colors duration-150"
    >
      {k}
    </kbd>
  ))}
</button>
```

- [ ] **Step 6: Update Nudge button**

Apply the **Nudge/inline link pattern** from the Token Reference:

```jsx
// BEFORE:
<a
  href="https://nudgenow.com"
  ...
  className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] transition-colors duration-150"
  style={{ color: 'var(--accent)', border: '1px solid var(--accent-tint-35)' }}
  onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-tint-08)'}
  onMouseLeave={e => e.currentTarget.style.background = ''}
>

// AFTER:
<a
  href="https://nudgenow.com"
  ...
  className="text-ui font-mono px-2 py-0.5 rounded-[2px] text-accent border border-accent-border-2 transition-colors duration-150 hover:bg-accent-bg"
>
```

- [ ] **Step 7: Update BigName**

The `clamp(60px, 8vw, 90px)` fontSize on the name text is **excluded from all changes**. Only update the container color:

```jsx
// BEFORE:
className="font-display font-black leading-[0.88] tracking-[-4px] text-[#1a1a1a] mb-4 ..."

// AFTER:
className="font-display font-black leading-[0.88] tracking-[-4px] text-ink mb-4 ..."
```

The blink cursor `<span>`: move `background` to className:

```jsx
// BEFORE:
style={{ width: 'clamp(4px, 0.5vw, 6px)', height: 'clamp(36px, 5.1vw, 56px)', background: 'var(--accent)', animation: 'blink 1.1s step-end infinite' }}

// AFTER:
className="... bg-accent"
style={{ width: 'clamp(4px, 0.5vw, 6px)', height: 'clamp(36px, 5.1vw, 56px)', animation: 'blink 1.1s step-end infinite' }}
```

- [ ] **Step 8: Update RoleLine**

```jsx
// BEFORE:
<span className="text-[14px] font-bold font-mono" style={{ color: 'var(--accent)' }}>
  Founding Designer
</span>
<span className="text-[#ddd]">·</span>
<span className="text-[11px] text-[#888] font-mono">Nudge · IIT Bombay · Bangalore</span>

// AFTER:
<span className="text-heading font-bold font-mono text-accent">
  Founding Designer
</span>
<span className="text-dim">·</span>
<span className="text-base text-muted font-mono">Nudge · IIT Bombay · Bangalore</span>
```

- [ ] **Step 9: Update HeroFooter (if still present in file as dead code)**

If `HeroFooter` function still exists in the file (it is no longer rendered but may still be defined), update its values anyway to keep the file clean:

```jsx
// border-[#e0ddd6] → border-border-lt
// text-[11px] → text-base
// text-[#bbb] → text-faint
// color: var(--terminal-green) → text-green
// CTA link → apply CTA hover pattern
```

- [ ] **Step 10: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 11: Commit**

```bash
git add src/components/HeroBox.jsx
git commit -m "refactor: apply design tokens to HeroBox — group-hover kbd, declarative nav hover"
```

---

### Task 4: TerminalPrompt

**Files:**
- Modify: `src/components/TerminalPrompt.jsx`

- [ ] **Step 1: Read the file**

Read `src/components/TerminalPrompt.jsx` in full.

- [ ] **Step 2: Apply all token replacements**

```jsx
// Container div:
// border-[#e0ddd6] → border-border-lt
// text-[15px] → text-ui (the base font for the terminal)

// History entry div (cmd type):
// style={{ color: entry.type === 'cmd' ? 'var(--accent)' : '#888' }}
// AFTER: remove style, use className conditionally:
className={`leading-[1.6] whitespace-pre-wrap break-all ${entry.type === 'cmd' ? 'text-accent' : 'text-muted'}`}

// Prompt arrow span:
// style={{ color: 'var(--terminal-green)' }} → remove style, add text-green to className

// Ghost overlay div:
// text-[15px] → text-ui (keep the rest of the className)

// Ghost spacer span:
// style={{ color: 'transparent' }} → remove style, add text-transparent to className

// Ghost suffix span:
// style={{ color: '#bbb', opacity: 0.55 }} → keep opacity: 0.55 inline, change color to className text-faint
// AFTER: className="text-faint" style={{ opacity: 0.55 }}

// Input element:
// text-[15px] → text-ui
// text-[#1a1a1a] → text-ink
// placeholder-[#ccc] → placeholder-ghost
// caret-[var(--accent)] → caret-accent

// "let's chat" link — apply CTA hover pattern from Token Reference:
// AFTER: className="flex-shrink-0 text-ui font-mono px-3 py-1 rounded-[2px] no-underline text-accent border border-accent-border transition-all duration-150 hover:bg-accent-bg hover:translate-x-0.5"
// Remove style prop and onMouseEnter/Leave entirely

// Hint bar container div:
// style={{ color: '#ccc' }} → remove style, add text-ghost to className

// Each kbd in hint bar:
// style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid #e0ddd6', color: '#aaa' }}
// AFTER: className="bg-kbd-bg border border-border-lt text-subtle px-1 py-px rounded-[2px] leading-none"
// Remove style prop entirely

// Hint label spans:
// style={{ color: '#ccc' }} → remove style, add text-ghost to className
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/TerminalPrompt.jsx
git commit -m "refactor: apply design tokens to TerminalPrompt — remove all inline color styles"
```

---

## Chunk 3: Content Components

### Task 5: ProjectsSection + ProjectTile

**Files:**
- Modify: `src/components/ProjectsSection.jsx`
- Modify: `src/components/ProjectTile.jsx`

- [ ] **Step 1: Read both files**

Read both files in full.

- [ ] **Step 2: Update ProjectsSection typewriter header**

```jsx
// BEFORE:
<div className="text-[16px] font-mono mb-4 flex items-center gap-2" style={{ color: '#888' }}>
  <span style={{ color: 'var(--terminal-green)' }}>❯</span>

// AFTER:
<div className="text-base font-mono mb-4 flex items-center gap-2 text-muted">
  <span className="text-green">❯</span>
```

The typewriter cursor span that uses `color: 'hsl(277,65%,32%)'` → change to `text-accent`:

```jsx
// BEFORE:
<span style={{ color: 'hsl(277,65%,32%)', animation: 'blink 1s step-end infinite' }}>█</span>

// AFTER:
<span className="text-accent" style={{ animation: 'blink 1s step-end infinite' }}>█</span>
```

- [ ] **Step 3: Update filter buttons — fully declarative**

The filter buttons currently use `style` props and `onMouseEnter`/`onMouseLeave`. Replace entirely with `className`:

```jsx
// BEFORE (approximately):
<button
  className="text-[15px] font-mono px-2.5 py-1 rounded-[2px] border transition-all duration-150 cursor-pointer"
  style={isActive
    ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: 'white' }
    : { borderColor: '#d0cdc6', color: '#888' }
  }
  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-tint-04)' } }}
  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = '#d0cdc6'; e.currentTarget.style.color = '#888'; e.currentTarget.style.background = '' } }}
>

// AFTER: (remove style prop, remove onMouseEnter/Leave entirely)
<button
  className={`text-ui font-mono px-2.5 py-1 rounded-[2px] border transition-all duration-150 cursor-pointer ${
    isActive
      ? 'bg-accent border-accent text-white'
      : 'border-border text-muted hover:border-accent hover:text-accent hover:bg-accent-ghost'
  }`}
>
```

- [ ] **Step 4: Update grid gaps and margins**

```jsx
// gap-[12px] (appears in featured row and bento row) → gap-3
// mb-[12px] (appears in ProjectsSection row divs) → mb-3
```

- [ ] **Step 5: Update ProjectTile**

Replace the `titleSize` variable:

```jsx
// BEFORE:
const titleSize = project.size === 'featured' ? '35px' : project.size === 'half' ? '27px' : '21px'

// AFTER:
const titleSizeVar = {
  featured: 'var(--text-tile-lg)',
  half:     'var(--text-tile-md)',
  small:    'var(--text-tile-sm)',
}[project.size] ?? 'var(--text-tile-sm)'
```

Then update the usage: `style={{ fontSize: titleSize, ... }}` → `style={{ fontSize: titleSizeVar, ... }}`

Apply remaining token replacements:

| Find | Replace |
|---|---|
| `text-[20px]` (arrow ↗) | `text-xl` |
| `text-[14px]` (box-draw chrome) | `text-sm` |
| `text-[15px]` (description) | `text-ui` |
| `text-[14px]` (tags) | `text-sm` |
| `text-[#888]` (description — Tailwind arbitrary class) | replace with `text-muted` in className (no style prop to remove — it is already a className) |
| `p-[28px]` (tile container) | `p-7` |

Note: Arrow color (`c.title` / `c.chrome`), box-draw color (`var(--tile-chrome)`), and tag color (`var(--tile-tag)`) are **all runtime dynamic values** — keep these inline.

- [ ] **Step 6: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/ProjectsSection.jsx src/components/ProjectTile.jsx
git commit -m "refactor: apply design tokens to ProjectsSection and ProjectTile"
```

---

### Task 6: ProjectModal

**Files:**
- Modify: `src/components/ProjectModal.jsx`

- [ ] **Step 1: Read the file**

Read `src/components/ProjectModal.jsx` in full.

- [ ] **Step 2: Apply token replacements**

```jsx
// Header chrome label:
// text-[14px] → text-sm
// color: c.chrome → keep (dynamic)

// Title h2:
// fontSize: 'clamp(42px, 6.75vw, 63px)' → 'clamp(2.625rem, 6.75vw, 3.9375rem)'
// color: c.title → keep (dynamic)

// Close button:
// text-[16px] → text-base
// text-[#bbb] hover:text-[#555] → text-faint hover:text-ink-3

// Meta chip containers (3 of them):
// text-[14px] → text-sm
// background: 'rgba(255,255,255,0.5)' → keep (specific per-chip semi-transparent white)
// border: `1px solid ${c.borderRest}` → keep (dynamic)

// Brief paragraph:
// text-[16px] → text-base
// style={{ color: '#444' }} → remove style, add text-ink-2 to className

// Footer tags:
// text-[14px] → text-sm
// color: c.tag → keep (dynamic)

// Behance link:
// text-[16px] → text-base
// color: c.title → keep (dynamic)
// hover:opacity-70 is already there — no change needed
```

**Keep these as-is (dynamic/complex):**
- Backdrop `rgba(26,26,26,0.55)` — specific backdrop opacity, no token
- Panel `background: c.bg`, `border: 1px solid c.borderHover` — runtime
- Scan head `linear-gradient(transparent, hsl(277,65%,80%), transparent)` — animation-specific
- Glitch animation SCRAMBLE `textShadow` values — animation-specific

- [ ] **Step 3: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ProjectModal.jsx
git commit -m "refactor: apply design tokens to ProjectModal"
```

---

### Task 7: AboutModal

**Files:**
- Modify: `src/components/AboutModal.jsx`

- [ ] **Step 1: Read the file**

Read `src/components/AboutModal.jsx` in full.

- [ ] **Step 2: Apply token replacements**

```jsx
// Panel motion.div — move background to className:
// BEFORE: style={{ background: '#FAF8F3', border: '1px solid var(--ana-1-border)' }}
// AFTER:  className="... bg-surface"
//         style={{ border: '1px solid var(--ana-1-border)' }}

// Avatar container:
// border: '1px solid var(--ana-1-border)' → keep (dynamic palette)
// background: 'var(--ana-1-bg)' → keep (dynamic palette)

// Header chrome label:
// text-[14px] → text-sm
// color: var(--ana-1-chrome) → keep (dynamic palette)

// Name h2:
// fontSize: 'clamp(39px, 6.75vw, 54px)' → 'clamp(2.4375rem, 6.75vw, 3.375rem)'
// color: 'var(--accent)' → remove style, add text-accent to className

// Subtitle:
// text-[16px] → text-base
// color: var(--ana-1-tag) → keep (dynamic palette)

// Close button:
// text-[16px] → text-base
// text-[#bbb] hover:text-[#555] → text-faint hover:text-ink-3

// Bio paragraphs:
// text-[16px] → text-base  (Tailwind arbitrary class → replace in className)
// text-[#555] → text-ink-3  (Tailwind arbitrary class → replace in className; there is NO style prop)

// "find me on" header:
// text-[14px] → text-sm
// color: var(--ana-1-chrome) → keep (dynamic palette)

// Social links — apply CTA hover pattern:
// BEFORE:
//   className="text-[15px] font-mono px-2.5 py-1 rounded-[2px] no-underline transition-all duration-150"
//   style={{ color: 'var(--accent)', border: '1px solid var(--accent-tint-30)' }}
//   onMouseEnter / onMouseLeave handlers
// AFTER:
//   className="text-ui font-mono px-2.5 py-1 rounded-[2px] no-underline text-accent border border-accent-border transition-all duration-150 hover:bg-accent-bg hover:translate-x-0.5"
//   (remove style prop and event handlers)
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/AboutModal.jsx
git commit -m "refactor: apply design tokens to AboutModal"
```

---

### Task 8: ExperimentsSection + CommandPalette

**Files:**
- Modify: `src/components/ExperimentsSection.jsx`
- Modify: `src/components/CommandPalette.jsx`

- [ ] **Step 1: Read both files**

Read both files in full.

- [ ] **Step 2: Update ExperimentsSection**

```jsx
// Section header div:
// text-[16px] → text-base
// color: var(--terminal-green) on ❯ → text-green
// color: var(--accent) on header text → text-accent

// Dark container:
// BEFORE: style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)' }}
// AFTER:  className="... bg-dark border border-dark-border"  (remove style)

// Sub-header description:
// text-[14px] → text-sm
// color: '#444' → text-ink-2

// Experiment card (ExperimentCard component):
// BEFORE style: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }
// AFTER className: "bg-dark-card border border-dark-border"  (remove style)

// Card hover (onMouseEnter/Leave on card — replaces both background AND borderColor):
// BEFORE:
//   onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(40,200,64,0.35)'; e.currentTarget.style.background = 'rgba(40,200,64,0.04)' }}
//   onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
// AFTER: remove handlers, use Tailwind hover:
//   className="... hover:border-green-border hover:bg-green-ghost transition-colors duration-200"

// Year text:
// text-[14px] → text-sm
// color: '#444' → text-ink-2

// Arrow:
// text-[16px] → text-base
// color: var(--terminal-green) → text-green

// Card title:
// fontSize: 'clamp(27px, 3.75vw, 36px)' → 'clamp(1.6875rem, 3.75vw, 2.25rem)'
// text-white is ALREADY in className — do NOT add it again; only change the fontSize clamp

// Description:
// text-[15px] → text-ui
// color: '#555' → text-ink-3

// Tags:
// text-[12px] → text-xs
// background: 'rgba(255,255,255,0.05)' → bg-dark-tag (remove style, add class)
// color: '#444' → text-ink-2
```

- [ ] **Step 3: Update CommandPalette**

```jsx
// Backdrop:
// background: 'rgba(0,0,0,0.55)' → keep inline (specific backdrop)
// backdropFilter: 'blur(6px)' → keep inline

// Panel motion.div:
// BEFORE: style={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '...' }}
// AFTER:  className="... bg-dark border border-dark-border-2"
//         style={{ boxShadow: '0 32px 96px rgba(0,0,0,0.7)' }}  (keep shadow inline — no token)

// Search input row:
// BEFORE: style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
// AFTER:  className="... border-b border-dark-divider"  (remove style)

// Prompt arrow:
// text-[16px] → text-base
// color: var(--terminal-green) → text-green

// Command.Input:
// text-[20px] → text-xl
// caretColor: 'var(--terminal-green)' → caret-green

// Esc kbd:
// text-[14px] → text-sm
// color: '#444' → text-ink-2
// border: '1px solid rgba(255,255,255,0.1)' → border border-dark-border-2  (remove style)

// Command.Empty:
// text-[16px] → text-base
// color: '#555' → text-ink-3

// PaletteItem:
// text-[18px] → text-lg
// color: '#aaa' → text-subtle

// ItemIcon:
// text-[15px] → text-ui
// color: '#555' → text-ink-3

// ItemNum:
// text-[14px] → text-sm
// color: '#555' → text-ink-3
```

- [ ] **Step 4: Verify**

```bash
npm run build && npm run lint
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ExperimentsSection.jsx src/components/CommandPalette.jsx
git commit -m "refactor: apply design tokens to ExperimentsSection and CommandPalette — dark surface tokens"
```

---

## Final Verification

After all 8 tasks complete:

- [ ] **Run full build + lint**

```bash
npm run build && npm run lint
```

Expected: 0 errors, only pre-existing warnings (ProjectModal ref cleanup warnings — those are harmless, pre-existing).

- [ ] **Spot-check: zero remaining arbitrary color classes**

```bash
# Should return NOTHING (no arbitrary color classes remain):
grep -r "text-\[#" src/components/
grep -r "bg-\[#" src/components/
grep -r "border-\[#" src/components/
```

- [ ] **Spot-check: zero remaining arbitrary px font classes**

```bash
# Should return NOTHING:
grep -rE "text-\[[0-9]+px\]" src/components/
```

- [ ] **Spot-check: zero remaining hardcoded hex/rgb inline color styles**

```bash
# Should return very few results (only dynamic c.xxx values and specific exceptions):
grep -r "color: '#" src/components/
grep -r "background: '#" src/components/
grep -r "color: 'rgba" src/components/
```

Any remaining results from the spot-checks are either:
- `c.title`, `c.bg`, `c.chrome`, `c.tag` etc. → these are **intentional** runtime-computed values from COLOR_MAP
- `rgba(26,26,26,0.X)` for modal backdrops → **intentional** specific overlay opacity, no token needed
- `rgba(255,255,255,0.5)` for chip backgrounds in ProjectModal → **intentional** semi-transparent white specific to the chip design

Those should be left alone.

- [ ] **Final commit (if any cleanup needed)**

```bash
git add -A
git commit -m "refactor: complete design token migration — all components use semantic tokens"
```
