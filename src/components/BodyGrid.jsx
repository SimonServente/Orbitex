import { useState } from 'react'
import { CATALOG, INSTRUMENTS } from '../data/catalog'
import Orb from './Orb'
import { normalize } from '../utils/text'

const GROUPS = ['Luna', 'Planetas', 'Lunas', 'Planetas enanos']


export default function BodyGrid({ seenIds, onOpen }) {
  const [search, setSearch] = useState('')
  const term = normalize(search.trim())

  // Busca por nombre o por grupo ("lunas" muestra todas las lunas)
  const results = CATALOG.filter(
    (b) => !term || normalize(b.name).includes(term) || normalize(b.group).includes(term),
  )

  return (
    <>
      <div className="search">
        <input
          type="search"
          placeholder="Buscar: Marte, Saturno, lunas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar en la Pokédex"
        />
      </div>

      {results.length === 0 && (
        <p className="muted empty">
          No hay ningún cuerpo que coincida con “{search.trim()}”.{' '}
          <button className="link" onClick={() => setSearch('')}>Ver todos</button>
        </p>
      )}

      {GROUPS.map((group) => {
        const bodies = results.filter((b) => b.group === group)
        if (bodies.length === 0) return null
        return (
          <section key={group} className="group">
            <h2>{group}</h2>
            <ul className="grid">
              {bodies.map((b) => {
                const seen = seenIds.has(b.id)
                const number = String(CATALOG.indexOf(b) + 1).padStart(3, '0')
                return (
                  <li key={b.id}>
                    <button className={`body-card ${seen ? 'seen' : ''}`} onClick={() => onOpen(b.id)}>
                      <span className="number">#{number}</span>
                      <Orb color={b.color} seen={seen} />
                      <strong>{b.name}</strong>
                      <small>{seen ? 'Visto' : INSTRUMENTS[b.difficulty]}</small>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </>
  )
}
