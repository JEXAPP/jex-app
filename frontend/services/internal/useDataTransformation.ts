export const useDataTransformation = () => {

  function stringToDate(fechaStr: string): Date {
    const [dia, mes, anio] = fechaStr.split('/').map(Number);
    // año, mesIndex (0-based), día → en local
    return new Date(anio, mes - 1, dia);
  }

  const formatFechaCorta = (date: string) => {
    const [day, month, year] = date.split('/');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

    const weekday = dateObj.toLocaleDateString('es-AR', { weekday: 'long' });
    const formattedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

    return `${formattedWeekday} ${day}/${month}`;
  };

  const formatFechaLarga = (fechaStr: string): string => {
    if (!fechaStr) return '';

    try {
      let fecha: Date;

      if (fechaStr.includes('/')) {
        // formato DD/MM/YYYY
        const [d, m, y] = fechaStr.split('/').map(Number);
        fecha = new Date(y, m - 1, d); // siempre local
      } else {
        // formato YYYY-MM-DD
        const [y, m, d] = fechaStr.split('-').map(Number);
        fecha = new Date(y, m - 1, d); // siempre local
      }

      const fechaFormateada = fecha.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).replace(',', '');

      return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    } catch (error) {
      console.log('Hubo un error:', error);
      console.warn('Fecha inválida:', fechaStr);
      return fechaStr;
    }
  };

  return { formatFechaCorta, formatFechaLarga, stringToDate };
};
