// src/components/ExperimentsSection.jsx
import { motion } from 'framer-motion'
import { EXPERIMENTS } from '../data/experiments'

/**
 * ExperimentsSection — dark grid below Projects.
 * Contrasts with the warm off-white background.
 * Each card links out to the experiment URL.
 */
export function ExperimentsSection() {
  return (
    <section id="experiments" className="mt-6 mb-6">
      {/* Header — matches ProjectsSection typewriter aesthetic */}
      <div className="text-base font-mono mb-3 flex items-center gap-2">
        <span className="text-green">❯</span>
        <span className="text-accent">ls ./experiments</span>
      </div>

      {/* Dark container */}
      <div className="rounded-sm overflow-hidden p-5 sm:p-6 bg-dark border border-dark-border">
        {/* Sub-header inside dark zone */}
        <div className="text-sm font-mono mb-5 text-ink-2">
          tools and explorations — side projects, interactive essays, visual experiments
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXPERIMENTS.map((exp, i) => (
            <ExperimentCard key={exp.id} experiment={exp} index={i} />
          ))}
        </div>
      </div>
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
      {/* Year + arrow */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-mono text-ink-2">
          {experiment.year}
        </span>
        <span className="text-base font-mono text-green">
          ↗
        </span>
      </div>

      {/* Title */}
      <div
        className="font-display font-black text-white mb-1.5 leading-tight"
        style={{ fontSize: 'clamp(1.6875rem, 3.75vw, 2.25rem)' }}
      >
        {experiment.title}
      </div>

      {/* Description */}
      <p className="text-ui font-mono leading-relaxed mb-3 text-ink-3">
        {experiment.description}
      </p>

      {/* Tags */}
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
