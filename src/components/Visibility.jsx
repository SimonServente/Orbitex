import { formatTime, rangeText } from '../services/sky'

// Una línea que resume si el cuerpo se ve esta noche y cuándo
export default function Visibility({ info, body }) {
  if (!body.sky) return <span className="vis none">Sin cálculo de visibilidad</span>
  if (!info) return <span className="vis none">No se ve esta noche</span>
  return (
    <span className="vis yes">
      Visible esta noche {rangeText(info)}
      {info.until - info.from >= 30 * 60000 && ` · mejor a las ${formatTime(info.bestTime)}`} hacia el {info.direction}
    </span>
  )
}
