// import axios from "axios";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Print from "expo-print";
// import JSZip from "jszip";
// import { GibDocument, parseGibDocument } from "../models/gibDocument";

// const USE_TEST_ENV = false;

// const BASE_URL = USE_TEST_ENV
//   ? "https://earsivportaltest.efatura.gov.tr"
//   : "https://earsivportal.efatura.gov.tr";

// function toFormUrlEncoded(data: Record<string, string>) {
//   return Object.entries(data)
//     .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
//     .join("&");
// }

// function makeCallId() {
//   return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
// }

// function safeFileName(input: string) {
//   return input
//     .replace(/İ/g, "I")
//     .replace(/ı/g, "i")
//     .replace(/Ğ/g, "G")
//     .replace(/ğ/g, "g")
//     .replace(/Ü/g, "U")
//     .replace(/ü/g, "u")
//     .replace(/Ş/g, "S")
//     .replace(/ş/g, "s")
//     .replace(/Ö/g, "O")
//     .replace(/ö/g, "o")
//     .replace(/Ç/g, "C")
//     .replace(/ç/g, "c")
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/[^a-zA-Z0-9_-]/g, "_")
//     .replace(/_+/g, "_")
//     .replace(/^_+|_+$/g, "")
//     .slice(0, 120);
// }

// function normalizeDateForFileName(dateText: string) {
//   const value = String(dateText || "").trim();

//   // 01/06/2026, 01.06.2026, 01-06-2026
//   const trDate = value.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
//   if (trDate) {
//     return `${trDate[3]}-${trDate[2]}-${trDate[1]}`;
//   }

//   // 2026-06-01, 2026/06/01
//   const isoDate = value.match(/^(\d{4})[./-](\d{2})[./-](\d{2})$/);
//   if (isoDate) {
//     return `${isoDate[1]}-${isoDate[2]}-${isoDate[3]}`;
//   }

//   return "";
// }

// function shortenText(input: string, maxLength: number) {
//   const clean = safeFileName(input);
//   return clean.length > maxLength ? clean.slice(0, maxLength) : clean;
// }

// function buildInvoiceFileName(document: GibDocument) {
//   const date = normalizeDateForFileName(document.tarih);
//   const alici = shortenText(document.alici || "", 60);

//   const belgeTuru = document.belgeTuru?.toUpperCase().includes("SMM")
//     ? "SMM"
//     : document.belgeTuru?.toUpperCase().includes("MUSTAHSIL")
//       ? "Mustahsil"
//       : "Fatura";

//   const parts = [
//     date,
//     belgeTuru,
//     alici,
//   ].filter(Boolean);

//   return safeFileName(parts.join("_")) || "Fatura";
// }

// export class GibService {
//   private token: string | null = null;

//   get isLoggedIn() {
//     return Boolean(this.token);
//   }

//   async login(username: string, password: string) {
//     const url = `${BASE_URL}/earsiv-services/assos-login`;

//     const body = toFormUrlEncoded({
//       assoscmd: USE_TEST_ENV ? "login" : "anologin",
//       userid: username,
//       sifre: password,
//       sifre2: password,
//       parola: password,
//     });

//     try {
//       const response = await axios.post(url, body, {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//         },
//         timeout: 30000,
//       });

//       const data = response.data;

//       if (!data?.token) {
//         // GİB API'den dönen hata mesajını kontrol et
//         if (data?.error) {
//           throw new Error(this.getLoginErrorMessage(data.error));
//         }
        
//         // Yanıt boşsa
//         if (!data || Object.keys(data).length === 0) {
//           throw new Error("Kullanıcı adı veya parola yanlış. Lütfen tekrar deneyin.");
//         }

//         throw new Error("GİB giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
//       }

//       this.token = String(data.token);
//       return this.token;
//     } catch (error: any) {
//       // Timeout hatası
//       if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
//         throw new Error("Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.");
//       }

//       // Network hatası
//       if (error.message?.includes("Network Error") || error.code === "ERR_NETWORK") {
//         throw new Error("İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin.");
//       }

//       // Zaten hata işlenmiş ise direkt throw et
//       if (error.message?.includes("Kullanıcı adı") || 
//           error.message?.includes("parola") || 
//           error.message?.includes("bağlantı") ||
//           error.message?.includes("GİB giriş")) {
//         throw error;
//       }

//       // Diğer hatalar
//       throw new Error("Giriş sırasında hata oluştu. Lütfen daha sonra tekrar deneyin.");
//     }
//   }

//   private getLoginErrorMessage(errorCode: string): string {
//     const errorMessages: Record<string, string> = {
//       "INVALID_CREDENTIALS": "Kullanıcı adı veya parola yanlış.",
//       "INVALID_USERNAME": "Kullanıcı adı bulunamadı.",
//       "INVALID_PASSWORD": "Parola yanlış.",
//       "ACCOUNT_LOCKED": "Hesabınız kilitli. Lütfen GİB destek hattı ile iletişime geçin.",
//       "USER_NOT_FOUND": "Bu kullanıcı adı sistemde bulunamadı.",
//       "ACCESS_DENIED": "Erişim reddedildi. Lütfen yetkiniz olup olmadığını kontrol edin.",
//     };

//     return errorMessages[errorCode] || "Kullanıcı adı veya parola yanlış. Lütfen tekrar deneyin.";
//   }

//   async logout() {
//     if (!this.token) return;

//     const url = `${BASE_URL}/earsiv-services/assos-login`;

//     const body = toFormUrlEncoded({
//       assoscmd: "logout",
//       token: this.token,
//     });

//     await axios.post(url, body, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//       },
//       timeout: 15000,
//     });

//     this.token = null;
//   }

//   private async dispatch(cmd: string, pageName: string, payload: Record<string, any>) {
//     if (!this.token) {
//       throw new Error("Token yok. Önce giriş yapılmalı.");
//     }

//     const url = `${BASE_URL}/earsiv-services/dispatch`;

//     const body = toFormUrlEncoded({
//       callid: makeCallId(),
//       token: this.token,
//       cmd,
//       pageName,
//       jp: JSON.stringify(payload ?? {}),
//     });

//     const response = await axios.post(url, body, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
//       },
//       timeout: 30000,
//     });

//     const data = response.data;

//     if (data?.error) {
//       throw new Error(`GİB hata döndürdü: ${JSON.stringify(data.error)}`);
//     }

//     return data;
//   }

//   async getIssuedDocuments(startDate: string, endDate: string) {
//     const result = await this.dispatch(
//       "EARSIV_PORTAL_TASLAKLARI_GETIR",
//       "RG_TASLAKLAR",
//       {
//         baslangic: startDate,
//         bitis: endDate,
//         hangiTip: "5000/30000",
//       }
//     );

//     const rows = Array.isArray(result?.data) ? result.data : [];

//     return rows.map(parseGibDocument).filter((doc: GibDocument) => {
//       // İlk testte çok sıkı filtreleme yapmayalım.
//       // Onay durumu alanı farklı dönerse belgeleri kaçırmayalım.
//       return doc.ettn || doc.belgeNo;
//     });
//   }

//   buildDownloadUrl(document: GibDocument) {
//     if (!this.token) {
//       throw new Error("Token yok. Önce giriş yapılmalı.");
//     }

//     if (!document.ettn) {
//       throw new Error("Belge ETTN bilgisi bulunamadı.");
//     }

//     const params = new URLSearchParams({
//       token: this.token,
//       ettn: document.ettn,
//       onayDurumu: document.onayDurumu || "Onaylandı",
//       belgeTip: document.belgeTuru || "FATURA",
//       cmd: "EARSIV_PORTAL_BELGE_INDIR",
//     });

//     return `${BASE_URL}/earsiv-services/download?${params.toString()}`;
//   }

//   async downloadDocument(document: GibDocument) {
//     const downloadUrl = this.buildDownloadUrl(document);

//     const nameBase = buildInvoiceFileName(document);
//     const zipUri = `${FileSystem.cacheDirectory}${nameBase}.zip`;

//     const result = await FileSystem.downloadAsync(downloadUrl, zipUri, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//       },
//     });

//     if (result.status !== 200) {
//       throw new Error(`Belge indirilemedi. HTTP ${result.status}`);
//     }

//     const pdfUri = await this.convertGibZipToPdf(zipUri, nameBase);

//     return pdfUri;
//   }

  

//   private async convertGibZipToPdf(zipUri: string, nameBase: string) {
//   const base64Encoding =
//     (FileSystem as any).EncodingType?.Base64 ??
//     (FileSystem as any).EncodingTypes?.Base64 ??
//     "base64";

//   const zipBase64 = await FileSystem.readAsStringAsync(zipUri, {
//     encoding: base64Encoding,
//   } as any);

//   const zip = await JSZip.loadAsync(zipBase64, { base64: true });

//   const files = Object.values(zip.files);

//   const htmlFile = files.find((file) => {
//     const fileName = file.name.toLowerCase();
//     return (
//       !file.dir &&
//       (fileName.endsWith(".html") ||
//         fileName.endsWith(".htm") ||
//         fileName.endsWith(".xhtml"))
//     );
//   });

//   if (!htmlFile) {
//     const fileNames = files.map((file) => file.name).join(", ");
//     throw new Error(`ZIP içinde HTML dosyası bulunamadı. Dosyalar: ${fileNames}`);
//   }

//   let html = await htmlFile.async("string");

//   // QR kod ve diğer görseller ZIP içinde ayrı dosya olarak geliyorsa
//   // burada base64 olarak HTML içine gömüyoruz.
//   html = await this.inlineZipAssetsIntoHtml(html, zip);
//   // GİB HTML içindeki qrvalue değerinden QR üretip qrcode alanına koy.
//   html = await this.injectGibQrCodeIntoHtml(html);
//   html = this.prepareHtmlForPdf(html);

//   const pdf = await Print.printToFileAsync({
//     html,
//     base64: false,
//   });

//   const finalPdfUri = `${FileSystem.cacheDirectory}${nameBase}.pdf`;

//   const existing = await FileSystem.getInfoAsync(finalPdfUri);
//   if (existing.exists) {
//     await FileSystem.deleteAsync(finalPdfUri, { idempotent: true });
//   }

//   await FileSystem.moveAsync({
//     from: pdf.uri,
//     to: finalPdfUri,
//   });

//   return finalPdfUri;
// }

//   private async inlineZipAssetsIntoHtml(html: string, zip: JSZip) {
//   let updatedHtml = html;

//   // <img src="...">
//   updatedHtml = await this.replaceHtmlAssetReferences(
//     updatedHtml,
//     zip,
//     /(<img\b[^>]*?\bsrc=["'])([^"']+)(["'][^>]*>)/gi
//   );

//   // SVG içinde <image href="...">
//   updatedHtml = await this.replaceHtmlAssetReferences(
//     updatedHtml,
//     zip,
//     /(<image\b[^>]*?\bhref=["'])([^"']+)(["'][^>]*>)/gi
//   );

//   // SVG içinde <image xlink:href="...">
//   updatedHtml = await this.replaceHtmlAssetReferences(
//     updatedHtml,
//     zip,
//     /(<image\b[^>]*?\bxlink:href=["'])([^"']+)(["'][^>]*>)/gi
//   );

//   // CSS içinde url(...)
//   updatedHtml = await this.replaceCssUrlReferences(updatedHtml, zip);

//   return updatedHtml;
// }

// private async replaceHtmlAssetReferences(
//   html: string,
//   zip: JSZip,
//   regex: RegExp
// ) {
//   const matches = Array.from(html.matchAll(regex));
//   let updatedHtml = html;

//   for (const match of matches) {
//     const fullMatch = match[0];
//     const before = match[1];
//     const src = match[2];
//     const after = match[3];

//     if (!src || this.shouldSkipAsset(src)) {
//       continue;
//     }

//     const dataUri = await this.getZipAssetAsDataUri(zip, src);

//     if (!dataUri) {
//       continue;
//     }

//     updatedHtml = updatedHtml.replace(fullMatch, `${before}${dataUri}${after}`);
//   }

//   return updatedHtml;
// }

// private async replaceCssUrlReferences(html: string, zip: JSZip) {
//   const regex = /url\((["']?)([^"')]+)\1\)/gi;
//   const matches = Array.from(html.matchAll(regex));
//   let updatedHtml = html;

//   for (const match of matches) {
//     const fullMatch = match[0];
//     const src = match[2];

//     if (!src || this.shouldSkipAsset(src)) {
//       continue;
//     }

//     const dataUri = await this.getZipAssetAsDataUri(zip, src);

//     if (!dataUri) {
//       continue;
//     }

//     updatedHtml = updatedHtml.replace(fullMatch, `url("${dataUri}")`);
//   }

//   return updatedHtml;
// }

// private shouldSkipAsset(src: string) {
//   const value = src.trim().toLowerCase();

//   return (
//     value.startsWith("data:") ||
//     value.startsWith("http://") ||
//     value.startsWith("https://") ||
//     value.startsWith("mailto:") ||
//     value.startsWith("javascript:")
//   );
// }

// private async getZipAssetAsDataUri(zip: JSZip, src: string) {
//   const cleanSrc = this.cleanAssetPath(src);
//   const file = this.findZipFile(zip, cleanSrc);

//   if (!file) {
//     return null;
//   }

//   const extension = cleanSrc.split(".").pop()?.toLowerCase() ?? "";
//   const mimeType = this.getMimeType(extension);
//   const base64 = await file.async("base64");

//   return `data:${mimeType};base64,${base64}`;
// }

// private cleanAssetPath(src: string) {
//   let clean = src.trim();

//   clean = clean.split("?")[0];
//   clean = clean.split("#")[0];

//   try {
//     clean = decodeURIComponent(clean);
//   } catch {
//     // Decode edilemezse olduğu gibi devam ederiz.
//   }

//   clean = clean.replace(/\\/g, "/");
//   clean = clean.replace(/^\.?\//, "");
//   clean = clean.replace(/^\/+/, "");

//   return clean;
// }

// private findZipFile(zip: JSZip, src: string) {
//   const files = Object.values(zip.files).filter((file) => !file.dir);

//   const normalizedSrc = src.toLowerCase().replace(/\\/g, "/");
//   const srcFileName = normalizedSrc.split("/").pop();

//   // 1. Birebir yol eşleşmesi
//   let found = files.find((file) => {
//     return file.name.toLowerCase().replace(/\\/g, "/") === normalizedSrc;
//   });

//   if (found) {
//     return found;
//   }

//   // 2. Dosya yolu sonu eşleşmesi
//   found = files.find((file) => {
//     return file.name.toLowerCase().replace(/\\/g, "/").endsWith(normalizedSrc);
//   });

//   if (found) {
//     return found;
//   }

//   // 3. Sadece dosya adı eşleşmesi
//   found = files.find((file) => {
//     const fileName = file.name.toLowerCase().replace(/\\/g, "/").split("/").pop();
//     return fileName === srcFileName;
//   });

//   return found ?? null;
// }

// private getMimeType(extension: string) {
//   switch (extension) {
//     case "png":
//       return "image/png";
//     case "jpg":
//     case "jpeg":
//       return "image/jpeg";
//     case "gif":
//       return "image/gif";
//     case "svg":
//       return "image/svg+xml";
//     case "webp":
//       return "image/webp";
//     case "bmp":
//       return "image/bmp";
//     default:
//       return "application/octet-stream";
//   }
// }

// private async injectGibQrCodeIntoHtml(html: string) {
//   const qrValue = this.extractQrValueFromHtml(html);

//   if (!qrValue) {
//     return html;
//   }

//   const QRCode = await import("qrcode");

//   const qrSvg = await QRCode.default.toString(qrValue, {
//     type: "svg",
//     errorCorrectionLevel: "H",
//     margin: 0,
//     width: 220,
//     color: {
//       dark: "#000000",
//       light: "#ffffff",
//     },
//   });

//   const qrDataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(qrSvg)}`;

//   const qrImageHtml = `
//     <img
//       src="${qrDataUri}"
//       alt="QR Kod"
//       style="width:220px;height:220px;display:block;"
//     />
//   `;

//   let updatedHtml = html.replace(
//     /<div\b([^>]*\bid=["']qrcode["'][^>]*)>\s*<\/div>/i,
//     `<div $1>${qrImageHtml}</div>`
//   );

//   if (updatedHtml === html) {
//     updatedHtml = html.replace(
//       /<div\b(?=[^>]*\bid=["']qrcode["'])[^>]*>[\s\S]*?<\/div>/i,
//       `<div id="qrcode">${qrImageHtml}</div>`
//     );
//   }

//   return updatedHtml;
// }

//   private extractQrValueFromHtml(html: string) {
//     const match = html.match(
//       /<div\b(?=[^>]*\bid=["']qrvalue["'])[^>]*>([\s\S]*?)<\/div>/i
//     );

//     if (!match?.[1]) {
//       return null;
//     }

//     return this.decodeHtmlEntities(match[1])
//       .replace(/\s+/g, " ")
//       .trim();
//   }

//   private decodeHtmlEntities(value: string) {
//     return value
//       .replace(/&nbsp;/g, " ")
//       .replace(/&amp;/g, "&")
//       .replace(/&quot;/g, '"')
//       .replace(/&#39;/g, "'")
//       .replace(/&lt;/g, "<")
//       .replace(/&gt;/g, ">");
//   }
//   private prepareHtmlForPdf(html: string) {
//     const hasHtmlTag = /<html[\s>]/i.test(html);

//     const printCss = `
//       <style>
//         @page {
//           size: A4;
//           margin: 10mm;
//         }

//         html, body {
//           margin: 0;
//           padding: 0;
//           font-family: Arial, sans-serif;
//           -webkit-print-color-adjust: exact;
//           print-color-adjust: exact;
//         }

//         table {
//           page-break-inside: auto;
//         }

//         tr {
//           page-break-inside: avoid;
//           page-break-after: auto;
//         }
//       </style>
//     `;

//     if (!hasHtmlTag) {
//       return `
//         <!doctype html>
//         <html>
//           <head>
//             <meta charset="utf-8" />
//             ${printCss}
//           </head>
//           <body>
//             ${html}
//           </body>
//         </html>
//       `;
//     }

//     if (/<head[\s>]/i.test(html)) {
//       return html.replace(/<head[^>]*>/i, (match) => {
//         return `${match}<meta charset="utf-8" />${printCss}`;
//       });
//     }

//     return html.replace(/<html[^>]*>/i, (match) => {
//       return `${match}<head><meta charset="utf-8" />${printCss}</head>`;
//     });
//   }
// }
export { GibService } from "./gib";
export * from "./gib";