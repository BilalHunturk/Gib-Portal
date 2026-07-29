import { GibClient } from "./gibClient";
import { GibAuthService } from "./gibAuthService";
import { GibDocumentService } from "./gibDocumentService";
import { GibInvoiceService } from "./gibInvoiceService";
import { GibPdfService } from "./gibPdfService";
import { GibQrService } from "./gibQrService";

import { GibDocument } from "../../models/gibDocument";
import {
  InvoiceDraftInput,
} from "../../models/invoiceDraft";
import {
  CreateInvoiceDraftResult,
} from "./gibInvoiceService";

export class GibService {
  private client: GibClient;
  private authService: GibAuthService;
  private documentService: GibDocumentService;
  private invoiceService: GibInvoiceService;
  private pdfService: GibPdfService;
  private qrService: GibQrService;

  constructor() {
    this.client = new GibClient();

    this.qrService = new GibQrService();
    this.pdfService = new GibPdfService(this.qrService);

    this.authService = new GibAuthService(this.client);
    this.documentService = new GibDocumentService(
      this.client,
      this.pdfService
    );
    this.invoiceService = new GibInvoiceService(this.client);
  }

  get isLoggedIn(): boolean {
    return this.client.isLoggedIn();
  }

  login(username: string, password: string): Promise<string> {
    return this.authService.login(username, password);
  }

  logout(): Promise<void> {
    return this.authService.logout();
  }

  getIssuedDocuments(
    startDate: string,
    endDate: string
  ): Promise<GibDocument[]> {
    return this.documentService.getIssuedDocuments(startDate, endDate);
  }

  buildDownloadUrl(document: GibDocument): string {
    return this.documentService.buildDownloadUrl(document);
  }

  downloadDocument(document: GibDocument): Promise<string> {
    return this.documentService.downloadDocument(document);
  }

  createInvoiceDraft(
    input: InvoiceDraftInput
  ): Promise<CreateInvoiceDraftResult> {
    return this.invoiceService.createInvoiceDraft(input);
  }
}

export { GibClient } from "./gibClient";
export { GibAuthService } from "./gibAuthService";
export { GibDocumentService } from "./gibDocumentService";
export { GibInvoiceService } from "./gibInvoiceService";
export { GibPdfService } from "./gibPdfService";
export { GibQrService } from "./gibQrService";