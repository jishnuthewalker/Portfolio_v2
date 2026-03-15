import { useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useScramble } from '../hooks/useScramble'
import { TerminalPrompt } from './TerminalPrompt'

export function HeroBox({ onAboutOpen, onFilterChange, onOpenProject, onPaletteOpen }) {
  return (
    <div className="border border-border rounded-sm mb-6 overflow-hidden bg-surface">
      <HeroTitlebar onAboutOpen={onAboutOpen} onPaletteOpen={onPaletteOpen} />
      <div className="px-7 pt-6 pb-5">
        <BigName />
        <RoleLine />
      </div>
      <TerminalPrompt
        onFilterChange={onFilterChange}
        onOpenProject={onOpenProject}
        onOpenAbout={onAboutOpen}
      />
    </div>
  )
}

function HeroTitlebar({ onAboutOpen, onPaletteOpen }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border text-base">
      <span className="text-brand font-bold tracking-wide font-mono text-accent">
        जेदी
      </span>
      <nav className="flex gap-4 items-center">
        <a
          href="#projects"
          className="text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
        >
          work
        </a>
        <button
          type="button"
          onClick={onAboutOpen}
          className="text-faint text-ui font-mono transition-colors duration-150 hover:text-accent bg-transparent border-0 cursor-pointer p-0"
        >
          about
        </button>
        <a
          href="https://blog.jishnuthewalker.com"
          target="_blank"
          rel="noreferrer"
          className="text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
        >
          blog
        </a>
        <a
          href="https://drive.google.com/file/d/1RIVWbv4fpKQe4n8QgOEw5IhPWOxXeInc/view?pli=1"
          target="_blank"
          rel="noreferrer"
          className="text-faint no-underline text-ui font-mono transition-colors duration-150 hover:text-accent"
        >
          resume
        </a>
        {/* ⌘K / Ctrl+K hint — opens command palette */}
        <button
          type="button"
          onClick={onPaletteOpen}
          className="flex items-center gap-0.5 bg-transparent border-0 cursor-pointer p-0 group"
          title="Open command palette"
        >
          {[/Mac|iPhone|iPad/i.test(typeof navigator !== 'undefined' ? navigator.platform : '') ? '⌘' : 'Ctrl', 'K'].map((k, i) => (
            <kbd
              key={i}
              className="text-sm font-mono px-1 py-0.5 rounded-[2px] leading-none bg-kbd-bg border border-border-lt text-faint group-hover:text-accent group-hover:border-accent-border-2 transition-colors duration-150"
            >
              {k}
            </kbd>
          ))}
        </button>
        <a
          href="https://nudgenow.com"
          target="_blank"
          rel="noreferrer"
          className="text-ui font-mono px-2 py-0.5 rounded-[2px] text-accent border border-accent-border-2 transition-colors duration-150 hover:bg-accent-bg"
        >
          nudge ↗
        </a>
      </nav>
    </div>
  )
}

function BigName() {
  const textRef = useRef(null)
  const cursorRef = useRef(null)
  const { scrambleName } = useScramble()
  const running = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (cursorRef.current) {
        cursorRef.current.style.transition = 'opacity 0.4s'
        cursorRef.current.style.opacity = '0'
        setTimeout(() => {
          if (cursorRef.current) cursorRef.current.style.display = 'none'
        }, 400)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (running.current) return
    running.current = true
    scrambleName(textRef.current, 'JISHNU\nDIWAKAR')
    setTimeout(() => { running.current = false }, 800)
  }, [scrambleName])

  return (
    <div
      className="font-display font-black leading-[0.88] tracking-[-4px] text-ink mb-4 cursor-default select-none inline-flex items-end"
      style={{ fontSize: 'clamp(60px, 8vw, 90px)' }}
      onMouseEnter={handleMouseEnter}
    >
      <span ref={textRef}>JISHNU<br />DIWAKAR</span>
      <span
        ref={cursorRef}
        className="inline-block ml-1 align-bottom bg-accent"
        style={{
          width: 'clamp(4px, 0.5vw, 6px)',
          height: 'clamp(36px, 5.1vw, 56px)',
          animation: 'blink 1.1s step-end infinite',
        }}
      />
    </div>
  )
}

function RoleLine() {
  return (
    <motion.div
      className="flex items-center gap-2.5 mb-3.5"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <span className="text-heading font-bold font-mono text-accent">
        Founding Designer
      </span>
      <span className="text-dim">·</span>
      <span className="text-base text-muted font-mono">Nudge · IIT Bombay · Bangalore</span>
    </motion.div>
  )
}
