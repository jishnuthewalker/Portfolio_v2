import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/**
 * AccordionBar — clickable section header with one-shot typewriter on load.
 *
 * Props:
 *   label      — path string, e.g. './projects'
 *   meta       — summary string shown after typing, e.g. '8 projects · ux · 3d'
 *   isOpen     — boolean controlled by parent
 *   onToggle   — callback to flip isOpen
 *   typeDelay  — ms before typewriter starts (default 0)
 */
export function AccordionBar({ label, meta, isOpen, onToggle, typeDelay = 0 }) {
  const [typedLabel, setTypedLabel] = useState('')
  const [showCursor, setShowCursor] = useState(false)
  const [metaVisible, setMetaVisible] = useState(false)
  const cancelledRef = useRef(false)

  useEffect(() => {
    cancelledRef.current = false

    const startTimer = setTimeout(() => {
      if (cancelledRef.current) return
      setShowCursor(true)
      let i = 0

      function type() {
        if (cancelledRef.current) return
        if (i < label.length) {
          setTypedLabel(label.slice(0, ++i))
          setTimeout(type, 18 + Math.random() * 16)
        } else {
          // blink for 800ms then fade cursor, show meta
          setTimeout(() => {
            if (cancelledRef.current) return
            setShowCursor(false)
            setMetaVisible(true)
          }, 800)
        }
      }

      type()
    }, typeDelay)

    return () => {
      cancelledRef.current = true
      clearTimeout(startTimer)
    }
  }, [label, typeDelay])

  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-2 text-base font-mono mb-3 bg-transparent border-0 cursor-pointer text-left px-0 py-1 rounded-[2px] hover:opacity-75 transition-opacity duration-150"
    >
      <span className="text-green">❯</span>
      <span className="text-accent">{typedLabel}</span>

      {showCursor && (
        <span
          className="inline-block bg-accent"
          style={{
            width: '7px',
            height: '0.9em',
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }}
        />
      )}

      {metaVisible && meta && (
        <span className="text-muted text-sm">— {meta}</span>
      )}

      <motion.span
        className="text-faint text-sm ml-auto"
        animate={{ rotate: isOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ display: 'inline-block' }}
      >
        ▸
      </motion.span>
    </button>
  )
}
