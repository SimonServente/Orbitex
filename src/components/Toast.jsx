import { useEffect } from 'react'

// Mensaje de éxito o error que desaparece solo
export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`toast ${type}`} role="status">
      {message}
    </div>
  )
}
