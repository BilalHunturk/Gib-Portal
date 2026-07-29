import React from "react";
import { Pressable, Text, View } from "react-native";

import { styles } from "../styles";

type Props = {
  loading: boolean;
  onBack: () => void;
};

export function DraftHeader({ loading, onBack }: Props) {
  return (
    <View style={styles.topHeader}>
      <Pressable
        style={styles.headerBackButton}
        onPress={onBack}
        disabled={loading}
      >
        <Text style={styles.headerBackText}>‹</Text>
      </Pressable>

      <View style={styles.headerTitleBlock}>
        <Text style={styles.title}>Fatura Yaz</Text>
        <Text style={styles.subtitle}>Sadece taslak oluşturur, SMS onayı yapmaz.</Text>
      </View>

      <View style={styles.testBadge}>
        <Text style={styles.testBadgeText}>TEST</Text>
      </View>
    </View>
  );
}
