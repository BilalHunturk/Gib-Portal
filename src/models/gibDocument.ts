export type GibDocument = {
  ettn: string;
  belgeNo: string;
  alici: string;
  aliciVknTckn: string;
  tarih: string;
  tutar: string;
  onayDurumu: string;
  belgeTuru: string;
  raw: any;
};

export function parseGibDocument(row: any): GibDocument {
  return {
    ettn: String(row?.ettn ?? row?.faturaUuid ?? row?.uuid ?? ""),
    belgeNo: String(row?.belgeNumarasi ?? row?.faturaNo ?? row?.belgeNo ?? ""),
    alici: String(row?.aliciUnvanAdSoyad ?? row?.alici ?? row?.unvan ?? ""),
    aliciVknTckn: String(row?.aliciVknTckn ?? row?.vknTckn ?? ""),
    tarih: String(row?.belgeTarihi ?? row?.faturaTarihi ?? row?.tarih ?? ""),
    tutar: String(row?.toplamTutar ?? row?.odenecekTutar ?? row?.tutar ?? ""),
    onayDurumu: String(row?.onayDurumu ?? row?.durum ?? ""),
    belgeTuru: String(row?.belgeTuru ?? row?.belgeTip ?? "FATURA"),
    raw: row,
  };
}