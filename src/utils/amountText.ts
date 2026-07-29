const ONES = [
  "",
  "bir",
  "iki",
  "üç",
  "dört",
  "beş",
  "altı",
  "yedi",
  "sekiz",
  "dokuz",
];

const TENS = [
  "",
  "on",
  "yirmi",
  "otuz",
  "kırk",
  "elli",
  "altmış",
  "yetmiş",
  "seksen",
  "doksan",
];

function threeDigitsToTurkishText(value: number) {
  const hundreds = Math.floor(value / 100);
  const tens = Math.floor((value % 100) / 10);
  const ones = value % 10;

  let text = "";

  if (hundreds > 0) {
    text += hundreds === 1 ? "yüz" : `${ONES[hundreds]}yüz`;
  }

  if (tens > 0) {
    text += TENS[tens];
  }

  if (ones > 0) {
    text += ONES[ones];
  }

  return text;
}

export function numberToTurkishText(value: number) {
  const cleanValue = Math.floor(Math.abs(value));

  if (cleanValue === 0) {
    return "sıfır";
  }

  const billions = Math.floor(cleanValue / 1_000_000_000);
  const millions = Math.floor((cleanValue % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((cleanValue % 1_000_000) / 1_000);
  const rest = cleanValue % 1_000;

  let text = "";

  if (billions > 0) {
    text += `${threeDigitsToTurkishText(billions)}milyar`;
  }

  if (millions > 0) {
    text += `${threeDigitsToTurkishText(millions)}milyon`;
  }

  if (thousands > 0) {
    text += thousands === 1 ? "bin" : `${threeDigitsToTurkishText(thousands)}bin`;
  }

  if (rest > 0) {
    text += threeDigitsToTurkishText(rest);
  }

  return text;
}

export function amountToTurkishLiraText(value: number) {
  const rounded = Math.round((value + Number.EPSILON) * 100) / 100;

  const lira = Math.floor(rounded);
  const kurus = Math.round((rounded - lira) * 100);

  const liraText = `${numberToTurkishText(lira)}türklirası`;

  if (kurus <= 0) {
    return `Yalnız;${liraText}`;
  }

  return `Yalnız;${liraText}${numberToTurkishText(kurus)}kuruş`;
}