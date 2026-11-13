import { CATALOG } from '../data/catalog'
import { formatTime } from '../services/sky'

// Franja debajo del encabezado: la Luna de hoy y los próximos cuerpos visibles.
// Lleva a la pestaña "Esta noche" con el detalle y la brújula.
export default function TonightSummary({ sky, onOpenTonight, onOpen }) {
  const { moon, byBody } = sky
  const visible = CATALOG
    .filter((b) => byBody[b.id] && b.group !== 'Lunas')
    .sort((a, b) => byBody[a.id].bestTime - byBody[b.id].bestTime)
  const next = visible.slice(0, 3)

  return (
    <section className="tonight-strip" aria-label="Resumen de esta noche">
      <div className="strip-moon">
        <div className="moon-disc small" style={{ '--lit': `${moon.illuminated}%` }} data-waxing={moon.waxing} aria-hidden="true" />
        <p>
          <strong>{moon.name}</strong>
          <span>{moon.illuminated}% iluminada</span>
        </p>
      </div>

      <div className="strip-list">
        <p className="strip-title">
          {visible.length ? `Esta noche se ven ${visible.length}` : 'Esta noche no hay planetas a la vista'}
        </p>
        {next.length > 0 && (
          <ul>
            {next.map((b) => (
              <li key={b.id}>
                <button onClick={() => onOpen(b.id)}>
                  {b.name} <time>{formatTime(byBody[b.id].bestTime)}</time>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="strip-cta" onClick={onOpenTonight}>Ver la noche completa</button>
    </section>
  )
}
