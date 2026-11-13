import { CATALOG, INSTRUMENTS } from '../data/catalog'
import Orb from './Orb'
import Visibility from './Visibility'
import WishButton from './WishButton'
import { nasaThumb } from '../services/nasa'

// Pestaña "Quiero ver": los objetivos pendientes, con su visibilidad de esta noche.
// Los que se ven hoy aparecen primero.
export default function Wishlist({ wishlist, loading, sky, onToggleWish, onOpen }) {
  if (loading) return <section className="card"><p className="loading">Cargando tu lista…</p></section>

  const items = wishlist
    .map((w) => CATALOG.find((b) => b.id === w.bodyId))
    .filter(Boolean)
    .sort((a, b) => (sky.byBody[b.id] ? 1 : 0) - (sky.byBody[a.id] ? 1 : 0))
  const visibleCount = items.filter((b) => sky.byBody[b.id]).length

  return (
    <section className="card">
      <h2>Quiero ver</h2>
      {items.length === 0 ? (
        <p className="muted">
          Tu lista está vacía. Tocá ☆ en cualquier cuerpo del álbum para agregarlo como objetivo.
        </p>
      ) : (
        <>
          <p className="muted small">
            {visibleCount > 0
              ? `${visibleCount} de tus ${items.length} objetivos se pueden ver esta noche.`
              : 'Ninguno de tus objetivos se ve esta noche.'}{' '}
            Cuando registres un avistamiento, se tacha solo de la lista.
          </p>
          <ul className="sightings">
            {items.map((b) => (
              <li key={b.id} className="sighting">
                <Orb color={b.color} image={nasaThumb(b.nasaId)} seen={false} size={40} />
                <div className="sighting-info">
                  <strong>{b.name}</strong>
                  <small>{b.group} · se ve con: {INSTRUMENTS[b.difficulty].toLowerCase()}</small>
                  <Visibility info={sky.byBody[b.id]} body={b} />
                </div>
                <div className="sighting-actions">
                  <button className="secondary" onClick={() => onOpen(b.id)}>Ver ficha</button>
                  <WishButton compact active onToggle={() => onToggleWish(b)} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
