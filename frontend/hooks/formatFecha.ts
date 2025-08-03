export const formatFecha = (fechaIso: string): string => {
  if (!fechaIso) return '';

  try {
    // Reordena si viene en formato DD/MM/YYYY
    const fechaNormalizada = fechaIso.includes('/')
      ? toISODate(fechaIso) // 👇
      : fechaIso;

    const fecha = new Date(fechaNormalizada);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).replace(',', '');

    return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
  } catch (error) {
    console.warn('Fecha inválida:', fechaIso);
    return fechaIso;
  }
};

// Utilidad para convertir DD/MM/YYYY a YYYY-MM-DD
const toISODate = (ddmmaaaa: string): string => {
  const [d, m, y] = ddmmaaaa.split('/');
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};
