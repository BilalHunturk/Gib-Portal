import React from "react";
import { Text, TextInput, View } from "react-native";

import type { InvoiceDraftFormController } from "../hooks/useInvoiceDraftForm";
import { styles } from "../styles";

type Props = {
  form: InvoiceDraftFormController;
};

export function NoteCard({ form }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Not</Text>

      <TextInput
        style={[styles.input, styles.noteInput]}
        placeholder="Fatura açıklaması, varsa ek not"
        value={form.note}
        onChangeText={form.setNote}
        multiline
      />
    </View>
  );
}
