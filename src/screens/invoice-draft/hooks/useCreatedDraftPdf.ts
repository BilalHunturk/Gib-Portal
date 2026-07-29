import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Alert } from "react-native";

import { GibDocument } from "../../../models/gibDocument";
import { InvoiceDraftInput } from "../../../models/invoiceDraft";
import { GibService } from "../../../services/gib";
import { openPdfFile, sharePdfFile } from "../../../utils/pdfActions";
import { useDraftDocumentFinder } from "./useDraftDocumentFinder";

type PdfAction = "open" | "share";

type UseCreatedDraftPdfParams = {
  gib: GibService;
  loading: boolean;
  createdDraftInput: InvoiceDraftInput | null;
  createdDocument: GibDocument | null;
  setCreatedDocument: Dispatch<SetStateAction<GibDocument | null>>;
};

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

export function useCreatedDraftPdf({
  gib,
  loading,
  createdDraftInput,
  createdDocument,
  setCreatedDocument,
}: UseCreatedDraftPdfParams) {
  const [createdPdfUri, setCreatedPdfUri] = useState<string | null>(null);
  const [preparingPdf, setPreparingPdf] = useState(false);
  const [activePdfAction, setActivePdfAction] = useState<PdfAction | null>(null);

  const { findCreatedDraftDocument } = useDraftDocumentFinder(gib);

  useEffect(() => {
    setCreatedPdfUri(null);
    setPreparingPdf(false);
    setActivePdfAction(null);
  }, [createdDraftInput]);

  const isPdfBusy = Boolean(activePdfAction) || preparingPdf;

  function resetPdfState() {
    setCreatedPdfUri(null);
    setPreparingPdf(false);
    setActivePdfAction(null);
  }

  async function getCreatedPdfUri() {
    if (createdPdfUri) {
      return createdPdfUri;
    }

    if (!createdDraftInput) {
      throw new Error(
        "Oluşturulan fatura bilgisi bulunamadı. Lütfen taslağı yeniden oluşturun."
      );
    }

    setPreparingPdf(true);

    try {
      let document = createdDocument;

      if (!document) {
        console.log("PDF için oluşturulan taslak aranıyor...");

        document = await findCreatedDraftDocument(createdDraftInput);

        if (!document) {
          throw new Error(
            "Fatura taslağı belge listesinde güvenli şekilde bulunamadı. Birkaç saniye sonra tekrar deneyin veya Faturalar ekranından listeyi yenileyin."
          );
        }

        console.log(
          "PDF için eşleşen taslak bulundu:",
          JSON.stringify(
            {
              belgeNo: document.belgeNo,
              ettn: document.ettn,
              alici: document.alici,
              tarih: document.tarih,
              onayDurumu: document.onayDurumu,
            },
            null,
            2
          )
        );

        setCreatedDocument(document);
      }

      const uri = await withTimeout(
        gib.downloadDocument(document),
        45000,
        "PDF hazırlanırken zaman aşımı oluştu. Lütfen tekrar deneyin."
      );

      setCreatedPdfUri(uri);

      return uri;
    } finally {
      setPreparingPdf(false);
    }
  }

  async function openCreatedPdf() {
    if (activePdfAction || loading) {
      return;
    }

    try {
      setActivePdfAction("open");

      const uri = await getCreatedPdfUri();

      setActivePdfAction(null);

      await openPdfFile(uri);
    } catch (err: any) {
      Alert.alert(
        "PDF Görüntüleme Hatası",
        err?.message ?? "PDF görüntülenemedi."
      );
    } finally {
      setActivePdfAction(null);
      setPreparingPdf(false);
    }
  }

  async function shareCreatedPdf() {
    if (activePdfAction || loading) {
      return;
    }

    try {
      setActivePdfAction("share");

      const uri = await getCreatedPdfUri();

      setActivePdfAction(null);

      await sharePdfFile(uri);
    } catch (err: any) {
      Alert.alert(
        "Paylaşım Hatası",
        err?.message ?? "PDF paylaşılamadı."
      );
    } finally {
      setActivePdfAction(null);
      setPreparingPdf(false);
    }
  }

  return {
    activePdfAction,
    isPdfBusy,
    createdPdfUri,
    openCreatedPdf,
    shareCreatedPdf,
    resetPdfState,
  };
}
