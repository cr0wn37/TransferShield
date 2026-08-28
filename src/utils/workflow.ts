import type {
  PartyRole,
  TaskStatus,
  Transfer,
  TransferStatus,
} from "../types/transfer";

export interface ActionRequired {
  role: PartyRole | "system";
  title: string;
  description: string;
  actionLabel?: string;
}

export interface WorkflowProgress {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  label: string;
}

interface WorkflowStage {
  step: number;
  label: string;
}

const WORKFLOW_STAGES: Record<TransferStatus, WorkflowStage> = {
  INITIATED: { step: 1, label: "Transfer started" },
  BUYER_INVITED: { step: 1, label: "Waiting for buyer to join" },
  BUYER_JOINED: { step: 2, label: "Buyer joined" },
  DETAILS_COMPLETED: { step: 3, label: "Details completed" },
  DOCUMENTS_PENDING: { step: 4, label: "Documents required" },
  DOCUMENTS_VERIFIED: { step: 4, label: "Documents verified" },
  PAYMENT_PENDING: { step: 5, label: "Payment required" },
  BUYER_ESIGN_PENDING: { step: 6, label: "Buyer e-sign required" },
  SELLER_ESIGN_PENDING: { step: 7, label: "Seller e-sign required" },
  FINAL_REVIEW_PENDING: {step: 8,label: "Final review required",},
  READY_FOR_RTO: { step: 9, label: "Ready for RTO review" },
  RTO_PROCESSING: { step: 9, label: "RTO reviewing application" },
  ACTION_REQUIRED: { step: 9, label: "Correction required" },
  RESUBMISSION: { step: 9, label: "Ready to resubmit" },
  RTO_APPROVED: { step: 10, label: "RTO approved transfer" },
  TRANSFER_COMPLETED: { step: 10, label: "Transfer completed" },
};

const TOTAL_WORKFLOW_STEPS = 10;

export function getWorkflowProgress(status: TransferStatus): WorkflowProgress {
  const stage = WORKFLOW_STAGES[status];

  return {
    currentStep: stage.step,
    totalSteps: TOTAL_WORKFLOW_STEPS,
    percentage: Math.round((stage.step / TOTAL_WORKFLOW_STEPS) * 100),
    label: stage.label,
  };
}

export function getStatusLabel(status: TransferStatus): string {
  return WORKFLOW_STAGES[status].label;
}

export function getActionRequired(transfer: Transfer): ActionRequired {
  if (transfer.status === "ACTION_REQUIRED") {
    return {
      role: transfer.rto.responsibleParty ?? "rto",
      title: "Correction needed before RTO review can continue",
      description:
        transfer.rto.requiredAction ??
        transfer.rto.message ??
        "Review the requested correction and submit the updated information.",
      actionLabel: "Review correction",
    };
  }

  const actions: Record<TransferStatus, ActionRequired> = {
    INITIATED: {
      role: "seller",
      title: "Invite the buyer",
      description:
        "Share the transfer invite so the buyer can join this workspace.",
      actionLabel: "Invite buyer",
    },
    BUYER_INVITED: {
      role: "buyer",
      title: "Join this transfer",
      description:
        "Use the invite code or link shared by the seller to join the transfer.",
      actionLabel: "Join transfer",
    },
    BUYER_JOINED: {
      role: "shared",
      title: "Complete transfer details",
      description:
        "Seller and buyer should check and complete their respective details.",
      actionLabel: "Complete details",
    },
    DETAILS_COMPLETED: {
      role: "shared",
      title: "Upload required documents",
      description:
        "Both parties need to upload their required documents for verification.",
      actionLabel: "View documents",
    },
    DOCUMENTS_PENDING: {
      role: getDocumentActionOwner(transfer),
      title: "Documents need attention",
      description: getDocumentActionMessage(transfer),
      actionLabel: "Review documents",
    },
    DOCUMENTS_VERIFIED: {
      role: "buyer",
      title: "Pay the transfer fee",
      description:
        "The buyer needs to complete the mock payment before e-signing.",
      actionLabel: "Make payment",
    },
    PAYMENT_PENDING: {
      role: "buyer",
      title: "Pay the transfer fee",
      description:
        "Complete the mock payment to continue with the ownership transfer.",
      actionLabel: "Make payment",
    },
   BUYER_ESIGN_PENDING: {
      role: "buyer",
      title: "Buyer documents and e-sign required",
      description:
        "Upload Form 30, address proof, date-of-birth proof, and a passport-size photo. Then verify the mock Aadhaar OTP and submit.",
      actionLabel: "Complete buyer e-sign",
    },
    SELLER_ESIGN_PENDING: {
      role: "seller",
      title: "Seller documents and e-sign required",
      description:
        "Upload Form 29, address proof, date-of-birth proof, and a passport-size photo. Then verify the mock Aadhaar OTP and submit.",
      actionLabel: "Complete seller e-sign",
    },
    FINAL_REVIEW_PENDING: {
  role: "shared",
  title: "Final review required",
  description:
    "Seller and buyer must review their own submission before the application can be sent to the RTO.",
  actionLabel: "Review submission",
},
    READY_FOR_RTO: {
      role: "rto",
      title: "Application ready for RTO review",
      description:
        "All required actions are complete. The RTO can now review the application.",
      actionLabel: "Open RTO review",
    },
    RTO_PROCESSING: {
      role: "rto",
      title: "RTO is reviewing the application",
      description:
        "No action is needed right now. You will be notified if a correction is required.",
    },
    ACTION_REQUIRED: {
      role: "rto",
      title: "Correction needed",
      description: "Review the requested correction.",
    },
    RESUBMISSION: {
      role: "shared",
      title: "Resubmit corrected application",
      description:
        "The requested correction is complete. Resubmit the application for RTO review.",
      actionLabel: "Resubmit to RTO",
    },
    RTO_APPROVED: {
      role: "system",
      title: "Transfer approved",
      description:
        "The RTO has approved the application. The ownership transfer is being completed.",
    },
    TRANSFER_COMPLETED: {
      role: "system",
      title: "Ownership transfer completed",
      description:
        "The government ownership transfer has been successfully recorded.",
    },
  };

  return actions[transfer.status];
}

export function isTaskLocked(
  transfer: Transfer,
  prerequisiteTaskIds: string[],
): boolean {
  return prerequisiteTaskIds.some((taskId) => {
    const prerequisite = transfer.tasks.find((task) => task.id === taskId);

    return !prerequisite || prerequisite.status !== "completed";
  });
}

export function getDerivedTaskStatus(
  transfer: Transfer,
  taskId: string,
): TaskStatus {
  const task = transfer.tasks.find((item) => item.id === taskId);

  if (!task) {
    return "locked";
  }

  if (
    transfer.status === "ACTION_REQUIRED" &&
    transfer.rto.requestedDocumentId
  ) {
    const rejectedDocument = transfer.documents.find(
      (document) => document.id === transfer.rto.requestedDocumentId,
    );

    if (rejectedDocument) {
      const affectedTaskId =
        rejectedDocument.owner === "buyer"
          ? "buyer-esign"
          : rejectedDocument.owner === "seller"
            ? "seller-esign"
            : undefined;

      if (task.id === affectedTaskId) {
        return "blocked";
      }
    }
  }

  if (task.status === "completed" || task.status === "blocked") {
    return task.status;
  }

  return isTaskLocked(transfer, task.prerequisiteTaskIds)
    ? "locked"
    : "pending";
}

export function canSubmitToRto(transfer: Transfer): boolean {
  const buyerReviewDone = transfer.tasks.some(
    (task) =>
      task.id === "buyer-final-review" &&
      task.status === "completed",
  );

  const sellerReviewDone = transfer.tasks.some(
    (task) =>
      task.id === "seller-final-review" &&
      task.status === "completed",
  );

  return (
    transfer.documents.every((document) => document.status === "valid") &&
    transfer.payment.status === "completed" &&
    transfer.eSign.buyer === "completed" &&
    transfer.eSign.seller === "completed" &&
    buyerReviewDone &&
    sellerReviewDone
  );
}

export function canResubmitToRto(transfer: Transfer): boolean {
  return (
    transfer.status === "ACTION_REQUIRED" &&
    transfer.documents.every((document) => document.status === "valid")
  );
}

function getDocumentActionOwner(transfer: Transfer): PartyRole {
  const documentNeedingAttention = transfer.documents.find(
    (document) =>
      document.status === "missing" ||
      document.status === "invalid" ||
      document.status === "needs_reupload",
  );

  return documentNeedingAttention?.owner ?? "shared";
}

function getDocumentActionMessage(transfer: Transfer): string {
  const invalidDocument = transfer.documents.find(
    (document) =>
      document.status === "invalid" || document.status === "needs_reupload",
  );

  if (invalidDocument) {
    return `${invalidDocument.label} needs to be uploaded again. ${
      invalidDocument.issueMessage ?? "Please upload a clearer, valid document."
    }`;
  }

  const missingDocument = transfer.documents.find(
    (document) => document.status === "missing",
  );

  if (missingDocument) {
    return `${missingDocument.label} has not been uploaded yet.`;
  }

  return "Documents are being checked.";
}