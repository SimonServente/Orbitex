// Pasa a minúsculas y saca tildes, para que "jupiter" encuentre "Júpiter"
export const normalize = (text) =>
  text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
