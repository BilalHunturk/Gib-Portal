import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  selectButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fff",
  },
  selectLabel: {
    color: "#777",
    fontSize: 12,
    marginBottom: 4,
  },
  selectValue: {
    color: "#222",
    fontWeight: "800",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
  },
  modalCloseText: {
    color: "#1f6feb",
    fontWeight: "800",
  },
  modalList: {
    maxHeight: 520,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 12,
  },
  optionCode: {
    width: 58,
    color: "#666",
    fontWeight: "700",
  },
  optionLabel: {
    flex: 1,
    color: "#222",
  },
  flex: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },
  container: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 130,
    backgroundColor: "#f4f6f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 6,
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
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#000",
    backgroundColor: "#fff",
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  lineCard: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fafafa",
    gap: 10,
  },
  lineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lineTitle: {
    fontWeight: "800",
    color: "#333",
  },
  lineInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  lineInput: {
    flex: 1,
  },
  lineSummary: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  lineSummaryText: {
    color: "#555",
    fontSize: 13,
  },
  lineSummaryTotal: {
    fontWeight: "800",
    color: "#222",
    fontSize: 14,
  },
  addSmallButton: {
    backgroundColor: "#e8eef7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  addSmallButtonText: {
    color: "#1f6feb",
    fontWeight: "800",
  },
  addLineButton: {
    borderWidth: 1,
    borderColor: "#1f6feb",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  addLineButtonText: {
    color: "#1f6feb",
    fontWeight: "800",
  },
  removeButton: {
    backgroundColor: "#ffecec",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: "#b00020",
    fontWeight: "800",
  },
  summaryText: {
    color: "#444",
    fontSize: 15,
  },
  totalText: {
    marginTop: 4,
    fontWeight: "800",
    fontSize: 17,
  },
  createButton: {
    marginTop: 16,
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  resultBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  resultTitle: {
    fontWeight: "800",
    marginBottom: 8,
  },
  resultText: {
    color: "#333",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },

  headerBackText: {
    fontSize: 34,
    lineHeight: 36,
    color: "#222",
    fontWeight: "600",
  },

  headerTitleBlock: {
    flex: 1,
  },

  testBadge: {
    backgroundColor: "#fff4d6",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#f0d58c",
  },

  testBadgeText: {
    color: "#8a6400",
    fontWeight: "800",
    fontSize: 12,
  },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  bottomBarLabel: {
    color: "#777",
    fontSize: 12,
    marginBottom: 2,
  },

  bottomBarTotal: {
    color: "#111",
    fontSize: 18,
    fontWeight: "900",
  },

  bottomCreateButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 13,
    minWidth: 145,
    alignItems: "center",
  },

  bottomCreateButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },
  loadingButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  bottomBarReady: {
    gap: 10,
  },

  bottomReadyInfo: {
    minWidth: 86,
  },

  bottomReadyText: {
    color: "#176b2c",
    fontSize: 15,
    fontWeight: "900",
  },

  bottomActionRow: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
  },

  bottomPdfButton: {
    flex: 1.15,
    backgroundColor: "#1f6feb",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 13,
    alignItems: "center",
  },

  bottomPdfButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  bottomShareButton: {
    flex: 0.85,
    backgroundColor: "#176b2c",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 13,
    alignItems: "center",
  },

  bottomShareButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  advancedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  advancedSubtitle: {
    color: "#777",
    fontSize: 12,
    marginTop: 3,
  },

  advancedToggle: {
    color: "#1f6feb",
    fontWeight: "800",
  },

  advancedContent: {
    marginTop: 12,
    gap: 10,
  },

  sectionLabel: {
    marginTop: 6,
    color: "#444",
    fontWeight: "800",
    fontSize: 13,
  },

  quickOptionRow: {
    flexDirection: "row",
    gap: 8,
  },

  quickOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  quickOptionActive: {
    backgroundColor: "#1f6feb",
    borderColor: "#1f6feb",
  },

  quickOptionText: {
    color: "#333",
    fontWeight: "700",
    fontSize: 13,
  },

  quickOptionTextActive: {
    color: "#fff",
  },

  buyerTypeRow: {
    flexDirection: "row",
    gap: 8,
  },

  buyerTypeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    backgroundColor: "#fff",
  },

  buyerTypeButtonActive: {
    backgroundColor: "#1f6feb",
    borderColor: "#1f6feb",
  },

  buyerTypeText: {
    color: "#333",
    fontWeight: "800",
  },

  buyerTypeTextActive: {
    color: "#fff",
  },
  inlineExpandButton: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fafafa",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inlineExpandTitle: {
    color: "#333",
    fontWeight: "800",
  },

  inlineExpandAction: {
    color: "#1f6feb",
    fontWeight: "800",
  },
  successCard: {
    backgroundColor: "#eefaf1",
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#bde8c7",
  },

  successTitle: {
    color: "#176b2c",
    fontWeight: "900",
    fontSize: 16,
  },

  successText: {
    color: "#285c35",
    lineHeight: 20,
  },

  successHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },

  successIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#176b2c",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },

  successIconText: {
    color: "#fff",
    fontWeight: "900",
  },

  successTextBlock: {
    flex: 1,
  },

  newInvoiceInlineButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  newInvoiceInlineButtonText: {
    color: "#1f6feb",
    fontWeight: "900",
  },

  successButtonRow: {
    flexDirection: "row",
    gap: 10,
  },

  secondaryActionButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#1f6feb",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  secondaryActionButtonText: {
    color: "#1f6feb",
    fontWeight: "900",
  },

  newInvoiceButton: {
    backgroundColor: "#176b2c",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },

  newInvoiceButtonText: {
    color: "#fff",
    fontWeight: "900",
  },
});