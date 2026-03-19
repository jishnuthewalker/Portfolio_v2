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
  {
    id: 'p5-cube',
    title: 'Cube',
    description: 'Interactive 3D cube — RGB sliders + free-orbit camera.',
    url: '/Portfolio_v2/p5/cube.html',
    tags: ['3d', 'webgl'],
    year: '2024',
  },
  {
    id: 'p5-grid',
    title: 'Grid',
    description: 'Mouse-driven generative drawing with clear toggle.',
    url: '/Portfolio_v2/p5/grid.html',
    tags: ['interactive', 'generative'],
    year: '2024',
  },
  {
    id: 'p5-type',
    title: 'Type',
    description: '3D kinetic typography in WEBGL with parametric controls.',
    url: '/Portfolio_v2/p5/type.html',
    tags: ['type', 'webgl'],
    year: '2024',
  },
  {
    id: 'p5-crystals',
    title: 'Crystals',
    description: 'Tap-to-regenerate layered crystal compositions.',
    url: '/Portfolio_v2/p5/crystals.html',
    tags: ['generative', 'svg'],
    year: '2024',
  },
  {
    id: 'p5-meteors',
    title: 'Meteors',
    description: 'Mic-reactive noise curves that respond to ambient sound.',
    url: '/Portfolio_v2/p5/meteors.html',
    tags: ['audio', 'generative'],
    year: '2024',
  },
  {
    id: 'p5-eye',
    title: 'Eye',
    description: 'An eye that follows your cursor across a crimson canvas.',
    url: '/Portfolio_v2/p5/eye.html',
    tags: ['interactive'],
    year: '2024',
  },
  {
    id: 'p5-vj',
    title: 'VJ 01',
    description: 'Perlin noise visual experiment, mouse-controlled.',
    url: '/Portfolio_v2/p5/VJ_01.html',
    tags: ['vj', 'generative'],
    year: '2024',
  },
]
