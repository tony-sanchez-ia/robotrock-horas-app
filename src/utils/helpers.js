export const HOUR_RATE = 10.5;

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function fmt(date) {
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}

export function monthLabel(dateStr) {
  const [y, m] = dateStr.split('-');
  const names = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  return `${names[parseInt(m) - 1]} ${y}`;
}

export function thisMonth() {
  return today().slice(0, 7);
}

export function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('');
}
