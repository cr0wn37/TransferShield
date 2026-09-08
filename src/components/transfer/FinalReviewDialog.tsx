import {
  CheckCircle2,
  CircleAlert,
  Eye,
  FileSearch,
  Upload,
  X,
} from "lucide-react";

import type { PartyRole, Transfer } from "../../types/transfer";

interface FinalReviewDialogProps {
  role: Extract<PartyRole, "seller" | "buyer">;
  transfer: Transfer;
  onClose: () => void;
  onConfirm: (role: Extract<PartyRole, "seller" | "buyer">) => void;
  onReplaceDocument: (documentId: string, fileName: string) => void;
}

export function FinalReviewDialog({
  role,
  transfer,
  onClose,
  onConfirm,
  onReplaceDocument,
}: FinalReviewDialogProps) {
  const documents = transfer.documents.filter(
    (document) =>
      document.owner === role ||
      (role === "buyer" && document.id === "form-30") ||
      (role === "seller" && document.id === "form-29"),
  );

  const party = transfer[role];

  const allValid = documents.every(
    (document) => document.status === "valid",
  );

  const aiCheckedCount =
  documents.filter(
    (document) =>
      document.verification,
  ).length;

const aiIssueCount =
  documents.filter(
    (document) =>
      document.verification?.status ===
        "needs_correction" ||
      document.verification?.status ===
        "unable_to_verify",
  ).length;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24201d]/45 p-3 sm:p-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="final-review-dialog-title"
      className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden border border-[#d9d0c7] bg-[#fffdf9] shadow-2xl"
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
            Final review
          </p>

          <h2
            id="final-review-dialog-title"
            className="mt-1 text-lg font-bold tracking-tight text-[#24201d]"
          >
            Review your submission
          </h2>

          <p className="mt-2 text-xs leading-5 text-[#6b635d]">
            Check your details and documents before the application is locked
            for RTO review.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] text-[#8a7d72] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        {/* Party summary */}
        <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
            {role === "buyer" ? "Buyer" : "Seller"}
          </p>

          <p className="mt-1 text-sm font-semibold text-[#24201d]">
            {party.name}
          </p>

          <p className="mt-1 text-xs leading-5 text-[#6b635d]">
            {party.address}
          </p>
        </div>

        {/* AI pre-flight */}
        <div className="mt-5">
          {aiCheckedCount > 0 ? (
            <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-3">
              <div className="flex items-start gap-3">
                <FileSearch
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#b56f52]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#24201d]">
                    AI document pre-flight
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                    {aiCheckedCount} of {documents.length} documents have been
                    analyzed.
                    {aiIssueCount > 0
                      ? ` ${aiIssueCount} need${
                          aiIssueCount === 1 ? "s" : ""
                        } attention.`
                      : " No AI consistency issues were detected."}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Documents */}
          <div className="mt-4 divide-y divide-[#e5ddd5] border border-[#d9d0c7] bg-[#fffdf9]">
            {documents.map((document) => {
              const isValid = document.status === "valid";
              const aiVerification = document.verification;

              const aiPassed =
                aiVerification?.status === "verified";

              

              return (
                <div
                  key={document.id}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#24201d]">
                        {document.label}
                      </p>

                      <p className="mt-1 text-xs text-[#6b635d]">
                        {document.fileName ?? "No document uploaded"}
                      </p>

                      {document.issueMessage ? (
                        <div className="mt-2 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-3 py-2">
                          <p className="text-xs font-medium text-[#8c6427]">
                            {document.issueMessage}
                          </p>
                        </div>
                      ) : null}

                      {/* AI verification */}
                      {aiVerification ? (
                        <div
                          className={[
                            "mt-3 border px-3 py-3",
                            aiPassed
                              ? "border-[#cdddcf] bg-[#f4f8f4]"
                              : "border-[#e3cfaa] bg-[#fbf3e3]",
                          ].join(" ")}
                        >
                          <div className="flex items-start gap-2">
                            {aiPassed ? (
                              <CheckCircle2
                                aria-hidden="true"
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#5d7c60]"
                              />
                            ) : (
                              <CircleAlert
                                aria-hidden="true"
                                className="mt-0.5 h-4 w-4 shrink-0 text-[#8c6427]"
                              />
                            )}

                            <div className="min-w-0">
                              <p
                                className={[
                                  "text-xs font-semibold",
                                  aiPassed
                                    ? "text-[#48634b]"
                                    : "text-[#7a591f]",
                                ].join(" ")}
                              >
                                {aiPassed
                                  ? "AI document check passed"
                                  : aiVerification.status ===
                                      "unable_to_verify"
                                    ? "AI verification unavailable"
                                    : "AI needs attention"}
                              </p>

                              <p
                                className={[
                                  "mt-1 text-xs leading-5",
                                  aiPassed
                                    ? "text-[#5d7c60]"
                                    : "text-[#8c6427]",
                                ].join(" ")}
                              >
                                {aiVerification.summary}
                              </p>

                              <p className="mt-2 text-[10px] font-medium text-[#8a7d72]">
                                Extraction confidence:{" "}
                                {Math.round(
                                  aiVerification.confidence * 100,
                                )}
                                %
                              </p>

                              {aiVerification.issues.length > 0 ? (
                                <div className="mt-3 space-y-2">
                                  {aiVerification.issues.map(
                                    (issue, index) => (
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
                                    ),
                                  )}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Document status */}
                    <span
                      className={[
                        "shrink-0 border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
                        isValid
                          ? "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]"
                          : "border-[#e3cfaa] bg-[#fbf3e3] text-[#8c6427]",
                      ].join(" ")}
                    >
                      {isValid ? "Ready" : "Needs attention"}
                    </span>
                  </div>

                  {/* Document actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="inline-flex min-h-9 items-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-3 py-2 text-xs font-semibold text-[#6b635d] transition hover:border-[#24201d] hover:text-[#24201d]"
                    >
                      <Eye aria-hidden="true" className="h-3.5 w-3.5" />
                      View
                    </button>

                    <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-3 py-2 text-xs font-semibold text-[#6b635d] transition hover:border-[#24201d] hover:text-[#24201d]">
                      <Upload
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />
                      Replace

                      <input
                        type="file"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.target.files?.[0];

                          if (file) {
                            onReplaceDocument(
                              document.id,
                              file.name,
                            );
                          }

                          event.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lock notice */}
        <div className="mt-5 border-l-2 border-[#e99b79] bg-[#f8f3ee] px-3 py-3">
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-[#b56f52]"
            />

            <p className="text-xs leading-5 text-[#6b635d]">
              After you confirm, your submission is locked for RTO review.
              Any later correction must come through the RTO correction flow.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#e5ddd5] bg-[#f8f3ee] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 border border-[#d9d0c7] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold text-[#6b635d] transition hover:bg-white hover:text-[#24201d]"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!allValid}
          onClick={() => onConfirm(role)}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9a8d82]"
        >
          Confirm & lock submission
        </button>
      </div>
    </section>
  </div>
);}