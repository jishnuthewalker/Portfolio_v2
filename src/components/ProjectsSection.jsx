import { useState } from 'react'
import { PROJECTS, FILTERS } from '../data/projects'
import { ProjectTile } from './ProjectTile'

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState(null)

  function toggleFilter(value) {
    setActiveFilter(prev => prev === value ? null : value)
  }

  function isDimmed(project) {
    if (!activeFilter) return false
    return !project.skills.includes(activeFilter)
  }

  const featured = PROJECTS.filter(p => p.size === 'featured')
  const half = PROJECTS.filter(p => p.size === 'half')
  const small = PROJECTS.filter(p => p.size === 'small')

  return (
    <section>
      {/* Typewriter header */}
      <div className="text-[9.5px] text-[#888] mb-3 whitespace-nowrap overflow-hidden font-mono">
        <span style={{ color: 'var(--terminal-green)' }}>❯</span>{' '}
        <span>ls ./projects --sort=featured</span>
      </div>

      {/* Filter tags */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => toggleFilter(f.value)}
            className={[
              'text-[8.5px] font-mono border px-2 py-0.5 rounded-[2px] cursor-pointer transition-all duration-150',
              activeFilter === f.value
                ? 'text-white'
                : 'border-[#d0cdc6] text-[#888]',
            ].join(' ')}
            style={activeFilter === f.value
              ? { background: 'var(--accent)', borderColor: 'var(--accent)' }
              : {}
            }
            onMouseEnter={e => {
              if (activeFilter !== f.value) {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.background = 'var(--accent-tint-04)'
              }
            }}
            onMouseLeave={e => {
              if (activeFilter !== f.value) {
                e.currentTarget.style.borderColor = ''
                e.currentTarget.style.color = ''
                e.currentTarget.style.background = ''
              }
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Featured row: large left + stacked right */}
      <div className="grid gap-2.5 mb-2.5" style={{ gridTemplateColumns: '1.8fr 1fr' }}>
        {featured.map(p => (
          <ProjectTile key={p.id} project={p} dimmed={isDimmed(p)} />
        ))}
        <div className="flex flex-col gap-2.5">
          {half.map(p => (
            <ProjectTile key={p.id} project={p} dimmed={isDimmed(p)} />
          ))}
        </div>
      </div>

      {/* Small tiles */}
      <div className="grid grid-cols-4 gap-2.5">
        {small.map(p => (
          <ProjectTile key={p.id} project={p} dimmed={isDimmed(p)} />
        ))}
      </div>
    </section>
  )
}
