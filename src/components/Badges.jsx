import { BADGES } from '../data/badges'

// Grilla de insignias: las bloqueadas se ven apagadas y dicen cómo conseguirlas
export default function Badges({ unlocked }) {
  const set = new Set(unlocked)
  return (
    <ul className="badges">
      {BADGES.map((b) => {
        const ok = set.has(b.id)
        return (
          <li key={b.id} className={`badge ${ok ? 'on' : ''}`}>
            <span className="badge-icon" aria-hidden="true">{b.icon}</span>
            <span>
              <strong>{b.name}</strong>
              <small>{ok ? 'Desbloqueada' : b.desc}</small>
            </span>
          </li>
        )
      })}
    </ul>
  )
}
