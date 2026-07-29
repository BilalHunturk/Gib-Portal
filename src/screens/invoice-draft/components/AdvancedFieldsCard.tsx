import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { InvoiceDraftFormController } from "../hooks/useInvoiceDraftForm";
import { styles } from "../styles";

type Props = {
  form: InvoiceDraftFormController;
};

export function AdvancedFieldsCard({ form }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.advancedHeader}
        onPress={() => form.setShowAdvancedFields((value) => !value)}
      >
        <View>
          <Text style={styles.cardTitle}>Gelişmiş Alanlar</Text>
          <Text style={styles.advancedSubtitle}>Fatura tipi, döviz, sipariş ve irsaliye bilgileri</Text>
        </View>

        <Text style={styles.advancedToggle}>{form.showAdvancedFields ? "Kapat" : "Aç"}</Text>
      </Pressable>

      {form.showAdvancedFields ? (
        <View style={styles.advancedContent}>
          <Text style={styles.sectionLabel}>Fatura Ayarları</Text>

          <View style={styles.quickOptionRow}>
            <Pressable
              style={[styles.quickOption, form.faturaTipi === "SATIS" && styles.quickOptionActive]}
              onPress={() => form.setFaturaTipi("SATIS")}
            >
              <Text
                style={[
                  styles.quickOptionText,
                  form.faturaTipi === "SATIS" && styles.quickOptionTextActive,
                ]}
              >
                Satış
              </Text>
            </Pressable>

            <Pressable
              style={[styles.quickOption, form.faturaTipi === "IADE" && styles.quickOptionActive]}
              onPress={() => form.setFaturaTipi("IADE")}
            >
              <Text
                style={[
                  styles.quickOptionText,
                  form.faturaTipi === "IADE" && styles.quickOptionTextActive,
                ]}
              >
                İade
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.quickOption,
                form.faturaTipi === "TEVKIFAT" && styles.quickOptionActive,
              ]}
              onPress={() => form.setFaturaTipi("TEVKIFAT")}
            >
              <Text
                style={[
                  styles.quickOptionText,
                  form.faturaTipi === "TEVKIFAT" && styles.quickOptionTextActive,
                ]}
              >
                Tevkifat
              </Text>
            </Pressable>
          </View>

          <View style={styles.lineInputRow}>
            <TextInput
              style={[styles.input, styles.lineInput]}
              placeholder="Para Birimi"
              value={form.paraBirimi}
              onChangeText={form.setParaBirimi}
              autoCapitalize="characters"
            />

            <TextInput
              style={[styles.input, styles.lineInput]}
              placeholder="Döviz Kuru"
              value={form.dovzTLkur}
              onChangeText={form.setDovzTLkur}
              keyboardType="decimal-pad"
            />
          </View>

          <Text style={styles.sectionLabel}>Sipariş Bilgileri</Text>

          <TextInput
            style={styles.input}
            placeholder="Sipariş Numarası"
            value={form.siparisNumarasi}
            onChangeText={form.setSiparisNumarasi}
          />

          <TextInput
            style={styles.input}
            placeholder="Sipariş Tarihi - GG/AA/YYYY"
            value={form.siparisTarihi}
            onChangeText={form.setSiparisTarihi}
          />

          <Text style={styles.sectionLabel}>İrsaliye Bilgileri</Text>

          <TextInput
            style={styles.input}
            placeholder="İrsaliye Numarası"
            value={form.irsaliyeNumarasi}
            onChangeText={form.setIrsaliyeNumarasi}
          />

          <TextInput
            style={styles.input}
            placeholder="İrsaliye Tarihi - GG/AA/YYYY"
            value={form.irsaliyeTarihi}
            onChangeText={form.setIrsaliyeTarihi}
          />

          <Text style={styles.sectionLabel}>İletişim Bilgileri</Text>

          <TextInput
            style={styles.input}
            placeholder="Telefon"
            value={form.tel}
            onChangeText={form.setTel}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="E-posta"
            value={form.eposta}
            onChangeText={form.setEposta}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Web Sitesi"
            value={form.websitesi}
            onChangeText={form.setWebsitesi}
            autoCapitalize="none"
          />
        </View>
      ) : null}
    </View>
  );
}
