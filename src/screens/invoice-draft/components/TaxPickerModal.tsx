import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import { GIB_TAX_TYPES } from "../../../constants/gibTaxTypes";
import { styles } from "../styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
};

export function TaxPickerModal({ visible, onClose, onSelect }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Vergi Çeşidi Seç</Text>

            <Pressable onPress={onClose}>
              <Text style={styles.modalCloseText}>Kapat</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.modalList}>
            {GIB_TAX_TYPES.map((item) => (
              <Pressable key={item.value} style={styles.optionItem} onPress={() => onSelect(item.value)}>
                <Text style={styles.optionCode}>{item.value.trim() || "-"}</Text>
                <Text style={styles.optionLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
