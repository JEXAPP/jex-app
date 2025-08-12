export const useDataTransformation = () =>{

    function stringToDate(fechaStr: string): Date {
        const [dia, mes, anio] = fechaStr.split('/').map(Number);
        return new Date(anio, mes - 1, dia);
    }

    const formatFechaCorta = (date: string) => {

        const [day, month, year] = date.split('/');
        const dateObj = new Date(Number(year), Number(month) - 1, Number(day));

        const weekday = dateObj.toLocaleDateString('es-AR', { weekday: 'long' });
        // Capitalizar primera letra
        const formattedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

        // Formato final: "Sábado 02/08"
        const formattedDate = `${formattedWeekday} ${day}/${month}`;

        return formattedDate
    }

    const formatFechaLarga = (fechaIso: string): string => {
        if (!fechaIso) return '';

        try {
            // Reordena si viene en formato DD/MM/YYYY
            const fechaNormalizada = fechaIso.includes('/')
            ? toISODate(fechaIso) 
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
            console.log('Hubo un error:', error)
            console.warn('Fecha inválida:', fechaIso);
            return fechaIso;
        }
        };

        // Utilidad para convertir DD/MM/YYYY a YYYY-MM-DD
        const toISODate = (ddmmaaaa: string): string => {
        const [d, m, y] = ddmmaaaa.split('/');
        return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        };

  return {formatFechaCorta, formatFechaLarga, stringToDate}
}