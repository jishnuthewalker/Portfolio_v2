import { useCallback, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>/\\[]{}'
const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// All 7 project hues — sweeps purple → pink-purple during name scramble
const PALETTE_HSL = [
  [277, 65, 32],  // ana-1 dark
  [258, 73, 32],  // ana-2
  [264, 45, 41],  // ana-3
  [290, 50, 28],  // ana-4 dark
  [307, 52, 32],  // ana-5 dark
  [333, 60, 32],  // ana-6 dark
  [320, 52, 28],  // ana-7 dark
]

function lerpHSL(a, b, t) {
  let dh = b[0] - a[0]
  if (dh > 180) dh -= 360
  if (dh < -180) dh += 360
  return `hsl(${Math.round(a[0] + dh * t)},${Math.round(a[1] + (b[1] - a[1]) * t)}%,${Math.round(a[2] + (b[2] - a[2]) * t)}%)`
}

// Core scramble — getColor(progress 0→1) returns a CSS color string
function scrambleCore(el, target, duration, getColor, rafRef) {
  if (!el) return
  if (REDUCED) { el.innerHTML = target.replace(/\n/g, '<br>'); return }
  if (rafRef.current) cancelAnimationFrame(rafRef.current)

  let start = null
  const lines = target.split('\n')

  function frame(ts) {
    if (!start) start = ts
    const p = Math.min((ts - start) / duration, 1)
    const color = getColor(p)
    let html = ''
    lines.forEach((line, li) => {
      const revealed = Math.floor(p * line.length)
      for (let i = 0; i < line.length; i++) {
        if (line[i] === ' ') { html += ' '; continue }
        if (i < revealed) {
          html += line[i]
        } else {
          html += `<span style="color:${color};opacity:0.65">${CHARS[Math.floor(Math.random() * CHARS.length)]}</span>`
        }
      }
      if (li < lines.length - 1) html += '<br>'
    })
    el.innerHTML = html
    if (p < 1) {
      rafRef.current = requestAnimationFrame(frame)
    } else {
      el.innerHTML = target.replace(/\n/g, '<br>')
    }
  }
  rafRef.current = requestAnimationFrame(frame)
}

export function useScramble() {
  const rafRef = useRef(null)

  // For tile titles — uses the element's own computed color
  const scrambleWithColor = useCallback((el, target, color, duration = 420) => {
    scrambleCore(el, target, duration, () => color, rafRef)
  }, [])

  // For the name — sweeps through all project hues
  const scrambleName = useCallback((el, target, duration = 700) => {
    const steps = PALETTE_HSL.length - 1
    scrambleCore(el, target, duration, p => {
      const scaled = p * steps
      const idx = Math.min(Math.floor(scaled), steps - 1)
      return lerpHSL(PALETTE_HSL[idx], PALETTE_HSL[idx + 1], scaled - idx)
    }, rafRef)
  }, [])

  return { scrambleWithColor, scrambleName }
}
