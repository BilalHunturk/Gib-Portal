import { GibDocument } from "../models/gibDocument";

export function safeFileName(input: string) {
  return String(input || "")
    .replace(/İ/g, "I")
    .replace(/ı/g, "i")
    .replace(/Ğ/g, "G")
    .replace(/ğ/g, "g")
    .replace(/Ü/g, "U")
    .replace(/ü/g, "u")
    .replace(/Ş/g, "S")
    .replace(/ş/g, "s")
    .replace(/Ö/g, "O")
    .replace(/ö/g, "o")
    .replace(/Ç/g, "C")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 120);
}

export function normalizeDateForFileName(dateText: string) {
  const value = String(dateText || "").trim();

  // 01/06/2026, 01.06.2026, 01-06-2026
  const trDate = value.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);

  if (trDate) {
    return `${trDate[3]}-${trDate[2]}-${trDate[1]}`;
  }

  // 2026-06-01, 2026/06/01, 2026.06.01
  const isoDate = value.match(/^(\d{4})[./-](\d{2})[./-](\d{2})$/);

  if (isoDate) {
    return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
  }

  return "";
}

export function shortenText(input: string, maxLength: number) {
  const clean = safeFileName(input);

  return clean.length > maxLength ? clean.slice(0, maxLength) : clean;
}

export function buildInvoiceFileName(document: GibDocument) {
  const date = normalizeDateForFileName(document.tarih);
  const alici = shortenText(document.alici || "", 60);

  const belgeTuru = getDocumentTypeName(document.belgeTuru);

  const parts = [date, belgeTuru, alici].filter(Boolean);

  return safeFileName(parts.join("_")) || "Fatura";
}

function getDocumentTypeName(documentType: string) {
  const value = String(documentType || "").toUpperCase();

  if (value.includes("SMM")) {
    return "SMM";
  }

  if (value.includes("MUSTAHSIL") || value.includes("MÜSTAHSİL")) {
    return "Mustahsil";
  }

  return "Fatura";
}