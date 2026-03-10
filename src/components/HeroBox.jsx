export function HeroBox() {
  return (
    <div className="border border-[#d0cdc6] rounded-sm mb-6 overflow-hidden bg-[#FAF8F3]">
      <HeroTitlebar />
      <div className="px-7 pt-6 pb-5">
        <BigName />
        <RoleLine />
        <HeroFooter />
      </div>
    </div>
  )
}

function HeroTitlebar() {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-[#d0cdc6] text-[9px]">
      <span className="text-[13px] font-bold tracking-wide font-mono" style={{ color: 'var(--accent)' }}>
        जेदी
      </span>
      <nav className="flex gap-4 items-center">
        {['work', 'about', 'resume', 'blog'].map(item => (
          <a
            key={item}
            href="#"
            className="text-[#bbb] no-underline text-[8.5px] font-mono transition-colors duration-150 hover:text-[var(--accent)]"
            style={{ '--hover-color': 'var(--accent)' }}
          >
            {item}
          </a>
        ))}
        <a
          href="https://nudgenow.com"
          target="_blank"
          rel="noreferrer"
          className="text-[8.5px] font-mono px-2 py-0.5 rounded-[2px] transition-colors duration-150"
          style={{
            color: 'var(--accent)',
            border: '1px solid var(--accent-tint-35)',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-tint-08)'}
          onMouseLeave={e => e.currentTarget.style.background = ''}
        >
          nudge ↗
        </a>
      </nav>
    </div>
  )
}

function BigName() {
  return (
    <div
      className="font-display font-black leading-[0.88] tracking-[-4px] text-[#1a1a1a] mb-4 cursor-default select-none inline-block"
      style={{ fontSize: 'clamp(50px, 7vw, 76px)' }}
    >
      JISHNU<br />DIWAKAR
    </div>
  )
}

function RoleLine() {
  return (
    <div className="flex items-center gap-2.5 mb-3.5">
      <span className="text-[12px] font-bold font-mono" style={{ color: 'var(--accent)' }}>
        Founding Designer
      </span>
      <span className="text-[#ddd]">·</span>
      <span className="text-[9.5px] text-[#888] font-mono">Nudge · IIT Bombay · Bangalore</span>
    </div>
  )
}

function HeroFooter() {
  return (
    <div className="border-t border-[#e0ddd6] pt-3 flex items-center gap-3 text-[9px] text-[#bbb] font-mono">
      <span style={{ color: 'var(--terminal-green)' }}>❯</span>
      <span>crafting experiences that just feel right</span>
      <a
        href="mailto:jishnu@hey.com"
        className="ml-auto text-[9px] font-mono px-3 py-1 rounded-[2px] no-underline transition-all duration-150"
        style={{
          color: 'var(--accent)',
          border: '1px solid var(--accent-tint-30)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--accent-tint-08)'
          e.currentTarget.style.transform = 'translateX(2px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = ''
          e.currentTarget.style.transform = ''
        }}
      >
        let's chat ↗
      </a>
    </div>
  )
}
