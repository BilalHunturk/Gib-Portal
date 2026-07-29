export type GibTaxType = {
  value: string;
  label: string;
};

export const GIB_TAX_TYPES: GibTaxType[] = [
  { value: " ", label: "Seçiniz" },
  { value: "V0021", label: "BANKA MUAMELELERİ VER." },
  { value: "V0061", label: "KKDF KESİNTİ" },
  { value: "V0071", label: "ÖTV 1. LİSTE" },
  { value: "V9077", label: "ÖTV 2. LİSTE" },
  { value: "V0073", label: "ÖTV 3. LİSTE" },
  { value: "V0074", label: "ÖTV 4. LİSTE" },
  { value: "V0075", label: "ÖTV 3A LİSTE" },
  { value: "V0076", label: "ÖTV 3B LİSTE" },
  { value: "V0077", label: "ÖTV 3C LİSTE" },
  { value: "V1047", label: "DAMGA V" },
  { value: "V1048", label: "5035SKDAMGAV" },
  { value: "V4080", label: "Ö.İLETİŞİM V" },
  { value: "V4081", label: "5035ÖZİLETV." },
  { value: "V9015", label: "KDV TEVKİFAT" },
  { value: "V9021", label: "4961BANKASMV" },
  { value: "V8001", label: "BORSA TES.ÜC." },
  { value: "V8002", label: "ENERJİ FONU" },
  { value: "V4071", label: "ELK.HAVAGAZ.TÜK.VER." },
  { value: "V8004", label: "TRT PAYI" },
  { value: "V8005", label: "ELK.TÜK.VER." },
  { value: "V8006", label: "TK KULLANIM" },
  { value: "V8007", label: "TK RUHSAT" },
  { value: "V8008", label: "ÇEV. TEM .VER." },
  { value: "V0003", label: "GV. STOPAJI" },
  { value: "V0011", label: "KV. STOPAJI" },
  { value: "V9040", label: "MERA FONU" },
  { value: "V4171", label: "ÖTV 1. LİSTE TEVKİFAT" },
  { value: "V9944", label: "BEL.ÖD.HAL RÜSUM" },
  { value: "V0059", label: "KONAKLAMA VERGİSİ" },
];

export function getGibTaxTypeLabel(value: string) {
  return GIB_TAX_TYPES.find((item) => item.value === value)?.label ?? "Seçiniz";
}