// Catálogo de Orbitex: qué cuerpos se pueden "coleccionar".
// El id es el que usa Le Système Solaire API (en francés).
// Los nombres en español y la dificultad de observación son contenido propio:
// la API no los trae y son la parte útil para alguien que mira el cielo.

export const CATALOG = [
  { id: 'lune', name: 'Luna', group: 'Luna', color: '#c9c9c9', difficulty: 'ojo',
    tip: 'Visible casi todas las noches. Con binoculares se ven cráteres en la línea entre luz y sombra.' },
  { id: 'mercure', name: 'Mercurio', group: 'Planetas', color: '#a39a8e', difficulty: 'ojo',
    tip: 'Difícil: siempre está cerca del Sol. Buscalo bajo en el horizonte justo después del atardecer o antes del amanecer.' },
  { id: 'venus', name: 'Venus', group: 'Planetas', color: '#e8cf8f', difficulty: 'ojo',
    tip: 'El punto más brillante del cielo después de la Luna. Aparece al atardecer o al amanecer.' },
  { id: 'mars', name: 'Marte', group: 'Planetas', color: '#d0603a', difficulty: 'ojo',
    tip: 'Se reconoce por su color anaranjado. No titila como las estrellas.' },
  { id: 'jupiter', name: 'Júpiter', group: 'Planetas', color: '#d9a066', difficulty: 'ojo',
    tip: 'Muy brillante. Con binoculares firmes se ven sus cuatro lunas grandes como puntitos en línea.' },
  { id: 'saturne', name: 'Saturno', group: 'Planetas', color: '#e3c58b', difficulty: 'ojo',
    tip: 'Se ve a ojo como una estrella amarillenta. Los anillos necesitan un telescopio pequeño.' },
  { id: 'uranus', name: 'Urano', group: 'Planetas', color: '#9fd8df', difficulty: 'binoculares',
    tip: 'En el límite de lo visible a ojo. Con binoculares y un mapa del cielo se encuentra como un punto verdoso.' },
  { id: 'neptune', name: 'Neptuno', group: 'Planetas', color: '#5b7fd6', difficulty: 'telescopio',
    tip: 'Solo con binoculares potentes o telescopio. Se ve como una estrella tenue azulada.' },
  { id: 'io', name: 'Ío', group: 'Lunas', color: '#e6d36a', difficulty: 'binoculares',
    tip: 'Luna de Júpiter. Uno de los puntitos que lo acompañan.' },
  { id: 'europe', name: 'Europa', group: 'Lunas', color: '#cdb89a', difficulty: 'binoculares',
    tip: 'Luna de Júpiter, la más chica de las cuatro galileanas.' },
  { id: 'ganymede', name: 'Ganímedes', group: 'Lunas', color: '#a8a29a', difficulty: 'binoculares',
    tip: 'Luna de Júpiter, la más grande del sistema solar.' },
  { id: 'callisto', name: 'Calisto', group: 'Lunas', color: '#7d7468', difficulty: 'binoculares',
    tip: 'Luna de Júpiter, la que más se aleja de él.' },
  { id: 'titan', name: 'Titán', group: 'Lunas', color: '#d6a95b', difficulty: 'telescopio',
    tip: 'La luna más grande de Saturno. Con telescopio se ve como un punto cerca del planeta.' },
  { id: 'pluton', name: 'Plutón', group: 'Planetas enanos', color: '#c8a98a', difficulty: 'telescopio',
    tip: 'El desafío final: necesita un telescopio grande y paciencia.' },
  { id: 'ceres', name: 'Ceres', group: 'Planetas enanos', color: '#8d8a84', difficulty: 'telescopio',
    tip: 'El planeta enano del cinturón de asteroides. A veces alcanza a verse con binoculares.' },
]

export const INSTRUMENTS = {
  ojo: 'A ojo',
  binoculares: 'Binoculares',
  telescopio: 'Telescopio',
}
