// src/hooks/useTerminal.js
import { useState, useCallback, useRef } from 'react'
import { PROJECTS } from '../data/projects'
import { EXPERIMENTS } from '../data/experiments'

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

/**
 * useTerminal — command parser and history manager for the inline HeroBox prompt.
 *
 * @param {object} callbacks
 * @param {(tag: string|null) => void} callbacks.onFilterChange
 * @param {(id: string) => void}       callbacks.onOpenProject
 * @param {() => void}                 callbacks.onOpenAbout
 *
 * @returns {{ history, inputValue, setInputValue, handleKeyDown, inputRef }}
 */
export function useTerminal({ onFilterChange, onOpenProject, onOpenAbout }) {
  // history: array of { type: 'cmd' | 'output', text: string }
  const [history, setHistory] = useState([])
  // cmdHistory: array of previously run command strings for arrow-key recall
  const [cmdHistory, setCmdHistory] = useState([])
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const execCommand = useCallback((raw) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    setInputValue('')
    setHistoryIdx(-1)
    setCmdHistory(prev => [trimmed, ...prev.slice(0, 49)])

    const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)
    const arg = args.join(' ')

    let outputLines = []
    let sideEffect = null

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
        const tag = args[0]
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
          p.id.includes(arg) ||
          p.title.toLowerCase().includes(arg)
        )
        if (match) {
          sideEffect = () => onOpenProject(match.id)
          outputLines = [`opening ${match.title}…`]
        } else {
          outputLines = [`project not found: "${arg}"`, `try: ls ./projects`]
        }
        break
      }

      case 'cd': {
        const dest = args[0]
        const destMap = {
          work: 'projects',
          projects: 'projects',
          experiments: 'experiments',
        }
        if (!dest) {
          outputLines = ['usage: cd <work|experiments|home>']
        } else if (dest === 'home' || dest === '~' || dest === '/') {
          sideEffect = () => window.scrollTo({ top: 0, behavior: 'smooth' })
          outputLines = ['navigating to top…']
        } else if (destMap[dest]) {
          sideEffect = () =>
            document.getElementById(destMap[dest])?.scrollIntoView({ behavior: 'smooth' })
          outputLines = [`navigating to ${dest}…`]
        } else {
          outputLines = [`no such directory: ${dest}`]
        }
        break
      }

      case 'whoami':
        sideEffect = () => onOpenAbout()
        outputLines = [
          'jishnu diwakar',
          'founding designer @ nudge',
          'iit bombay · bangalore',
        ]
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
        outputLines = [
          `command not found: ${cmd}`,
          `type 'help' for available commands`,
        ]
    }

    const newEntries = [
      { type: 'cmd', text: trimmed },
      ...outputLines.map(text => ({ type: 'output', text })),
    ]

    setHistory(prev => [...prev, ...newEntries].slice(-60))
    sideEffect?.()
  }, [onFilterChange, onOpenProject, onOpenAbout])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      execCommand(inputValue)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(historyIdx + 1, cmdHistory.length - 1)
      if (next !== historyIdx) {
        setHistoryIdx(next)
        setInputValue(cmdHistory[next] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = Math.max(historyIdx - 1, -1)
      if (next !== historyIdx) {
        setHistoryIdx(next)
        setInputValue(next === -1 ? '' : (cmdHistory[next] || ''))
      }
    } else if (e.key === 'Escape') {
      inputRef.current?.blur()
    }
  }, [inputValue, execCommand, cmdHistory, historyIdx])

  return { history, inputValue, setInputValue, handleKeyDown, inputRef }
}
