export function TerminalChrome() {
  return (
    <div className="flex items-center gap-1.5 mb-5">
      <div className="w-2.5 h-2.5 rounded-full bg-dot-red" />
      <div className="w-2.5 h-2.5 rounded-full bg-dot-yellow" />
      <div className="w-2.5 h-2.5 rounded-full bg-green" />
      <span className="text-base text-subtle ml-2 font-mono">~/jishnu/portfolio — zsh</span>
      <span className="ml-auto text-base flex items-center gap-1.5 text-green">
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-green"
          style={{
            animation: 'statusPulse 2s ease infinite'
          }}
        />
        open to interesting things
      </span>
    </div>
  )
}
