import { GibClient } from "./gibClient";
import {
  InvoiceDraftInput,
  buildInvoicePayload,
} from "../../models/invoiceDraft";

export type CreateInvoiceDraftResult = {
  success: boolean;
  message: string;
  raw: any;
};

export class GibInvoiceService {
  constructor(private client: GibClient) {}

  async createInvoiceDraft(
    input: InvoiceDraftInput
  ): Promise<CreateInvoiceDraftResult> {
    const payload = buildInvoicePayload(input);

    const result = await this.client.dispatch(
      "EARSIV_PORTAL_FATURA_OLUSTUR",
      "RG_BASITFATURA",
      payload
    );

    const message = this.extractResultMessage(result);

    if (!this.isSuccessMessage(message)) {
      throw new Error(message || "Taslak fatura oluşturulamadı.");
    }

    console.log("FATURA OLUSTUR RAW RESULT:", JSON.stringify(result, null, 2));
    return {
      success: true,
      message,
      raw: result,
    };
  }

  private extractResultMessage(result: any) {
    if (typeof result?.data === "string") {
      return result.data;
    }

    if (typeof result?.data?.message === "string") {
      return result.data.message;
    }

    if (typeof result?.message === "string") {
      return result.message;
    }

    return JSON.stringify(result?.data ?? result ?? "");
  }

  private isSuccessMessage(message: string) {
    const normalized = message.toLocaleLowerCase("tr-TR");

    return (
      normalized.includes("başarı") ||
      normalized.includes("basari") ||
      normalized.includes("oluşturuldu") ||
      normalized.includes("olusturuldu")
    );
  }
}