import { CATALOG, INSTRUMENTS } from '../data/catalog'
import { formatTime, rangeText } from '../services/sky'
import Orb from './Orb'
import WishButton from './WishButton'
import SkyDome from './SkyDome'
import { nasaThumb } from '../services/nasa'

// Pestaña "Esta noche": qué cuerpos se pueden ver, cuándo y hacia dónde mirar
export default function Tonight({ sky, seenIds, wishIds, onToggleWish, onOpen, onUseMyLocation, locating }) {
  const { night, byBody, moon, location } = sky

  // Solo los cuerpos "principales" (las lunas de Júpiter/Saturno se ven junto a su planeta)
  const visible = CATALOG
    .filter((b) => byBody[b.id] && b.group !== 'Lunas')
    .sort((a, b) => byBody[a.id].bestTime - byBody[b.id].bestTime)
  const notVisible = CATALOG.filter((b) => b.sky && !byBody[b.id] && b.group !== 'Lunas')

  return (
    <>
      <section className="card tonight-head">
        <div className="moon-phase">
          <div
            className="moon-disc"
            style={{ '--lit': `${moon.illuminated}%` }}
            data-waxing={moon.waxing}
            aria-hidden="true"
          />
          <div>
            <h2>{moon.name}</h2>
            <p className="muted">{moon.illuminated}% iluminada</p>
            <p className="small">{moon.advice}</p>
          </div>
        </div>
        <div className="night-info">
          {night ? (
            <p>
              {night.isNight ? 'Ya es de noche' : `Oscurece a las ${formatTime(night.start)}`} · amanece a las{' '}
              {formatTime(night.end)}
            </p>
          ) : (
            <p>No se pudo calcular la noche para esta ubicación.</p>
          )}
          <p className="muted small">
            Calculado para {location.label}.{' '}
            <button className="link" onClick={onUseMyLocation} disabled={locating}>
              {locating ? 'Buscando ubicación…' : 'Usar mi ubicación'}
            </button>
          </p>
        </div>
      </section>

      <section className="card">
        <h2>Para ver esta noche ({visible.length})</h2>
        {visible.length === 0 && <p className="muted">Esta noche no hay planetas visibles desde tu ubicación.</p>}
        <ul className="tonight-list">
          {visible.map((b) => {
            const info = byBody[b.id]
            return (
              <li key={b.id}>
                <button className="tonight-item" onClick={() => onOpen(b.id)}>
                  <Orb color={b.color} image={nasaThumb(b.nasaId)} seen={seenIds.has(b.id)} size={48} />
                  <span className="tonight-text">
                    <strong>{b.name}</strong>
                    <span className="tonight-time">Mejor a las {formatTime(info.bestTime)}</span>
                    <small>
                      Mirá hacia el {info.direction}, {info.height} · visible {rangeText(info)} ·{' '}
                      {INSTRUMENTS[b.difficulty].toLowerCase()}
                    </small>
                  </span>
                </button>
                <WishButton compact active={wishIds.has(b.id)} onToggle={() => onToggleWish(b)} />
              </li>
            )
          })}
        </ul>
      </section>

      {night && visible.length > 0 && (
        <SkyDome bodies={visible} night={night} location={location} onOpen={onOpen} />
      )}

      {notVisible.length > 0 && (
        <section className="card">
          <h2>No se ven esta noche</h2>
          <p className="muted small">Están bajo el horizonte o demasiado cerca del Sol.</p>
          <div className="chips">
            {notVisible.map((b) => (
              <button key={b.id} className="chip" onClick={() => onOpen(b.id)}>{b.name}</button>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
