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
  // Close on Escape
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
              className="w-full max-w-[560px] pointer-events-auto overflow-hidden rounded-[4px] bg-dark border border-dark-border-2"
              style={{ boxShadow: '0 32px 96px rgba(0,0,0,0.7)' }}
              initial={{ opacity: 0, y: -10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <Command>
                {/* Search input row */}
                <div className="flex items-center px-4 gap-3 border-b border-dark-divider">
                  <span className="text-base font-mono flex-shrink-0 text-green">
                    ❯
                  </span>
                  <Command.Input
                    placeholder="type a command or search…"
                    className="flex-1 bg-transparent border-0 outline-none text-xl font-mono text-white py-4 caret-green"
                    style={{
                      WebkitAppearance: 'none',
                    }}
                  />
                  <kbd className="text-sm font-mono rounded-[2px] px-1.5 py-0.5 flex-shrink-0 text-ink-2 border border-dark-border-2">
                    esc
                  </kbd>
                </div>

                <Command.List className="py-2 max-h-[340px] overflow-y-auto">
                  <Command.Empty className="text-base font-mono px-4 py-3 text-ink-3">
                    no results.
                  </Command.Empty>

                  {/* ── Navigate ─────────────────────────────── */}
                  <Command.Group heading="Navigate">
                    <PaletteItem onSelect={() => run(() => scrollTo('projects'))}>
                      <ItemIcon>↓</ItemIcon> scroll to work
                    </PaletteItem>
                    <PaletteItem onSelect={() => run(() => scrollTo('experiments'))}>
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
      className="flex items-center gap-2.5 px-4 py-2.5 text-lg font-mono cursor-pointer transition-colors duration-75 text-subtle"
    >
      {children}
    </Command.Item>
  )
}

function ItemIcon({ children }) {
  return (
    <span className="text-ui w-4 flex-shrink-0 text-ink-3">
      {children}
    </span>
  )
}

function ItemNum({ children }) {
  return (
    <span className="text-sm font-mono w-6 flex-shrink-0 text-ink-3">
      {children}
    </span>
  )
}
