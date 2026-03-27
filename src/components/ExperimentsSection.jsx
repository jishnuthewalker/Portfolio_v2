// src/components/ExperimentsSection.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { EXPERIMENTS } from '../data/experiments'
import { AccordionBar } from './AccordionBar'

export function ExperimentsSection() {
  const [isOpen, setIsOpen] = useState(false)

  // auto-expand if user navigated directly to #experiments
  useEffect(() => {
    if (window.location.hash === '#experiments') {
      setIsOpen(true)
    }
    function handleHashChange() {
      if (window.location.hash === '#experiments') {
        setIsOpen(true)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const meta = `${EXPERIMENTS.length} experiment${EXPERIMENTS.length !== 1 ? 's' : ''}`

  return (
    <section id="experiments" className="mt-6 mb-6">
      <AccordionBar
        label="./experiments"
        meta={meta}
        isOpen={isOpen}
        onToggle={() => setIsOpen(o => !o)}
        typeDelay={400}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="experiments-body"
            className="relative overflow-hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Scan head */}
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

            {/* Dark container */}
            <div className="rounded-sm overflow-hidden p-5 sm:p-6 bg-dark border border-dark-border">
              <div className="text-sm font-mono mb-5 text-ink-2">
                tools and explorations — side projects, interactive essays, visual experiments
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXPERIMENTS.map((exp, i) => (
                  <ExperimentCard key={exp.id} experiment={exp} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ExperimentCard({ experiment, index }) {
  return (
    <motion.a
      href={experiment.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[2px] p-4 no-underline bg-dark-card border border-dark-border hover:border-green-border hover:bg-green-ghost transition-colors duration-200"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-mono text-ink-2">{experiment.year}</span>
        <span className="text-base font-mono text-green">↗</span>
      </div>

      <div
        className="font-display font-black text-white mb-1.5 leading-tight"
        style={{ fontSize: 'clamp(1.6875rem, 3.75vw, 2.25rem)' }}
      >
        {experiment.title}
      </div>

      <p className="text-ui font-mono leading-relaxed mb-3 text-ink-3">
        {experiment.description}
      </p>

      <div className="flex gap-1.5 flex-wrap">
        {experiment.tags.map(tag => (
          <span
            key={tag}
            className="text-xs font-mono px-1.5 py-0.5 rounded-[2px] bg-dark-tag text-ink-2"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
