import { initialTransfer } from "./mockTransfers";
import type {
  DocumentStatus,
  TimelineEvent,
  Transfer,
} from "../types/transfer";

export interface DemoScenario {
  id:
    | "happy-path"
    | "buyer-document-missing"
    | "seller-esign-pending"
    | "invalid-document"
    | "rto-correction"
    | "completed-transfer";
  title: string;
  description: string;
  transfer: Transfer;
}

const cloneTransfer = (): Transfer =>
  JSON.parse(JSON.stringify(initialTransfer)) as Transfer;

function createEvent(
  id: string,
  timestamp: string,
  title: string,
  description: string,
  actor: TimelineEvent["actor"],
  status: TimelineEvent["status"],
): TimelineEvent {
  return { id, timestamp, title, description, actor, status };
}

function setTaskStatus(
  transfer: Transfer,
  completedTaskIds: string[],
  pendingTaskId?: string,
) {
  transfer.tasks = transfer.tasks.map((task) => ({
    ...task,
    status: completedTaskIds.includes(task.id)
      ? "completed"
      : task.id === pendingTaskId
        ? "pending"
        : "locked",
    completedAt: completedTaskIds.includes(task.id)
      ? "2026-08-25T10:15:00+05:30"
      : undefined,
  }));
}

function setDocumentsForStage(
  transfer: Transfer,
  stage: "BUYER_ESIGN_PENDING" | "SELLER_ESIGN_PENDING",
  status: DocumentStatus,
) {
  transfer.documents = transfer.documents.map((document) =>
    document.requiredAt === stage
      ? {
          ...document,
          status,
          fileName:
            status === "valid" ? `${document.id}-demo-document.pdf` : undefined,
          uploadedAt:
            status === "valid" ? "2026-08-25T10:15:00+05:30" : undefined,
          validatedAt:
            status === "valid" ? "2026-08-25T10:15:00+05:30" : undefined,
        }
      : document,
  );
}

function setAllDocumentsValid(transfer: Transfer) {
  transfer.documents = transfer.documents.map((document) => ({
    ...document,
    status: "valid",
    fileName: `${document.id}-demo-document.pdf`,
    uploadedAt: "2026-08-25T10:15:00+05:30",
    validatedAt: "2026-08-25T10:15:00+05:30",
    issueMessage: undefined,
  }));
}

function standardTimeline(
  includeSellerESign: boolean,
  includeRtoSubmission: boolean,
): TimelineEvent[] {
  const events = [
    createEvent(
      "event-1",
      "2026-08-25T10:00:00+05:30",
      "Transfer started",
      "Arjun Mehta started an ownership transfer for MH 01 AB 4821.",
      "seller",
      "success",
    ),
    createEvent(
      "event-2",
      "2026-08-25T10:02:00+05:30",
      "Buyer invited",
      "An invite code was generated for the buyer.",
      "seller",
      "success",
    ),
    createEvent(
      "event-3",
      "2026-08-25T10:04:00+05:30",
      "Buyer joined the transfer",
      "Priya Sharma joined the shared transfer workspace.",
      "buyer",
      "success",
    ),
    createEvent(
      "event-4",
      "2026-08-25T10:06:00+05:30",
      "Transfer details confirmed",
      "Seller and buyer details have been confirmed.",
      "shared",
      "success",
    ),
    createEvent(
      "event-5",
      "2026-08-25T10:08:00+05:30",
      "Transfer fee paid",
      "Mock payment of ₹525 was completed by the buyer.",
      "buyer",
      "success",
    ),
    createEvent(
      "event-6",
      "2026-08-25T10:12:00+05:30",
      "Buyer e-sign completed",
      "Buyer documents, Form 30, and mock Aadhaar e-sign were submitted.",
      "buyer",
      "success",
    ),
  ];

  if (includeSellerESign) {
    events.push(
      createEvent(
        "event-7",
        "2026-08-25T10:16:00+05:30",
        "Seller e-sign completed",
        "Seller documents, Forms 29 and 30, and mock Aadhaar e-sign were submitted.",
        "seller",
        "success",
      ),
    );
  }

  if (includeRtoSubmission) {
    events.push(
      createEvent(
        "event-8",
        "2026-08-25T10:18:00+05:30",
        "Application submitted to RTO",
        "All requirements are complete and the RTO review has started.",
        "system",
        "info",
      ),
    );
  }

  return events;
}

function createHappyPathTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.status = "READY_FOR_RTO";
  transfer.updatedAt = "2026-08-25T10:16:00+05:30";
  transfer.invite.status = "joined";
  transfer.invite.sentAt = "2026-08-25T10:02:00+05:30";
  transfer.invite.joinedAt = "2026-08-25T10:04:00+05:30";
  transfer.buyer.joinedAt = "2026-08-25T10:04:00+05:30";
  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-4821",
    paidAt: "2026-08-25T10:08:00+05:30",
  };
  transfer.eSign = {
    buyer: "completed",
    seller: "completed",
    buyerSignedAt: "2026-08-25T10:12:00+05:30",
    sellerSignedAt: "2026-08-25T10:16:00+05:30",
  };
  transfer.rto.status = "not_ready";

  setTaskStatus(
    transfer,
    [
      "invite-buyer",
      "buyer-join",
      "seller-confirm-details",
      "buyer-confirm-details",
      "buyer-payment",
      "buyer-esign",
      "seller-esign",
      "buyer-final-review",
      "seller-final-review",
    ],
    "rto-review",
  );
  setAllDocumentsValid(transfer);
  transfer.timeline = standardTimeline(true, false);

  return transfer;
}

function createBuyerDocumentMissingTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.status = "BUYER_ESIGN_PENDING";
  transfer.updatedAt = "2026-08-25T10:10:00+05:30";
  transfer.invite.status = "joined";
  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-4821",
    paidAt: "2026-08-25T10:08:00+05:30",
  };

  setTaskStatus(
    transfer,
    ["invite-buyer", "buyer-join", "seller-confirm-details",
    "buyer-confirm-details", "buyer-payment"],
    "buyer-esign",
  );
  setDocumentsForStage(transfer, "BUYER_ESIGN_PENDING", "valid");

  transfer.documents = transfer.documents.map((document) =>
    document.id === "buyer-address-proof"
      ? {
          ...document,
          status: "missing",
          fileName: undefined,
          uploadedAt: undefined,
          validatedAt: undefined,
        }
      : document,
  );

  transfer.timeline = standardTimeline(false, false);

  return transfer;
}

function createSellerESignPendingTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.status = "SELLER_ESIGN_PENDING";
  transfer.updatedAt = "2026-08-25T10:12:00+05:30";
  transfer.invite.status = "joined";
  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-4821",
    paidAt: "2026-08-25T10:08:00+05:30",
  };
  transfer.eSign = {
    buyer: "completed",
    seller: "not_started",
    buyerSignedAt: "2026-08-25T10:12:00+05:30",
  };

  setTaskStatus(
  transfer,
  [
    "invite-buyer",
    "buyer-join",
    "seller-confirm-details",
    "buyer-confirm-details",
    "buyer-payment",
    "buyer-esign",
  ],
  "seller-esign",
);

transfer.tasks = transfer.tasks.map((task) =>
  task.id === "buyer-final-review"
    ? {
        ...task,
        status: "pending",
        completedAt: undefined,
      }
    : task,
);
  setDocumentsForStage(transfer, "BUYER_ESIGN_PENDING", "valid");
  transfer.timeline = standardTimeline(false, false);

  return transfer;
}

function createInvalidDocumentTransfer(): Transfer {
  const transfer = createBuyerDocumentMissingTransfer();

  transfer.documents = transfer.documents.map((document) =>
    document.id === "form-30"
      ? {
          ...document,
          status: "invalid",
          fileName: "form-30-blurry-photo.jpg",
          issueMessage:
            "The signatures on Form 30 are unclear. Upload a clearer signed copy.",
        }
      : document.id === "buyer-address-proof"
        ? {
            ...document,
            status: "valid",
            fileName: "buyer-address-proof.pdf",
          }
        : document,
  );

  transfer.timeline = [
    ...standardTimeline(false, false),
    createEvent(
      "event-7",
      "2026-08-25T10:10:00+05:30",
      "Form 30 needs re-upload",
      "The signatures on Form 30 are unclear.",
      "system",
      "warning",
    ),
  ];

  return transfer;
}

function createRtoCorrectionTransfer(): Transfer {
  const transfer = createHappyPathTransfer();

  setTaskStatus(
  transfer,
  [
    "invite-buyer",
    "buyer-join",
    "seller-confirm-details",
    "buyer-confirm-details",
    "buyer-payment",
    "buyer-esign",
    "seller-esign",
    "buyer-final-review",
    "seller-final-review",
    "rto-review",
  ],
);

  transfer.status = "ACTION_REQUIRED";
  transfer.updatedAt = "2026-08-25T10:20:00+05:30";
  transfer.rto = {
    status: "action_required",
    assignedOfficerName: "RTO Officer",
    submittedAt: "2026-08-25T10:18:00+05:30",
    reviewedAt: "2026-08-25T10:20:00+05:30",
    reasonCode: "FORM_INCOMPLETE",
    message: "Please complete all required signatures and fields before resubmitting.",
    responsibleParty: "buyer",
    requiredAction: "Upload Form 30 again and resubmit the application.",
    requestedDocumentId: "form-30",
  };

  transfer.documents = transfer.documents.map((document) =>
    document.id === "form-30"
      ? {
          ...document,
          status: "needs_reupload",
          issueMessage:
            "Please complete all required signatures and fields before resubmitting.",
        }
      : document,
  );

  transfer.timeline = [
    ...standardTimeline(true, true),
    createEvent(
      "event-9",
      "2026-08-25T10:20:00+05:30",
      "RTO requested a correction",
      "Please complete all required signatures and fields before resubmitting.",
      "rto",
      "warning",
    ),
  ];

  return transfer;
}

function createCompletedTransfer(): Transfer {
  const transfer = createHappyPathTransfer();

  transfer.status = "TRANSFER_COMPLETED";
  transfer.updatedAt = "2026-08-25T10:22:00+05:30";
  transfer.completedAt = "2026-08-25T10:22:00+05:30";
  transfer.rto = {
    status: "approved",
    assignedOfficerName: "RTO Officer",
    submittedAt: "2026-08-25T10:18:00+05:30",
    reviewedAt: "2026-08-25T10:21:00+05:30",
  };

  setTaskStatus(
    transfer,
    [
      "invite-buyer",
      "buyer-join",
      "seller-confirm-details",
      "buyer-confirm-details",
      "buyer-payment",
      "buyer-esign",
      "seller-esign",
      "buyer-final-review",
      "seller-final-review",
      "rto-review",
    ],
  );

  transfer.timeline = [
    ...standardTimeline(true, true),
    createEvent(
      "event-9",
      "2026-08-25T10:21:00+05:30",
      "Transfer approved by RTO",
      "The RTO has approved the ownership transfer application.",
      "rto",
      "success",
    ),
    createEvent(
      "event-10",
      "2026-08-25T10:22:00+05:30",
      "Ownership transfer completed",
      `Transfer ${transfer.id} has been successfully completed.`,
      "system",
      "success",
    ),
  ];

  return transfer;
}

export const demoScenarios: DemoScenario[] = [
  {
    id: "happy-path",
    title: "Happy path",
    description: "All citizen steps are done and the transfer is ready for RTO review.",
    transfer: createHappyPathTransfer(),
  },
  {
    id: "buyer-document-missing",
    title: "Buyer document missing",
    description: "Buyer cannot e-sign until their address proof is uploaded.",
    transfer: createBuyerDocumentMissingTransfer(),
  },
  {
    id: "seller-esign-pending",
    title: "Seller e-sign pending",
    description: "Buyer has completed their package; the seller needs to act.",
    transfer: createSellerESignPendingTransfer(),
  },
  {
    id: "invalid-document",
    title: "Invalid document",
    description: "Form 30 has unclear signatures and needs a re-upload.",
    transfer: createInvalidDocumentTransfer(),
  },
  {
    id: "rto-correction",
    title: "RTO correction",
    description: "RTO has requested a corrected Form 30 before continuing review.",
    transfer: createRtoCorrectionTransfer(),
  },
  {
    id: "completed-transfer",
    title: "Completed transfer",
    description: "A completed record with RTO approval and a full audit history.",
    transfer: createCompletedTransfer(),
  },
];