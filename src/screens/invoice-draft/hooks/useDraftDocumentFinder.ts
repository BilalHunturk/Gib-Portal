import { useCallback } from "react";

import { GibDocument } from "../../../models/gibDocument";
import { InvoiceDraftInput } from "../../../models/invoiceDraft";
import { GibService } from "../../../services/gib";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .toLocaleLowerCase("tr-TR")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGibDate(value: unknown) {
  return String(value ?? "")
    .replace(/\//g, "-")
    .trim();
}

function extractDocumentNumber(value: unknown) {
  const match = String(value ?? "").match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}

function getDocValue(doc: GibDocument, key: string) {
  return String((doc as any)?.[key] ?? doc.raw?.[key] ?? "");
}

function buyerMatches(docBuyer: string, expectedBuyer: string) {
  if (!expectedBuyer) {
    return false;
  }

  return (
    docBuyer === expectedBuyer ||
    docBuyer.includes(expectedBuyer) ||
    expectedBuyer.includes(docBuyer)
  );
}

export function useDraftDocumentFinder(gib: GibService) {
  const findCreatedDraftDocument = useCallback(
    async (input: InvoiceDraftInput): Promise<GibDocument | null> => {
      const expectedDate = normalizeText(normalizeGibDate(input.tarih));
      const expectedVknTckn = normalizeText(input.vknTckn);

      const expectedBuyer = normalizeText(
        input.aliciUnvan ||
          `${input.aliciAdi} ${input.aliciSoyadi}`.trim()
      );

      for (let attempt = 1; attempt <= 4; attempt += 1) {
        if (attempt > 1) {
          await wait(1500);
        }

        const docs: GibDocument[] = await withTimeout(
          gib.getIssuedDocuments(input.tarih, input.tarih),
          12000,
          "Belge listesi alınırken zaman aşımı oluştu. Lütfen birkaç saniye sonra tekrar deneyin."
        );

        const scored = docs
          .filter((doc: GibDocument) => Boolean(doc.ettn))
          .map((doc: GibDocument) => {
            const docDate = normalizeText(
              normalizeGibDate(doc.tarih || getDocValue(doc, "belgeTarihi"))
            );

            const docVknTckn = normalizeText(
              (doc as any).aliciVknTckn ||
                doc.raw?.aliciVknTckn ||
                doc.raw?.vknTckn ||
                ""
            );

            const docBuyer = normalizeText(
              doc.alici ||
                doc.raw?.aliciUnvanAdSoyad ||
                doc.raw?.alici ||
                doc.raw?.unvan ||
                ""
            );

            const docType = normalizeText(
              doc.belgeTuru || doc.raw?.belgeTuru || "FATURA"
            );

            const approval = normalizeText(
              doc.onayDurumu || doc.raw?.onayDurumu || ""
            );

            let score = 0;
            const reasons: string[] = [];

            if (docDate === expectedDate) {
              score += 20;
              reasons.push("date");
            }

            if (docVknTckn === expectedVknTckn) {
              score += 35;
              reasons.push("vkn");
            }

            if (buyerMatches(docBuyer, expectedBuyer)) {
              score += 35;
              reasons.push("buyer");
            }

            if (docType === normalizeText("FATURA")) {
              score += 10;
              reasons.push("type");
            }

            if (approval === normalizeText("Onaylanmadı")) {
              score += 10;
              reasons.push("draft");
            }

            return {
              doc,
              score,
              reasons,
              belgeNo: doc.belgeNo,
              docNumber: extractDocumentNumber(doc.belgeNo),
              docDate,
              docVknTckn,
              docBuyer,
              docType,
              approval,
            };
          })
          .sort((a, b) => {
            if (b.score !== a.score) {
              return b.score - a.score;
            }

            return b.docNumber - a.docNumber;
          });

        console.log(
          "CREATED DRAFT MATCH ATTEMPT:",
          attempt,
          JSON.stringify(
            scored.slice(0, 10).map((item) => ({
              score: item.score,
              reasons: item.reasons,
              belgeNo: item.belgeNo,
              docNumber: item.docNumber,
              docDate: item.docDate,
              docVknTckn: item.docVknTckn,
              docBuyer: item.docBuyer,
              docType: item.docType,
              approval: item.approval,
              ettn: item.doc.ettn,
            })),
            null,
            2
          )
        );

        const best = scored[0];

        if (best && best.score >= 80) {
          return best.doc;
        }
      }

      return null;
    },
    [gib]
  );

  return {
    findCreatedDraftDocument,
  };
}
