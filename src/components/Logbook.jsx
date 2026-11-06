import { useState } from 'react'
import { INSTRUMENTS } from '../data/catalog'
import { normalize } from '../utils/text'
import SightingList from './SightingList'

// Pestaña "Mi bitácora": todos los avistamientos, con buscador.
// Busca por cuerpo, lugar, notas, instrumento o fecha (ej: "marte", "palermo", "telescopio", "11/2026").
export default function Logbook({ sightings, loading, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const term = normalize(search.trim())

  const results = sightings.filter((s) => {
    if (!term) return true
    const text = [
      s.bodyName,
      s.place,
      s.notes,
      INSTRUMENTS[s.instrument],
      s.date.split('-').reverse().join('/'), // la fecha como se ve en pantalla
    ].join(' ')
    return normalize(text).includes(term)
  })

  return (
    <section className="card">
      <h2>Mi bitácora</h2>

      {sightings.length > 0 && (
        <div className="search">
          <input
            type="search"
            placeholder="Buscar por cuerpo, lugar, notas o fecha…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Buscar en la bitácora"
          />
          {term && (
            <small className="muted">
              {results.length} de {sightings.length} avistamientos
            </small>
          )}
        </div>
      )}

      {term && results.length === 0 ? (
        <p className="muted empty">
          Ningún avistamiento coincide con “{search.trim()}”.{' '}
          <button className="link" onClick={() => setSearch('')}>Ver todos</button>
        </p>
      ) : (
        <SightingList
          sightings={results}
          loading={loading}
          showBody
          onEdit={onEdit}
          onDelete={onDelete}
          empty="Todavía no registraste avistamientos. Abrí un cuerpo de la Pokédex para empezar."
        />
      )}
    </section>
  )
}
