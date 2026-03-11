import { useEffect, useCallback } from 'react'

/**
 * Shared modal behaviour: Escape key close, body scroll lock.
 * @param {boolean} isOpen
 * @param {() => void} onClose
 */
export function useModal(isOpen, onClose) {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])
}
