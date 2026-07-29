export type BuyerType = "corporate" | "person";

export type DraftLineForm = {
  id: string;
  malHizmet: string;
  miktar: string;
  birimFiyat: string;
  kdvOrani: string;
  birim: string;
  vergiCesidi: string;
};

export type DraftLineTotal = {
  miktar: number;
  birimFiyat: number;
  kdvOrani: number;
  araToplam: number;
  kdvTutari: number;
  genelToplam: number;
};

export type DraftTotals = {
  araToplam: number;
  kdvTutari: number;
  genelToplam: number;
};

export type InvoiceDraftFormSnapshot = {
  buyerType: BuyerType;

  vknTckn: string;
  aliciUnvan: string;
  aliciAdi: string;
  aliciSoyadi: string;
  vergiDairesi: string;

  adres: string;
  mahalleSemtIlce: string;
  sehir: string;
  ulke: string;

  binaAdi: string;
  binaNo: string;
  kapiNo: string;
  kasabaKoy: string;
  postaKodu: string;

  faturaTipi: string;
  paraBirimi: string;
  dovzTLkur: string;

  siparisNumarasi: string;
  siparisTarihi: string;

  irsaliyeNumarasi: string;
  irsaliyeTarihi: string;

  tel: string;
  eposta: string;
  websitesi: string;

  note: string;
  lines: DraftLineForm[];
};
