import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";

export async function openPdfFile(uri: string) {
  if (Platform.OS === "android") {
    const getContentUriAsync = (FileSystem as any).getContentUriAsync;

    if (!getContentUriAsync) {
      await sharePdfFile(uri);
      return;
    }

    const contentUri = await getContentUriAsync(uri);

    await IntentLauncher.startActivityAsync(
      "android.intent.action.VIEW",
      {
        data: contentUri,
        type: "application/pdf",
        flags: 1,
      }
    );

    return;
  }

  await sharePdfFile(uri);
}

export async function sharePdfFile(uri: string) {
  const isAvailable = await Sharing.isAvailableAsync();

  if (!isAvailable) {
    throw new Error("Bu cihazda dosya paylaşımı desteklenmiyor.");
  }

  await Sharing.shareAsync(uri, {
    dialogTitle: "Faturayı paylaş",
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
  });
}