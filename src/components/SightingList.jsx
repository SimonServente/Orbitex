import { CATALOG, INSTRUMENTS } from '../data/catalog'
import Orb from './Orb'

const formatDate = (iso) => iso.split('-').reverse().join('/')

export default function SightingList({ sightings, loading, showBody, onEdit, onDelete, empty }) {
  if (loading) return <p className="loading">Cargando avistamientos…</p>
  if (sightings.length === 0) return <p className="muted">{empty}</p>

  return (
    <ul className="sightings">
      {sightings.map((s) => {
        const body = CATALOG.find((b) => b.id === s.bodyId)
        return (
          <li key={s.id} className="sighting">
            {showBody && <Orb color={body?.color ?? '#888'} size={40} />}
            <div className="sighting-info">
              {showBody && <strong>{s.bodyName}</strong>}
              <small>
                {formatDate(s.date)} · {INSTRUMENTS[s.instrument]}{s.place ? ` · ${s.place}` : ''}
              </small>
              {s.notes && <p className="notes">{s.notes}</p>}
            </div>
            <div className="sighting-actions">
              <button className="secondary" onClick={() => onEdit(s)}>Editar</button>
              <button className="danger" onClick={() => onDelete(s)}>Eliminar</button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
