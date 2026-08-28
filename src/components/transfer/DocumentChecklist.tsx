import {
  CheckCircle2,
  CircleAlert,
  FileText,
  RefreshCw,
  Upload,
} from "lucide-react";

import type { DocumentStatus, TransferDocument } from "../../types/transfer";

type ESignStage = "BUYER_ESIGN_PENDING" | "SELLER_ESIGN_PENDING";

interface DocumentChecklistProps {
  documents: TransferDocument[];
  stage: ESignStage;
  onUpload: (documentId: string, fileName: string) => void;
  isCompleted: boolean;
}

const statusStyles: Record<
  DocumentStatus,
  {
    label: string;
    icon: typeof FileText;
    iconClassName: string;
    badgeClassName: string;
  }
> = {
  missing: {
    label: "Upload required",
    icon: Upload,
    iconClassName: "text-slate-500",
    badgeClassName: "bg-slate-100 text-slate-700",
  },
  pending_review: {
    label: "Checking",
    icon: RefreshCw,
    iconClassName: "text-blue-600",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  valid: {
    label: "Accepted",
    icon: CheckCircle2,
    iconClassName: "text-emerald-600",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  invalid: {
    label: "Invalid",
    icon: CircleAlert,
    iconClassName: "text-rose-600",
    badgeClassName: "bg-rose-100 text-rose-700",
  },
  needs_reupload: {
    label: "Upload again",
    icon: RefreshCw,
    iconClassName: "text-amber-700",
    badgeClassName: "bg-amber-100 text-amber-800",
  },
};

export function DocumentChecklist({
  documents,
  stage,
  onUpload,
  isCompleted,
}: DocumentChecklistProps) {
  const requiredDocuments = documents.filter(
    (document) =>
      document.requiredAt === stage || document.alsoRequiredAt === stage,
  );

  const isBuyerStage = stage === "BUYER_ESIGN_PENDING";
  const heading = isBuyerStage
    ? "Buyer documents and Form 30"
    : "Seller documents, Forms 29 and 30";

  return !isCompleted ? (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div>
      <p className="text-sm font-medium text-slate-500">
        Required documents
      </p>

      <h2 className="mt-1 text-lg font-semibold text-slate-900">
        {heading}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        Upload each item before completing the mock Aadhaar OTP e-sign.
      </p>
    </div>

    <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
      {requiredDocuments.map((document) => {
        const config = statusStyles[document.status];
        const StatusIcon = config.icon;
        const inputId = `document-upload-${document.id}`;

        const canUpload =
          document.status === "missing" ||
          document.status === "invalid" ||
          document.status === "needs_reupload";

        return (
          <div
            key={document.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
          >
            <StatusIcon
              aria-hidden="true"
              className={`h-5 w-5 shrink-0 ${config.iconClassName}`}
            />

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900">
                {document.label}
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-600">
                {document.description}
              </p>

              {document.signers?.length ? (
                <p className="mt-2 text-xs font-medium text-slate-500">
                  Signatures required:{" "}
                  {document.signers
                    .map((signer) =>
                      signer === "seller" ? "Seller" : "Buyer",
                    )
                    .join(" and ")}
                </p>
              ) : null}

              {document.fileName ? (
                <p className="mt-2 truncate text-xs font-medium text-slate-500">
                  Uploaded: {document.fileName}
                </p>
              ) : null}

              {document.issueMessage ? (
                <p className="mt-2 text-sm font-medium text-amber-800">
                  {document.issueMessage}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClassName}`}
              >
                {config.label}
              </span>

              {canUpload ? (
                <>
                  <input
                    id={inputId}
                    type="file"
                    className="sr-only"
                    onChange={(event) => {
                      const file = event.target.files?.[0];

                      if (file) {
                        onUpload(document.id, file.name);
                      }

                      event.target.value = "";
                    }}
                  />

                  <label
                    htmlFor={inputId}
                    className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Upload
                      aria-hidden="true"
                      className="h-4 w-4"
                    />

                    {document.status === "needs_reupload"
                      ? "Upload again"
                      : "Upload"}
                  </label>
                </>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  </section>
) : (
  <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
    <div className="flex items-start gap-3">
      <CheckCircle2
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
      />

      <div>
        <p className="text-sm font-semibold text-emerald-700">
          Seller documents submitted
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          Seller e-sign completed
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your documents, Form 29/30 and mock Aadhaar e-sign have been
          completed. Continue to the final review before the application
          is sent to the RTO.
        </p>
      </div>
    </div>
  </section>
);}