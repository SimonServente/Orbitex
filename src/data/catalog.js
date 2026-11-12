// Catálogo de Orbitex: qué cuerpos se pueden "coleccionar".
// El id es el que usa Le Système Solaire API (en francés).
// Los nombres en español y la dificultad de observación son contenido propio:
// la API no los trae y son la parte útil para alguien que mira el cielo.
// sky: nombre del cuerpo en Astronomy Engine para calcular si se ve esta noche.
// Las lunas de Júpiter y Saturno usan la posición de su planeta (se ven a su lado).
// nasaId: foto elegida a mano de la NASA Image Library (misiones Voyager, Cassini, Galileo, etc.).

export const CATALOG = [
  { id: 'lune', nasaId: 'PIA00405', sky: 'Moon', name: 'Luna', group: 'Luna', color: '#c9c9c9', difficulty: 'ojo',
    tip: 'Visible casi todas las noches. Con binoculares se ven cráteres en la línea entre luz y sombra.' },
  { id: 'mercure', nasaId: 'PIA15162', sky: 'Mercury', name: 'Mercurio', group: 'Planetas', color: '#a39a8e', difficulty: 'ojo',
    tip: 'Difícil: siempre está cerca del Sol. Buscalo bajo en el horizonte justo después del atardecer o antes del amanecer.' },
  { id: 'venus', nasaId: 'PIA00104', sky: 'Venus', name: 'Venus', group: 'Planetas', color: '#e8cf8f', difficulty: 'ojo',
    tip: 'El punto más brillante del cielo después de la Luna. Aparece al atardecer o al amanecer.' },
  { id: 'mars', nasaId: 'PIA00407', sky: 'Mars', name: 'Marte', group: 'Planetas', color: '#d0603a', difficulty: 'ojo',
    tip: 'Se reconoce por su color anaranjado. No titila como las estrellas.' },
  { id: 'jupiter', nasaId: 'PIA02873', sky: 'Jupiter', name: 'Júpiter', group: 'Planetas', color: '#d9a066', difficulty: 'ojo',
    tip: 'Muy brillante. Con binoculares firmes se ven sus cuatro lunas grandes como puntitos en línea.' },
  { id: 'saturne', nasaId: 'PIA11141', sky: 'Saturn', name: 'Saturno', group: 'Planetas', color: '#e3c58b', difficulty: 'ojo',
    tip: 'Se ve a ojo como una estrella amarillenta. Los anillos necesitan un telescopio pequeño.' },
  { id: 'uranus', nasaId: 'PIA18182', sky: 'Uranus', name: 'Urano', group: 'Planetas', color: '#9fd8df', difficulty: 'binoculares',
    tip: 'En el límite de lo visible a ojo. Con binoculares y un mapa del cielo se encuentra como un punto verdoso.' },
  { id: 'neptune', nasaId: 'PIA01492', sky: 'Neptune', name: 'Neptuno', group: 'Planetas', color: '#5b7fd6', difficulty: 'telescopio',
    tip: 'Solo con binoculares potentes o telescopio. Se ve como una estrella tenue azulada.' },
  { id: 'io', nasaId: 'PIA02308', sky: 'Jupiter', name: 'Ío', group: 'Lunas', color: '#e6d36a', difficulty: 'binoculares',
    tip: 'Luna de Júpiter. Uno de los puntitos que lo acompañan.' },
  { id: 'europe', nasaId: 'PIA19048', sky: 'Jupiter', name: 'Europa', group: 'Lunas', color: '#cdb89a', difficulty: 'binoculares',
    tip: 'Luna de Júpiter, la más chica de las cuatro galileanas.' },
  { id: 'ganymede', nasaId: 'PIA00716', sky: 'Jupiter', name: 'Ganímedes', group: 'Lunas', color: '#a8a29a', difficulty: 'binoculares',
    tip: 'Luna de Júpiter, la más grande del sistema solar.' },
  { id: 'callisto', nasaId: 'PIA03456', sky: 'Jupiter', name: 'Calisto', group: 'Lunas', color: '#7d7468', difficulty: 'binoculares',
    tip: 'Luna de Júpiter, la que más se aleja de él.' },
  { id: 'titan', nasaId: 'PIA14602', sky: 'Saturn', name: 'Titán', group: 'Lunas', color: '#d6a95b', difficulty: 'telescopio',
    tip: 'La luna más grande de Saturno. Con telescopio se ve como un punto cerca del planeta.' },
  { id: 'pluton', nasaId: 'PIA19857', sky: 'Pluto', name: 'Plutón', group: 'Planetas enanos', color: '#c8a98a', difficulty: 'telescopio',
    tip: 'El desafío final: necesita un telescopio grande y paciencia.' },
  { id: 'ceres', nasaId: 'PIA19562', sky: null, name: 'Ceres', group: 'Planetas enanos', color: '#8d8a84', difficulty: 'telescopio',
    tip: 'El planeta enano del cinturón de asteroides. A veces alcanza a verse con binoculares.' },
]

export const INSTRUMENTS = {
  ojo: 'A ojo',
  binoculares: 'Binoculares',
  telescopio: 'Telescopio',
}
