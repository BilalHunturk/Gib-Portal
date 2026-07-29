import {
  InvoiceDraftInput,
  nowAsGibTime,
  todayAsGibDate,
} from "../../../models/invoiceDraft";
import { InvoiceDraftFormSnapshot } from "../types";
import { calculateLineTotal, toNumber } from "./invoiceDraftCalculations";

export function buildInvoiceDraftInput(
  form: InvoiceDraftFormSnapshot
): InvoiceDraftInput {
  return {
    vknTckn: form.vknTckn.trim(),

    aliciUnvan: form.buyerType === "corporate" ? form.aliciUnvan.trim() : "",
    aliciAdi: form.buyerType === "person" ? form.aliciAdi.trim() : "",
    aliciSoyadi: form.buyerType === "person" ? form.aliciSoyadi.trim() : "",

    vergiDairesi: form.vergiDairesi.trim(),

    adres: form.adres.trim(),
    mahalleSemtIlce: form.mahalleSemtIlce.trim(),
    sehir: form.sehir.trim(),
    ulke: form.ulke.trim() || "Türkiye",

    binaAdi: form.binaAdi.trim(),
    binaNo: form.binaNo.trim(),
    kapiNo: form.kapiNo.trim(),
    kasabaKoy: form.kasabaKoy.trim(),
    postaKodu: form.postaKodu.trim(),

    tarih: todayAsGibDate(),
    saat: nowAsGibTime(),

    paraBirimi: form.paraBirimi.trim() || "TRY",
    dovzTLkur: toNumber(form.dovzTLkur),
    faturaTipi: form.faturaTipi.trim() || "SATIS",

    siparisNumarasi: form.siparisNumarasi.trim(),
    siparisTarihi: form.siparisTarihi.trim(),

    irsaliyeNumarasi: form.irsaliyeNumarasi.trim(),
    irsaliyeTarihi: form.irsaliyeTarihi.trim(),

    tel: form.tel.trim(),
    eposta: form.eposta.trim(),
    websitesi: form.websitesi.trim(),

    not: form.note.trim(),

    lines: form.lines.map((line) => {
      const lineTotal = calculateLineTotal(line);

      return {
        malHizmet: line.malHizmet.trim(),
        miktar: lineTotal.miktar,
        birimFiyat: lineTotal.birimFiyat,
        kdvOrani: lineTotal.kdvOrani,
        birim: line.birim || "C62",
        vergiCesidi: line.vergiCesidi || " ",
      };
    }),
  };
}
