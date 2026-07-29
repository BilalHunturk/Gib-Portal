import * as FileSystem from "expo-file-system/legacy";
import { GibDocument, parseGibDocument } from "../../models/gibDocument";
import { GibClient } from "./gibClient";
import { GibPdfService } from "./gibPdfService";
import { buildInvoiceFileName } from "../../utils/fileName";

export class GibDocumentService {
  constructor(
    private client: GibClient,
    private pdfService: GibPdfService
  ) {}

  async getIssuedDocuments(
    startDate: string,
    endDate: string
  ): Promise<GibDocument[]> {
    const result = await this.client.dispatch(
      "EARSIV_PORTAL_TASLAKLARI_GETIR",
      "RG_TASLAKLAR",
      {
        baslangic: startDate,
        bitis: endDate,
        hangiTip: "5000/30000",
      }
    );

    const rows: any[] = Array.isArray(result?.data) ? result.data : [];

    console.log("GIB DOCUMENT RAW ROWS:", JSON.stringify(rows.slice(0, 5), null, 2));

    return rows
      .map(parseGibDocument)
      .filter((doc: GibDocument) => {
        return Boolean(doc.ettn || doc.belgeNo);
      });
  }

  buildDownloadUrl(document: GibDocument): string {
    if (!document.ettn) {
      throw new Error("Belge ETTN bilgisi bulunamadı.");
    }

    return this.client.buildDownloadUrl({
      ettn: document.ettn,
      onayDurumu: document.onayDurumu || "Onaylandı",
      belgeTip: document.belgeTuru || "FATURA",
    });
  }

  async downloadDocument(document: GibDocument): Promise<string> {
    const downloadUrl = this.buildDownloadUrl(document);

    const nameBase = buildInvoiceFileName(document);
    const zipUri = `${FileSystem.cacheDirectory}${nameBase}.zip`;

    const result = await FileSystem.downloadAsync(downloadUrl, zipUri, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (result.status !== 200) {
      throw new Error(`Belge indirilemedi. HTTP ${result.status}`);
    }

    const pdfUri = await this.pdfService.convertGibZipToPdf(zipUri, nameBase);

    return pdfUri;
  }
}