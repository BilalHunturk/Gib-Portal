import dayjs from "dayjs";

export function parseDocumentDate(dateText: string) {
  const formats = [
    "DD/MM/YYYY",
    "DD.MM.YYYY",
    "YYYY-MM-DD",
    "YYYY/MM/DD",
    "DD-MM-YYYY",
  ];

  for (const format of formats) {
    const parsed = dayjs(dateText, format, true);
    if (parsed.isValid()) {
      return parsed.valueOf();
    }
  }

  const fallback = dayjs(dateText);
  return fallback.isValid() ? fallback.valueOf() : 0;
}

export function formatDateForGib(date: Date) {
  return dayjs(date).format("DD/MM/YYYY");
}
