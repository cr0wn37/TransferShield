import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  FileText,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTransferStore } from "../state/transferStore";
import type { RejectionReasonCode } from "../types/transfer";
import { rejectionReasons } from "../lib/rtoRejectionReasons";



export function RtoOfficerPage() {
  const transfer = useTransferStore((state) => state.transfer);
  const approveTransfer = useTransferStore((state) => state.approveTransfer);
  const reviewDocument =
  useTransferStore(
    (state) => state.reviewDocument,
  );
  const completeTransfer = useTransferStore(
    (state) => state.completeTransfer,
  );


  const [selectedDocumentId, setSelectedDocumentId] = useState(
    transfer.documents[0]?.id ?? "",
  );
  const [reasonCode, setReasonCode] =
    useState<RejectionReasonCode>("DOCUMENT_UNCLEAR");

  const selectedDocument = transfer.documents.find(
    (document) => document.id === selectedDocumentId,
  );

  const canReviewDocuments =
  transfer.status === "RTO_PROCESSING" ||
  transfer.status === "ACTION_REQUIRED" ||
  transfer.status === "RESUBMISSION";

const canApproveApplication =
  transfer.status === "RTO_PROCESSING";

const isApproved =
  transfer.status === "RTO_APPROVED";

const isCompleted =
  transfer.status === "TRANSFER_COMPLETED";

  const handleReasonChange = (
  nextReasonCode: RejectionReasonCode,
) => {
  setReasonCode(nextReasonCode);
};

  

  return (
  <main className="min-h-screen bg-[#f8f1e8] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      {/* ======================================================= */}
      {/* TOP NAV                                                  */}
      {/* ======================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to="/rto"
          className="inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-[#b56f52] transition hover:text-[#24201d]"
        >
          <ArrowLeft
            aria-hidden="true"
            className="h-3.5 w-3.5"
          />
          Back to RTO queue
        </Link>

        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
          TransferShield · Officer workspace
        </div>
      </div>

      {/* ======================================================= */}
      {/* CASE HEADER                                               */}
      {/* ======================================================= */}

      <header className="mt-5 border-y border-[#d9d0c7] bg-[#fffdf9]">
        <div className="flex flex-col gap-6 px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Ownership transfer case
            </p>

            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#24201d]">
                {transfer.vehicle.registrationNumber}
              </h1>

              <span className="text-sm text-[#8a7d72]">
                Application {transfer.id}
              </span>
            </div>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b635d]">
              Review the submitted ownership-transfer package and either
              approve it or return specific documents for correction.
            </p>
          </div>

          <div className="shrink-0 border-l-2 border-[#7c9a7f] bg-[#f4f8f4] px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#5d7c60]">
              Case status
            </p>

            <p className="mt-1 text-sm font-bold text-[#24201d]">
              {isCompleted
                ? "Transfer completed"
                : isApproved
                  ? "Application approved"
                  : canReviewDocuments
                    ? "Ready for officer review"
                    : "Awaiting submission"}
            </p>
          </div>
        </div>
      </header>

      {/* ======================================================= */}
      {/* APPROVED / COMPLETED STATE                               */}
      {/* ======================================================= */}

      {isCompleted ? (
        <section className="mt-5 border border-[#cdddcf] bg-[#f4f8f4] px-5 py-4">
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#5d7c60]"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5d7c60]">
                Transfer completed
              </p>

              <p className="mt-1 text-sm font-semibold text-[#24201d]">
                The ownership-transfer workflow has been recorded as complete.
              </p>
            </div>
          </div>
        </section>
      ) : isApproved ? (
        <section className="mt-5 flex flex-col gap-4 border border-[#cdddcf] bg-[#f4f8f4] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#5d7c60]"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5d7c60]">
                RTO decision recorded
              </p>

              <p className="mt-1 text-sm font-semibold text-[#24201d]">
                Application approved. Finalize the transfer to complete the case.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={completeTransfer}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
          >
            Complete transfer
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />
          </button>
        </section>
      ) : null}

      {!canReviewDocuments && !isApproved && !isCompleted ? (
        <section className="mt-5 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-5 py-4">
          <div className="flex items-start gap-3">
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-[#8c6427]"
            />

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8c6427]">
                Not ready for review
              </p>

              <p className="mt-1 text-sm font-semibold text-[#24201d]">
                The seller and buyer must complete their requirements and
                submit the application first.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* ======================================================= */}
      {/* CASE SUMMARY                                              */}
      {/* ======================================================= */}

      <section className="mt-5 bg-[#fffdf9]">
        <div className="border-b border-[#d9d0c7] px-5 py-4 sm:px-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
            Case information
          </p>

          <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
            Parties and vehicle
          </h2>
        </div>

        <div className="grid gap-x-10 gap-y-6 px-5 py-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Seller
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              {transfer.seller.name}
            </p>

            <p className="mt-1 text-xs text-[#6b635d]">
              {transfer.seller.phoneMasked}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Buyer
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              {transfer.buyer.name}
            </p>

            <p className="mt-1 text-xs text-[#6b635d]">
              {transfer.buyer.phoneMasked}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Chassis number
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              XXXXX{transfer.vehicle.chassisLast5}
            </p>
          </div>

          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Registering authority
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              Maharashtra Motor Vehicle Department
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 border-t border-[#e5ddd5] pt-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Seller address
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                  {transfer.seller.address ?? "Address not provided"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Buyer address
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                  {transfer.buyer.address ?? "Address not provided"}
                </p>
              </div>

              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Vehicle compliance
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                  Insurance valid through{" "}
                  {transfer.vehicle.insuranceValidUpto} · PUCC valid through{" "}
                  {transfer.vehicle.puccValidUpto}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* DOCUMENT REVIEW                                          */}
      {/* ======================================================= */}

      <section className="mt-5 bg-[#fffdf9]">
        <div className="border-b border-[#d9d0c7] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                Document review
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Submitted documents
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                Review each submitted document independently. Corrections do
                not restart the application.
              </p>
            </div>

            <p className="text-xs font-semibold text-[#8a7d72]">
              {transfer.documents.filter(
                (document) => document.fileName,
              ).length}{" "}
              submitted
            </p>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#d9d0c7]">
                  <th className="pb-3 pr-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Document
                  </th>

                  <th className="pb-3 pr-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Submitted by
                  </th>

                  <th className="pb-3 pr-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Citizen check
                  </th>

                  <th className="pb-3 pr-5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    RTO decision
                  </th>

                  <th className="pb-3 text-right text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {(["buyer", "seller"] as const).flatMap(
                  (role) =>
                    transfer.documents
                      .filter((document) => document.owner === role)
                      .map((document) => {
                        const reviewStatus =
                          document.rtoReview?.status ?? "pending";

                        return (
                          <tr
                            key={document.id}
                            className="border-b border-[#eee8e1] align-top"
                          >
                            <td className="py-4 pr-5">
                              <p className="text-sm font-semibold text-[#24201d]">
                                {document.label}
                              </p>

                              <p className="mt-1 text-[11px] leading-5 text-[#8a7d72]">
                                {document.fileName ??
                                  "No file submitted"}
                              </p>

                              {document.rtoReview?.message ? (
                                <p className="mt-2 max-w-xs border-l-2 border-[#d49a45] bg-[#fbf3e3] px-2.5 py-2 text-[11px] leading-5 text-[#6b635d]">
                                  {document.rtoReview.message}
                                </p>
                              ) : null}
                            </td>

                            <td className="py-4 pr-5">
                              <span className="text-xs font-semibold text-[#24201d]">
                                {role === "buyer"
                                  ? "Buyer"
                                  : "Seller"}
                              </span>
                            </td>

                            <td className="py-4 pr-5">
                              {document.verification ? (
                                <span
                                  className={`text-xs font-semibold ${
                                    document.verification.status ===
                                    "verified"
                                      ? "text-[#5d7c60]"
                                      : document.verification.status ===
                                          "unable_to_verify"
                                        ? "text-[#8c6427]"
                                        : "text-[#9a4f4f]"
                                  }`}
                                >
                                  {document.verification.status ===
                                  "verified"
                                    ? "Passed"
                                    : document.verification.status ===
                                        "unable_to_verify"
                                      ? "Unable to verify"
                                      : "Needs attention"}
                                </span>
                              ) : (
                                <span className="text-xs text-[#8a7d72]">
                                  Not checked
                                </span>
                              )}
                            </td>

                            <td className="py-4 pr-5">
                              <span
                                className={`text-xs font-semibold ${
                                  reviewStatus === "approved"
                                    ? "text-[#5d7c60]"
                                    : reviewStatus === "rejected"
                                      ? "text-[#8c6427]"
                                      : "text-[#8a7d72]"
                                }`}
                              >
                                {reviewStatus === "approved"
                                  ? "Approved"
                                  : reviewStatus === "rejected"
                                    ? "Correction required"
                                    : "Pending review"}
                              </span>
                            </td>

                            <td className="py-4 text-right">
                              {canReviewDocuments &&
                              document.fileName ? (
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      reviewDocument(
                                        document.id,
                                        "approved",
                                      )
                                    }
                                    disabled={
                                      reviewStatus === "approved"
                                    }
                                    className="inline-flex min-h-9 items-center gap-1.5 border border-[#5d7c60] bg-[#f4f8f4] px-2.5 py-1.5 text-[11px] font-semibold text-[#5d7c60] transition hover:bg-[#eaf2eb] disabled:cursor-not-allowed disabled:border-[#e5ddd5] disabled:bg-[#f8f3ee] disabled:text-[#9b9188]"
                                  >
                                    <CheckCircle2
                                      aria-hidden="true"
                                      className="h-3.5 w-3.5"
                                    />
                                    Approve
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDocumentId(
                                        document.id,
                                      );
                                      setReasonCode(
                                        "DOCUMENT_MISMATCH",
                                      );

                                      requestAnimationFrame(() => {
                                        window.document
                                          .getElementById(
                                            "rto-correction-panel",
                                          )
                                          ?.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                          });
                                      });
                                    }}
                                    disabled={
                                      reviewStatus === "rejected"
                                    }
                                    className="inline-flex min-h-9 items-center gap-1.5 border border-[#d49a45] bg-[#fbf3e3] px-2.5 py-1.5 text-[11px] font-semibold text-[#8c6427] transition hover:bg-[#f7ecd7] disabled:cursor-not-allowed disabled:border-[#e5ddd5] disabled:bg-[#f8f3ee] disabled:text-[#9b9188]"
                                  >
                                    <CircleAlert
                                      aria-hidden="true"
                                      className="h-3.5 w-3.5"
                                    />
                                    Correction
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-[#9b9188]">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      }),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* OFFICER DECISION                                         */}
      {/* ======================================================= */}

      <section
        id="rto-correction-panel"
        className="mt-5 border-t border-[#d9d0c7] pt-5"
      >
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          {canApproveApplication ? (
            <div className="bg-[#f4f8f4] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5d7c60]">
                Final decision
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Approve application
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-[#6b635d]">
                All submitted documents must have an approved RTO review
                decision before the application can be approved.
              </p>

              <button
                type="button"
                onClick={approveTransfer}
                disabled={
                  !transfer.documents
                    .filter((document) => document.fileName)
                    .every(
                      (document) =>
                        document.rtoReview?.status ===
                        "approved",
                    )
                }
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
              >
                Approve transfer
                <CheckCircle2
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              </button>
            </div>
          ) : (
            <div className="bg-[#f8f3ee] px-5 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
                Officer review
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Review in progress
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-[#6b635d]">
                Review the remaining documents above. A correction can be
                sent to the responsible party without restarting the
                application.
              </p>
            </div>
          )}

          <div className="bg-[#fffdf9]">
            <div className="border-b border-[#d9d0c7] px-5 py-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8c6427]">
                Correction workflow
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Request a correction
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                Return a specific document with a structured reason and a
                clear instruction for the citizen.
              </p>
            </div>

            <div className="px-5 py-5">
              <label className="block text-xs font-semibold text-[#24201d]">
                Document requiring correction

                <select
                  value={selectedDocumentId}
                  onChange={(event) =>
                    setSelectedDocumentId(event.target.value)
                  }
                  className="mt-2 min-h-10 w-full border border-[#d9d0c7] bg-[#f8f3ee] px-3 text-xs text-[#24201d] outline-none focus:border-[#24201d]"
                >
                  {transfer.documents.map((document) => (
                    <option
                      key={document.id}
                      value={document.id}
                    >
                      {document.label} — {document.owner}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block text-xs font-semibold text-[#24201d]">
                Reason

                <select
                  value={reasonCode}
                  onChange={(event) =>
                    handleReasonChange(
                      event.target.value as RejectionReasonCode,
                    )
                  }
                  className="mt-2 min-h-10 w-full border border-[#d9d0c7] bg-[#f8f3ee] px-3 text-xs text-[#24201d] outline-none focus:border-[#24201d]"
                >
                  {rejectionReasons.map((reason) => (
                    <option
                      key={reason.code}
                      value={reason.code}
                    >
                      {reason.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="mt-4 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-3 py-3">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8c6427]">
                  Citizen instruction
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                  {
                    rejectionReasons.find(
                      (reason) => reason.code === reasonCode,
                    )?.defaultMessage
                  }
                </p>
              </div>

              <button
                type="button"
                disabled={!selectedDocument}
                onClick={() => {
                  if (!selectedDocument) {
                    return;
                  }

                  reviewDocument(
                    selectedDocument.id,
                    "rejected",
                    reasonCode,
                  );
                }}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 border border-[#d49a45] bg-[#d49a45] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#bf8738] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
              >
                Request correction
                <CircleAlert
                  aria-hidden="true"
                  className="h-3.5 w-3.5"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* FOOTER                                                    */}
      {/* ======================================================= */}

      <div className="mt-5 flex items-center gap-2 border-t border-[#d9d0c7] py-4 text-[10px] leading-5 text-[#8a7d72]">
        <Landmark
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0"
        />
        <span>
          TransferShield prototype · Officer actions are simulated for demo
          purposes.
        </span>
      </div>
    </div>
  </main>
);}