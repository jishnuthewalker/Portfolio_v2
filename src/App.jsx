import { useState, useEffect, lazy, Suspense } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome }       from './components/TerminalChrome'
import { HeroBox }              from './components/HeroBox'
import { ProjectsSection }      from './components/ProjectsSection'
import { ExperimentsSection }   from './components/ExperimentsSection'
import { Footer }               from './components/Footer'
import { ProjectModal }         from './components/ProjectModal'
import { AboutModal }           from './components/AboutModal'
import { CommandPalette }       from './components/CommandPalette'
import { FEATURES }             from './config/features'

// Lazy-loaded — Excalidraw's ~700KB bundle is only fetched when canvas is enabled
// and the component first renders. When FEATURES.canvas is false, these factories
// never execute.
const CanvasPlayground = FEATURES.canvas
  ? lazy(() => import('./components/CanvasPlayground').then(m => ({ default: m.CanvasPlayground })))
  : null

const CanvasOverlay = FEATURES.canvas
  ? lazy(() => import('./components/CanvasOverlay').then(m => ({ default: m.CanvasOverlay })))
  : null

export default function App() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)
  const [canvasOpen, setCanvasOpen] = useState(false)

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
        <ExperimentsSection />

        {FEATURES.canvas && CanvasPlayground && (
          <Suspense fallback={<div className="h-[480px] border border-border-lt rounded-sm mt-6 mb-6" />}>
            <CanvasPlayground />
          </Suspense>
        )}

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

        {/* Canvas overlay — rendered last so it stacks above all other modals */}
        {FEATURES.canvas && CanvasOverlay && (
          <Suspense fallback={
            <div className="fixed inset-0 z-50 bg-black/80" />
          }>
            <CanvasOverlay isOpen={canvasOpen} onClose={() => setCanvasOpen(false)} />
          </Suspense>
        )}
      </main>

      {/* Floating canvas button — outside <main> so fixed positioning is viewport-relative */}
      {FEATURES.canvas && (
        <button
          onClick={() => setCanvasOpen(true)}
          aria-label="Open canvas moodboard"
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 rounded-sm font-mono text-sm bg-dark border border-dark-border text-green hover:bg-dark-card hover:border-green-border transition-colors duration-200"
        >
          <span aria-hidden="true">✏</span> canvas
        </button>
      )}
    </LayoutGroup>
  )
}
