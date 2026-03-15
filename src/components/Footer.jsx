import { motion } from 'framer-motion'

const LINKS = [
  { label: 'linkedin',  href: 'https://linkedin.com/in/jishnu-diwakar-b02a37160' },
  { label: 'behance',   href: 'https://behance.net/jishnuthewalker' },
  { label: 'instagram', href: 'https://instagram.com/jishnuthewalker/' },
  { label: 'resume ↗', href: 'https://drive.google.com/file/d/1RIVWbv4fpKQe4n8QgOEw5IhPWOxXeInc/view?pli=1' },
]

export function Footer() {
  return (
    <motion.footer
      className="mt-8 pt-4 border-t border-border flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center text-ui text-faint font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 1.2 }}
    >
      <span>
        {'© 2026 Jishnu Diwakar · '}
        <span className="text-green">जेदी</span>
        {' · Founding Designer @ '}
        <a
          href="https://nudgenow.com"
          target="_blank"
          rel="noreferrer"
          className="no-underline text-green"
        >
          Nudge
        </a>
      </span>
      <div className="flex gap-4">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            {...(href !== '#' ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="text-faint no-underline transition-colors duration-150 hover:text-accent"
          >
            {label}
          </a>
        ))}
      </div>
    </motion.footer>
  )
}
