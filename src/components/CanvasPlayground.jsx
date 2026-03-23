import { useState } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'

export function CanvasPlayground() {
  // On touch devices, Excalidraw's touch-action:none hijacks page scroll.
  // Only mount Excalidraw after the user deliberately taps into the section.
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const [activated, setActivated] = useState(!isTouchDevice)

  return (
    <section id="canvas" className="mt-6 mb-6">
      {/* Header — matches ExperimentsSection terminal aesthetic */}
      <div className="text-base font-mono mb-3 flex items-center gap-2">
        <span className="text-green">❯</span>
        <span className="text-accent">open ./canvas --mode=draw</span>
      </div>

      {/* Canvas container — dark, fixed height, isolated stacking context */}
      <div
        className="rounded-sm overflow-hidden bg-dark border border-dark-border"
        style={{ height: '480px', isolation: 'isolate' }}
      >
        {activated ? (
          <Excalidraw
            initialData={{
              elements: [],
              appState: { viewBackgroundColor: 'transparent' },
            }}
            // No persistenceKey — fresh canvas on every page load (ephemeral).
            // To add persistence later: persistenceKey="portfolio-canvas-playground"
          />
        ) : (
          // Activation overlay — only shown on touch devices before first tap
          <div
            className="h-full flex flex-col items-center justify-center cursor-pointer gap-3"
            onClick={() => setActivated(true)}
          >
            <span className="text-2xl">✏️</span>
            <span className="text-muted text-sm font-mono">tap to draw</span>
          </div>
        )}
      </div>
    </section>
  )
}
