import {
  CheckCircle2,
  CircleAlert,
  FileSearch,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { TransferDocument } from "../../types/transfer";
import {
  verifyDocumentWithAI,
  type AIDocumentVerification,
} from "../../lib/verifyDocumentWithAI";
import { useTransferStore } from "../../state/transferStore";

interface AIDocumentPreflightProps {
  documents: TransferDocument[];
  documentFiles: Record<string, File>;
  vehicleNumber: string;
  sellerName: string;
  buyerName: string;
  chassisLast5: string;
  canAct?: boolean;
  isCompleted?: boolean;
  onVerificationComplete?: (
    results: Record<
      string,
      Awaited<ReturnType<typeof verifyDocumentWithAI>>
    >,
  ) => void;
}

export default function AIDocumentPreflight({
  documents,
  documentFiles,
  vehicleNumber,
  sellerName,
  buyerName,
  chassisLast5,
  canAct = true,
  isCompleted = false,
  onVerificationComplete,
}: AIDocumentPreflightProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<
    Record<
      string,
      Awaited<ReturnType<typeof verifyDocumentWithAI>>
    >
  >({});
  const setDocumentVerification =
  useTransferStore(
    (state) =>
      state.setDocumentVerification,
  );

  const documentSetKey = documents
  .map((document) => document.id)
  .sort()
  .join("|");

  useEffect(() => {
  setResults({});
  setError(null);
}, [documentSetKey]);

  const allDocumentsUploaded =
    documents.length > 0 &&
    documents.every(
      (document) =>
        document.fileName &&
        document.status !== "missing",
    );

  if (isCompleted || !allDocumentsUploaded) {
    return null;
  }

 const checkedCount = Object.keys(results).length;

const verifiedCount = Object.values(results).filter(
  (result) => result.status === "verified",
).length;

  




  const issueCount = Object.values(results).filter(
    (result) =>
      result.status === "needs_correction" ||
      result.status === "unable_to_verify",
  ).length;

  const handleVerify = async () => {

    console.log(
  "AI PRE-FLIGHT FILES:",
  Object.entries(documentFiles).map(
    ([documentId, file]) => ({
      documentId,
      name: file?.name,
      type: file?.type,
      size: file?.size,
    }),
  ),
);
  setError(null);
  setIsChecking(true);
  setResults({});

  const nextResults: Record<
    string,
    AIDocumentVerification
  > = {};

  for (const document of documents) {
    const file = documentFiles[document.id];

    if (!file) {
      nextResults[document.id] = {
        status: "unable_to_verify",
        confidence: 0,
        summary:
          "The uploaded file is not available in this browser session.",
        extracted: {
          documentType: "unknown",
          ownerName: null,
          buyerName: null,
          vehicleNumber: null,
          chassisLast5: null,
          documentDate: null,
          financierName: null,
        },
        issues: [
          {
            field: "document_quality",
            label: "Document unavailable",
            expected: null,
            found: null,
            message:
              "The uploaded file could not be accessed for AI verification.",
          },
        ],
      };

      setResults({ ...nextResults });
      continue;
    }

    try {

      console.log(
  "VERIFYING:",
  document.id,
  document.label,
  documentFiles[document.id],
);
      const result =
  await verifyDocumentWithAI({
    file,
    documentLabel: document.label,
    expectedVehicleNumber: vehicleNumber,
    expectedSellerName: sellerName,
    expectedBuyerName: buyerName,
    expectedChassisLast5: chassisLast5,
  });

nextResults[document.id] =
  result;

setResults({
  ...nextResults,
});

setDocumentVerification(
  document.id,
  result,
);

      
    } catch (verificationError) {
      console.error(
        `AI verification failed for ${document.label}:`,
        verificationError,
      );

      const failedResult: AIDocumentVerification = {
  status:
    "unable_to_verify" as const,

  confidence: 0,

  summary:
    "This document could not be checked because the AI verification service returned an error.",

  extracted: {
    documentType: "unknown" as const,
    ownerName: null,
    buyerName: null,
    vehicleNumber: null,
    chassisLast5: null,
    documentDate: null,
    financierName: null,
  },

  issues: [
    {
      field:
        "document_quality",

      label:
        "AI verification error",

      expected: null,

      found: null,

      message:
        verificationError instanceof Error
          ? verificationError.message
          : "The AI verification service could not process this document.",
    },
  ],
};

nextResults[document.id] =
  failedResult;

setResults({
  ...nextResults,
});

setDocumentVerification(
  document.id,
  failedResult,
);

      
    }
  }

  onVerificationComplete?.(nextResults);

  setIsChecking(false);
};

  return (
  <section
    aria-label="AI document pre-flight"
    className="mt-4 border border-[#d9d0c7] bg-[#fffdf9]"
  >
    {/* Header */}
    <div className="border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#b56f52]">
          <FileSearch
            aria-hidden="true"
            className="h-4 w-4"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-bold tracking-tight text-[#24201d]">
              AI document pre-flight
            </h2>

            <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
              AI
            </span>
          </div>

          <p className="mt-1 text-xs leading-5 text-[#6b635d]">
            Check uploaded documents for consistency with this transfer.
          </p>
        </div>
      </div>
    </div>

    {/* Summary */}
    <div className="px-5 py-4 sm:px-6">
      <div className="grid grid-cols-3 border border-[#d9d0c7] bg-[#f8f3ee]">
        <div className="border-r border-[#d9d0c7] px-3 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
            Documents
          </p>

          <p className="mt-1 text-lg font-bold text-[#24201d]">
            {documents.length}
          </p>
        </div>

        <div className="border-r border-[#d9d0c7] px-3 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
            AI checked
          </p>

          <p className="mt-1 text-lg font-bold text-[#5d7c60]">
            {checkedCount}
          </p>
        </div>

        <div className="px-3 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
            Issues
          </p>

          <p className="mt-1 text-lg font-bold text-[#8c6427]">
            {issueCount}
          </p>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <div className="mt-4 border-l-2 border-[#c96262] bg-[#fbefef] px-3 py-3">
          <div className="flex items-start gap-3">
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#9a4f4f]"
            />

            <div>
              <p className="text-xs font-semibold text-[#8f3d3d]">
                AI verification could not be completed
              </p>

              <p className="mt-1 text-xs leading-5 text-[#9a4f4f]">
                {error}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Ready state */}
      {checkedCount === 0 && issueCount === 0 ? (
        <div className="mt-4 border border-[#d9d0c7] bg-[#fffdf9] px-4 py-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#b56f52]"
            />

            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#24201d]">
                Ready for AI verification
              </p>

              <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                Extract vehicle and party details from the uploaded
                documents and compare them with this transfer.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleVerify}
            disabled={!canAct || isChecking}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9a8d82]"
          >
            {isChecking ? (
              <>
                <Loader2
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin"
                />
                Checking documents...
              </>
            ) : (
              <>
                <FileSearch
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                Verify documents with AI
              </>
            )}
          </button>

          {!canAct ? (
            <p className="mt-2 text-[11px] font-medium text-[#8a7d72]">
              Only the active party can start document verification.
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Checking state */}
      {isChecking ? (
        <div className="mt-4 border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-3">
          <div className="flex items-center gap-3">
            <Loader2
              aria-hidden="true"
              className="h-4 w-4 animate-spin text-[#b56f52]"
            />

            <div>
              <p className="text-xs font-semibold text-[#24201d]">
                AI is reviewing your documents
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#8a7d72]">
                Each document is being analyzed against this transfer.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Results */}
      {!isChecking && Object.keys(results).length > 0 ? (
        <div className="mt-4 divide-y divide-[#e5ddd5] border border-[#d9d0c7] bg-[#fffdf9]">
          {documents.map((document) => {
            const result = results[document.id];

            if (!result) {
              return null;
            }

            const verified = result.status === "verified";

            return (
              <div
                key={document.id}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center border",
                      verified
                        ? "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]"
                        : "border-[#e3cfaa] bg-[#fbf3e3] text-[#8c6427]",
                    ].join(" ")}
                  >
                    {verified ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    ) : (
                      <CircleAlert
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#24201d]">
                          {document.label}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                          {result.summary}
                        </p>
                      </div>

                      <span
                        className={[
                          "shrink-0 border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
                          verified
                            ? "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]"
                            : "border-[#e3cfaa] bg-[#fbf3e3] text-[#8c6427]",
                        ].join(" ")}
                      >
                        {verified ? "Verified" : "Needs attention"}
                      </span>
                    </div>

                    <p className="mt-2 text-[10px] font-medium text-[#8a7d72]">
                      Extraction confidence:{" "}
                      {Math.round(result.confidence * 100)}%
                    </p>

                    {result.issues.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {result.issues.map((issue, index) => (
                          <div
                            key={`${issue.field}-${index}`}
                            className="border border-[#e3cfaa] bg-[#fffaf1] px-3 py-2.5"
                          >
                            <p className="text-xs font-semibold text-[#24201d]">
                              {issue.label}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                              {issue.message}
                            </p>

                            {issue.expected ? (
                              <p className="mt-2 text-[11px] text-[#8a7d72]">
                                Expected:{" "}
                                <span className="font-semibold text-[#24201d]">
                                  {issue.expected}
                                </span>
                              </p>
                            ) : null}

                            {issue.found ? (
                              <p className="mt-1 text-[11px] text-[#8a7d72]">
                                Found:{" "}
                                <span className="font-semibold text-[#24201d]">
                                  {issue.found}
                                </span>
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  </section>
);}