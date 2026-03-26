import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.jsx'
import { PROJECTS } from './data/projects'
import { EXPERIMENTS } from './data/experiments'
import { validateProjects } from './shared/contracts/project.contract'
import { validateExperiments } from './shared/contracts/experiment.contract'

// Initialize PostHog
posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
  api_host: import.meta.env.VITE_POSTHOG_HOST,
  person_profiles: 'identified_only',
})

if (import.meta.env.DEV) {
  const projectValidation = validateProjects(PROJECTS)
  if (!projectValidation.ok) {
    console.error('[contract] PROJECTS validation failed', projectValidation.errors)
  }

  const experimentValidation = validateExperiments(EXPERIMENTS)
  if (!experimentValidation.ok) {
    console.error('[contract] EXPERIMENTS validation failed', experimentValidation.errors)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider client={posthog}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
