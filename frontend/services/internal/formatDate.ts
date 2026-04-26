import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.locale('es');

/** dd/mm/yyyy → "12/03/2025" */
export function formatDate(date: Date): string {
  return dayjs(date).format('DD/MM/YYYY');
}

/** Parse "dd/mm/yyyy" or ISO string to ms (for sort comparisons). Returns 0 on invalid. */
export function parseExpirationMs(dateStr: string, timeStr?: string): number {
  const base = dayjs(dateStr, 'DD/MM/YYYY', true);
  if (!base.isValid()) return 0;

  if (timeStr) {
    const [hh, mm] = timeStr.split(':').map(Number);
    return base.hour(hh ?? 0).minute(mm ?? 0).valueOf();
  }
  return base.valueOf();
}

/** Relative time in Spanish: "hace 3 días", "en 2 horas" */
export function fromNow(dateOrStr: Date | string): string {
  return dayjs(dateOrStr).fromNow();
}

/** Format any date to a display string: "lun. 12 mar. 2025" */
export function formatFull(dateOrStr: Date | string): string {
  return dayjs(dateOrStr).format('ddd D MMM YYYY');
}
