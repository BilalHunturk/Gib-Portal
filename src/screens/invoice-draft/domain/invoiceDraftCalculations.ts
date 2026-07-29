import { DraftLineForm, DraftLineTotal, DraftTotals } from "../types";

export function createLine(): DraftLineForm {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    malHizmet: "Hizmet Bedeli",
    miktar: "1",
    birimFiyat: "100",
    kdvOrani: "20",
    birim: "C62",
    vergiCesidi: " ",
  };
}

export function toNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoney(value: number) {
  return value.toFixed(2);
}

export function calculateLineTotal(line: DraftLineForm): DraftLineTotal {
  const miktar = toNumber(line.miktar);
  const birimFiyat = toNumber(line.birimFiyat);
  const kdvOrani = toNumber(line.kdvOrani);

  const araToplam = miktar * birimFiyat;
  const kdvTutari = (araToplam * kdvOrani) / 100;
  const genelToplam = araToplam + kdvTutari;

  return {
    miktar,
    birimFiyat,
    kdvOrani,
    araToplam,
    kdvTutari,
    genelToplam,
  };
}

export function calculateDraftTotals(lines: DraftLineForm[]): DraftTotals {
  return lines.reduce(
    (sum, line) => {
      const lineTotal = calculateLineTotal(line);

      return {
        araToplam: sum.araToplam + lineTotal.araToplam,
        kdvTutari: sum.kdvTutari + lineTotal.kdvTutari,
        genelToplam: sum.genelToplam + lineTotal.genelToplam,
      };
    },
    {
      araToplam: 0,
      kdvTutari: 0,
      genelToplam: 0,
    }
  );
}
