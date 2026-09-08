import { Landmark, ShieldCheck ,CheckCircle2, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { ActionRequiredCard } from "../components/transfer/ActionRequiredCard";
import { DocumentChecklist } from "../components/transfer/DocumentChecklist";
import { PartyColumn } from "../components/transfer/PartyColumn";
import { ProgressTracker } from "../components/transfer/ProgressTracker";
import { useTransferStore } from "../state/transferStore";
import type { TransferTask } from "../types/transfer";
import { CompletionRecord } from "../components/transfer/CompletionRecord";
import { InviteBuyerDialog } from "../components/transfer/InviteBuyerDialog";
import { TransferDetailsDialog } from "../components/transfer/TransferDetailsDialog";
import { MockPaymentDialog } from "../components/transfer/MockPaymentDialog";
import { FinalReviewDialog } from "../components/transfer/FinalReviewDialog";
import { getActionRequired } from "../utils/workflow";
import { TransferDeadline } from "../components/transfer/TransferDeadline";
import { DigitalHandoverCard } from '../components/transfer/DigitalHandoverCard';
import { LiveSyncCard } from "../components/transfer/LiveSyncCard";
import { SlaClockCard } from "../components/transfer/SlaClockCard";
import { SlaActionAlert } from "../components/transfer/SlaActionAlert";
import { useLanguage } from "../context/LanguageContext";
import { PhysicalRtoDocket } from "../components/PhysicalRtoDocket";


import AIDocumentPreflight from "../components/transfer/AIDocumentPreflight";

export function TransferWorkspacePage() {
  const transfer = useTransferStore((state) => state.transfer);
  const inviteBuyer = useTransferStore((state) => state.inviteBuyer);
  const joinTransfer = useTransferStore((state) => state.joinTransfer);

  const { t } = useLanguage();
  
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
  const completeDigitalHandover = useTransferStore(
  (state) => state.completeDigitalHandover,
);

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

const openCorrections =
  transfer.rto.corrections?.filter(
    (correction) =>
      correction.status === "open",
  ) ?? [];

const hasOpenCorrections =
  openCorrections.length > 0;

const correctionsResolved =
  transfer.status === "ACTION_REQUIRED" &&
  openCorrections.length === 0;


  console.log(
  "RTO CORRECTIONS:",
  transfer.rto.corrections,
  "RESOLVED:",
  correctionsResolved,
);


  const liveSync = useTransferStore((state) => state.liveSync);

  const livePresence = useTransferStore(
  (state) => state.livePresence
);

  const activeWorkspaceRole =
  liveSync.enabled && liveSync.role
    ? liveSync.role
    : demoRole;

  const correctionDocuments =
  transfer.documents.filter(
    (document) =>
      document.status === "needs_reupload" &&
      transfer.rto.corrections?.some(
        (correction) =>
          correction.status === "open" &&
          correction.documentId === document.id &&
          correction.responsibleParty ===
            activeWorkspaceRole,
      ),
  );

const correctionDocument =
  correctionDocuments[0];

const hasSellerCorrection =
  transfer.rto.corrections?.some(
    (correction) =>
      correction.status === "open" &&
      correction.responsibleParty === "seller",
  ) ?? false;

const hasBuyerCorrection =
  transfer.rto.corrections?.some(
    (correction) =>
      correction.status === "open" &&
      correction.responsibleParty === "buyer",
  ) ?? false;

const isSellerCorrection =
  activeWorkspaceRole === "seller" &&
  hasSellerCorrection;

const isBuyerCorrection =
  activeWorkspaceRole === "buyer" &&
  hasBuyerCorrection;

  const activeESignStage =
  transfer.status === "BUYER_ESIGN_PENDING"
    ? "BUYER_ESIGN_PENDING"
    : transfer.status === "SELLER_ESIGN_PENDING"
      ? "SELLER_ESIGN_PENDING"
      : transfer.status === "ACTION_REQUIRED"
        ? isBuyerCorrection
          ? "BUYER_ESIGN_PENDING"
          : isSellerCorrection
            ? "SELLER_ESIGN_PENDING"
            : null
        : null;

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

  const [documentFiles, setDocumentFiles] = useState<
  Record<string, File>
>({});

  const handleTaskAction = (task: TransferTask) => {

    if (
      liveSync.enabled &&
      liveSync.role &&
      task.owner !== "shared" &&
      task.owner !== liveSync.role
    ) {
      return;
    }
    if (transfer.status === "ACTION_REQUIRED") {
  const hasOpenCorrectionForTask =
    transfer.rto.corrections?.some(
      (correction) => {
        if (
          correction.status !== "open" ||
          correction.responsibleParty !== task.owner
        ) {
          return false;
        }

        const document =
          transfer.documents.find(
            (item) =>
              item.id === correction.documentId,
          );

        return (
          document?.owner === task.owner
        );
      },
    ) ?? false;

  if (hasOpenCorrectionForTask) {
    scrollToESign();
    return;
  }
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
      case "BUYER_JOINED": {
        const buyerDetailsConfirmed = transfer.buyer.detailsConfirmedAt;
        const sellerDetailsConfirmed = transfer.seller.detailsConfirmedAt;

        if (!buyerDetailsConfirmed) {
          setDetailsDialogRole("buyer");
        } else if (!sellerDetailsConfirmed) {
          setDetailsDialogRole("seller");
        }

        setIsDetailsDialogOpen(true);
        break;
      }
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
  if (isCorrectionMode) {
    const allDocumentsValid = transfer.documents.every(
      (document) => document.status === "valid",
    );

    if (allDocumentsValid) {
      resubmitToRto();
    }

    return;
  }

  if (!activeESignStage || !areActiveDocumentsValid) {
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

const sellerName = 
  (transfer as any).parties?.seller?.name || 
  (transfer as any).seller?.name || 
  "Arjun Mehta";

const buyerName = 
  (transfer as any).parties?.buyer?.name || 
  (transfer as any).buyer?.name || 
  "Priya Sharma";

// Resolve Vehicle Number safely
const vehicleNumber = 
  (transfer as any).vehicle?.registrationNumber || 
  (transfer as any).registrationNumber || 
  "MH 01 AB 4821";

// Checks for payment completion across casing and post-payment stages
const isPaymentCompleted = Boolean(
  (transfer as any).payment?.status?.toLowerCase() === "completed" ||
  (transfer as any).payment?.status?.toLowerCase() === "paid" ||
  (transfer as any).isPaymentDone ||
  transfer.status === "BUYER_ESIGN_PENDING" ||
  transfer.status === "SELLER_ESIGN_PENDING" ||
  transfer.status === "ACTION_REQUIRED" ||
  transfer.timeline?.some(
    (event) =>
      event.title.toLowerCase().includes("payment") ||
      event.title.toLowerCase().includes("fee")
  )
);

// Unlocks handover card when payment is done or explicitly ready/active
const isHandoverUnlocked =
  transfer.handover?.status === "ready" ||
  transfer.handover?.status === "active" ||
  isPaymentCompleted;
  
const confirmFinalReview = useTransferStore(
  (state) => state.confirmFinalReview,
);

  const eSignButtonLabel = isCorrectionMode
  ? "Resubmit to RTO"
  : eSignStatus === "otp_sent"
    ? "Verify mock OTP and submit"
    : "Send mock Aadhaar OTP";

    const currentAction =
  transfer.status === "TRANSFER_COMPLETED"
    ? {
        title: "Transfer completed",
        description: "RTO approved the ownership transfer.",
        actionLabel: "View transfer receipt",
      }
    : getActionRequired(transfer);

    const canActOnDocument = (documentOwner: "seller" | "buyer") =>
  !liveSync.enabled || liveSync.role === documentOwner;

  return (
  <main className="min-h-screen bg-[#f8f1e8] px-4 py-5 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-[1600px]">

      {/* ========================================================= */}
      {/* HEADER                                                    */}
      {/* ========================================================= */}
      <header className="border-b border-[#d9d0c7] pb-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          {/* Transfer identity */}
          <div className="min-w-0">
            <p className="text-lg font-bold tracking-[-0.04em] text-[#24201d]">
              TransferShield
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-[#24201d] sm:text-3xl">
                Vehicle ownership transfer
              </h1>

              <span className="hidden h-5 w-px bg-[#d9d0c7] sm:block" />

              <span className="text-sm font-medium text-[#7b7169]">
                {transfer.vehicle.registrationNumber}
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#8a7d72]">
              <span>
                Application ID{" "}
                <span className="font-semibold text-[#24201d]">
                  {transfer.id}
                </span>
              </span>

              {currentAction ? (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#b5aaa0]" />
                  <span className="font-semibold text-[#b56f52]">
                    {currentAction.title}
                  </span>
                </>
              ) : null}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-1.5">
            <a
              href="#shared-workspace"
              className="inline-flex min-h-9 items-center border border-[#24201d] bg-[#24201d] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
            >
              Workspace
            </a>

            <a
              href="#handover"
              className="inline-flex min-h-9 items-center border border-[#d9d0c7] bg-transparent px-3.5 py-2 text-xs font-semibold text-[#6b635d] transition hover:border-[#24201d] hover:text-[#24201d]"
            >
              Handover
            </a>

            <Link
                to={`/transfer/${transfer.id}/sla`}
                className="inline-flex min-h-9 items-center border border-[#d9d0c7] bg-[#f8f3ee] px-3.5 py-2 text-xs font-semibold text-[#24201d] transition hover:border-[#24201d] hover:bg-[#fffdf9]"
              >
                SLA
              </Link>

            <Link
              to={`/transfer/${transfer.id}/timeline`}
              className="inline-flex min-h-9 items-center border border-[#d9d0c7] bg-[#f8f3ee] px-3.5 py-2 text-xs font-semibold text-[#24201d] transition hover:border-[#24201d] hover:bg-[#fffdf9]"
            >
              Timeline
            </Link>

            <a
              href="#rto-section"
              className="inline-flex min-h-9 items-center border border-[#d9d0c7] bg-transparent px-3.5 py-2 text-xs font-semibold text-[#6b635d] transition hover:border-[#24201d] hover:text-[#24201d]"
            >
              RTO
            </a>

            <Link
              to="/rto"
              className="inline-flex min-h-9 items-center border border-[#d9d0c7] bg-transparent px-3.5 py-2 text-xs font-semibold text-[#6b635d] transition hover:border-[#24201d] hover:text-[#24201d]"
            >
              Officer view
            </Link>

            <Link
              to="/demo"
              className="inline-flex min-h-9 items-center border border-[#d9d0c7] bg-transparent px-3.5 py-2 text-xs font-semibold text-[#6b635d] transition hover:border-[#24201d] hover:text-[#24201d]"
            >
              Demo
            </Link>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
{/* TOP TRANSFER SUMMARY                                     */}
{/* ========================================================= */}
<section className="mt-5 grid gap-4 lg:grid-cols-[1fr_3fr_1fr]">

  {/* ======================================================= */}
  {/* CURRENT ACTION — 20%                                   */}
  {/* ======================================================= */}
  <section className="border border-[#d9d0c7] bg-[#fffdf9]">
  <div className="border-b border-[#e5ddd5] px-5 py-4">
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
      Current action
    </p>
  </div>

  <div className="px-5 py-5">
    <h2 className="text-lg font-bold leading-6 text-[#24201d]">
      {currentAction?.title ?? "Transfer in progress"}
    </h2>

    <p className="mt-2 text-sm leading-6 text-[#6b635d]">
      {currentAction?.description ??
        "Complete the current action to keep the transfer moving."}
    </p>

    {transfer.status === "TRANSFER_COMPLETED" ? (
      <button
        type="button"
        onClick={() =>
          document
            .getElementById("completion-record")
            ?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
        }
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
      >
        View transfer receipt
        <ArrowDown
          aria-hidden="true"
          className="h-4 w-4"
        />
      </button>
    ) : (
      <div className="mt-4 border-t border-[#e5ddd5] pt-4">
        <ActionRequiredCard
          transfer={transfer}
          onAction={handlePrimaryAction}
        />
      </div>
    )}
  </div>
</section>

  {/* ======================================================= */}
  {/* PROGRESS — 60%                                         */}
  {/* ======================================================= */}
  <section className="border border-[#d9d0c7] bg-[#fffdf9]">
    <div className="border-b border-[#e5ddd5] px-5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
        Transfer progress
      </p>
    </div>

    <div className="px-5 py-5">
      <ProgressTracker status={transfer.status} />
    </div>
  </section>

  {/* ======================================================= */}
  {/* CASE OVERVIEW — 20%                                    */}
  {/* ======================================================= */}
  <section className="border border-[#d9d0c7] bg-[#fffdf9]">
    <div className="border-b border-[#e5ddd5] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
        Transfer
      </p>

      <h2 className="mt-1 text-base font-bold tracking-tight text-[#24201d]">
        Case overview
      </h2>
    </div>

    <div className="divide-y divide-[#e5ddd5]">

      <div className="px-4 py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          Vehicle
        </p>

        <p className="mt-1 text-xs font-bold text-[#24201d]">
          {transfer.vehicle.registrationNumber}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-[#e5ddd5]">
        <div className="px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Seller
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-[#24201d]">
            {sellerName}
          </p>
        </div>

        <div className="px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Buyer
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-[#24201d]">
            {buyerName}
          </p>
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          RTO
        </p>

        <p className="mt-1 text-xs font-semibold text-[#24201d]">
          RTO review
        </p>
      </div>

    </div>
  </section>

</section>

      {/* ========================================================= */}
      {/* SHARED WORKSPACE                                         */}
      {/* ========================================================= */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[3fr_1fr]">

        <section
  id="shared-workspace"
  className="min-w-0 scroll-mt-6 border border-[#d9d0c7] bg-[#fffdf9]"
>

        {/* Workspace heading */}
        <div className="border-b border-[#e5ddd5] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                Shared workspace
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#24201d]">
                Seller + buyer
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-[#6b635d]">
                Both parties work on the same transfer, with each action
                unlocking the next stage.
              </p>
            </div>

            <div className="shrink-0 text-xs text-[#8a7d72]">
              Application{" "}
              <span className="font-semibold text-[#24201d]">
                {transfer.id}
              </span>
            </div>
          </div>
        </div>

        {/* Current view / role */}
        <div className="flex flex-col gap-3 border-b border-[#e5ddd5] px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold text-[#24201d]">
              Viewing as{" "}
              <span className="text-[#b56f52]">
                {activeWorkspaceRole === "rto"
                  ? "RTO Officer"
                  : activeWorkspaceRole === "seller"
                    ? "Seller"
                    : "Buyer"}
              </span>
            </p>

            <p className="mt-0.5 text-[11px] text-[#8a7d72]">
              Actions are shared across the transfer.
            </p>
          </div>

          {!liveSync.enabled ? (
            <div className="flex gap-1">
              {(["seller", "buyer", "rto"] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setDemoRole(role)}
                  className={[
                    "border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition",
                    activeWorkspaceRole === role
                      ? "border-[#24201d] bg-[#24201d] text-white"
                      : "border-[#d9d0c7] bg-transparent text-[#6b635d] hover:border-[#24201d] hover:text-[#24201d]",
                  ].join(" ")}
                >
                  {role}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Live Sync */}
        {liveSync.enabled ? (
          <div className="border-b border-[#e5ddd5] bg-[#f8f3ee] px-5 py-3 sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Live Sync
                </p>

                <p className="mt-1 text-xs text-[#6b635d]">
                  Both parties are viewing the same transaction.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      livePresence.seller
                        ? "bg-[#6f8a72]"
                        : "bg-[#cfc6bd]",
                    ].join(" ")}
                  />

                  <span className="text-xs font-semibold text-[#24201d]">
                    Seller
                  </span>

                  <span className="text-[11px] text-[#8a7d72]">
                    {livePresence.seller ? "Connected" : "Waiting"}
                  </span>
                </div>

                <span className="h-4 w-px bg-[#d9d0c7]" />

                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      livePresence.buyer
                        ? "bg-[#6f8a72]"
                        : "bg-[#cfc6bd]",
                    ].join(" ")}
                  />

                  <span className="text-xs font-semibold text-[#24201d]">
                    Buyer
                  </span>

                  <span className="text-[11px] text-[#8a7d72]">
                    {livePresence.buyer ? "Connected" : "Waiting"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <LiveSyncCard transfer={transfer} />

        {/* Seller / Buyer workspace */}
        <div className="p-4 sm:p-5">
          <section className="grid gap-5 xl:grid-cols-2">

            {/* Seller */}
            <div className="min-w-0">
              <div className="mb-3 border-b border-[#e5ddd5] pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
                  Seller
                </p>

                <p className="mt-0.5 text-sm font-bold text-[#24201d]">
                  {sellerName}
                </p>
              </div>

              <PartyColumn
                transfer={transfer}
                role="seller"
                onTaskAction={handleTaskAction}
                activeDemoRole={activeWorkspaceRole}
              />
            </div>

            {/* Buyer */}
            <div className="min-w-0">
              <div className="mb-3 border-b border-[#e5ddd5] pb-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
                  Buyer
                </p>

                <p className="mt-0.5 text-sm font-bold text-[#24201d]">
                  {buyerName}
                </p>
              </div>

              <PartyColumn
                transfer={transfer}
                role="buyer"
                onTaskAction={handleTaskAction}
                activeDemoRole={activeWorkspaceRole}
              />
            </div>

          </section>
        </div>

      </section>
      <aside className="min-w-0 space-y-4">

  {/* Digital handover */}
  <section
    id="handover"
    className="scroll-mt-6 border border-[#d9d0c7] bg-[#fffdf9]"
  >
    <div className="border-b border-[#e5ddd5] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
        Handover
      </p>

      <h2 className="mt-1 text-base font-bold tracking-tight text-[#24201d]">
        Digital handover
      </h2>
    </div>

    <div className="p-3">
      <DigitalHandoverCard
        handoverState={transfer.handover}
        onComplete={completeDigitalHandover}
        sellerName={sellerName}
        buyerName={buyerName}
        vehicleNumber={vehicleNumber}
        isUnlocked={isHandoverUnlocked}
      />
    </div>
  </section>

  {/* Statutory deadline */}
  <section className="border border-[#d9d0c7] bg-[#fffdf9]">
    <div className="border-b border-[#e5ddd5] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
        Deadline
      </p>

      <h2 className="mt-1 text-base font-bold tracking-tight text-[#24201d]">
        Statutory transfer deadline
      </h2>
    </div>

    <div className="p-4">
      <TransferDeadline transfer={transfer} />
    </div>
  </section>

</aside>
</div>

      {/* ========================================================= */}
      {/* CORRECTIONS COMPLETE                                      */}
      {/* ========================================================= */}
      {correctionsResolved ? (
        <section className="mt-5 border border-[#b8cdbb] bg-[#eef5ef] px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-[#6f8a72]"
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#56715a]">
                  Corrections complete
                </p>

                <p className="mt-1 text-sm leading-5 text-[#4f5d52]">
                  All documents requested by the RTO have been updated.
                  The application is ready to be resubmitted.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resubmitToRto}
              disabled={
                !transfer.documents.every(
                  (document) => document.status === "valid",
                )
              }
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
            >
              <ShieldCheck
                aria-hidden="true"
                className="h-4 w-4"
              />
              Resubmit to RTO
            </button>

          </div>
        </section>
      ) : null}

      {/* ========================================================= */}
      {/* E-SIGN / CORRECTION PACKAGE                               */}
      {/* ========================================================= */}
      {activeESignStage ? (
        <section
          id="esign-package"
          className="mt-5 scroll-mt-6 border border-[#d9d0c7] bg-[#fffdf9]"
        >
          <div className="border-b border-[#e5ddd5] bg-[#f8f3ee] px-5 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Current package
            </p>

            <h2 className="mt-1 text-lg font-bold text-[#24201d]">
              {isBuyerESign ? "Buyer" : "Seller"} documents & e-sign
            </h2>
          </div>

          <div className="p-5">

            {correctionsResolved ? (
              <section className="border border-[#b8cdbb] bg-[#eef5ef] p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#6f8a72]"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#56715a]">
                      Corrections complete
                    </p>

                    <h3 className="mt-1 text-base font-semibold text-[#24201d]">
                      Application is ready to resubmit
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                      All documents requested by the RTO have been uploaded.
                      Your completed transfer information has been preserved.
                    </p>

                    <button
                      type="button"
                      disabled={
                        !transfer.documents.every(
                          (document) => document.status === "valid",
                        )
                      }
                      onClick={resubmitToRto}
                      className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
                    >
                      <ShieldCheck
                        aria-hidden="true"
                        className="h-4 w-4"
                      />
                      Resubmit to RTO
                    </button>
                  </div>
                </div>
              </section>
            ) : isCorrectionMode ? (
              <div>

                <div className="border-l-2 border-[#d49a45] bg-[#fbf3e3] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8c6427]">
                    RTO correction required
                  </p>

                  <h3 className="mt-1 text-base font-bold text-[#24201d]">
                    {correctionDocument?.label ?? "Document correction"}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                    {correctionDocument?.issueMessage ??
                      transfer.rto.message ??
                      "Please correct the requested document and resubmit the application."}
                  </p>
                </div>

                <div className="mt-4 border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Responsible party
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#24201d]">
                    {transfer.rto.responsibleParty === "buyer"
                      ? "Buyer"
                      : transfer.rto.responsibleParty === "seller"
                        ? "Seller"
                        : "Shared"}
                  </p>
                </div>

                <div className="mt-4">
                  <DocumentChecklist
                    documents={correctionDocuments}
                    stage={activeESignStage}
                    onUpload={(documentId, file) => {
                      setDocumentFiles((current) => ({
                        ...current,
                        [documentId]: file,
                      }));

                      uploadDocument(documentId, file.name);
                    }}
                    canAct={
                      !liveSync.enabled ||
                      transfer.rto.responsibleParty === liveSync.role
                    }
                    isCompleted={false}
                  />
                </div>

                <button
                  type="button"
                  disabled={
                    !transfer.documents.every(
                      (document) => document.status === "valid",
                    )
                  }
                  onClick={resubmitToRto}
                  className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
                >
                  <ShieldCheck
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                  Resubmit to RTO
                </button>

              </div>
            ) : (
              <div>

                <DocumentChecklist
                  documents={transfer.documents}
                  stage={activeESignStage}
                  onUpload={(documentId, file) => {
                    setDocumentFiles((current) => ({
                      ...current,
                      [documentId]: file,
                    }));

                    uploadDocument(documentId, file.name);
                  }}
                  canAct={
                    !liveSync.enabled ||
                    (activeESignStage === "BUYER_ESIGN_PENDING"
                      ? liveSync.role === "buyer"
                      : liveSync.role === "seller")
                  }
                  isCompleted={
                    activeESignStage === "BUYER_ESIGN_PENDING"
                      ? transfer.eSign.buyer === "completed"
                      : transfer.eSign.seller === "completed"
                  }
                />

                <div className="mt-4">
                  <AIDocumentPreflight
                    documents={transfer.documents.filter(
                      (document) =>
                        document.requiredAt === activeESignStage ||
                        document.alsoRequiredAt === activeESignStage,
                    )}
                    documentFiles={documentFiles}
                    vehicleNumber={
                      transfer.vehicle.registrationNumber
                    }
                    sellerName={transfer.seller.name}
                    buyerName={transfer.buyer.name}
                    chassisLast5={transfer.vehicle.chassisLast5}
                    canAct={
                      !liveSync.enabled ||
                      (activeESignStage === "BUYER_ESIGN_PENDING"
                        ? liveSync.role === "buyer"
                        : liveSync.role === "seller")
                    }
                    isCompleted={
                      activeESignStage === "BUYER_ESIGN_PENDING"
                        ? transfer.eSign.buyer === "completed"
                        : transfer.eSign.seller === "completed"
                    }
                  />
                </div>

                {!(
                  (isBuyerESign &&
                    transfer.eSign.buyer === "completed") ||
                  (!isBuyerESign &&
                    transfer.eSign.seller === "completed")
                ) ? (
                  <div className="mt-4 border-t border-[#e5ddd5] pt-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#24201d]">
                          {isBuyerESign ? "Buyer" : "Seller"} mock Aadhaar
                          e-sign
                        </p>

                        <p className="mt-1 max-w-lg text-xs leading-5 text-[#6b635d]">
                          {!areActiveDocumentsValid
                            ? "Upload and validate every required document before continuing."
                            : eSignStatus === "otp_sent"
                              ? "Mock OTP sent. Complete e-sign to submit this package."
                              : "Your documents are ready for mock OTP verification."}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={
                          !areActiveDocumentsValid ||
                          (liveSync.enabled &&
                            liveSync.role !==
                              (isBuyerESign ? "buyer" : "seller"))
                        }
                        onClick={handleESignAction}
                        className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
                      >
                        <ShieldCheck
                          aria-hidden="true"
                          className="h-4 w-4"
                        />
                        {eSignButtonLabel}
                      </button>
                    </div>
                  </div>
                ) : null}

              </div>
            )}

          </div>
        </section>
      ) : null}

     {/* ========================================================= */}
{/* RTO PREPARATION / COMPLETION                              */}
{/* ========================================================= */}

{/* RTO preparation — only before transfer completion */}
{transfer.status !== "TRANSFER_COMPLETED" ? (
  <div className="mt-5">
    <section className="border border-[#d9d0c7] bg-[#fffdf9]">
      <div className="border-b border-[#e5ddd5] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
          RTO preparation
        </p>
      </div>

      <div className="p-3">
        <PhysicalRtoDocket transfer={transfer} />
      </div>
    </section>
  </div>
) : null}


{/* ========================================================= */}
{/* RTO STATES                                                 */}
{/* ========================================================= */}
<section
  id="rto-section"
  className="mt-5 scroll-mt-6"
>
  {transfer.status === "READY_FOR_RTO" ? (
    <section className="border border-[#c9bfdc] bg-[#f4f0f7] px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Landmark
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-[#66547a]"
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#66547a]">
              RTO
            </p>

            <h2 className="mt-1 font-semibold text-[#24201d]">
              Ready for RTO review
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#6b635d]">
              Both parties have completed their documents and e-signs.
              Submit the application for RTO review.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={submitToRto}
          className="inline-flex min-h-11 shrink-0 items-center justify-center border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
        >
          Submit to RTO
        </button>
      </div>
    </section>
  ) : null}

  {transfer.status === "RTO_PROCESSING" ? (
    <section className="border border-[#d9d0c7] bg-[#fffdf9] px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Landmark
            aria-hidden="true"
            className="mt-0.5 h-5 w-5 shrink-0 text-[#66547a]"
          />

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#66547a]">
              RTO
            </p>

            <h2 className="mt-1 font-semibold text-[#24201d]">
              RTO review in progress
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#6b635d]">
              Your application is with the RTO. TransferShield will
              clearly show the next step if a correction is needed.
            </p>
          </div>
        </div>

        <Link
          to="/rto"
          className="inline-flex min-h-11 shrink-0 items-center justify-center border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
        >
          Open RTO officer view
        </Link>
      </div>
    </section>
  ) : null}
</section>


{/* ========================================================= */}
{/* COMPLETED TRANSFER                                        */}
{/* ========================================================= */}
{transfer.status === "TRANSFER_COMPLETED" ? (
  <div
    id="completion-record"
    className="mt-5 scroll-mt-6 grid gap-5 lg:grid-cols-[3fr_2fr]"
  >
    {/* Completion record */}
    <CompletionRecord transfer={transfer} />

    {/* Physical docket */}
    <section className="border border-[#d9d0c7] bg-[#fffdf9]">
      <div className="border-b border-[#e5ddd5] px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
          Physical submission
        </p>
      </div>

      <div className="p-3">
        <PhysicalRtoDocket transfer={transfer} />
      </div>
    </section>
  </div>
) : null}
      {/* ========================================================= */}
      {/* DIALOGS                                                    */}
      {/* ========================================================= */}
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

    </div>
  </main>
);}