/**
 * Utility to calculate tomorrow's date formatted as DD Month YYYY in Asia/Kolkata timezone.
 * Used for dynamic rolling promotional batch start dates on the homepage.
 */
export function getRollingBatchDate(): string {
  const now = new Date();

  // Extract date components in Asia/Kolkata timezone
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const parts = formatter.formatToParts(now);
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  for (const part of parts) {
    if (part.type === 'year') year = parseInt(part.value, 10);
    if (part.type === 'month') month = parseInt(part.value, 10);
    if (part.type === 'day') day = parseInt(part.value, 10);
  }

  // Create UTC date representing Kolkata midnight, then advance by 1 day
  const kolkataDate = new Date(Date.UTC(year, month - 1, day));
  kolkataDate.setUTCDate(kolkataDate.getUTCDate() + 1);

  const tomorrowDay = String(kolkataDate.getUTCDate()).padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const tomorrowMonth = monthNames[kolkataDate.getUTCMonth()];
  const tomorrowYear = kolkataDate.getUTCFullYear();

  return `${tomorrowDay} ${tomorrowMonth} ${tomorrowYear}`;
}
