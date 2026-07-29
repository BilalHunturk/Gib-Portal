import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { InvoiceDraftFormController } from "../hooks/useInvoiceDraftForm";
import { styles } from "../styles";

type Props = {
  form: InvoiceDraftFormController;
};

export function AddressCard({ form }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Adres Bilgileri</Text>

      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="Adres"
        value={form.adres}
        onChangeText={form.setAdres}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Mahalle / Semt / İlçe"
        value={form.mahalleSemtIlce}
        onChangeText={form.setMahalleSemtIlce}
      />

      <TextInput
        style={styles.input}
        placeholder="Şehir"
        value={form.sehir}
        onChangeText={form.setSehir}
      />

      <Pressable
        style={styles.inlineExpandButton}
        onPress={() => form.setShowDetailedAddress((value) => !value)}
      >
        <Text style={styles.inlineExpandTitle}>Detaylı Adres</Text>
        <Text style={styles.inlineExpandAction}>{form.showDetailedAddress ? "Kapat" : "Aç"}</Text>
      </Pressable>

      {form.showDetailedAddress ? (
        <View style={styles.advancedContent}>
          <TextInput
            style={styles.input}
            placeholder="Bina Adı"
            value={form.binaAdi}
            onChangeText={form.setBinaAdi}
          />

          <View style={styles.lineInputRow}>
            <TextInput
              style={[styles.input, styles.lineInput]}
              placeholder="Bina No"
              value={form.binaNo}
              onChangeText={form.setBinaNo}
            />

            <TextInput
              style={[styles.input, styles.lineInput]}
              placeholder="Kapı No"
              value={form.kapiNo}
              onChangeText={form.setKapiNo}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Kasaba / Köy"
            value={form.kasabaKoy}
            onChangeText={form.setKasabaKoy}
          />

          <View style={styles.lineInputRow}>
            <TextInput
              style={[styles.input, styles.lineInput]}
              placeholder="Posta Kodu"
              value={form.postaKodu}
              onChangeText={form.setPostaKodu}
              keyboardType="number-pad"
            />

            <TextInput
              style={[styles.input, styles.lineInput]}
              placeholder="Ülke"
              value={form.ulke}
              onChangeText={form.setUlke}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}
