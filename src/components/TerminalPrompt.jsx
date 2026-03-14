// src/components/TerminalPrompt.jsx
import { useEffect, useRef } from 'react'
import { useTerminal } from '../hooks/useTerminal'

/**
 * TerminalPrompt — inline command prompt at the bottom of HeroBox.
 * Delegates all logic to useTerminal; this component is purely presentational.
 */
export function TerminalPrompt({ onFilterChange, onOpenProject, onOpenAbout }) {
  const { history, inputValue, setInputValue, handleKeyDown, inputRef } =
    useTerminal({ onFilterChange, onOpenProject, onOpenAbout })

  const historyEndRef = useRef(null)

  // Auto-scroll history to bottom when new entries arrive
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [history])

  return (
    <div
      className="border-t border-[#e0ddd6] px-7 py-3 font-mono text-[10px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Command history — max ~88px tall, scrollable */}
      {history.length > 0 && (
        <div className="mb-2 max-h-[88px] overflow-y-auto">
          {history.map((entry, i) => (
            <div
              key={i}
              className="leading-[1.6] whitespace-pre-wrap break-all"
              style={{
                color: entry.type === 'cmd' ? 'var(--accent)' : '#888',
              }}
            >
              {entry.type === 'cmd' && (
                <span style={{ color: 'var(--terminal-green)' }}>❯ </span>
              )}
              {entry.text}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <span
          className="flex-shrink-0 select-none"
          style={{ color: 'var(--terminal-green)' }}
        >
          ❯
        </span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command… (try 'help')"
          className="flex-1 bg-transparent border-0 outline-none text-[10px] font-mono text-[#1a1a1a] placeholder-[#ccc] caret-[var(--accent)]"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
