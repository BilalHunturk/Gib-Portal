import dayjs from "dayjs";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { styles } from "../styles";

type DateRangeFilterProps = {
  startDate: Date;
  endDate: Date;
  loading: boolean;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onRefresh: () => void;
};

export function DateRangeFilter({
  startDate,
  endDate,
  loading,
  onStartDateChange,
  onEndDateChange,
  onRefresh,
}: DateRangeFilterProps) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  return (
    <>
      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Tarih Aralığı</Text>

        <View style={styles.dateRow}>
          <Pressable
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
            disabled={loading}
          >
            <Text style={styles.dateLabel}>Başlangıç</Text>
            <Text style={styles.dateValue}>
              {dayjs(startDate).format("DD/MM/YYYY")}
            </Text>
          </Pressable>

          <Pressable
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
            disabled={loading}
          >
            <Text style={styles.dateLabel}>Bitiş</Text>
            <Text style={styles.dateValue}>
              {dayjs(endDate).format("DD/MM/YYYY")}
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.refreshButton, loading && styles.disabledButton]}
          onPress={onRefresh}
          disabled={loading}
        >
          <Text style={styles.refreshButtonText}>
            {loading ? "Listeleniyor..." : "Faturaları Listele"}
          </Text>
        </Pressable>
      </View>

      {showStartPicker ? (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              onStartDateChange(selectedDate);
            }
            setShowStartPicker(false);
          }}
        />
      ) : null}

      {showEndPicker ? (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              onEndDateChange(selectedDate);
            }
            setShowEndPicker(false);
          }}
        />
      ) : null}
    </>
  );
}
