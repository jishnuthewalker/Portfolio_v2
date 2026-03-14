// src/data/experiments.js
// ─── ADD A NEW EXPERIMENT ─────────────────────────────────────────────────────
// Copy this block, increment num, add to the array.
//
// {
//   id:          'kebab-case-id',
//   title:       'Display Title',
//   description: 'One sentence describing the experiment.',
//   url:         'https://experiment.jishnuthewalker.com',
//   tags:        ['tool', 'animation'],   ← short labels for the tag chips
//   year:        '2024',
// },
// ────────────────────────────────────────────────────────────────────────────

export const EXPERIMENTS = [
  {
    id: 'wiggle',
    title: 'Wiggle',
    description: 'Physics-based spring animation playground. Tune stiffness, damping, and mass — copy the curve.',
    url: 'https://wiggle.jishnuthewalker.com',
    tags: ['animation', 'tool'],
    year: '2024',
  },
  {
    id: 'sorting',
    title: 'Sorting',
    description: 'Sorting algorithm visualizer. Watch bubble, merge, and quick sort race in real time.',
    url: 'https://sorting.jishnuthewalker.com',
    tags: ['algorithms', 'viz'],
    year: '2024',
  },
]
