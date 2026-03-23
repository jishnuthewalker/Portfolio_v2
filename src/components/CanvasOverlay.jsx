import { useState, useEffect } from 'react'
import { Excalidraw } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
import { useModal } from '../hooks/useModal'

// Module-level cache — snapshot is fetched once and reused across opens.
let snapshotCache = null

async function loadSnapshot() {
  if (snapshotCache) return snapshotCache
  const res = await fetch(`${import.meta.env.BASE_URL}canvas/snapshot.json`)
  if (!res.ok) throw new Error(`snapshot fetch failed: ${res.status}`)
  snapshotCache = await res.json()
  return snapshotCache
}

export function CanvasOverlay({ isOpen, onClose }) {
  const [snapshot, setSnapshot] = useState(null)
  const [error, setError] = useState(null)

  useModal(isOpen, onClose)

  // Fetch snapshot on first open; subsequent opens use the module-level cache.
  // State is set only inside async callbacks to avoid setState-in-effect lint error.
  useEffect(() => {
    if (!isOpen) return
    loadSnapshot()
      .then(data => { setSnapshot(data); setError(null) })
      .catch(err => setError(err))
  }, [isOpen])

  if (!isOpen) return null

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 bg-black/80 flex flex-col"
      onClick={onClose}
    >
      {/* Panel — stops click propagation so backdrop click works */}
      <div
        className="relative flex-1 m-4 rounded-sm overflow-hidden"
        style={{ isolation: 'isolate' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close canvas"
          className="absolute top-3 right-3 z-10 text-muted hover:text-ink font-mono text-sm bg-dark border border-dark-border rounded-sm px-2 py-1"
        >
          ✕ close
        </button>

        {/* Loading state */}
        {!snapshot && !error && (
          <div className="h-full flex items-center justify-center bg-dark border border-dark-border rounded-sm">
            <span className="text-muted text-sm font-mono">loading canvas...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="h-full flex items-center justify-center bg-dark border border-dark-border rounded-sm">
            <span className="text-muted text-sm font-mono">couldn't load canvas</span>
          </div>
        )}

        {/* Canvas — only mounted after snapshot resolves */}
        {snapshot && (
          <Excalidraw
            viewModeEnabled={true}
            initialData={snapshot}
          />
        )}
      </div>
    </div>
  )
}
