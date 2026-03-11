import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, COLOR_MAP } from '../data/projects'
import { useModal } from '../hooks/useModal'

export function ProjectModal({ projectId, onClose }) {
  const project = PROJECTS.find(p => p.id === projectId)
  const isOpen = !!project

  useModal(isOpen, onClose)

  if (!project) return null

  const c = COLOR_MAP[project.colorKey]
  const cs = project.caseStudy

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(26,26,26,0.6)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
      )}
      {isOpen && (
        <motion.div
          key="panel"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
          className="fixed inset-x-4 top-8 bottom-8 z-50 overflow-y-auto rounded-sm md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl"
          style={{ background: '#FAF8F3', border: `1px solid ${c.borderHover}` }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="text-[8px] font-mono mb-1.5" style={{ color: c.chrome }}>
                    {`┌─ [${project.num}] ${project.category} `}
                  </div>
                  <h2
                    className="font-display font-black leading-tight tracking-tight"
                    style={{ color: c.title, fontSize: 'clamp(28px, 5vw, 40px)' }}
                  >
                    {project.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[9px] font-mono text-[#bbb] hover:text-[#555] transition-colors duration-150 ml-4 mt-1 flex-shrink-0"
                >
                  ✕ close
                </button>
              </div>

              {/* Metadata chips */}
              <div className="flex gap-2 flex-wrap mb-6">
                {[
                  { label: 'ROLE', value: cs.role },
                  { label: 'DURATION', value: cs.duration },
                  { label: 'TYPE', value: cs.type },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="text-[8px] font-mono px-2.5 py-1.5 rounded-[2px]"
                    style={{ background: c.bg, border: `1px solid ${c.borderRest}` }}
                  >
                    <div style={{ color: c.chrome }} className="mb-0.5">{label}</div>
                    <div style={{ color: c.title }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              {[
                { key: 'problem', label: 'problem' },
                { key: 'process', label: 'process' },
                { key: 'outcome', label: 'outcome' },
              ].map(({ key, label }) => (
                <div key={key} className="mb-6">
                  <div
                    className="flex items-center gap-2 text-[9px] font-mono font-bold mb-2"
                    style={{ color: c.title }}
                  >
                    <span style={{ color: 'var(--terminal-green)' }}>❯</span>
                    {label}
                  </div>
                  <p className="text-[11px] font-mono text-[#555] leading-relaxed">
                    {cs[key].text}
                  </p>
                  {cs[key].images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {cs[key].images.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-full rounded-[2px] object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Tags footer */}
              <div className="text-[8px] font-mono mt-4 pt-4 border-t" style={{ borderColor: c.borderRest, color: c.tag }}>
                {project.tags.join(' · ')}
              </div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  )
}
