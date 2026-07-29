import { Pressable, Text, View } from "react-native";

import { GibDocument } from "../../../models/gibDocument";
import { styles } from "../styles";

type InvoiceCardProps = {
  document: GibDocument;
  loading: boolean;
  actionState: {
    isOpening: boolean;
    isSharing: boolean;
    isBusy: boolean;
  };
  onOpenPdf: () => void;
  onSharePdf: () => void;
};

export function InvoiceCard({
  document,
  loading,
  actionState,
  onOpenPdf,
  onSharePdf,
}: InvoiceCardProps) {
  const actionsDisabled = loading || actionState.isBusy;

  return (
    <View style={styles.item}>
      <Text style={styles.itemTitle}>
        {document.belgeNo || document.ettn || "Belge"}
      </Text>

      <Text style={styles.itemText}>
        {document.alici || "Alıcı bilgisi yok"}
      </Text>
      <Text style={styles.itemText}>
        {document.tarih || "-"} | {document.tutar || "-"} |{" "}
        {document.onayDurumu || "-"}
      </Text>

      <View style={styles.documentButtonRow}>
        <Pressable
          style={[styles.viewPdfButton, actionsDisabled && styles.disabledButton]}
          onPress={onOpenPdf}
          disabled={actionsDisabled}
        >
          <Text style={styles.viewPdfButtonText}>
            {actionState.isOpening ? "Yükleniyor..." : "PDF Görüntüle"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.sharePdfButton, actionsDisabled && styles.disabledButton]}
          onPress={onSharePdf}
          disabled={actionsDisabled}
        >
          <Text style={styles.sharePdfButtonText}>
            {actionState.isSharing ? "Yükleniyor..." : "PDF Paylaş"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
