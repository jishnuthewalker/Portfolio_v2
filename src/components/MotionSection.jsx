import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Masonry from 'react-masonry-css'
import { MOTION_VIDEOS } from '../data/motion'

const BREAKPOINTS = {
  default: 3,
  640: 2,
}

export function MotionSection() {
  const [typedCmd, setTypedCmd] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [visible, setVisible] = useState(false)

  const CMD = 'ls ./motion --type=reel'

  useEffect(() => {
    let cancelled = false
    const tileTimer = setTimeout(() => setVisible(true), 300)
    const startTimer = setTimeout(() => {
      let i = 0
      function type() {
        if (cancelled) return
        if (i < CMD.length) {
          setTypedCmd(CMD.slice(0, ++i))
          setTimeout(type, 18 + Math.random() * 16)
        } else {
          setShowCursor(false)
        }
      }
      type()
    }, 200)
    return () => {
      cancelled = true
      clearTimeout(tileTimer)
      clearTimeout(startTimer)
    }
  }, [])

  return (
    <section className="mt-8">
      <div className="text-[9.5px] text-[#888] mb-3 whitespace-nowrap overflow-hidden font-mono">
        <span style={{ color: 'var(--terminal-green)' }}>❯</span>{' '}
        <span>{typedCmd}</span>
        {showCursor && (
          <span style={{ color: 'hsl(277,65%,32%)', animation: 'blink 1s step-end infinite' }}>█</span>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Masonry
          breakpointCols={BREAKPOINTS}
          className="motion-masonry-grid"
          columnClassName="motion-masonry-col"
        >
          {MOTION_VIDEOS.map(video => (
            <iframe
              key={video.id}
              src={video.embedUrl}
              title={video.title}
              className="w-full rounded-[2px]"
              style={{
                border: '1px solid var(--ana-1-border)',
                aspectRatio: '16/9',
                display: 'block',
              }}
              allowFullScreen
              loading="lazy"
            />
          ))}
        </Masonry>
      </motion.div>
    </section>
  )
}
