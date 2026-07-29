import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { InvoiceDraftFormController } from "../hooks/useInvoiceDraftForm";
import { styles } from "../styles";

type Props = {
  form: InvoiceDraftFormController;
  loading: boolean;
};

export function BuyerCard({ form, loading }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Alıcı Bilgileri</Text>

      <View style={styles.buyerTypeRow}>
        <Pressable
          style={[
            styles.buyerTypeButton,
            form.buyerType === "person" && styles.buyerTypeButtonActive,
          ]}
          onPress={() => {
            form.setBuyerType("person");
            form.setVknTckn("11111111111");
            form.setAliciUnvan("");
          }}
          disabled={loading}
        >
          <Text
            style={[
              styles.buyerTypeText,
              form.buyerType === "person" && styles.buyerTypeTextActive,
            ]}
          >
            Şahıs
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.buyerTypeButton,
            form.buyerType === "corporate" && styles.buyerTypeButtonActive,
          ]}
          onPress={() => {
            form.setBuyerType("corporate");
            form.setVknTckn("1111111111");
            form.setAliciAdi("");
            form.setAliciSoyadi("");
          }}
          disabled={loading}
        >
          <Text
            style={[
              styles.buyerTypeText,
              form.buyerType === "corporate" && styles.buyerTypeTextActive,
            ]}
          >
            Kurumsal
          </Text>
        </Pressable>
      </View>

      <TextInput
        style={styles.input}
        placeholder={form.buyerType === "corporate" ? "VKN" : "TCKN"}
        value={form.vknTckn}
        onChangeText={form.setVknTckn}
        keyboardType="number-pad"
        maxLength={form.buyerType === "corporate" ? 10 : 11}
      />

      {form.buyerType === "corporate" ? (
        <TextInput
          style={styles.input}
          placeholder="Alıcı Unvan"
          value={form.aliciUnvan}
          onChangeText={form.setAliciUnvan}
        />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Alıcı Adı"
            value={form.aliciAdi}
            onChangeText={form.setAliciAdi}
          />

          <TextInput
            style={styles.input}
            placeholder="Alıcı Soyadı"
            value={form.aliciSoyadi}
            onChangeText={form.setAliciSoyadi}
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Vergi Dairesi"
        value={form.vergiDairesi}
        onChangeText={form.setVergiDairesi}
      />
    </View>
  );
}
