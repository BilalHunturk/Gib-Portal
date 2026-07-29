import React from "react";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

import { getGibTaxTypeLabel } from "../../../constants/gibTaxTypes";
import { getGibUnitLabel } from "../../../constants/gibUnits";
import {
  calculateLineTotal,
  formatMoney,
} from "../domain/invoiceDraftCalculations";
import type { InvoiceDraftFormController } from "../hooks/useInvoiceDraftForm";
import { styles } from "../styles";

type Props = {
  form: InvoiceDraftFormController;
  loading: boolean;
};

export function LineItemsCard({ form, loading }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Mal / Hizmet Kalemleri</Text>

        <Pressable style={styles.addSmallButton} onPress={form.addLine} disabled={loading}>
          <Text style={styles.addSmallButtonText}>+ Kalem</Text>
        </Pressable>
      </View>

      {form.lines.map((line, index) => {
        const lineTotal = calculateLineTotal(line);

        return (
          <View key={line.id} style={styles.lineCard}>
            <View style={styles.lineHeader}>
              <Text style={styles.lineTitle}>{index + 1}. Kalem</Text>

              {form.lines.length > 1 ? (
                <Pressable
                  style={styles.removeButton}
                  onPress={() => form.removeLine(line.id)}
                  disabled={loading}
                >
                  <Text style={styles.removeButtonText}>Sil</Text>
                </Pressable>
              ) : null}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Mal / Hizmet"
              value={line.malHizmet}
              onChangeText={(value) => form.updateLine(line.id, "malHizmet", value)}
            />

            <View style={styles.lineInputRow}>
              <TextInput
                style={[styles.input, styles.lineInput]}
                placeholder="Miktar"
                value={line.miktar}
                onChangeText={(value) => form.updateLine(line.id, "miktar", value)}
                keyboardType={Platform.OS === "android" ? "numeric" : "decimal-pad"}
              />

              <Pressable
                style={[styles.selectButton, styles.lineInput]}
                onPress={() => form.setUnitPickerLineId(line.id)}
                disabled={loading}
              >
                <Text style={styles.selectLabel}>Birim</Text>
                <Text style={styles.selectValue}>{getGibUnitLabel(line.birim || "C62")}</Text>
              </Pressable>
            </View>

            <View style={styles.lineInputRow}>
              <TextInput
                style={[styles.input, styles.lineInput]}
                placeholder="Birim Fiyat"
                value={line.birimFiyat}
                onChangeText={(value) => form.updateLine(line.id, "birimFiyat", value)}
                keyboardType="decimal-pad"
              />

              <TextInput
                style={[styles.input, styles.lineInput]}
                placeholder="KDV %"
                value={line.kdvOrani}
                onChangeText={(value) => form.updateLine(line.id, "kdvOrani", value)}
                keyboardType="decimal-pad"
              />
            </View>

            <Pressable
              style={styles.selectButton}
              onPress={() => form.setTaxPickerLineId(line.id)}
              disabled={loading}
            >
              <Text style={styles.selectLabel}>Vergi Çeşidi</Text>
              <Text style={styles.selectValue}>{getGibTaxTypeLabel(line.vergiCesidi)}</Text>
            </Pressable>

            <View style={styles.lineSummary}>
              <Text style={styles.lineSummaryText}>
                Ara Toplam: {formatMoney(lineTotal.araToplam)} TL
              </Text>
              <Text style={styles.lineSummaryText}>
                KDV: {formatMoney(lineTotal.kdvTutari)} TL
              </Text>
              <Text style={styles.lineSummaryTotal}>
                Kalem Toplamı: {formatMoney(lineTotal.genelToplam)} TL
              </Text>
            </View>
          </View>
        );
      })}

      <Pressable style={styles.addLineButton} onPress={form.addLine} disabled={loading}>
        <Text style={styles.addLineButtonText}>+ Yeni Kalem Ekle</Text>
      </Pressable>
    </View>
  );
}
