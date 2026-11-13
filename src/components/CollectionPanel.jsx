import { useEffect, useRef } from 'react'
import { CATALOG, INSTRUMENTS } from '../data/catalog'
import Badges from './Badges'
import { BADGES } from '../data/badges'

const GROUPS = ['Luna', 'Planetas', 'Lunas', 'Planetas enanos']

// Panel lateral con dos vistas:
// - "Tu colección": progreso total y por grupo, y estadísticas.
// - "Insignias": los logros desbloqueados y cómo conseguir los que faltan.
// Cada una se abre con su propio botón del encabezado (las insignias, también desde la bitácora).
export default function CollectionPanel({ mode, onClose, sightings, seenIds, badges }) {
  const open = mode !== null
  const closeRef = useRef(null)

  // Se cierra con Escape y el foco pasa al botón de cerrar al abrir
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null

  const nights = new Set(sightings.map((s) => s.date)).size
  const counts = sightings.reduce((acc, s) => ({ ...acc, [s.instrument]: (acc[s.instrument] || 0) + 1 }), {})
  const favorite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const percent = Math.round((seenIds.size / CATALOG.length) * 100)

  return (
    <div className="panel-backdrop" onClick={onClose}>
      <aside className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <h2 id="panel-title">{mode === 'insignias' ? 'Insignias' : 'Tu colección'}</h2>
          <button ref={closeRef} className="icon-btn" onClick={onClose} aria-label="Cerrar">×</button>
        </div>

        {mode === 'insignias' ? (
          <>
            <div className="panel-progress">
              <p className="big-number">
                {badges.length}<span>/{BADGES.length}</span>
              </p>
              <p className="muted">Se desbloquean solas a medida que registrás avistamientos.</p>
              <div className="bar"><span style={{ width: `${(badges.length / BADGES.length) * 100}%` }} /></div>
            </div>
            <Badges unlocked={badges} />
          </>
        ) : (
          <>
            <div className="panel-progress">
              <p className="big-number">
                {seenIds.size}<span>/{CATALOG.length}</span>
              </p>
              <p className="muted">{percent}% del sistema solar visto con tus propios ojos</p>
              <div className="bar"><span style={{ width: `${percent}%` }} /></div>
            </div>

            <ul className="group-progress">
              {GROUPS.map((g) => {
                const bodies = CATALOG.filter((b) => b.group === g)
                const seen = bodies.filter((b) => seenIds.has(b.id)).length
                return (
                  <li key={g}>
                    <span>{g}</span>
                    <span className="muted">{seen} de {bodies.length}</span>
                    <div className="bar thin"><span style={{ width: `${(seen / bodies.length) * 100}%` }} /></div>
                  </li>
                )
              })}
            </ul>

            <dl className="stats">
              <div><dt>Avistamientos</dt><dd>{sightings.length}</dd></div>
              <div><dt>Noches observando</dt><dd>{nights}</dd></div>
              <div><dt>Instrumento más usado</dt><dd>{favorite ? INSTRUMENTS[favorite] : 'Todavía ninguno'}</dd></div>
            </dl>

          </>
        )}
      </aside>
    </div>
  )
}
