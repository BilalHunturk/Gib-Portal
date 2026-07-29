import { amountToTurkishLiraText } from "../utils/amountText";
export type InvoiceDraftLineInput = {
  malHizmet: string;
  miktar: number;
  birimFiyat: number;
  kdvOrani: number;
  birim?: string;
  vergiCesidi?: string;
  iskontoArttm?: "İskonto" | "Artırım";
  iskontoOrani?: number;
  iskontoTutari?: number;
  iskontoNedeni?: string;
};

export type InvoiceDraftInput = {
  vknTckn: string;
  aliciUnvan: string;
  aliciAdi: string;
  aliciSoyadi: string;
  vergiDairesi: string;

  adres: string;
  mahalleSemtIlce: string;
  sehir: string;
  ulke: string;

  tarih: string;
  saat: string;
  not?: string;

  binaAdi?: string;
  binaNo?: string;
  kapiNo?: string;
  kasabaKoy?: string;
  postaKodu?: string;

  paraBirimi?: string;
  dovzTLkur?: number;
  faturaTipi?: string;

  siparisNumarasi?: string;
  siparisTarihi?: string;

  irsaliyeNumarasi?: string;
  irsaliyeTarihi?: string;

  tel?: string;
  fax?: string;
  eposta?: string;
  websitesi?: string;

  lines: InvoiceDraftLineInput[];
};

function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function safeNumber(value: number) {
  if (!Number.isFinite(value)) return 0;
  return round2(value);
}

function calculateLine(line: InvoiceDraftLineInput) {
  const miktar = safeNumber(line.miktar || 0);
  const birimFiyat = safeNumber(line.birimFiyat || 0);
  const kdvOrani = safeNumber(line.kdvOrani || 0);

  const fiyat = safeNumber(miktar * birimFiyat);

  const iskontoOrani = safeNumber(line.iskontoOrani || 0);
  const calculatedIskontoTutari = safeNumber((fiyat * iskontoOrani) / 100);
  const iskontoTutari = safeNumber(
    line.iskontoTutari ?? calculatedIskontoTutari
  );

  const iskontoArttm = line.iskontoArttm || "İskonto";

  const malHizmetTutari =
    iskontoArttm === "Artırım"
      ? safeNumber(fiyat + iskontoTutari)
      : safeNumber(fiyat - iskontoTutari);

  const kdvTutari = safeNumber((malHizmetTutari * kdvOrani) / 100);

  return {
    malHizmet: line.malHizmet,
    miktar,
    birim: line.birim || "C62",
    birimFiyat,
    fiyat,

    iskontoArttm,
    iskontoOrani,
    iskontoTutari,
    iskontoNedeni: line.iskontoNedeni || "",

    malHizmetTutari,
    kdvOrani,
    kdvTutari,

    vergininKdvTutari: 0,
    ozelMatrahTutari: 0,
    vergiCesidi: line.vergiCesidi || " ",
  };
}

export function buildInvoicePayload(input: InvoiceDraftInput) {
  const malHizmetTable = input.lines.map(calculateLine);

  const malhizmetToplamTutari = safeNumber(
    malHizmetTable.reduce((sum, item) => sum + item.fiyat, 0)
  );

  const matrah = safeNumber(
    malHizmetTable.reduce((sum, item) => sum + item.malHizmetTutari, 0)
  );

  const hesaplanankdv = safeNumber(
    malHizmetTable.reduce((sum, item) => sum + item.kdvTutari, 0)
  );

  const toplamIskonto = 0;
  const vergilerToplami = hesaplanankdv;
  const vergilerDahilToplamTutar = safeNumber(matrah + vergilerToplami);
  const odenecekTutar = vergilerDahilToplamTutar;
  const amountText = amountToTurkishLiraText(odenecekTutar);
  const userNote = input.not?.trim();

  const finalNote = userNote
    ? `${amountText}\n${userNote}`
    : amountText;
  return {
    // faturaUuid: createUuid(),
    faturaUuid: "",
    belgeNumarasi: "",
    faturaTarihi: input.tarih,
    saat: input.saat,
    paraBirimi: input.paraBirimi || "TRY",
    dovzTLkur: input.dovzTLkur ?? 0,
    faturaTipi: input.faturaTipi || "SATIS",
    hangiTip: "5000/30000",

    siparisNumarasi: input.siparisNumarasi || "",
    siparisTarihi: input.siparisTarihi || "",
    irsaliyeNumarasi: input.irsaliyeNumarasi || "",
    irsaliyeTarihi: input.irsaliyeTarihi || "",
    fisNo: "",
    fisTarihi: "",
    fisSaati: "",
    fisTipi: "",
    zRaporNo: "",
    okcSeriNo: "",

    vknTckn: input.vknTckn,
    aliciUnvan: input.aliciUnvan,
    aliciAdi: input.aliciAdi,
    aliciSoyadi: input.aliciSoyadi,

    bulvarcaddesokak: input.adres,
    binaAdi: input.binaAdi || "",
    binaNo: input.binaNo || "",
    kapiNo: input.kapiNo || "",
    kasabaKoy: input.kasabaKoy || "",
    mahalleSemtIlce: input.mahalleSemtIlce,
    sehir: input.sehir,
    postaKodu: input.postaKodu || "",
    ulke: input.ulke || "Türkiye",
    tel: input.tel || "",
    fax: input.fax || "",
    eposta: input.eposta || "",
    websitesi: input.websitesi || "",
    vergiDairesi: input.vergiDairesi,

    iadeTable: [],
    malHizmetTable,

    tip: "İskonto",
    matrah,
    malhizmetToplamTutari,
    malHizmetToplamTutari: malhizmetToplamTutari,
    toplamIskonto,
    hesaplanankdv,
    vergilerToplami,
    vergilerDahilToplamTutar,
    toplamMasraflar: 0,
    odenecekTutar,
    vergiCesidi: input.lines.find((line) => line.vergiCesidi && line.vergiCesidi !== " ")?.vergiCesidi || " ",

    not: finalNote,
  };
}

export function todayAsGibDate() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

export function nowAsGibTime() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

export function createUuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}