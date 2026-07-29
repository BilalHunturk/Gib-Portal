import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { formatMoney } from "../domain/invoiceDraftCalculations";
import { styles } from "../styles";
import type { DraftTotals } from "../types";

type Props = {
  totals: DraftTotals;
  isDraftReady: boolean;
  loading: boolean;
  isPdfBusy: boolean;
  activePdfAction: "open" | "share" | null;
  onCreateDraft: () => void;
  onOpenPdf: () => void;
  onSharePdf: () => void;
};

export function DraftBottomBar({
  totals,
  isDraftReady,
  loading,
  isPdfBusy,
  activePdfAction,
  onCreateDraft,
  onOpenPdf,
  onSharePdf,
}: Props) {
  return (
    <View style={[styles.bottomBar, isDraftReady && styles.bottomBarReady]}>
      {isDraftReady ? (
        <>
          <View style={styles.bottomReadyInfo}>
            <Text style={styles.bottomReadyText}>Taslak hazır</Text>
          </View>

          <View style={styles.bottomActionRow}>
            <Pressable
              style={[styles.bottomPdfButton, isPdfBusy && styles.disabledButton]}
              onPress={onOpenPdf}
              disabled={isPdfBusy || loading}
            >
              <Text style={styles.bottomPdfButtonText}>
                {activePdfAction === "open" ? "Yükleniyor..." : "PDF Görüntüle"}
              </Text>
            </Pressable>

            <Pressable
              style={[styles.bottomShareButton, isPdfBusy && styles.disabledButton]}
              onPress={onSharePdf}
              disabled={isPdfBusy || loading}
            >
              <Text style={styles.bottomShareButtonText}>
                {activePdfAction === "share" ? "Yükleniyor..." : "Paylaş"}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View>
            <Text style={styles.bottomBarLabel}>Ödenecek Tutar</Text>
            <Text style={styles.bottomBarTotal}>{formatMoney(totals.genelToplam)} TL</Text>
          </View>

          <Pressable
            style={[styles.bottomCreateButton, loading && styles.disabledButton]}
            onPress={onCreateDraft}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingButtonContent}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.bottomCreateButtonText}>Oluşturuluyor...</Text>
              </View>
            ) : (
              <Text style={styles.bottomCreateButtonText}>Taslak Oluştur</Text>
            )}
          </Pressable>
        </>
      )}
    </View>
  );
}
