import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function MasonryGrid({ items }) {
  const [columns, setColumns] = useState(3)

  useEffect(() => {
    const handleResize = () => setColumns(window.innerWidth > 640 ? 3 : 2)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ columns: columns, columnGap: '10px' }}>
      {items.map((item, i) => {
        // We use the pre-computed aspectRatio from motion.js (or fallback to 16/9 if missing)
        const ar = item.aspectRatio || (16/9);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            style={{ 
              breakInside: 'avoid', 
              marginBottom: '10px',
              position: 'relative',
              width: '100%',
              aspectRatio: ar
            }}
          >
            <iframe
              src={item.embedUrl}
              title={item.title}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                border: '1px solid var(--ana-1-border)',
                borderRadius: '2px',
                objectFit: 'cover'
              }}
              allowFullScreen
              loading="lazy"
            />
          </motion.div>
        )
      })}
    </div>
  )
}
