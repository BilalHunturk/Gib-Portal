import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#666",
    marginTop: 2,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#e8eef7",
  },
  smallButtonText: {
    color: "#1f6feb",
    fontWeight: "700",
  },
  filterCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fafafa",
  },
  dateLabel: {
    color: "#777",
    fontSize: 12,
    marginBottom: 4,
  },
  dateValue: {
    fontWeight: "800",
    fontSize: 15,
  },
  refreshButton: {
    marginTop: 12,
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.65,
  },
  error: {
    color: "#b00020",
    marginTop: 16,
  },
  empty: {
    color: "#666",
    marginTop: 20,
    textAlign: "center",
  },
  item: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    gap: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "800",
  },
  itemText: {
    color: "#555",
  },
  documentButtonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  viewPdfButton: {
    flex: 1,
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  viewPdfButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  sharePdfButton: {
    flex: 1,
    backgroundColor: "#176b2c",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  sharePdfButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
});
