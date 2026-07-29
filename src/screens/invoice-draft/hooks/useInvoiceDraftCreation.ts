import { Dispatch, SetStateAction, useState } from "react";
import { Alert } from "react-native";

import { GibDocument } from "../../../models/gibDocument";
import { InvoiceDraftInput } from "../../../models/invoiceDraft";
import { GibService } from "../../../services/gib";

type UseInvoiceDraftCreationParams = {
  gib: GibService;
  validateForm: () => string;
  buildInput: () => InvoiceDraftInput;
};

type UseInvoiceDraftCreationResult = {
  loading: boolean;
  resultText: string;
  createdDraftInput: InvoiceDraftInput | null;
  createdDocument: GibDocument | null;
  setCreatedDocument: Dispatch<SetStateAction<GibDocument | null>>;
  createdMessage: string;
  isDraftReady: boolean;
  createDraft: () => Promise<void>;
  resetCreatedDraftState: () => void;
};

export function useInvoiceDraftCreation({
  gib,
  validateForm,
  buildInput,
}: UseInvoiceDraftCreationParams): UseInvoiceDraftCreationResult {
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState("");
  const [createdDocument, setCreatedDocument] = useState<GibDocument | null>(null);
  const [createdMessage, setCreatedMessage] = useState("");
  const [createdDraftInput, setCreatedDraftInput] =
    useState<InvoiceDraftInput | null>(null);

  const isDraftReady = Boolean(createdDraftInput);

  function resetCreatedDraftState() {
    setResultText("");
    setCreatedDraftInput(null);
    setCreatedDocument(null);
    setCreatedMessage("");
  }

  async function createDraft() {
    const validationError = validateForm();

    if (validationError) {
      Alert.alert("Eksik Bilgi", validationError);
      return;
    }

    try {
      setLoading(true);
      setResultText("");
      setCreatedDocument(null);
      setCreatedMessage("");

      const input = buildInput();

      console.log("FATURA TASLAK INPUT:", JSON.stringify(input, null, 2));

      const result = await gib.createInvoiceDraft(input);

      console.log("FATURA TASLAK RESULT:", JSON.stringify(result, null, 2));

      setResultText(JSON.stringify(result, null, 2));
      setCreatedDraftInput(input);
      setCreatedDocument(null);

      setCreatedMessage(
        "Fatura taslağı oluşturuldu. PDF görüntüleyebilir veya paylaşabilirsiniz."
      );

      Alert.alert("Başarılı", "Fatura taslağı oluşturuldu.");
    } catch (err: any) {
      const message = err?.message ?? "Fatura taslağı oluşturulamadı.";
      setResultText(message);
      Alert.alert("Hata", message);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    resultText,
    createdDraftInput,
    createdDocument,
    setCreatedDocument,
    createdMessage,
    isDraftReady,
    createDraft,
    resetCreatedDraftState,
  };
}
