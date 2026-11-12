// Botón para agregar o quitar un cuerpo de la lista "Quiero ver"
export default function WishButton({ active, onToggle, compact = false }) {
  return (
    <button
      type="button"
      className={`wish ${active ? 'active' : ''} ${compact ? 'compact' : ''}`}
      onClick={(e) => { e.stopPropagation(); onToggle() }}
      aria-pressed={active}
      title={active ? 'Quitar de "Quiero ver"' : 'Agregar a "Quiero ver"'}
    >
      {active ? '★' : '☆'}{!compact && (active ? ' En tu lista' : ' Quiero ver')}
    </button>
  )
}
