import { InvoiceDraftFormSnapshot } from "../types";
import { calculateLineTotal } from "./invoiceDraftCalculations";

export function validateInvoiceDraftForm(form: InvoiceDraftFormSnapshot) {
  const cleanVknTckn = form.vknTckn.trim();

  if (!cleanVknTckn) {
    return "VKN/TCKN giriniz.";
  }

  if (form.buyerType === "corporate") {
    if (cleanVknTckn.length !== 10) {
      return "Kurumsal alıcı için VKN 10 haneli olmalıdır.";
    }

    if (!form.aliciUnvan.trim()) {
      return "Alıcı unvanı giriniz.";
    }
  }

  if (form.buyerType === "person") {
    if (cleanVknTckn.length !== 11) {
      return "Şahıs alıcı için TCKN 11 haneli olmalıdır.";
    }

    if (!form.aliciAdi.trim()) {
      return "Alıcı adı giriniz.";
    }

    if (!form.aliciSoyadi.trim()) {
      return "Alıcı soyadı giriniz.";
    }
  }

  if (!form.vergiDairesi.trim()) {
    return "Vergi dairesi giriniz.";
  }

  if (!form.adres.trim()) {
    return "Adres giriniz.";
  }

  if (!form.mahalleSemtIlce.trim()) {
    return "Mahalle / Semt / İlçe bilgisi giriniz.";
  }

  if (!form.sehir.trim()) {
    return "Şehir giriniz.";
  }

  if (form.lines.length === 0) {
    return "En az bir mal/hizmet kalemi ekleyiniz.";
  }

  for (let index = 0; index < form.lines.length; index += 1) {
    const line = form.lines[index];
    const lineNo = index + 1;
    const lineTotal = calculateLineTotal(line);

    if (!line.malHizmet.trim()) {
      return `${lineNo}. kalemde mal/hizmet adı giriniz.`;
    }

    if (lineTotal.miktar <= 0) {
      return `${lineNo}. kalemde miktar 0'dan büyük olmalıdır.`;
    }

    if (lineTotal.birimFiyat <= 0) {
      return `${lineNo}. kalemde birim fiyat 0'dan büyük olmalıdır.`;
    }

    if (lineTotal.kdvOrani < 0) {
      return `${lineNo}. kalemde KDV oranı negatif olamaz.`;
    }
  }

  return "";
}
