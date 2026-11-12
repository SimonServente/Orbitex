import { useState } from 'react'

// Representación de un cuerpo. Si tiene foto de NASA se muestra la foto;
// si todavía no se vio, la foto aparece como silueta (como en la Pokédex).
// Si la foto no carga, se usa una esfera con el color característico del cuerpo.
export default function Orb({ color, image, seen = true, size = 64 }) {
  const [failed, setFailed] = useState(false)

  if (image && !failed) {
    return (
      <img
        className={`orb photo ${seen ? '' : 'unseen'}`}
        src={image}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        style={{ '--orb': color, width: size, height: size }}
      />
    )
  }
  return (
    <div
      className={`orb ${seen ? '' : 'unseen'}`}
      style={{ '--orb': color, width: size, height: size }}
      aria-hidden="true"
    />
  )
}
