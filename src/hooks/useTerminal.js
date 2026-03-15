// src/hooks/useTerminal.js
import { useState, useCallback, useRef } from 'react'
import { PROJECTS } from '../data/projects'
import { EXPERIMENTS } from '../data/experiments'

const COMMANDS = [
  'help', 'clear', 'ls', 'filter', 'open',
  'cd', 'whoami', 'echo', 'sudo', 'neofetch',
]

const HELP_TEXT = [
  'available commands:',
  '  ls [./projects|./experiments]  list items',
  '  filter <ux|3d|game|brand|all>  filter projects',
  '  open <name>                    open a project',
  '  cd <work|experiments|home>     navigate to section',
  '  whoami                         about me',
  '  neofetch                       system info',
  '  clear                          clear terminal',
  '  help                           show this help',
]

// ── Completion engine ─────────────────────────────────────────────────────────

function getCompletions(input) {
  if (!input.trim()) return []

  const hasSpace = input.includes(' ')

  if (!hasSpace) {
    const lower = input.toLowerCase()
    return COMMANDS.filter(c => c.startsWith(lower) && c !== lower)
  }

  const spaceIdx = input.indexOf(' ')
  const cmd      = input.slice(0, spaceIdx).toLowerCase()
  const prefix   = input.slice(0, spaceIdx + 1)
  const partial  = input.slice(spaceIdx + 1).toLowerCase()

  switch (cmd) {
    case 'filter': {
      const opts = ['ux', '3d', 'game', 'brand', 'all']
      return opts.filter(o => o.startsWith(partial) && o !== partial).map(o => prefix + o)
    }
    case 'open': {
      return PROJECTS
        .filter(p => p.id.startsWith(partial) && p.id !== partial)
        .map(p => prefix + p.id)
    }
    case 'cd': {
      const opts = ['work', 'experiments', 'home', '~']
      return opts.filter(o => o.startsWith(partial) && o !== partial).map(o => prefix + o)
    }
    case 'ls': {
      const opts = ['./projects', './experiments']
      return opts.filter(o => o.startsWith(partial) && o !== partial).map(o => prefix + o)
    }
    default:
      return []
  }
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTerminal({ onFilterChange, onOpenProject, onOpenAbout }) {
  const [history,    setHistory]    = useState([])
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [inputValue, setInputValue] = useState('')
  const [ghostText,  setGhostText]  = useState('')

  const inputRef = useRef(null)

  // Completions for the current typed input — used by ArrowRight accept
  const completionsRef = useRef([])

  // Tab cycling state — separate from the ghost/completions computed on typing.
  // base: the input value when Tab was first pressed (null = not cycling)
  // completions: the list locked in when Tab was first pressed
  // idx: -1 means "showing base", 0+ means "showing completions[idx]"
  const tabRef = useRef({ base: null, completions: [], idx: -1 })

  // ── handleChange — called ONLY on real user input (not programmatic setInputValue) ──
  // React's synthetic onChange does not fire when value is set via state, so Tab
  // cycling never accidentally triggers this.
  const handleChange = useCallback((val) => {
    setInputValue(val)
    // Any real typing resets the Tab cycle
    tabRef.current = { base: null, completions: [], idx: -1 }
    // Recompute ghost
    const matches = getCompletions(val)
    completionsRef.current = matches
    setGhostText(matches.length > 0 ? matches[0].slice(val.length) : '')
  }, [])

  // ── Command execution ──────────────────────────────────────────────────────

  const execCommand = useCallback((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setInputValue('')
    setGhostText('')
    setHistoryIdx(-1)
    tabRef.current = { base: null, completions: [], idx: -1 }
    completionsRef.current = []
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)])

    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)
    const arg = args.join(' ')

    let outputLines = []
    let sideEffect  = null

    switch (cmd) {
      case 'help':
        outputLines = HELP_TEXT
        break

      case 'clear':
        setHistory([])
        return

      case 'ls': {
        const target = args[0] || './projects'
        if (target === './experiments' || target === 'experiments') {
          outputLines = [
            'experiments/',
            ...EXPERIMENTS.map(e => `  ${e.id.padEnd(12)}  ${e.description.slice(0, 48)}`),
          ]
        } else {
          outputLines = [
            'projects/',
            ...PROJECTS.map(p => `  ${p.id.padEnd(14)}  ${p.title}`),
          ]
        }
        break
      }

      case 'filter': {
        const tag   = args[0]
        const valid = ['ux', '3d', 'game', 'brand', 'all']
        if (!tag || !valid.includes(tag)) {
          outputLines = [`usage: filter <${valid.join('|')}>`]
        } else {
          const filterVal = tag === 'all' ? null : tag
          sideEffect = () => {
            onFilterChange(filterVal)
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }
          outputLines = [tag === 'all' ? 'filter cleared — showing all projects' : `filtering by ${tag}`]
        }
        break
      }

      case 'open': {
        if (!arg) {
          outputLines = ['usage: open <project-name>', 'tip: try "ls" to see project IDs']
          break
        }
        const match = PROJECTS.find(p =>
          p.id.includes(arg) || p.title.toLowerCase().includes(arg)
        )
        if (match) {
          sideEffect  = () => onOpenProject(match.id)
          outputLines = [`opening ${match.title}…`]
        } else {
          outputLines = [`project not found: "${arg}"`, `try: ls ./projects`]
        }
        break
      }

      case 'cd': {
        const dest    = args[0]
        const destMap = { work: 'projects', projects: 'projects', experiments: 'experiments' }
        if (!dest) {
          outputLines = ['usage: cd <work|experiments|home>']
        } else if (dest === 'home' || dest === '~' || dest === '/') {
          sideEffect  = () => window.scrollTo({ top: 0, behavior: 'smooth' })
          outputLines = ['navigating to top…']
        } else if (destMap[dest]) {
          sideEffect  = () =>
            document.getElementById(destMap[dest])?.scrollIntoView({ behavior: 'smooth' })
          outputLines = [`navigating to ${dest}…`]
        } else {
          outputLines = [`no such directory: ${dest}`]
        }
        break
      }

      case 'whoami':
        sideEffect  = () => onOpenAbout()
        outputLines = ['jishnu diwakar', 'founding designer @ nudge', 'iit bombay · bangalore']
        break

      case 'echo':
        outputLines = [args.join(' ') || '']
        break

      case 'sudo':
        outputLines = ['nice try. 🙂']
        break

      case 'neofetch':
        outputLines = [
          '  jishnu@portfolio',
          '  ─────────────────',
          '  OS:   Figma · FigJam',
          '  WM:   React + Vite',
          '  DE:   Tailwind v4',
          '  Up:   since 2019',
          '  Role: Founding Designer',
          '  Co:   Nudge',
          '  Loc:  Bangalore, IN',
        ]
        break

      default:
        outputLines = [`command not found: ${cmd}`, `type 'help' for available commands`]
    }

    const newEntries = [
      { type: 'cmd',    text: trimmed },
      ...outputLines.map(text => ({ type: 'output', text })),
    ]
    setHistory(prev => [...prev, ...newEntries].slice(-60))
    sideEffect?.()
  }, [onFilterChange, onOpenProject, onOpenAbout])

  // ── Keyboard handler ───────────────────────────────────────────────────────

  const handleKeyDown = useCallback((e) => {

    // ── Tab: cycle through completions ──────────────────────────────────────
    if (e.key === 'Tab') {
      e.preventDefault()
      const ts = tabRef.current

      if (ts.idx === -1) {
        // First Tab press — lock in completions for this input
        const matches = getCompletions(inputValue)
        if (matches.length === 0) return
        ts.base        = inputValue
        ts.completions = matches
        ts.idx         = 0
        setInputValue(matches[0])
        setGhostText('')  // full value is in input — no ghost needed
      } else {
        const next = ts.idx + 1
        if (next >= ts.completions.length) {
          // Wrap: restore original input and re-show ghost
          const base  = ts.base
          const ghost = ts.completions[0].slice(base.length)
          ts.idx = -1
          setInputValue(base)
          setGhostText(ghost)
          // Keep ts.base/completions so Tab can cycle again immediately
        } else {
          ts.idx = next
          setInputValue(ts.completions[next])
          setGhostText('')
        }
      }
      return
    }

    // ── ArrowRight at end of input: accept ghost suggestion ─────────────────
    if (e.key === 'ArrowRight') {
      const atEnd = inputRef.current?.selectionStart === inputValue.length
      if (atEnd && completionsRef.current.length > 0) {
        e.preventDefault()
        const completed  = completionsRef.current[0]
        const isBareName = !completed.includes(' ')
        const accepted   = completed + (isBareName ? ' ' : '')
        setInputValue(accepted)
        setGhostText('')
        tabRef.current = { base: null, completions: [], idx: -1 }
        // Update completionsRef for the new value
        const next = getCompletions(accepted)
        completionsRef.current = next
      }
      return
    }

    // ── Enter: execute ───────────────────────────────────────────────────────
    if (e.key === 'Enter') {
      execCommand(inputValue)
      return
    }

    // ── ArrowUp: walk back through command history ───────────────────────────
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      tabRef.current = { base: null, completions: [], idx: -1 }
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      if (next !== historyIdx) {
        setHistoryIdx(next)
        setInputValue(cmdHistory[next] || '')
        setGhostText('')
        completionsRef.current = []
      }
      return
    }

    // ── ArrowDown: walk forward through command history ──────────────────────
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      tabRef.current = { base: null, completions: [], idx: -1 }
      const next = Math.max(historyIdx - 1, -1)
      if (next !== historyIdx) {
        setHistoryIdx(next)
        const val = next === -1 ? '' : (cmdHistory[next] || '')
        setInputValue(val)
        setGhostText('')
        completionsRef.current = []
      }
      return
    }

    // ── Escape: unfocus ──────────────────────────────────────────────────────
    if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }, [inputValue, execCommand, cmdHistory, historyIdx])

  return { history, inputValue, handleChange, handleKeyDown, inputRef, ghostText }
}
