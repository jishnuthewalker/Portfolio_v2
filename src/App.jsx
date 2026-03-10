import { TerminalChrome } from './components/TerminalChrome'
import { HeroBox }        from './components/HeroBox'
import { ProjectsSection } from './components/ProjectsSection'
import { Footer }          from './components/Footer'

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
