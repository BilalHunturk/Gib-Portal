import { Alert } from "react-native";
import { useState } from "react";

import { GibDocument } from "../../../models/gibDocument";
import { GibService } from "../../../services/gib";
import { openPdfFile, sharePdfFile } from "../../../utils/pdfActions";

type DocumentAction = {
  key: string;
  type: "open" | "share";
};

type UseInvoiceListPdfActionsParams = {
  gib: GibService;
  loading: boolean;
};

export function getInvoiceListDocumentKey(doc: GibDocument) {
  return doc.ettn || doc.belgeNo;
}

export function useInvoiceListPdfActions({
  gib,
  loading,
}: UseInvoiceListPdfActionsParams) {
  const [documentAction, setDocumentAction] = useState<DocumentAction | null>(
    null
  );
  const [pdfUriCache, setPdfUriCache] = useState<Record<string, string>>({});

  const isBusy = Boolean(documentAction);

  function clearPdfCache() {
    setPdfUriCache({});
  }

  async function getDocumentPdfUri(doc: GibDocument) {
    const key = getInvoiceListDocumentKey(doc);

    if (!key) {
      throw new Error("Belge anahtarı bulunamadı.");
    }

    const cachedUri = pdfUriCache[key];

    if (cachedUri) {
      return cachedUri;
    }

    const fileUri = await gib.downloadDocument(doc);

    setPdfUriCache((current) => ({
      ...current,
      [key]: fileUri,
    }));

    return fileUri;
  }

  async function openDocumentPdf(doc: GibDocument) {
    const key = getInvoiceListDocumentKey(doc);

    if (!key || isBusy || loading) {
      return;
    }

    try {
      setDocumentAction({
        key,
        type: "open",
      });

      const fileUri = await getDocumentPdfUri(doc);

      // PDF hazırlandıktan sonra görüntüleyici açılırken butonu serbest bırakıyoruz.
      setDocumentAction(null);

      await openPdfFile(fileUri);
    } catch (err: any) {
      Alert.alert(
        "PDF Görüntüleme Hatası",
        err?.message ?? "Belge görüntülenemedi."
      );
    } finally {
      setDocumentAction(null);
    }
  }

  async function shareDocumentPdf(doc: GibDocument) {
    const key = getInvoiceListDocumentKey(doc);

    if (!key || isBusy || loading) {
      return;
    }

    try {
      setDocumentAction({
        key,
        type: "share",
      });

      const fileUri = await getDocumentPdfUri(doc);

      // Paylaşım ekranı açılmadan önce butonu serbest bırakıyoruz.
      setDocumentAction(null);

      await sharePdfFile(fileUri);
    } catch (err: any) {
      Alert.alert("Paylaşım Hatası", err?.message ?? "Belge paylaşılamadı.");
    } finally {
      setDocumentAction(null);
    }
  }

  function getActionState(doc: GibDocument) {
    const key = getInvoiceListDocumentKey(doc);

    return {
      isOpening: documentAction?.key === key && documentAction.type === "open",
      isSharing: documentAction?.key === key && documentAction.type === "share",
      isBusy,
    };
  }

  return {
    documentAction,
    isBusy,
    openDocumentPdf,
    shareDocumentPdf,
    getActionState,
    clearPdfCache,
  };
}
