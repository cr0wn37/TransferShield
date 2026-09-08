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
  onUpload: (documentId: string, file: File) => void;
  isCompleted: boolean;
  canAct?: boolean;
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
    iconClassName: "text-[#8a7d72]",
    badgeClassName: "border-[#d9d0c7] bg-[#f8f3ee] text-[#6b635d]",
  },

  pending_review: {
    label: "Checking",
    icon: RefreshCw,
    iconClassName: "text-[#b56f52]",
    badgeClassName: "border-[#dfd3ca] bg-[#f8f3ee] text-[#b56f52]",
  },

  valid: {
    label: "Accepted",
    icon: CheckCircle2,
    iconClassName: "text-[#5d7c60]",
    badgeClassName: "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]",
  },

  invalid: {
    label: "Invalid",
    icon: CircleAlert,
    iconClassName: "text-[#9a4f4f]",
    badgeClassName: "border-[#d9b5b5] bg-[#fbefef] text-[#9a4f4f]",
  },

  needs_reupload: {
    label: "Upload again",
    icon: RefreshCw,
    iconClassName: "text-[#8c6427]",
    badgeClassName: "border-[#e3cfaa] bg-[#fbf3e3] text-[#8c6427]",
  },
};

export function DocumentChecklist({
  documents,
  stage,
  onUpload,
  isCompleted,
  canAct = true,
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
  <section className="border border-[#d9d0c7] bg-[#fffdf9]">
    {/* Header */}
    <div className="border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
        Required documents
      </p>

      <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
        {heading}
      </h2>

      <p className="mt-1.5 text-xs leading-5 text-[#6b635d]">
        Upload each item before completing the mock Aadhaar OTP e-sign.
      </p>
    </div>

    {/* Documents */}
    <div className="divide-y divide-[#e5ddd5]">
      {requiredDocuments.map((document) => {
        const config = statusStyles[document.status];
        const StatusIcon = config.icon;
        const inputId = `document-upload-${document.id}`;

        const canUpload =
          canAct &&
          (document.status === "missing" ||
            document.status === "invalid" ||
            document.status === "needs_reupload");

        return (
          <div
            key={document.id}
            className="px-5 py-4 sm:px-6"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Document information */}
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center border",
                    config.badgeClassName,
                  ].join(" ")}
                >
                  <StatusIcon
                    aria-hidden="true"
                    className={`h-4 w-4 ${config.iconClassName}`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#24201d]">
                      {document.label}
                    </p>

                    <span
                      className={[
                        "border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
                        config.badgeClassName,
                      ].join(" ")}
                    >
                      {config.label}
                    </span>
                  </div>

                  <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                    {document.description}
                  </p>

                  {document.signers?.length ? (
                    <p className="mt-2 text-[11px] font-medium text-[#8a7d72]">
                      Signatures required:{" "}
                      {document.signers
                        .map((signer) =>
                          signer === "seller" ? "Seller" : "Buyer",
                        )
                        .join(" and ")}
                    </p>
                  ) : null}

                  {document.fileName ? (
                    <p className="mt-1.5 truncate text-[11px] font-medium text-[#8a7d72]">
                      Uploaded: {document.fileName}
                    </p>
                  ) : null}

                  {document.issueMessage ? (
                    <div className="mt-3 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-3 py-2">
                      <p className="text-xs font-medium leading-5 text-[#8c6427]">
                        {document.issueMessage}
                      </p>
                    </div>
                  ) : null}

                  {document.verification ? (
                    <div className="mt-2.5 flex items-center gap-2">
                      {document.verification.status === "verified" ? (
                        <>
                          <CheckCircle2
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#5d7c60]"
                          />

                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5d7c60]">
                            AI document check passed
                          </span>
                        </>
                      ) : (
                        <>
                          <CircleAlert
                            aria-hidden="true"
                            className="h-3.5 w-3.5 text-[#8c6427]"
                          />

                          <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8c6427]">
                            AI needs attention
                          </span>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 flex-wrap items-center gap-2 lg:pt-0.5">
                {!canAct ? (
                  <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-2.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8a7d72]">
                    {document.owner === "seller"
                      ? "Seller only"
                      : "Buyer only"}
                  </span>
                ) : null}

                {canUpload ? (
                  <>
                    <input
                      id={inputId}
                      type="file"
                      className="sr-only"
                      onChange={(event) => {
                        const file = event.target.files?.[0];

                        if (file) {
                          onUpload(document.id, file);
                        }

                        event.target.value = "";
                      }}
                    />

                    <label
                      htmlFor={inputId}
                      className="inline-flex min-h-10 cursor-pointer items-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
                    >
                      <Upload
                        aria-hidden="true"
                        className="h-3.5 w-3.5"
                      />

                      {document.status === "needs_reupload"
                        ? "Upload again"
                        : "Upload"}
                    </label>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </section>
) : (
  <section className="border border-[#cdddcf] bg-[#fffdf9]">
    <div className="bg-[#f4f8f4] px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#cdddcf] bg-[#fffdf9] text-[#5d7c60]">
          <CheckCircle2
            aria-hidden="true"
            className="h-4 w-4"
          />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#5d7c60]">
            Seller documents submitted
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
            Seller e-sign completed
          </h2>

          <p className="mt-1.5 text-xs leading-5 text-[#6b635d]">
            Your documents, Form 29/30 and mock Aadhaar e-sign have been
            completed. Continue to the final review before the application
            is sent to the RTO.
          </p>
        </div>
      </div>
    </div>
  </section>
);}