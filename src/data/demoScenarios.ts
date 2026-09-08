import { initialTransfer } from "./mockTransfers";
import type {
  DocumentStatus,
  TimelineEvent,
  Transfer,
} from "../types/transfer";

export interface DemoScenario {
  id:
    | "happy-path"
    | "vehicle-compliance-blocker"
    | "seller-esign-pending"
    | "rto-correction"
    | "buyer-document-missing"
    | "completed-transfer"
    | "digital-handover";
  title: string;
  description: string;
  transfer: Transfer;
}

/* ============================================================
   Recent demo timestamps
   ============================================================ */

const now = Date.now();

const minutesAgo = (minutes: number) =>
  new Date(now - minutes * 60 * 1000).toISOString();

const DEMO_CREATED_AT = minutesAgo(35);

/* ============================================================
   Helpers
   ============================================================ */

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
  return {
    id,
    timestamp,
    title,
    description,
    actor,
    status,
  };
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
      ? minutesAgo(4)
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
            status === "valid"
              ? `${document.id}-demo-document.pdf`
              : undefined,
          uploadedAt:
            status === "valid"
              ? minutesAgo(8)
              : undefined,
          validatedAt:
            status === "valid"
              ? minutesAgo(7)
              : undefined,
        }
      : document,
  );
}

function setAllDocumentsValid(transfer: Transfer) {
  transfer.documents = transfer.documents.map((document) => ({
    ...document,
    status: "valid",
    fileName: `${document.id}-demo-document.pdf`,
    uploadedAt: minutesAgo(14),
    validatedAt: minutesAgo(12),
    issueMessage: undefined,
    rtoReview: {
      status: "pending",
    },
  }));
}

/* ============================================================
   Timeline
   ============================================================ */

function standardTimeline(
  includeSellerESign: boolean,
  includeRtoSubmission: boolean,
): TimelineEvent[] {
  const events: TimelineEvent[] = [
    createEvent(
      "event-1",
      minutesAgo(35),
      "Transfer started",
      "Arjun Mehta started an ownership transfer for MH 01 AB 4821.",
      "seller",
      "success",
    ),

    createEvent(
      "event-2",
      minutesAgo(33),
      "Buyer invited",
      "An invite code was generated for the buyer.",
      "seller",
      "success",
    ),

    createEvent(
      "event-3",
      minutesAgo(31),
      "Buyer joined the transfer",
      "Priya Sharma joined the shared transfer workspace.",
      "buyer",
      "success",
    ),

    createEvent(
      "event-4",
      minutesAgo(28),
      "Transfer details confirmed",
      "Seller and buyer details have been confirmed.",
      "shared",
      "success",
    ),

    createEvent(
      "event-5",
      minutesAgo(24),
      "Transfer fee paid",
      "Mock payment of ₹525 was completed by the buyer.",
      "buyer",
      "success",
    ),

    createEvent(
      "event-6",
      minutesAgo(18),
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
        minutesAgo(14),
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
        minutesAgo(10),
        "Application submitted to RTO",
        "All requirements are complete and the RTO review has started.",
        "system",
        "info",
      ),
    );
  }

  return events;
}

/* ============================================================
   1. HAPPY PATH
   All citizen work complete → ready for RTO submission
   ============================================================ */

function createHappyPathTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.createdAt = DEMO_CREATED_AT;
  transfer.updatedAt = minutesAgo(4);

  transfer.status = "READY_FOR_RTO";

  transfer.invite.status = "joined";
  transfer.invite.sentAt = minutesAgo(33);
  transfer.invite.joinedAt = minutesAgo(31);

  transfer.buyer.joinedAt = minutesAgo(31);

  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-4821",
    paidAt: minutesAgo(24),
  };

  transfer.eSign = {
    buyer: "completed",
    seller: "completed",
    buyerSignedAt: minutesAgo(18),
    sellerSignedAt: minutesAgo(14),
  };

  transfer.rto = {
    status: "not_ready",
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
    ],
    "rto-review",
  );

  setAllDocumentsValid(transfer);

  transfer.timeline = standardTimeline(true, false);

  transfer.transferDeadline = {
    type: "same_state",
    days: 14,
    startsAt: DEMO_CREATED_AT,
  };

  return transfer;
}

/* ============================================================
   2. VEHICLE COMPLIANCE BLOCKER
   ============================================================ */

function createVehicleComplianceBlockerTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.createdAt = minutesAgo(12);
  transfer.updatedAt = minutesAgo(2);

  transfer.status = "INITIATED";

  transfer.invite.status = "not_sent";
  transfer.invite.sentAt = undefined;
  transfer.invite.joinedAt = undefined;
  transfer.buyer.joinedAt = undefined;

  transfer.payment = {
    status: "not_started",
    amount: 525,
    currency: "INR",
  };

  transfer.eSign = {
    buyer: "not_started",
    seller: "not_started",
  };

  transfer.rto = {
    status: "not_ready",
  };

  setTaskStatus(transfer, [], "invite-buyer");

  transfer.timeline = [
    createEvent(
      "event-1",
      minutesAgo(12),
      "Transfer started",
      "Arjun Mehta started an ownership transfer for MH 01 AB 4821.",
      "seller",
      "success",
    ),
  ];

  transfer.transferDeadline = {
    type: "same_state",
    days: 14,
    startsAt: transfer.createdAt,
  };

  return transfer;
}

/* ============================================================
   3. SELLER E-SIGN PENDING
   ============================================================ */

function createSellerESignPendingTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.createdAt = minutesAgo(28);
  transfer.updatedAt = minutesAgo(5);

  transfer.status = "SELLER_ESIGN_PENDING";

  transfer.invite.status = "joined";
  transfer.invite.sentAt = minutesAgo(26);
  transfer.invite.joinedAt = minutesAgo(24);

  transfer.buyer.joinedAt = minutesAgo(24);

  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-4821",
    paidAt: minutesAgo(18),
  };

  transfer.eSign = {
    buyer: "completed",
    seller: "not_started",
    buyerSignedAt: minutesAgo(12),
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

  setDocumentsForStage(
    transfer,
    "BUYER_ESIGN_PENDING",
    "valid",
  );

  transfer.timeline = standardTimeline(false, false);

  transfer.transferDeadline = {
    type: "same_state",
    days: 14,
    startsAt: transfer.createdAt,
  };

  return transfer;
}

/* ============================================================
   4. RTO CORRECTIONS REQUIRED
   One seller document + one buyer document
   ============================================================ */

function createRtoCorrectionTransfer(): Transfer {
  const transfer = createHappyPathTransfer();

  transfer.status = "ACTION_REQUIRED";
  transfer.updatedAt = minutesAgo(2);

  transfer.rto = {
    status: "action_required",
    assignedOfficerName: "RTO Officer",
    submittedAt: minutesAgo(18),
    reviewedAt: minutesAgo(12),

    corrections: [
      {
        documentId: "form-29",
        reasonCode: "DOCUMENT_UNCLEAR",
        message:
          "The seller signature on Form 29 is unclear. Upload a clearer signed copy.",
        responsibleParty: "seller",
        status: "open",
        requestedAt: minutesAgo(12),
      },
      {
        documentId: "buyer-address-proof",
        reasonCode: "ADDRESS_MISMATCH",
        message:
          "The buyer address proof does not match the transfer address. Upload a valid matching document.",
        responsibleParty: "buyer",
        status: "open",
        requestedAt: minutesAgo(11),
      },
    ],
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

  transfer.documents = transfer.documents.map((document) => {
    if (document.id === "form-29") {
      return {
        ...document,
        status: "needs_reupload",
        fileName: "form-29-seller-signed.pdf",
        uploadedAt: minutesAgo(25),
        validatedAt: minutesAgo(24),
        issueMessage:
          "The seller signature on Form 29 is unclear. Upload a clearer signed copy.",
        rtoReview: {
          status: "rejected",
        },
      };
    }

    if (document.id === "buyer-address-proof") {
      return {
        ...document,
        status: "needs_reupload",
        fileName: "buyer-address-proof.pdf",
        uploadedAt: minutesAgo(24),
        validatedAt: minutesAgo(23),
        issueMessage:
          "The buyer address proof does not match the transfer address.",
        rtoReview: {
          status: "rejected",
        },
      };
    }

    return document;
  });

  transfer.timeline = [
    ...standardTimeline(true, true),

    createEvent(
      "event-9",
      minutesAgo(12),
      "RTO requested corrections",
      "The officer returned one seller document and one buyer document for correction.",
      "rto",
      "warning",
    ),

    createEvent(
      "event-10",
      minutesAgo(11),
      "Seller correction requested",
      "Form 29 needs a clearer seller signature.",
      "rto",
      "warning",
    ),

    createEvent(
      "event-11",
      minutesAgo(10),
      "Buyer correction requested",
      "Buyer address proof does not match the transfer address.",
      "rto",
      "warning",
    ),
  ];

  return transfer;
}

/* ============================================================
   5. BUYER DOCUMENT MISSING
   ============================================================ */

function createBuyerDocumentMissingTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.createdAt = minutesAgo(22);
  transfer.updatedAt = minutesAgo(4);

  transfer.status = "BUYER_ESIGN_PENDING";

  transfer.invite.status = "joined";
  transfer.invite.sentAt = minutesAgo(20);
  transfer.invite.joinedAt = minutesAgo(18);

  transfer.buyer.joinedAt = minutesAgo(18);

  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-4821",
    paidAt: minutesAgo(12),
  };

  transfer.eSign = {
    buyer: "not_started",
    seller: "not_started",
  };

  setTaskStatus(
    transfer,
    [
      "invite-buyer",
      "buyer-join",
      "seller-confirm-details",
      "buyer-confirm-details",
      "buyer-payment",
    ],
    "buyer-esign",
  );

  setDocumentsForStage(
    transfer,
    "BUYER_ESIGN_PENDING",
    "valid",
  );

  transfer.documents = transfer.documents.map((document) =>
    document.id === "buyer-address-proof"
      ? {
          ...document,
          status: "missing",
          fileName: undefined,
          uploadedAt: undefined,
          validatedAt: undefined,
          issueMessage:
            "Required buyer address proof has not been uploaded.",
        }
      : document,
  );

  transfer.timeline = [
    ...standardTimeline(false, false),

    createEvent(
      "event-7",
      minutesAgo(4),
      "Buyer document missing",
      "Buyer address proof is still required before e-sign can continue.",
      "system",
      "warning",
    ),
  ];

  transfer.transferDeadline = {
    type: "same_state",
    days: 14,
    startsAt: transfer.createdAt,
  };

  return transfer;
}

/* ============================================================
   6. COMPLETED TRANSFER
   ============================================================ */

function createCompletedTransfer(): Transfer {
  const transfer = createHappyPathTransfer();

  transfer.status = "TRANSFER_COMPLETED";
  transfer.updatedAt = minutesAgo(1);
  transfer.completedAt = minutesAgo(1);

  transfer.rto = {
    status: "approved",
    assignedOfficerName: "RTO Officer",
    submittedAt: minutesAgo(15),
    reviewedAt: minutesAgo(3),
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
      minutesAgo(3),
      "Transfer approved by RTO",
      "The RTO has approved the ownership transfer application.",
      "rto",
      "success",
    ),

    createEvent(
      "event-10",
      minutesAgo(1),
      "Ownership transfer completed",
      `Transfer ${transfer.id} has been successfully completed.`,
      "system",
      "success",
    ),
  ];

  return transfer;
}

/* ============================================================
   7. DIGITAL HANDOVER
   Payment complete → handover unlocked
   Remaining transfer steps are intentionally incomplete.
   ============================================================ */

function createDigitalHandoverTransfer(): Transfer {
  const transfer = cloneTransfer();

  transfer.createdAt = minutesAgo(20);
  transfer.updatedAt = minutesAgo(2);

  transfer.status = "DOCUMENTS_PENDING";

  transfer.invite.status = "joined";
  transfer.invite.sentAt = minutesAgo(18);
  transfer.invite.joinedAt = minutesAgo(16);

  transfer.buyer.joinedAt = minutesAgo(16);

  transfer.payment = {
    status: "completed",
    amount: 525,
    currency: "INR",
    transactionId: "MOCK-PAY-HANDOVER-4821",
    paidAt: minutesAgo(8),
  };

  transfer.eSign = {
    buyer: "not_started",
    seller: "not_started",
  };

  transfer.rto = {
    status: "not_ready",
  };

  setTaskStatus(
    transfer,
    [
      "invite-buyer",
      "buyer-join",
      "seller-confirm-details",
      "buyer-confirm-details",
      "buyer-payment",
    ],
    "buyer-esign",
  );

  transfer.documents = transfer.documents.map((document) => ({
    ...document,
    status: "missing",
    fileName: undefined,
    uploadedAt: undefined,
    validatedAt: undefined,
    rtoReview: {
      status: "pending",
    },
  }));

  transfer.timeline = [
    createEvent(
      "event-1",
      minutesAgo(20),
      "Transfer started",
      "Arjun Mehta started an ownership transfer for MH 01 AB 4821.",
      "seller",
      "success",
    ),

    createEvent(
      "event-2",
      minutesAgo(18),
      "Buyer invited",
      "An invite code was generated for the buyer.",
      "seller",
      "success",
    ),

    createEvent(
      "event-3",
      minutesAgo(16),
      "Buyer joined the transfer",
      "Priya Sharma joined the shared transfer workspace.",
      "buyer",
      "success",
    ),

    createEvent(
      "event-4",
      minutesAgo(13),
      "Transfer details confirmed",
      "Seller and buyer independently confirmed their transfer details.",
      "shared",
      "success",
    ),

    createEvent(
      "event-5",
      minutesAgo(8),
      "Transfer fee paid",
      "Mock payment of ₹525 was completed by the buyer.",
      "buyer",
      "success",
    ),
  ];

  transfer.transferDeadline = {
    type: "same_state",
    days: 14,
    startsAt: transfer.createdAt,
  };

  return transfer;
}

/* ============================================================
   DEMO SCENARIOS
   ============================================================ */

export const demoScenarios: DemoScenario[] = [
  {
    id: "happy-path",
    title: "Happy path",
    description:
      "Seller and buyer have completed every citizen action. The application is ready for RTO submission.",
    transfer: createHappyPathTransfer(),
  },

  {
    id: "vehicle-compliance-blocker",
    title: "Vehicle compliance blocker",
    description:
      "Pending challan and active hypothecation block the transfer before it can proceed.",
    transfer: createVehicleComplianceBlockerTransfer(),
  },

  {
    id: "seller-esign-pending",
    title: "Seller e-sign pending",
    description:
      "Buyer has completed their package. The seller is the remaining action owner.",
    transfer: createSellerESignPendingTransfer(),
  },

  {
    id: "rto-correction",
    title: "RTO corrections required",
    description:
      "RTO has returned one seller document and one buyer document for correction and re-upload.",
    transfer: createRtoCorrectionTransfer(),
  },

  {
    id: "buyer-document-missing",
    title: "Missing document",
    description:
      "Buyer has reached the document stage, but a required address proof is still missing.",
    transfer: createBuyerDocumentMissingTransfer(),
  },

  {
    id: "completed-transfer",
    title: "Completed transfer",
    description:
      "RTO has approved the application and the ownership transfer is officially completed.",
    transfer: createCompletedTransfer(),
  },

  {
    id: "digital-handover",
    title: "Digital handover",
    description:
      "Buyer has completed payment, unlocking Digital Handover while the remaining transfer steps are still pending.",
    transfer: createDigitalHandoverTransfer(),
  },
];