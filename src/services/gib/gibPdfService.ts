import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import JSZip from "jszip";
import { GibQrService } from "./gibQrService";

export class GibPdfService {
  constructor(private qrService: GibQrService) {}

  async convertGibZipToPdf(zipUri: string, nameBase: string) {
    const base64Encoding =
      (FileSystem as any).EncodingType?.Base64 ??
      (FileSystem as any).EncodingTypes?.Base64 ??
      "base64";

    const zipBase64 = await FileSystem.readAsStringAsync(zipUri, {
      encoding: base64Encoding,
    } as any);

    const zip = await JSZip.loadAsync(zipBase64, { base64: true });

    const files = Object.values(zip.files);

    const htmlFile = files.find((file) => {
      const fileName = file.name.toLowerCase();

      return (
        !file.dir &&
        (fileName.endsWith(".html") ||
          fileName.endsWith(".htm") ||
          fileName.endsWith(".xhtml"))
      );
    });

    if (!htmlFile) {
      const fileNames = files.map((file) => file.name).join(", ");
      throw new Error(`ZIP içinde HTML dosyası bulunamadı. Dosyalar: ${fileNames}`);
    }

    let html = await htmlFile.async("string");

    // ZIP içindeki normal görselleri HTML içine göm.
    html = await this.inlineZipAssetsIntoHtml(html, zip);

    // GİB HTML içindeki qrvalue değerinden QR üretip qrcode alanına koy.
    html = await this.qrService.injectGibQrCodeIntoHtml(html);

    // PDF çıktısı için temel HTML/CSS düzeltmeleri.
    html = this.prepareHtmlForPdf(html);

    const pdf = await Print.printToFileAsync({
      html,
      base64: false,
    });

    const finalPdfUri = `${FileSystem.cacheDirectory}${nameBase}.pdf`;

    const existing = await FileSystem.getInfoAsync(finalPdfUri);

    if (existing.exists) {
      await FileSystem.deleteAsync(finalPdfUri, { idempotent: true });
    }

    await FileSystem.moveAsync({
      from: pdf.uri,
      to: finalPdfUri,
    });

    return finalPdfUri;
  }

  private async inlineZipAssetsIntoHtml(html: string, zip: JSZip) {
    let updatedHtml = html;

    // <img src="...">
    updatedHtml = await this.replaceHtmlAssetReferences(
      updatedHtml,
      zip,
      /(<img\b[^>]*?\bsrc=["'])([^"']+)(["'][^>]*>)/gi
    );

    // SVG içinde <image href="...">
    updatedHtml = await this.replaceHtmlAssetReferences(
      updatedHtml,
      zip,
      /(<image\b[^>]*?\bhref=["'])([^"']+)(["'][^>]*>)/gi
    );

    // SVG içinde <image xlink:href="...">
    updatedHtml = await this.replaceHtmlAssetReferences(
      updatedHtml,
      zip,
      /(<image\b[^>]*?\bxlink:href=["'])([^"']+)(["'][^>]*>)/gi
    );

    // CSS içinde url(...)
    updatedHtml = await this.replaceCssUrlReferences(updatedHtml, zip);

    return updatedHtml;
  }

  private async replaceHtmlAssetReferences(
    html: string,
    zip: JSZip,
    regex: RegExp
  ) {
    const matches = Array.from(html.matchAll(regex));
    let updatedHtml = html;

    for (const match of matches) {
      const fullMatch = match[0];
      const before = match[1];
      const src = match[2];
      const after = match[3];

      if (!src || this.shouldSkipAsset(src)) {
        continue;
      }

      const dataUri = await this.getZipAssetAsDataUri(zip, src);

      if (!dataUri) {
        continue;
      }

      updatedHtml = updatedHtml.replace(fullMatch, `${before}${dataUri}${after}`);
    }

    return updatedHtml;
  }

  private async replaceCssUrlReferences(html: string, zip: JSZip) {
    const regex = /url\((["']?)([^"')]+)\1\)/gi;
    const matches = Array.from(html.matchAll(regex));
    let updatedHtml = html;

    for (const match of matches) {
      const fullMatch = match[0];
      const src = match[2];

      if (!src || this.shouldSkipAsset(src)) {
        continue;
      }

      const dataUri = await this.getZipAssetAsDataUri(zip, src);

      if (!dataUri) {
        continue;
      }

      updatedHtml = updatedHtml.replace(fullMatch, `url("${dataUri}")`);
    }

    return updatedHtml;
  }

  private shouldSkipAsset(src: string) {
    const value = src.trim().toLowerCase();

    return (
      value.startsWith("data:") ||
      value.startsWith("http://") ||
      value.startsWith("https://") ||
      value.startsWith("mailto:") ||
      value.startsWith("javascript:")
    );
  }

  private async getZipAssetAsDataUri(zip: JSZip, src: string) {
    const cleanSrc = this.cleanAssetPath(src);
    const file = this.findZipFile(zip, cleanSrc);

    if (!file) {
      return null;
    }

    const extension = cleanSrc.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = this.getMimeType(extension);
    const base64 = await file.async("base64");

    return `data:${mimeType};base64,${base64}`;
  }

  private cleanAssetPath(src: string) {
    let clean = src.trim();

    clean = clean.split("?")[0];
    clean = clean.split("#")[0];

    try {
      clean = decodeURIComponent(clean);
    } catch {
      // Decode edilemezse olduğu gibi devam ederiz.
    }

    clean = clean.replace(/\\/g, "/");
    clean = clean.replace(/^\.?\//, "");
    clean = clean.replace(/^\/+/, "");

    return clean;
  }

  private findZipFile(zip: JSZip, src: string) {
    const files = Object.values(zip.files).filter((file) => !file.dir);

    const normalizedSrc = src.toLowerCase().replace(/\\/g, "/");
    const srcFileName = normalizedSrc.split("/").pop();

    // 1. Birebir yol eşleşmesi
    let found = files.find((file) => {
      return file.name.toLowerCase().replace(/\\/g, "/") === normalizedSrc;
    });

    if (found) {
      return found;
    }

    // 2. Dosya yolu sonu eşleşmesi
    found = files.find((file) => {
      return file.name.toLowerCase().replace(/\\/g, "/").endsWith(normalizedSrc);
    });

    if (found) {
      return found;
    }

    // 3. Sadece dosya adı eşleşmesi
    found = files.find((file) => {
      const fileName = file.name
        .toLowerCase()
        .replace(/\\/g, "/")
        .split("/")
        .pop();

      return fileName === srcFileName;
    });

    return found ?? null;
  }

  private getMimeType(extension: string) {
    switch (extension) {
      case "png":
        return "image/png";
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "svg":
        return "image/svg+xml";
      case "webp":
        return "image/webp";
      case "bmp":
        return "image/bmp";
      default:
        return "application/octet-stream";
    }
  }

  private prepareHtmlForPdf(html: string) {
    const hasHtmlTag = /<html[\s>]/i.test(html);

    const printCss = `
      <style>
        @page {
          size: A4;
          margin: 10mm;
        }

        html, body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        table {
          page-break-inside: auto;
        }

        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
      </style>
    `;

    if (!hasHtmlTag) {
      return `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            ${printCss}
          </head>
          <body>
            ${html}
          </body>
        </html>
      `;
    }

    if (/<head[\s>]/i.test(html)) {
      return html.replace(/<head[^>]*>/i, (match) => {
        return `${match}<meta charset="utf-8" />${printCss}`;
      });
    }

    return html.replace(/<html[^>]*>/i, (match) => {
      return `${match}<head><meta charset="utf-8" />${printCss}</head>`;
    });
  }
}