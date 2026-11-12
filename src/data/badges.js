// Insignias: se desbloquean solas según los avistamientos registrados.
// No se guardan en Firebase: se calculan a partir de los avistamientos, así nunca quedan desactualizadas.

const has = (seen, ...ids) => ids.every((id) => seen.has(id))

// Cantidad máxima de noches seguidas con algún avistamiento
function longestStreak(sightings) {
  const days = [...new Set(sightings.map((s) => s.date))].sort()
  let best = 0
  let current = 0
  let prev = null
  for (const d of days) {
    const date = new Date(`${d}T12:00:00`)
    current = prev && (date - prev) / 86400000 === 1 ? current + 1 : 1
    best = Math.max(best, current)
    prev = date
  }
  return best
}

export const BADGES = [
  { id: 'primero', icon: '✦', name: 'Primera luz', desc: 'Registrá tu primer avistamiento.',
    test: ({ sightings }) => sightings.length >= 1 },
  { id: 'luna', icon: '☾', name: 'Vecina', desc: 'Observá la Luna.',
    test: ({ seen }) => has(seen, 'lune') },
  { id: 'rojo', icon: '♂', name: 'Planeta rojo', desc: 'Encontrá a Marte.',
    test: ({ seen }) => has(seen, 'mars') },
  { id: 'gigantes', icon: '♃', name: 'Gigantes gaseosos', desc: 'Observá Júpiter y Saturno.',
    test: ({ seen }) => has(seen, 'jupiter', 'saturne') },
  { id: 'clasicos', icon: '✶', name: 'Los cinco clásicos', desc: 'Los planetas que se ven a ojo: Mercurio, Venus, Marte, Júpiter y Saturno.',
    test: ({ seen }) => has(seen, 'mercure', 'venus', 'mars', 'jupiter', 'saturne') },
  { id: 'galileo', icon: '◉', name: 'Como Galileo', desc: 'Las cuatro lunas que Galileo descubrió en 1610: Ío, Europa, Ganímedes y Calisto.',
    test: ({ seen }) => has(seen, 'io', 'europe', 'ganymede', 'callisto') },
  { id: 'hielo', icon: '❄', name: 'Gigantes de hielo', desc: 'Observá Urano y Neptuno.',
    test: ({ seen }) => has(seen, 'uranus', 'neptune') },
  { id: 'telescopio', icon: '⌖', name: 'Ojo de telescopio', desc: 'Registrá un avistamiento con telescopio.',
    test: ({ sightings }) => sightings.some((s) => s.instrument === 'telescopio') },
  { id: 'lejos', icon: '♇', name: 'Más allá', desc: 'Encontrá un planeta enano: Plutón o Ceres.',
    test: ({ seen }) => seen.has('pluton') || seen.has('ceres') },
  { id: 'noches', icon: '☽', name: 'Noctámbulo', desc: 'Observá el cielo en 5 noches distintas.',
    test: ({ sightings }) => new Set(sightings.map((s) => s.date)).size >= 5 },
  { id: 'racha', icon: '⚡', name: 'Racha', desc: 'Observá 3 noches seguidas.',
    test: ({ sightings }) => longestStreak(sightings) >= 3 },
  { id: 'completa', icon: '★', name: 'Colección completa', desc: 'Los 15 cuerpos de la Pokédex.',
    test: ({ seen, total }) => seen.size >= total },
]

export function unlockedBadges(sightings, total) {
  const seen = new Set(sightings.map((s) => s.bodyId))
  return BADGES.filter((b) => b.test({ sightings, seen, total })).map((b) => b.id)
}
