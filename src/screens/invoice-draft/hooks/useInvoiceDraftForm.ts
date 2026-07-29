import { useState } from "react";
import { Alert } from "react-native";

import { InvoiceDraftInput } from "../../../models/invoiceDraft";
import {
  BuyerType,
  DraftLineForm,
  InvoiceDraftFormSnapshot,
} from "../types";
import {
  calculateDraftTotals,
  createLine,
} from "../domain/invoiceDraftCalculations";
import { buildInvoiceDraftInput } from "../domain/invoiceDraftBuilder";
import { validateInvoiceDraftForm } from "../domain/invoiceDraftValidation";

export function useInvoiceDraftForm() {
  const [buyerType, setBuyerType] = useState<BuyerType>("person");

  const [vknTckn, setVknTckn] = useState("1111111111");
  const [aliciUnvan, setAliciUnvan] = useState("TEST ALICI LTD ŞTİ");
  const [aliciAdi, setAliciAdi] = useState("");
  const [aliciSoyadi, setAliciSoyadi] = useState("");
  const [vergiDairesi, setVergiDairesi] = useState("TEST VERGİ DAİRESİ");

  const [adres, setAdres] = useState("Test Mahallesi Test Caddesi No:1");
  const [mahalleSemtIlce, setMahalleSemtIlce] = useState("YeniKara");
  const [sehir, setSehir] = useState("İzmir");
  const [ulke, setUlke] = useState("Türkiye");

  const [showDetailedAddress, setShowDetailedAddress] = useState(false);

  const [binaAdi, setBinaAdi] = useState("");
  const [binaNo, setBinaNo] = useState("");
  const [kapiNo, setKapiNo] = useState("");
  const [kasabaKoy, setKasabaKoy] = useState("");
  const [postaKodu, setPostaKodu] = useState("");

  const [lines, setLines] = useState<DraftLineForm[]>([createLine()]);
  const [note, setNote] = useState("");

  const [taxPickerLineId, setTaxPickerLineId] = useState<string | null>(null);
  const [unitPickerLineId, setUnitPickerLineId] = useState<string | null>(null);
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);

  const [faturaTipi, setFaturaTipi] = useState("SATIS");
  const [paraBirimi, setParaBirimi] = useState("TRY");
  const [dovzTLkur, setDovzTLkur] = useState("0");

  const [siparisNumarasi, setSiparisNumarasi] = useState("");
  const [siparisTarihi, setSiparisTarihi] = useState("");

  const [irsaliyeNumarasi, setIrsaliyeNumarasi] = useState("");
  const [irsaliyeTarihi, setIrsaliyeTarihi] = useState("");

  const [tel, setTel] = useState("");
  const [eposta, setEposta] = useState("");
  const [websitesi, setWebsitesi] = useState("");

  const totals = calculateDraftTotals(lines);

  function updateLine(
    id: string,
    field: keyof Omit<DraftLineForm, "id">,
    value: string
  ) {
    setLines((currentLines) => {
      return currentLines.map((line) => {
        if (line.id !== id) {
          return line;
        }

        return {
          ...line,
          [field]: value,
        };
      });
    });
  }

  function selectTaxType(value: string) {
    if (!taxPickerLineId) {
      return;
    }

    updateLine(taxPickerLineId, "vergiCesidi", value);
    setTaxPickerLineId(null);
  }

  function selectUnit(value: string) {
    if (!unitPickerLineId) {
      return;
    }

    updateLine(unitPickerLineId, "birim", value || "C62");
    setUnitPickerLineId(null);
  }

  function addLine() {
    setLines((currentLines) => [...currentLines, createLine()]);
  }

  function removeLine(id: string) {
    if (lines.length === 1) {
      Alert.alert("Uyarı", "Faturada en az bir mal/hizmet kalemi bulunmalıdır.");
      return;
    }

    setLines((currentLines) => {
      return currentLines.filter((line) => line.id !== id);
    });
  }

  function getFormSnapshot(): InvoiceDraftFormSnapshot {
    return {
      buyerType,

      vknTckn,
      aliciUnvan,
      aliciAdi,
      aliciSoyadi,
      vergiDairesi,

      adres,
      mahalleSemtIlce,
      sehir,
      ulke,

      binaAdi,
      binaNo,
      kapiNo,
      kasabaKoy,
      postaKodu,

      faturaTipi,
      paraBirimi,
      dovzTLkur,

      siparisNumarasi,
      siparisTarihi,

      irsaliyeNumarasi,
      irsaliyeTarihi,

      tel,
      eposta,
      websitesi,

      note,
      lines,
    };
  }

  function validateForm() {
    return validateInvoiceDraftForm(getFormSnapshot());
  }

  function buildCurrentInvoiceInput(): InvoiceDraftInput {
    return buildInvoiceDraftInput(getFormSnapshot());
  }

  function resetFormAfterSuccess() {
    setLines([createLine()]);
    setNote("");
  }

  return {
    buyerType,
    setBuyerType,
    vknTckn,
    setVknTckn,
    aliciUnvan,
    setAliciUnvan,
    aliciAdi,
    setAliciAdi,
    aliciSoyadi,
    setAliciSoyadi,
    vergiDairesi,
    setVergiDairesi,

    adres,
    setAdres,
    mahalleSemtIlce,
    setMahalleSemtIlce,
    sehir,
    setSehir,
    ulke,
    setUlke,
    showDetailedAddress,
    setShowDetailedAddress,
    binaAdi,
    setBinaAdi,
    binaNo,
    setBinaNo,
    kapiNo,
    setKapiNo,
    kasabaKoy,
    setKasabaKoy,
    postaKodu,
    setPostaKodu,

    lines,
    updateLine,
    addLine,
    removeLine,
    note,
    setNote,
    totals,

    taxPickerLineId,
    setTaxPickerLineId,
    selectTaxType,
    unitPickerLineId,
    setUnitPickerLineId,
    selectUnit,

    showAdvancedFields,
    setShowAdvancedFields,
    faturaTipi,
    setFaturaTipi,
    paraBirimi,
    setParaBirimi,
    dovzTLkur,
    setDovzTLkur,
    siparisNumarasi,
    setSiparisNumarasi,
    siparisTarihi,
    setSiparisTarihi,
    irsaliyeNumarasi,
    setIrsaliyeNumarasi,
    irsaliyeTarihi,
    setIrsaliyeTarihi,
    tel,
    setTel,
    eposta,
    setEposta,
    websitesi,
    setWebsitesi,

    getFormSnapshot,
    validateForm,
    buildCurrentInvoiceInput,
    resetFormAfterSuccess,
  };
}

export type InvoiceDraftFormController = ReturnType<typeof useInvoiceDraftForm>;
