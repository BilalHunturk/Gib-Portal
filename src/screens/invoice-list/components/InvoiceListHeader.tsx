import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type InvoiceListHeaderProps = {
  onLogout: () => void;
  onCreateDraft?: () => void;
  disabled?: boolean;
};

export function InvoiceListHeader({
  onLogout,
  onCreateDraft,
  disabled,
}: InvoiceListHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Faturalar</Text>
        <Text style={styles.subtitle}>Seçilen tarih aralığındaki belgeler</Text>
      </View>

      <View style={styles.headerActions}>
        {onCreateDraft ? (
          <Pressable
            style={[styles.smallButton, disabled && styles.disabledButton]}
            onPress={onCreateDraft}
            disabled={disabled}
          >
            <Text style={styles.smallButtonText}>Fatura Yaz</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={[styles.smallButton, disabled && styles.disabledButton]}
          onPress={onLogout}
          disabled={disabled}
        >
          <Text style={styles.smallButtonText}>Çıkış</Text>
        </Pressable>
      </View>
    </View>
  );
}
