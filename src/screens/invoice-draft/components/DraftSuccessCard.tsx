import React from "react";
import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type Props = {
  message: string;
  isPdfBusy: boolean;
  onReset: () => void;
};

export function DraftSuccessCard({ message, isPdfBusy, onReset }: Props) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.successCard}>
      <View style={styles.successHeaderRow}>
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>
        <View style={styles.successTextBlock}>
          <Text style={styles.successTitle}>Taslak oluşturuldu</Text>
          <Text style={styles.successText}>{message}</Text>
        </View>
      </View>

      <Pressable style={styles.newInvoiceInlineButton} onPress={onReset} disabled={isPdfBusy}>
        <Text style={styles.newInvoiceInlineButtonText}>Yeni fatura yaz</Text>
      </Pressable>
    </View>
  );
}
