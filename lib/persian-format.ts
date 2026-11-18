// Reuse ICU formatters across renders; constructing one per card is expensive.
const dateFormatter = new Intl.DateTimeFormat("fa-IR", { timeZone: "Asia/Tehran" });
const numberFormatter = new Intl.NumberFormat("fa-IR");

export function formatPersianDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatPersianNumber(value: number) {
  return numberFormatter.format(value);
}
