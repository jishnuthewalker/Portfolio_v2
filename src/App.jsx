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
