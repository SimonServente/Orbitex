import { BADGES } from '../data/badges'

// Grilla de insignias: las bloqueadas se ven apagadas y muestran cómo conseguirlas
export default function Badges({ unlocked }) {
  const set = new Set(unlocked)
  return (
    <section className="card">
      <h2>Insignias <span className="muted">{set.size}/{BADGES.length}</span></h2>
      <ul className="badges">
        {BADGES.map((b) => {
          const ok = set.has(b.id)
          return (
            <li key={b.id} className={`badge ${ok ? 'on' : ''}`} title={b.desc}>
              <span className="badge-icon" aria-hidden="true">{b.icon}</span>
              <strong>{b.name}</strong>
              <small>{ok ? 'Desbloqueada' : b.desc}</small>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
