import { useRef, useCallback } from 'react'
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

export function ProjectTile({ project, dimmed = false }) {
  const c = COLOR_MAP[project.colorKey]
  const { top, bot } = makeBox(project.num, project.category, project.size)
  const titleSize = project.size === 'featured' ? '20px' : project.size === 'half' ? '15px' : '12px'

  const titleRef = useRef(null)
  const { scrambleWithColor } = useScramble()
  const running = useRef(false)

  const handleMouseEnter = useCallback(() => {
    if (running.current) return
    running.current = true
    scrambleWithColor(titleRef.current, project.title, c.title)
    setTimeout(() => { running.current = false }, 500)
  }, [scrambleWithColor, project.title, c.title])

  return (
    <div
      style={{
        background: c.bg,
        borderColor: c.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        '--tile-chrome': c.chrome,
        '--tile-tag': c.tag,
        '--tile-title': c.title,
      }}
      className={[
        'rounded-sm p-3.5 relative cursor-pointer transition-all duration-200',
        dimmed ? 'opacity-20 grayscale' : '',
      ].join(' ')}
      onMouseEnter={handleMouseEnter}
    >
      <span
        className="absolute top-3 right-3.5 text-[11px] transition-transform duration-200"
        style={{ color: 'var(--tile-chrome)' }}
      >
        ↗
      </span>
      <div className="text-[8px] leading-none mb-2 font-mono" style={{ color: 'var(--tile-chrome)' }}>
        {top}
      </div>
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
      <div className="text-[8px] leading-none mt-2 font-mono" style={{ color: 'var(--tile-chrome)' }}>
        {bot}
      </div>
    </div>
  )
}
