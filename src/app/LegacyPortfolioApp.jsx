import { useState, useEffect } from 'react'
import { LayoutGroup } from 'framer-motion'
import { TerminalChrome } from '../components/TerminalChrome'
import { HeroBox } from '../components/HeroBox'
import { ProjectsSection } from '../components/ProjectsSection'
import { ExperimentsSection } from '../components/ExperimentsSection'
import { Footer } from '../components/Footer'
import { ProjectModal } from '../components/ProjectModal'
import { AboutModal } from '../components/AboutModal'
import { CommandPalette } from '../components/CommandPalette'

export function LegacyPortfolioApp() {
  const [activeProjectId, setActiveProjectId] = useState(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState(null)

  useEffect(() => {
    function handleKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setPaletteOpen((prev) => !prev)
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
