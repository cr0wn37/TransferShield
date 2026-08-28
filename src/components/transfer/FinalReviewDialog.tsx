import { CheckCircle2, Eye, Upload, X } from "lucide-react";

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

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <section
      role="dialog"
      aria-modal="true"
      className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
    >
      {/* Header */}
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Final review
          </p>
          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Review your submission
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Check your details and documents before the application is
            locked for RTO review.
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {role === "buyer" ? "Buyer" : "Seller"}
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {party.name}
          </p>

          <p className="mt-1 text-sm text-slate-600">
            {party.address}
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {documents.map((document) => {
            const isValid = document.status === "valid";

            return (
              <div
                key={document.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">
                      {document.label}
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {document.fileName ?? "No document uploaded"}
                    </p>

                    {document.issueMessage ? (
                      <p className="mt-2 text-sm font-medium text-amber-700">
                        {document.issueMessage}
                      </p>
                    ) : null}
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      isValid
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isValid ? "Ready" : "Needs attention"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>

                  <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    <Upload className="h-4 w-4" />
                    Replace

                    <input
                      type="file"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          onReplaceDocument(document.id, file.name);
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

        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

            <p className="text-sm leading-6 text-blue-900">
              After you confirm, your submission is locked for RTO review.
              Any later correction must come through the RTO correction flow.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white p-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="button"
          disabled={!allValid}
          onClick={() => onConfirm(role)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirm & lock submission
        </button>
      </div>
    </section>
  </div>
);}