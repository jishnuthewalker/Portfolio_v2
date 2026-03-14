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
  const [_paletteOpen, setPaletteOpen] = useState(false)
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
