import { useEffect, useCallback } from 'react'

/**
 * Shared modal behaviour: Escape key close, body scroll lock.
 * Uses a CSS class (not inline style) so it wins over Excalidraw's
 * own body overflow manipulation via !important.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 */
export function useModal(isOpen, onClose) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.body.classList.add('modal-open')
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.classList.remove('modal-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])
}
