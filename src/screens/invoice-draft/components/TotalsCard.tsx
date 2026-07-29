import React from "react";
import { Text, View } from "react-native";

import { formatMoney } from "../domain/invoiceDraftCalculations";
import type { DraftTotals } from "../types";
import { styles } from "../styles";

type Props = {
  totals: DraftTotals;
};

export function TotalsCard({ totals }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Fatura Toplamı</Text>

      <Text style={styles.summaryText}>
        Mal/Hizmet Toplamı: {formatMoney(totals.araToplam)} TL
      </Text>
      <Text style={styles.summaryText}>KDV Toplamı: {formatMoney(totals.kdvTutari)} TL</Text>
      <Text style={styles.totalText}>Ödenecek Tutar: {formatMoney(totals.genelToplam)} TL</Text>
    </View>
  );
}
