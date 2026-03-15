import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PROJECTS, COLOR_MAP } from '../data/projects'
import { useModal } from '../hooks/useModal'

const SCRAMBLE = 'ABCDEFGHJKLMNPQRSTWXYZabcdefghjkmnpqrstuvwxyz0123456789#@!?%&*'
function rndStr(len) {
  let s = ''
  for (let i = 0; i < len; i++) s += SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
  return s
}

export function ProjectModal({ projectId, onClose }) {
  const project = PROJECTS.find(p => p.id === projectId)
  const isOpen  = !!project
  useModal(isOpen, onClose)
  const c = project ? COLOR_MAP[project.colorKey] : null

  const titleRef    = useRef(null)
  const roleRef     = useRef(null)
  const durationRef = useRef(null)
  const typeRef     = useRef(null)

  useEffect(() => {
    if (!isOpen || !project) return
    const rafs = []

    // ── Glitch flash on title ──────────────────────────────
    if (titleRef.current) {
      titleRef.current.animate([
        { textShadow: '-27px 0 rgba(255,0,60,.9), 27px 0 rgba(0,229,255,.9)' },
        { textShadow: '13px 0 rgba(255,0,60,.55), -13px 0 rgba(0,229,255,.55)', offset: 0.3 },
        { textShadow: '-4px 0 rgba(255,0,60,.1), 4px 0 rgba(0,229,255,.1)',     offset: 0.65 },
        { textShadow: 'none' },
      ], { duration: 320, easing: 'ease-out', fill: 'forwards' })
    }

    // ── Text decode on meta chips ──────────────────────────
    const chips = [
      { ref: roleRef,     text: project.role     || '' },
      { ref: durationRef, text: project.duration  || '' },
      { ref: typeRef,     text: project.type      || '' },
    ]

    chips.forEach(({ ref, text }, i) => {
      if (!ref.current || !text) return
      ref.current.textContent = rndStr(text.length)

      setTimeout(() => {
        const fieldDur = 480
        let start = null
        const step = ts => {
          if (!start) start = ts
          const p        = Math.min((ts - start) / fieldDur, 1)
          const resolved = Math.floor(p * text.length)
          let s = ''
          for (let j = 0; j < text.length; j++)
            s += j < resolved ? text[j] : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
          if (ref.current) ref.current.textContent = s
          if (p < 1) { rafs.push(requestAnimationFrame(step)) }
          else if (ref.current) ref.current.textContent = text
        }
        rafs.push(requestAnimationFrame(step))
      }, i * 90)
    })

    return () => {
      rafs.forEach(cancelAnimationFrame)
      titleRef.current?.getAnimations().forEach(a => a.cancel())
      if (roleRef.current)     roleRef.current.textContent     = project.role     || ''
      if (durationRef.current) durationRef.current.textContent = project.duration  || ''
      if (typeRef.current)     typeRef.current.textContent     = project.type      || ''
    }
  }, [isOpen, projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* Backdrop */}
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

          {/* Centering wrapper */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 pointer-events-none">
            {/* Panel — scanline wipe entry */}
            <motion.div
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label={`${project.title} project`}
              className="w-full max-w-xl pointer-events-auto rounded-sm overflow-hidden relative"
              style={{ background: c.bg, border: `1px solid ${c.borderHover}` }}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Scan head — sweeps top→bottom in sync with wipe */}
              <motion.div
                aria-hidden="true"
                className="absolute left-0 w-full pointer-events-none z-10"
                style={{
                  height: '6px',
                  background: `linear-gradient(transparent, hsl(277,65%,80%), transparent)`,
                }}
                initial={{ top: '0%', opacity: 1 }}
                animate={{ top: '105%', opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
              />

              {/* Scrollable content */}
              <div className="overflow-y-auto max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2.5rem)]">
                <div className="p-5">

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-mono mb-1.5" style={{ color: c.chrome }}>
                        {`┌─ [${project.num}] ${project.category}`}
                      </div>
                      <h2
                        ref={titleRef}
                        className="font-display font-black leading-tight tracking-tight"
                        style={{ color: c.title, fontSize: 'clamp(1.875rem, 6.75vw, 3.9375rem)' }}
                      >
                        {project.title}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="text-base font-mono text-faint hover:text-ink-3 transition-colors duration-150 ml-4 mt-1 flex-shrink-0"
                    >
                      ✕ close
                    </button>
                  </div>

                  {/* Meta chips */}
                  {(project.role || project.duration || project.type) && (
                    <div className="flex gap-2 flex-wrap mb-4">
                      {project.role && (
                        <div
                          className="text-sm font-mono px-2.5 py-1.5 rounded-[2px]"
                          style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${c.borderRest}` }}
                        >
                          <div style={{ color: c.chrome }} className="mb-0.5">ROLE</div>
                          <div ref={roleRef} style={{ color: c.title }}>{project.role}</div>
                        </div>
                      )}
                      {project.duration && (
                        <div
                          className="text-sm font-mono px-2.5 py-1.5 rounded-[2px]"
                          style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${c.borderRest}` }}
                        >
                          <div style={{ color: c.chrome }} className="mb-0.5">DURATION</div>
                          <div ref={durationRef} style={{ color: c.title }}>{project.duration}</div>
                        </div>
                      )}
                      {project.type && (
                        <div
                          className="text-sm font-mono px-2.5 py-1.5 rounded-[2px]"
                          style={{ background: 'rgba(255,255,255,0.5)', border: `1px solid ${c.borderRest}` }}
                        >
                          <div style={{ color: c.chrome }} className="mb-0.5">TYPE</div>
                          <div ref={typeRef} style={{ color: c.title }}>{project.type}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Brief */}
                  {project.brief && (
                    <p className="text-base font-mono leading-relaxed mb-4 text-ink-2">
                      {project.brief}
                    </p>
                  )}

                  {/* Hero image */}
                  {project.heroImage && (
                    <div
                      className="w-full rounded-[2px] overflow-hidden mb-4"
                      style={{ border: `1px solid ${c.borderRest}` }}
                    >
                      <img
                        src={project.heroImage}
                        alt={`${project.title} preview`}
                        className="w-full block object-cover"
                        style={{ maxHeight: '300px', objectPosition: 'top' }}
                      />
                    </div>
                  )}

                  {/* Footer: tags + behance link */}
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: `1px solid ${c.borderRest}` }}
                  >
                    <div className="text-sm font-mono" style={{ color: c.tag }}>
                      {project.tags.join(' · ')}
                    </div>
                    {project.behanceUrl && (
                      <a
                        href={project.behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-mono transition-opacity duration-150 hover:opacity-70 flex-shrink-0 ml-4"
                        style={{ color: c.title }}
                      >
                        view on behance ↗
                      </a>
                    )}
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
