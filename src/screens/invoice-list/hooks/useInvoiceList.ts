import dayjs from "dayjs";
import { useEffect, useState } from "react";

import { GibDocument } from "../../../models/gibDocument";
import { GibService } from "../../../services/gib";
import { formatDateForGib, parseDocumentDate } from "../domain/invoiceListDate";

type UseInvoiceListParams = {
  gib: GibService;
};

export function useInvoiceList({ gib }: UseInvoiceListParams) {
  const [documents, setDocuments] = useState<GibDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState<Date>(
    dayjs().startOf("month").toDate()
  );
  const [endDate, setEndDate] = useState<Date>(new Date());

  async function loadDocuments() {
    setError("");

    if (dayjs(startDate).isAfter(dayjs(endDate), "day")) {
      setError("Başlangıç tarihi bitiş tarihinden sonra olamaz.");
      return;
    }

    try {
      setLoading(true);

      const start = formatDateForGib(startDate);
      const end = formatDateForGib(endDate);

      const docs = await gib.getIssuedDocuments(start, end);

      const sortedDocs = [...docs].sort((a: GibDocument, b: GibDocument) => {
        return parseDocumentDate(b.tarih) - parseDocumentDate(a.tarih);
      });

      setDocuments(sortedDocs);
    } catch (err: any) {
      setError(err?.message ?? "Belgeler alınamadı.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocuments();
    // İlk açılışta bir kez listelemek için dependency bilinçli olarak boş bırakıldı.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    documents,
    loading,
    error,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    loadDocuments,
  };
}
