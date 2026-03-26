// src/components/ProjectsSection.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, FILTERS } from '../data/projects'
import { ProjectTile } from './ProjectTile'
import { AccordionBar } from './AccordionBar'

export function ProjectsSection({ onOpenProject, activeFilter, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tilesVisible, setTilesVisible] = useState(false)

  // auto-expand if user navigated directly to #projects
  useEffect(() => {
    if (window.location.hash === '#projects') {
      setIsOpen(true)
    }
    function handleHashChange() {
      if (window.location.hash === '#projects') {
        setIsOpen(true)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // reset + re-trigger stagger every time section opens
  useEffect(() => {
    if (!isOpen) {
      setTilesVisible(false)
      return
    }
    const timer = setTimeout(() => setTilesVisible(true), 50)
    return () => clearTimeout(timer)
  }, [isOpen])

  function toggleFilter(value) {
    onFilterChange(activeFilter === value ? null : value)
  }

  function isDimmed(project) {
    if (!activeFilter) return false
    return !project.skills.includes(activeFilter)
  }

  const featured = PROJECTS.filter(p => p.size === 'featured')
  const half     = PROJECTS.filter(p => p.size === 'half')
  const small    = PROJECTS.filter(p => p.size === 'small')

  const meta = `${PROJECTS.length} projects · ${FILTERS.map(f => f.value).join(' · ')}`

  return (
    <section id="projects">
      <AccordionBar
        label="./projects"
        meta={meta}
        isOpen={isOpen}
        onToggle={() => setIsOpen(o => !o)}
        typeDelay={0}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="projects-body"
            className="relative overflow-hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Scan head — sweeps top→bottom on open */}
            <motion.div
              aria-hidden="true"
              className="absolute left-0 w-full pointer-events-none z-10"
              style={{
                height: '6px',
                background: 'linear-gradient(transparent, hsl(277,65%,80%), transparent)',
              }}
              initial={{ top: '0%', opacity: 1 }}
              animate={{ top: '105%', opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            />

            {/* Filter tags */}
            <motion.div
              className="flex gap-1.5 flex-wrap mb-3"
              initial={{ opacity: 0 }}
              animate={tilesVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {FILTERS.map(f => (
                <button
                  type="button"
                  key={f.value}
                  onClick={() => toggleFilter(f.value)}
                  className={`text-ui font-mono px-2.5 py-1 rounded-[2px] border transition-all duration-150 cursor-pointer ${
                    activeFilter === f.value
                      ? 'bg-accent border-accent text-white'
                      : 'border-border text-muted hover:border-accent hover:text-accent hover:bg-accent-ghost'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </motion.div>

            {/* Featured row */}
            <div className="grid gap-3 mb-3 grid-cols-1 sm:grid-cols-[2.0fr_1fr]">
              {featured.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="h-full"
                  initial={{ opacity: 0, y: 8 }}
                  animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                >
                  <ProjectTile
                    project={p}
                    dimmed={isDimmed(p)}
                    onOpen={() => onOpenProject(p.id)}
                  />
                </motion.div>
              ))}
              <div className="flex flex-col gap-3">
                {half.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ duration: 0.35, delay: (featured.length + i) * 0.07 }}
                  >
                    <ProjectTile
                      project={p}
                      dimmed={isDimmed(p)}
                      onOpen={() => onOpenProject(p.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3 grid-flow-row-dense">
              {small.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={tilesVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: (featured.length + half.length + i) * 0.07 }}
                >
                  <ProjectTile
                    project={p}
                    dimmed={isDimmed(p)}
                    onOpen={() => onOpenProject(p.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
