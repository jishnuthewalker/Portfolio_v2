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
      <div className="text-[11px] font-mono mb-3 flex items-center gap-2">
        <span style={{ color: 'var(--terminal-green)' }}>❯</span>
        <span style={{ color: 'var(--accent)' }}>ls ./experiments</span>
      </div>

      {/* Dark container */}
      <div
        className="rounded-sm overflow-hidden p-5 sm:p-6"
        style={{
          background: '#111',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Sub-header inside dark zone */}
        <div className="text-[9px] font-mono mb-5" style={{ color: '#444' }}>
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
      className="block rounded-[2px] p-4 no-underline"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(40,200,64,0.35)'
        e.currentTarget.style.background   = 'rgba(40,200,64,0.04)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.background   = 'rgba(255,255,255,0.04)'
      }}
    >
      {/* Year + arrow */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-[9px] font-mono" style={{ color: '#444' }}>
          {experiment.year}
        </span>
        <span
          className="text-[11px] font-mono"
          style={{ color: 'var(--terminal-green)' }}
        >
          ↗
        </span>
      </div>

      {/* Title */}
      <div
        className="font-display font-black text-white mb-1.5 leading-tight"
        style={{ fontSize: 'clamp(18px, 2.5vw, 24px)' }}
      >
        {experiment.title}
      </div>

      {/* Description */}
      <p className="text-[10px] font-mono leading-relaxed mb-3" style={{ color: '#555' }}>
        {experiment.description}
      </p>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap">
        {experiment.tags.map(tag => (
          <span
            key={tag}
            className="text-[8px] font-mono px-1.5 py-0.5 rounded-[2px]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              color: '#444',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.a>
  )
}
