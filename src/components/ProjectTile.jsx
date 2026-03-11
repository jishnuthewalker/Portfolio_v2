import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { COLOR_MAP } from '../data/projects'
import { useScramble } from '../hooks/useScramble'

function makeBox(num, category, size) {
  const prefix = `┌─ [${num}] ${category} `
  const lengths = { featured: 56, half: 37, small: 15 }
  const total = lengths[size] || 15
  const dashes = Math.max(1, total - prefix.length - 1)
  const top = prefix + '─'.repeat(dashes) + '┐'
  const bot = '└' + '─'.repeat(top.length - 2) + '┘'
  return { top, bot }
}

export function ProjectTile({ project, dimmed = false, onOpen }) {
  const c = COLOR_MAP[project.colorKey]
  const { top, bot } = makeBox(project.num, project.category, project.size)
  const titleSize = project.size === 'featured' ? '20px' : project.size === 'half' ? '15px' : '12px'

  const titleRef = useRef(null)
  const { scrambleWithColor } = useScramble()
  const running = useRef(false)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnterScramble = useCallback(() => {
    if (running.current) return
    running.current = true
    scrambleWithColor(titleRef.current, project.title, c.title)
    setTimeout(() => { running.current = false }, 500)
  }, [scrambleWithColor, project.title, c.title])

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} project`}
      onClick={onOpen}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpen?.() }}
      style={{
        background: c.bg,
        borderWidth: '1px',
        borderStyle: 'solid',
        '--tile-chrome': c.chrome,
        '--tile-tag': c.tag,
        '--tile-title': c.title,
      }}
      className="rounded-sm p-3.5 relative cursor-pointer"
      initial={{ borderColor: c.borderRest }}
      animate={{
        opacity: dimmed ? 0.2 : 1,
        filter: dimmed ? 'grayscale(1)' : 'grayscale(0)',
        borderColor: hovered ? c.borderHover : c.borderRest,
      }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => { setHovered(true); handleMouseEnterScramble() }}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Arrow — translates on hover */}
      <span
        aria-hidden="true"
        className="absolute top-3 right-3.5 text-[11px] font-mono transition-all duration-200"
        style={{
          color: hovered ? c.title : 'var(--tile-chrome)',
          transform: hovered ? 'translate(2px, -2px)' : 'translate(0, 0)',
        }}
      >
        ↗
      </span>

      {/* box top */}
      <div className="text-[8px] leading-none mb-2 font-mono" style={{ color: 'var(--tile-chrome)' }}>{top}</div>

      {/* title */}
      <span
        ref={titleRef}
        className="block font-display font-black tracking-tight leading-tight mb-1"
        style={{ color: 'var(--tile-title)', fontSize: titleSize }}
      >
        {project.title}
      </span>

      {project.desc && (
        <div className="text-[8.5px] text-[#888] leading-relaxed mb-1.5 font-mono">{project.desc}</div>
      )}
      <div className="text-[8px] mt-1.5 font-mono" style={{ color: 'var(--tile-tag)' }}>
        {project.tags.join(' · ')}
      </div>
      <div className="text-[8px] leading-none mt-2 font-mono" style={{ color: 'var(--tile-chrome)' }}>{bot}</div>
    </motion.div>
  )
}
