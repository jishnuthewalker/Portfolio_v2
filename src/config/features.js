// Feature flags — driven by environment variables.
// Set VITE_CANVAS_ENABLED=true in .env.local or deployment dashboard to enable canvas.
export const FEATURES = {
  canvas: import.meta.env.VITE_CANVAS_ENABLED === 'true',
}
