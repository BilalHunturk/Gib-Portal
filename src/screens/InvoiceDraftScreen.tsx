import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { GibService } from "../services/gib";
import {
  AddressCard,
  AdvancedFieldsCard,
  BuyerCard,
  DraftBottomBar,
  DraftHeader,
  DraftSuccessCard,
  LineItemsCard,
  NoteCard,
  TaxPickerModal,
  TechnicalDetails,
  TotalsCard,
  UnitPickerModal,
} from "./invoice-draft/components";
import { useCreatedDraftPdf } from "./invoice-draft/hooks/useCreatedDraftPdf";
import { useInvoiceDraftCreation } from "./invoice-draft/hooks/useInvoiceDraftCreation";
import { useInvoiceDraftForm } from "./invoice-draft/hooks/useInvoiceDraftForm";
import { styles } from "./invoice-draft/styles";

type Props = {
  gib: GibService;
  onBack: () => void;
};

export function InvoiceDraftScreen({ gib, onBack }: Props) {
  const form = useInvoiceDraftForm();

  const {
    loading,
    resultText,
    createdDraftInput,
    createdDocument,
    setCreatedDocument,
    createdMessage,
    isDraftReady,
    createDraft,
    resetCreatedDraftState,
  } = useInvoiceDraftCreation({
    gib,
    validateForm: form.validateForm,
    buildInput: form.buildCurrentInvoiceInput,
  });

  const {
    activePdfAction,
    isPdfBusy,
    openCreatedPdf,
    shareCreatedPdf,
    resetPdfState,
  } = useCreatedDraftPdf({
    gib,
    loading,
    createdDraftInput,
    createdDocument,
    setCreatedDocument,
  });

  function resetFormAfterSuccess() {
    form.resetFormAfterSuccess();
    resetCreatedDraftState();
    resetPdfState();
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
      >
        <DraftHeader loading={loading} onBack={onBack} />

        <BuyerCard form={form} loading={loading} />
        <LineItemsCard form={form} loading={loading} />
        <AddressCard form={form} />
        <TotalsCard totals={form.totals} />
        <NoteCard form={form} />
        <TechnicalDetails resultText={resultText} />
        <AdvancedFieldsCard form={form} />
        <DraftSuccessCard
          message={createdMessage}
          isPdfBusy={isPdfBusy}
          onReset={resetFormAfterSuccess}
        />
      </ScrollView>

      <TaxPickerModal
        visible={Boolean(form.taxPickerLineId)}
        onClose={() => form.setTaxPickerLineId(null)}
        onSelect={form.selectTaxType}
      />

      <UnitPickerModal
        visible={Boolean(form.unitPickerLineId)}
        onClose={() => form.setUnitPickerLineId(null)}
        onSelect={form.selectUnit}
      />

      <DraftBottomBar
        totals={form.totals}
        isDraftReady={isDraftReady}
        loading={loading}
        isPdfBusy={isPdfBusy}
        activePdfAction={activePdfAction}
        onCreateDraft={createDraft}
        onOpenPdf={openCreatedPdf}
        onSharePdf={shareCreatedPdf}
      />
    </KeyboardAvoidingView>
  );
}
