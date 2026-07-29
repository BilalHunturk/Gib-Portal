import React from "react";
import { Text, View } from "react-native";

import { styles } from "../styles";

type Props = {
  resultText: string;
};

export function TechnicalDetails({ resultText }: Props) {
  if (!__DEV__ || !resultText) {
    return null;
  }

  return (
    <View style={styles.resultBox}>
      <Text style={styles.resultTitle}>Teknik Detay</Text>
      <Text style={styles.resultText}>{resultText}</Text>
    </View>
  );
}
