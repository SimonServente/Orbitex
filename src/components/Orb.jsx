// Representación visual de un cuerpo: una esfera con su color característico.
// Si todavía no se vio, se muestra como silueta (como en la Pokédex).
export default function Orb({ color, seen = true, size = 64 }) {
  return (
    <div
      className={`orb ${seen ? '' : 'unseen'}`}
      style={{ '--orb': color, width: size, height: size }}
      aria-hidden="true"
    />
  )
}
