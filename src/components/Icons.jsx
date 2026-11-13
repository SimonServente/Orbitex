// Íconos de la navegación (SVG propios, trazo fino para acompañar la tipografía)
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const IconCatalog = () => (
  <svg {...base}><circle cx="7" cy="7" r="3" /><circle cx="17" cy="7" r="3" /><circle cx="7" cy="17" r="3" /><circle cx="17" cy="17" r="3" /></svg>
)
export const IconNight = () => (
  <svg {...base}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" /><path d="M17 3v3M15.5 4.5h3" /></svg>
)
export const IconStar = () => (
  <svg {...base}><path d="m12 3 2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6-4.5-4.2 6.1-.7Z" /></svg>
)
export const IconLog = () => (
  <svg {...base}><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3Z" /><path d="M5 17a3 3 0 0 1 3-3h11M9 8h6" /></svg>
)
