// src/components/TerminalPrompt.jsx
import { useEffect, useRef } from 'react'
import { useTerminal } from '../hooks/useTerminal'

/**
 * TerminalPrompt — inline command prompt at the bottom of HeroBox.
 *
 * Ghost text overlay: an absolutely-positioned div sits behind the <input>.
 * It renders the typed portion as transparent text (to push the ghost to the
 * right position) then the ghost suffix in muted gray. Works perfectly with
 * JetBrains Mono since every character is the same width.
 *
 * Tab / ArrowRight accept the ghost. Tab cycles when multiple matches exist.
 * ArrowUp / ArrowDown walk command history.
 */
export function TerminalPrompt({ onFilterChange, onOpenProject, onOpenAbout }) {
  const { history, inputValue, handleChange, handleKeyDown, inputRef, ghostText } =
    useTerminal({ onFilterChange, onOpenProject, onOpenAbout })

  const historyEndRef = useRef(null)

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [history])

  return (
    <div
      className="border-t border-border-lt px-7 py-3 font-mono text-ui cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Command history */}
      {history.length > 0 && (
        <div className="mb-2 max-h-[160px] overflow-y-auto">
          {history.map((entry, i) => (
            <div
              key={i}
              className={`leading-[1.6] whitespace-pre-wrap break-all ${entry.type === 'cmd' ? 'text-accent' : 'text-muted'}`}
            >
              {entry.type === 'cmd' && (
                <span className="text-green">❯ </span>
              )}
              {entry.text}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0 select-none text-green">
          ❯
        </span>

        {/* Ghost text + real input stacked */}
        <div className="flex-1 relative">
          {/* Ghost overlay — sits behind the input, pointer-events disabled */}
          {ghostText && (
            <div
              className="absolute inset-0 flex items-center whitespace-pre font-mono text-ui pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              {/* Transparent spacer matches typed text width exactly (monospace) */}
              <span className="text-transparent">{inputValue}</span>
              {/* Muted ghost suffix */}
              <span className="text-faint" style={{ opacity: 0.55 }}>{ghostText}</span>
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={inputValue ? '' : "type a command… (try 'help')"}
            className="relative w-full bg-transparent border-0 outline-none text-ui font-mono text-ink placeholder-ghost caret-accent"
            style={{ padding: 0 }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>

        <a
          href="mailto:jishnu@hey.com"
          className="flex-shrink-0 text-ui font-mono px-3 py-1 rounded-[2px] no-underline text-accent border border-accent-border transition-all duration-150 hover:bg-accent-bg hover:translate-x-0.5"
        >
          let's chat ↗
        </a>
      </div>

      {/* Hint bar */}
      <div className="flex items-center gap-3 mt-1.5 select-none text-ghost">
        {[
          ['↑', '↓', 'history'],
          ['tab', 'cycle'],
          ['→', 'accept'],
          ['esc', 'blur'],
        ].map((group, gi) => (
          <span key={gi} className="flex items-center gap-0.5 text-[14px] font-mono">
            {group.slice(0, -1).map((k, ki) => (
              <kbd
                key={ki}
                className="bg-kbd-bg border border-border-lt text-subtle px-1 py-px rounded-[2px] leading-none"
              >
                {k}
              </kbd>
            ))}
            <span className="ml-0.5 text-ghost">{group[group.length - 1]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
