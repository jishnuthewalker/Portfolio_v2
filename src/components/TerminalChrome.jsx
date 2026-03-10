export function TerminalChrome() {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
      <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      <span className="text-[9px] text-[#aaa] ml-2 font-mono">~/jishnu/portfolio — zsh</span>
      <span className="ml-auto text-[9px] flex items-center gap-1.5" style={{ color: 'var(--terminal-green)' }}>
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            background: 'var(--terminal-green)',
            animation: 'statusPulse 2s ease infinite'
          }}
        />
        open to interesting things
      </span>
    </div>
  )
}
