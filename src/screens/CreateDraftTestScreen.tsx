import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import dayjs from "dayjs";
import { GibService } from "../services/gib";
import {
    todayAsGibDate,
    nowAsGibTime,
    InvoiceDraftInput,
} from "../models/invoiceDraft";

type Props = {
    gib: GibService;
    onBack: () => void;
};

export function CreateDraftTestScreen({ gib, onBack }: Props) {
    const [loading, setLoading] = useState(false);
    const [resultText, setResultText] = useState("");

    async function createTestDraft() {
        try {
            setLoading(true);
            setResultText("");

            const input: InvoiceDraftInput = {
                vknTckn: "1111111111",

                // Kurumsal alıcı için unvan dolu, ad/soyad boş olabilir.
                aliciUnvan: "TEST ALICI LTD ŞTİ",
                aliciAdi: "",
                aliciSoyadi: "",

                vergiDairesi: "TEST VERGİ DAİRESİ",

                adres: "Test Mahallesi Test Caddesi No:1",
                mahalleSemtIlce: "Çanaklı",
                sehir: "İzmir",
                ulke: "Türkiye",

                tarih: todayAsGibDate(),
                saat: nowAsGibTime(),

                // not: "Bu belge mobil uygulama test ortamında taslak olarak oluşturulmuştur.",

                lines: [
                    {
                        malHizmet: "Test Hizmet Bedeli",
                        miktar: 1,
                        birimFiyat: 100,
                        kdvOrani: 20,
                        birim: "C62",
                    },
                ],
            };

            const result = await gib.createInvoiceDraft(input as any);

            const text = JSON.stringify(result, null, 2);
            setResultText(text);

            Alert.alert("Başarılı", "Test fatura taslağı oluşturma isteği gönderildi.");
        } catch (err: any) {
            const message = err?.message ?? "Taslak oluşturulamadı.";
            setResultText(message);
            Alert.alert("Hata", message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Test Taslak Fatura</Text>

            <Text style={styles.info}>
                Bu ekran sadece test ortamında basit bir satış faturası taslağı oluşturma
                denemesi içindir. SMS onaylama veya kesinleştirme yapmaz.
            </Text>

            <Pressable style={styles.backButton} onPress={onBack} disabled={loading}>
                <Text style={styles.backButtonText}>Geri Dön</Text>
            </Pressable>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>Test Verisi</Text>
                <Text style={styles.text}>Alıcı: TEST ALICI</Text>
                <Text style={styles.text}>VKN: 1111111111</Text>
                <Text style={styles.text}>Ürün: Test Ürün</Text>
                <Text style={styles.text}>Tutar: 100 TL + %20 KDV</Text>
            </View>

            <Pressable
                style={[styles.button, loading && styles.disabledButton]}
                onPress={createTestDraft}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Test Taslak Oluştur</Text>
                )}
            </Pressable>

            {resultText ? (
                <View style={styles.resultBox}>
                    <Text style={styles.resultTitle}>GİB Cevabı / Hata</Text>
                    <Text style={styles.resultText}>{resultText}</Text>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 32,
        backgroundColor: "#f4f6f8",
        flexGrow: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: "800",
    },
    info: {
        marginTop: 8,
        color: "#555",
        lineHeight: 20,
    },
    backButton: {
        marginTop: 16,
        backgroundColor: "#e8eef7",
        borderRadius: 10,
        padding: 12,
        alignItems: "center",
    },
    backButtonText: {
        color: "#1f6feb",
        fontWeight: "700",
    },
    card: {
        marginTop: 16,
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
        gap: 6,
    },
    cardTitle: {
        fontWeight: "800",
        fontSize: 16,
        marginBottom: 4,
    },
    text: {
        color: "#444",
    },
    button: {
        marginTop: 16,
        backgroundColor: "#1f6feb",
        borderRadius: 10,
        padding: 14,
        alignItems: "center",
    },
    disabledButton: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 16,
    },
    resultBox: {
        marginTop: 16,
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 14,
    },
    resultTitle: {
        fontWeight: "800",
        marginBottom: 8,
    },
    resultText: {
        fontFamily: "monospace",
        color: "#333",
    },
});