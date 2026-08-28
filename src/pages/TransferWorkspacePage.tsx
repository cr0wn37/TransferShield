import { Landmark, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { ActionRequiredCard } from "../components/transfer/ActionRequiredCard";
import { DocumentChecklist } from "../components/transfer/DocumentChecklist";
import { PartyColumn } from "../components/transfer/PartyColumn";
import { ProgressTracker } from "../components/transfer/ProgressTracker";
import { useTransferStore } from "../state/transferStore";
import type { TransferTask } from "../types/transfer";
import { AuditTimeline } from "../components/transfer/AuditTimeline";
import { CompletionRecord } from "../components/transfer/CompletionRecord";
import { InviteBuyerDialog } from "../components/transfer/InviteBuyerDialog";
import { TransferDetailsDialog } from "../components/transfer/TransferDetailsDialog";
import { MockPaymentDialog } from "../components/transfer/MockPaymentDialog";
import { FinalReviewDialog } from "../components/transfer/FinalReviewDialog";

export function TransferWorkspacePage() {
  const transfer = useTransferStore((state) => state.transfer);
  const inviteBuyer = useTransferStore((state) => state.inviteBuyer);
  const joinTransfer = useTransferStore((state) => state.joinTransfer);
  
  const updatePartyDetails = useTransferStore(
    (state) => state.updatePartyDetails,
  );
  const completePayment = useTransferStore((state) => state.completePayment);
  const uploadDocument = useTransferStore((state) => state.uploadDocument);
  const sendBuyerOtp = useTransferStore((state) => state.sendBuyerOtp);
  const completeBuyerESign = useTransferStore(
    (state) => state.completeBuyerESign,
  );
  const sendSellerOtp = useTransferStore((state) => state.sendSellerOtp);
  const completeSellerESign = useTransferStore(
    (state) => state.completeSellerESign,
  );
  const submitToRto = useTransferStore((state) => state.submitToRto);
  const resubmitToRto = useTransferStore((state) => state.resubmitToRto);

  const [finalReviewRole, setFinalReviewRole] = useState<
  "seller" | "buyer"
>("seller");

const [isFinalReviewDialogOpen, setIsFinalReviewDialogOpen] =
  useState(false);



  const [detailsDialogRole, setDetailsDialogRole] = useState<
  "seller" | "buyer"
>("seller");

  const [demoRole, setDemoRole] = useState<"seller" | "buyer" | "rto">("seller");

  const isCorrectionMode = transfer.status === "ACTION_REQUIRED";
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const confirmPartyDetails = useTransferStore(
  (state) => state.confirmPartyDetails,
);

  const correctionDocument =
  transfer.documents.find(
    (document) => document.id === transfer.rto.requestedDocumentId,
  ) ??
  transfer.documents.find(
    (document) =>
      document.status === "invalid" || document.status === "needs_reupload",
  ) ??
  transfer.documents.find((document) =>
    transfer.rto.requiredAction?.includes(document.label),
  );

  const activeESignStage =
    transfer.status === "BUYER_ESIGN_PENDING"
      ? "BUYER_ESIGN_PENDING"
      : transfer.status === "SELLER_ESIGN_PENDING"
        ? "SELLER_ESIGN_PENDING"
        : correctionDocument?.requiredAt;

  const activeDocuments = activeESignStage
    ? transfer.documents.filter(
        (document) =>
          document.requiredAt === activeESignStage ||
          document.alsoRequiredAt === activeESignStage,
      )
    : [];

  const areActiveDocumentsValid =
    activeDocuments.length > 0 &&
    activeDocuments.every((document) => document.status === "valid");

  const isBuyerESign = activeESignStage === "BUYER_ESIGN_PENDING";
  const eSignStatus = isBuyerESign ? transfer.eSign.buyer : transfer.eSign.seller;

  const scrollToESign = () => {
    document.getElementById("esign-package")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleTaskAction = (task: TransferTask) => {
    if (
      transfer.status === "ACTION_REQUIRED" &&
      transfer.rto.requestedDocumentId
    ) {
      scrollToESign();
      return;
    }

    switch (task.id) {
      case "invite-buyer":
        setIsInviteDialogOpen(true);
        break;
      case "buyer-join":
        joinTransfer();
        break;
      case "seller-confirm-details":
        setDetailsDialogRole("seller");
        setIsDetailsDialogOpen(true);
        break;
      case "buyer-confirm-details":
        setDetailsDialogRole("buyer");
        setIsDetailsDialogOpen(true);
        break;
      case "buyer-payment":
      setIsPaymentDialogOpen(true);
      break;
      case "buyer-esign":
      case "seller-esign":
        scrollToESign();
        break;
      case "buyer-final-review":
  setFinalReviewRole("buyer");
  setIsFinalReviewDialogOpen(true);
  break;
case "seller-final-review":
  setFinalReviewRole("seller");
  setIsFinalReviewDialogOpen(true);
  break;
      default:
        break;
    }
  };

  const handlePrimaryAction = () => {
    switch (transfer.status) {
      case "INITIATED":
        setIsInviteDialogOpen(true);
        break;
      case "BUYER_INVITED":
        joinTransfer();
        break;
      case "BUYER_JOINED":
        setDetailsDialogRole("seller");
        setIsDetailsDialogOpen(true);
        break;
      case "PAYMENT_PENDING":
        setIsPaymentDialogOpen(true);
        break;
      case "BUYER_ESIGN_PENDING":
      case "SELLER_ESIGN_PENDING":
      case "ACTION_REQUIRED":
        scrollToESign();
        break;
      case "READY_FOR_RTO":
        submitToRto();
        break;
      default:
        break;
    }
  };

  const handleESignAction = () => {
  if (!activeESignStage || !areActiveDocumentsValid) {
    return;
  }

  if (isCorrectionMode) {
    resubmitToRto();
    return;
  }

  if (isBuyerESign) {
    if (eSignStatus === "not_started") {
      sendBuyerOtp();
    } else if (eSignStatus === "otp_sent") {
      completeBuyerESign();
    }

    return;
  }

  if (eSignStatus === "not_started") {
    sendSellerOtp();
  } else if (eSignStatus === "otp_sent") {
    completeSellerESign();
  }
};

const confirmFinalReview = useTransferStore(
  (state) => state.confirmFinalReview,
);

  const eSignButtonLabel = isCorrectionMode
  ? "Resubmit to RTO"
  : eSignStatus === "otp_sent"
    ? "Verify mock OTP and submit"
    : "Send mock Aadhaar OTP";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              TransferShield
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Vehicle ownership transfer
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Application ID:{" "}
              <span className="font-semibold text-slate-900">{transfer.id}</span>
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:items-end">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
              <p className="font-medium text-slate-500">Vehicle</p>
              <p className="mt-1 font-semibold text-slate-900">
                {transfer.vehicle.registrationNumber}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to="/demo"
                className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
              >
                Demo scenarios
              </Link>

              <Link
                to="/rto"
                className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-white"
              >
                RTO view
              </Link>
            </div>
          </div>
        </header>

        <div className="space-y-6">
          <ProgressTracker status={transfer.status} />

          <ActionRequiredCard
            transfer={transfer}
            onAction={handlePrimaryAction}
          />

          {activeESignStage ? (
            <section
              id="esign-package"
              className="scroll-mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-4 sm:p-6"
            >
              <DocumentChecklist
                documents={transfer.documents}
                stage={activeESignStage}
                onUpload={(documentId, fileName) =>
                  uploadDocument(documentId, fileName)
                }
                isCompleted={
                  activeESignStage === "BUYER_ESIGN_PENDING"
                    ? transfer.eSign.buyer === "completed"
                    : transfer.eSign.seller === "completed"
                }
              />

              {!(
                (isBuyerESign && transfer.eSign.buyer === "completed") ||
                (!isBuyerESign && transfer.eSign.seller === "completed")
              ) ? (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-blue-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {isBuyerESign ? "Buyer" : "Seller"} mock Aadhaar e-sign
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {!areActiveDocumentsValid
                        ? "Upload and validate every required document before continuing."
                        : isCorrectionMode
                          ? "The requested correction is ready. Resubmit it for RTO review."
                          : eSignStatus === "otp_sent"
                            ? "Mock OTP sent. Complete e-sign to submit this package."
                            : "Your documents are ready for mock OTP verification."}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!areActiveDocumentsValid}
                    onClick={handleESignAction}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    <ShieldCheck aria-hidden="true" className="h-4 w-4" />
                    {eSignButtonLabel}
                  </button>
                </div>
              ) : null}
            </section>
          ) : null}

          <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div>
              <p className="text-sm font-semibold text-slate-900">Demo Mode</p>
              <p className="text-xs text-slate-500">
                Switch roles while using the same transfer
              </p>
            </div>

            <div className="flex rounded-lg bg-slate-100 p-1">
              {(["seller", "buyer", "rto"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setDemoRole(role)}
                  className={`rounded-md px-3 py-2 text-xs font-semibold capitalize transition ${
                    demoRole === role
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <p className="text-sm font-semibold text-blue-900">
              Acting as: {demoRole === "rto" ? "RTO Officer" : demoRole}
            </p>
            <p className="mt-1 text-xs text-blue-700">
              All actions update the same shared transfer state.
            </p>
          </div>

          <section className="grid gap-6 lg:grid-cols-2">
            <PartyColumn
              transfer={transfer}
              role="seller"
              onTaskAction={handleTaskAction}
              activeDemoRole={demoRole}
            />
            <PartyColumn
              transfer={transfer}
              role="buyer"
              onTaskAction={handleTaskAction}
              activeDemoRole={demoRole}
            />
          </section>

          <AuditTimeline events={transfer.timeline} />

          {transfer.status === "READY_FOR_RTO" ? (
            <section className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                  <Landmark
                    aria-hidden="true"
                    className="mt-0.5 h-6 w-6 shrink-0 text-indigo-700"
                  />
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Ready for RTO review
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Both parties have completed their documents and e-signs.
                      Submit the application for RTO review.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={submitToRto}
                  className="min-h-11 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
                >
                  Submit to RTO
                </button>
              </div>
            </section>
          ) : null}

          {transfer.status === "RTO_PROCESSING" ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <Landmark
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-indigo-700"
                  />
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      RTO review in progress
                    </h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Your application is with the RTO. TransferShield will clearly
                      show the next step if any correction is needed.
                    </p>
                  </div>
                </div>

                <Link
                  to="/rto"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-800"
                >
                  Open RTO officer view
                </Link>
              </div>
            </section>
          ) : null}

          {transfer.status === "TRANSFER_COMPLETED" ? (
            <CompletionRecord transfer={transfer} />
          ) : null}
        </div>
      </div>
      {isInviteDialogOpen ? (
        <InviteBuyerDialog
          buyerName={transfer.buyer.name}
          invite={transfer.invite}
          onClose={() => setIsInviteDialogOpen(false)}
          onSendInvite={() => {
            inviteBuyer();
            setIsInviteDialogOpen(false);
          }}
        />
      ) : null}
      {isDetailsDialogOpen ? (
  <TransferDetailsDialog
    role={detailsDialogRole}
    party={
      detailsDialogRole === "seller"
        ? transfer.seller
        : transfer.buyer
    }
    otherPartyConfirmed={
      detailsDialogRole === "seller"
        ? Boolean(transfer.buyer.detailsConfirmedAt)
        : Boolean(transfer.seller.detailsConfirmedAt)
    }
    onClose={() => setIsDetailsDialogOpen(false)}
    onConfirm={(details) => {
      updatePartyDetails(detailsDialogRole, details);
      confirmPartyDetails(detailsDialogRole);
      setIsDetailsDialogOpen(false);
    }}
  />
) : null}
      {isPaymentDialogOpen ? (
        <MockPaymentDialog
          amount={transfer.payment.amount}
          vehicleRegistrationNumber={transfer.vehicle.registrationNumber}
          onClose={() => setIsPaymentDialogOpen(false)}
          onPaymentComplete={() => {
            completePayment();
            setIsPaymentDialogOpen(false);
          }}
        />
      ) : null}
    {isFinalReviewDialogOpen ? (
      <FinalReviewDialog
        role={finalReviewRole}
        transfer={transfer}
        onClose={() => setIsFinalReviewDialogOpen(false)}
        onConfirm={(role) => {
          confirmFinalReview(role);
          setIsFinalReviewDialogOpen(false);
        }}
        onReplaceDocument={(documentId, fileName) => {
          uploadDocument(documentId, fileName);
        }}
      />
    ) : null}
    </main>
  );
}