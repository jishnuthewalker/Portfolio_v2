import { motion, AnimatePresence } from 'framer-motion'
import { useModal } from '../hooks/useModal'

const SOCIAL_LINKS = [
  { label: 'linkedin',  href: 'https://linkedin.com/in/jishnu-diwakar-b02a37160/' },
  { label: 'instagram', href: 'https://instagram.com/jishnuthewalker/' },
  { label: 'behance',   href: 'https://behance.net/jishnuthewalker' },
  { label: 'vimeo',     href: 'https://vimeo.com/showcase/6308449' },
  { label: 'email',     href: 'mailto:jishnu@hey.com' },
]

const BIO = [
  "I'm Jishnu— a little awkward, definitely quirky, and always curious. I enjoy stepping out of my comfort zone—trying new things (like salsa dancing!), meeting new people, and learning whatever sparks my interest.",
  "I'm a designer and tech enthusiast who loves creating experiences that just feel right. Whether it's UI/UX design, 3D animation, motion graphics, or game design, I'm always exploring how to combine creativity and functionality to make something that truly connects with people.",
  "When I'm not creating, you'll probably find me trekking, watching anime, vibing to Indian hip-hop, or enjoying some quiet time with nature and a strong cup of coffee.",
]

export function AboutModal({ isOpen, onClose }) {
  useModal(isOpen, onClose)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="about-backdrop"
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
          key="about-panel"
          role="dialog"
          aria-modal="true"
          aria-label="About Jishnu"
          className="fixed inset-x-4 top-8 bottom-8 z-50 overflow-y-auto rounded-sm md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-xl"
          style={{
            background: '#FAF8F3',
            border: '1px solid var(--ana-1-border)',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-[2px] flex-shrink-0 overflow-hidden"
                  style={{ border: '1px solid var(--ana-1-border)', background: 'var(--ana-1-bg)' }}
                >
                  <img
                    src="/avatar.jpg"
                    alt="Jishnu Diwakar"
                    className="w-full h-full object-cover"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div>
                  <div className="text-[8px] font-mono mb-1" style={{ color: 'var(--ana-1-chrome)' }}>
                    ┌─ about ──────────────
                  </div>
                  <h2
                    className="font-display font-black leading-tight tracking-tight"
                    style={{ color: 'var(--accent)', fontSize: 'clamp(22px, 4vw, 30px)' }}
                  >
                    जेदी
                  </h2>
                  <div className="text-[9px] font-mono mt-0.5" style={{ color: 'var(--ana-1-tag)' }}>
                    Founding Designer @ Nudge · IIT Bombay · Bangalore
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close about modal"
                className="text-[9px] font-mono text-[#bbb] hover:text-[#555] transition-colors duration-150 ml-4 mt-1 flex-shrink-0"
              >
                ✕ close
              </button>
            </div>

            <div className="space-y-3 mb-6">
              {BIO.map((para, i) => (
                <p key={i} className="text-[11px] font-mono text-[#555] leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div
              className="border-t pt-4"
              style={{ borderColor: 'var(--ana-1-border)' }}
            >
              <div className="text-[8px] font-mono mb-3" style={{ color: 'var(--ana-1-chrome)' }}>
                ❯ find me on
              </div>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noreferrer"
                    className="text-[8.5px] font-mono px-2.5 py-1 rounded-[2px] no-underline transition-all duration-150"
                    style={{
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-tint-30)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-tint-08)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = '' }}
                  >
                    {label} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
