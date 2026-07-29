import { Text } from "react-native";

import { styles } from "../styles";

type EmptyInvoiceListProps = {
  loading: boolean;
  error: string;
  documentCount: number;
};

export function EmptyInvoiceList({
  loading,
  error,
  documentCount,
}: EmptyInvoiceListProps) {
  if (loading || error || documentCount > 0) {
    return null;
  }

  return (
    <Text style={styles.empty}>Seçilen tarih aralığında belge bulunamadı.</Text>
  );
}
