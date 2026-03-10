const LINKS = [
  { label: 'linkedin',   href: 'https://linkedin.com/in/jishnu-diwakar-b02a37160' },
  { label: 'behance',    href: 'https://behance.net/jishnuthewalker' },
  { label: 'instagram',  href: '#' },
  { label: 'resume ↗',  href: '#' },
]

export function Footer() {
  return (
    <footer className="mt-8 pt-4 border-t border-[#d0cdc6] flex justify-between items-center text-[8.5px] text-[#bbb] font-mono">
      <span>
        {'© 2026 Jishnu Diwakar · '}
        <span style={{ color: 'var(--terminal-green)' }}>जेदी</span>
        {' · Founding Designer @ '}
        <a
          href="https://nudgenow.com"
          target="_blank"
          rel="noreferrer"
          className="no-underline"
          style={{ color: 'var(--terminal-green)' }}
        >
          Nudge
        </a>
      </span>
      <div className="flex gap-4">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-[#bbb] no-underline transition-colors duration-150 hover:text-[var(--accent)]"
          >
            {label}
          </a>
        ))}
      </div>
    </footer>
  )
}
