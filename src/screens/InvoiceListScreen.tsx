import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";

import { GibService } from "../services/gib";
import {
  DateRangeFilter,
  EmptyInvoiceList,
  InvoiceCard,
  InvoiceListHeader,
} from "./invoice-list/components";
import { useInvoiceList } from "./invoice-list/hooks/useInvoiceList";
import { useInvoiceListPdfActions } from "./invoice-list/hooks/useInvoiceListPdfActions";
import { styles } from "./invoice-list/styles";

dayjs.extend(customParseFormat);

type Props = {
  gib: GibService;
  onLogout: () => void;
  onCreateDraft?: () => void;
};

export function InvoiceListScreen({
  gib,
  onLogout,
  onCreateDraft,
}: Props) {
  const list = useInvoiceList({ gib });
  const pdfActions = useInvoiceListPdfActions({
    gib,
    loading: list.loading,
  });

  useEffect(() => {
    pdfActions.clearPdfCache();
    // Belge listesi yenilendiğinde eski PDF cache'i temizlensin.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.documents]);

  async function handleLogout() {
    try {
      await gib.logout();
    } catch (err: any) {
      Alert.alert(
        "Çıkış Uyarısı",
        err?.message ?? "GİB oturumu kapatılırken hata oluştu."
      );
    } finally {
      onLogout();
    }
  }

  return (
    <View style={styles.container}>
      <InvoiceListHeader
        onLogout={handleLogout}
        onCreateDraft={onCreateDraft}
        disabled={list.loading || pdfActions.isBusy}
      />

      <DateRangeFilter
        startDate={list.startDate}
        endDate={list.endDate}
        loading={list.loading}
        onStartDateChange={list.setStartDate}
        onEndDateChange={list.setEndDate}
        onRefresh={list.loadDocuments}
      />

      {list.loading ? <ActivityIndicator style={{ marginTop: 20 }} /> : null}

      {list.error ? <Text style={styles.error}>{list.error}</Text> : null}

      <EmptyInvoiceList
        loading={list.loading}
        error={list.error}
        documentCount={list.documents.length}
      />

      <FlatList
        data={list.documents}
        keyExtractor={(item, index) => item.ettn || item.belgeNo || String(index)}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <InvoiceCard
            document={item}
            loading={list.loading}
            actionState={pdfActions.getActionState(item)}
            onOpenPdf={() => pdfActions.openDocumentPdf(item)}
            onSharePdf={() => pdfActions.shareDocumentPdf(item)}
          />
        )}
      />
    </View>
  );
}
