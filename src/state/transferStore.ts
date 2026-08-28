import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  demoScenarios,
  type DemoScenario,
} from "../data/demoScenarios";
import { initialTransfer } from "../data/mockTransfers";
import type {
  DocumentStatus,
  ESignStatus,
  Party,
  PartyRole,
  RejectionReasonCode,
  TimelineEvent,
  Transfer,
} from "../types/transfer";

interface TransferStore {
  transfer: Transfer;

  confirmFinalReview: (role: "seller" | "buyer") => void;
  resetTransfer: () => void;
  inviteBuyer: () => void;
  loadScenario: (scenarioId: DemoScenario["id"]) => void;
  createTransfer: (
  registrationNumber: string,
  chassisLast5: string,
) => void;
  joinTransfer: () => void;
  updatePartyDetails: (
    role: Extract<PartyRole, "seller" | "buyer">,
    details: Pick<Party, "name" | "phoneMasked" | "address">,
  ) => void;
  confirmPartyDetails: (
  role: Extract<PartyRole, "seller" | "buyer">,
) => void;
  completeTransferDetails: () => void;

  completePayment: () => void;

  uploadDocument: (
    documentId: string,
    fileName: string,
    validationStatus?: Extract<
      DocumentStatus,
      "valid" | "invalid" | "needs_reupload"
    >,
    issueMessage?: string,
  ) => void;

  sendBuyerOtp: () => void;
  completeBuyerESign: () => void;

  sendSellerOtp: () => void;
  completeSellerESign: () => void;

  submitToRto: () => void;
  requestReupload: (
    documentId: string,
    reasonCode: RejectionReasonCode,
    message: string,
    responsibleParty: Extract<PartyRole, "seller" | "buyer">,
  ) => void;
  resubmitToRto: () => void;
  approveTransfer: () => void;
  completeTransfer: () => void;
}

const cloneInitialTransfer = (): Transfer =>
  JSON.parse(JSON.stringify(initialTransfer)) as Transfer;

const getNow = () => new Date().toISOString();

function addEvent(
  transfer: Transfer,
  event: Omit<TimelineEvent, "id" | "timestamp">,
): Transfer {
  const timestamp = getNow();

  return {
    ...transfer,
    updatedAt: timestamp,
    timeline: [
      ...transfer.timeline,
      {
        id: `event-${Date.now()}-${transfer.timeline.length + 1}`,
        timestamp,
        ...event,
      },
    ],
  };
}

function updateTask(
  transfer: Transfer,
  taskId: string,
  status: "pending" | "completed" | "locked" | "blocked",
): Transfer {
  const completedAt = status === "completed" ? getNow() : undefined;

  return {
    ...transfer,
    tasks: transfer.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status,
            ...(completedAt ? { completedAt } : {}),
          }
        : task,
    ),
  };
}

function areDocumentsValidForStage(
  transfer: Transfer,
  stage: "BUYER_ESIGN_PENDING" | "SELLER_ESIGN_PENDING",
): boolean {
  const requiredDocuments = transfer.documents.filter(
    (document) => document.requiredAt === stage,
  );

  return (
    requiredDocuments.length > 0 &&
    requiredDocuments.every((document) => document.status === "valid")
  );
}

export const useTransferStore = create<TransferStore>()(
  persist(
    (set, get) => ({
  transfer: cloneInitialTransfer(),

  resetTransfer: () => {
  set({ transfer: cloneInitialTransfer() });
},

createTransfer: (registrationNumber, chassisLast5) => {
  const now = getNow();
  const normalizedRegistrationNumber = registrationNumber
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");
    

  const newTransfer = cloneInitialTransfer();

  newTransfer.id = `TS-${new Date().getFullYear()}-${String(
    Date.now(),
  ).slice(-6)}`;
  newTransfer.createdAt = now;
  newTransfer.updatedAt = now;
  newTransfer.vehicle.registrationNumber = normalizedRegistrationNumber;
  newTransfer.vehicle.chassisLast5 = chassisLast5;
  newTransfer.timeline = [
    {
      id: `event-transfer-created-${Date.now()}`,
      timestamp: now,
      title: "Transfer started",
      description: `A vehicle ownership transfer was started for ${normalizedRegistrationNumber}.`,
      actor: "seller",
      status: "success",
    },
  ];

  set({ transfer: newTransfer });
},

loadScenario: (scenarioId) => {
  const scenario = demoScenarios.find((item) => item.id === scenarioId);

  if (!scenario) {
    return;
  }

  set({
    transfer: JSON.parse(JSON.stringify(scenario.transfer)) as Transfer,
  });
},

inviteBuyer: () => {
    const { transfer } = get();

    if (transfer.status !== "INITIATED") {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      status: "BUYER_INVITED",
      invite: {
        ...transfer.invite,
        status: "sent",
        sentAt: getNow(),
      },
    };

    updatedTransfer = updateTask(updatedTransfer, "invite-buyer", "completed");
    updatedTransfer = updateTask(updatedTransfer, "buyer-join", "pending");
    updatedTransfer = addEvent(updatedTransfer, {
      title: "Buyer invited",
      description: `Invite code ${transfer.invite.code} was generated for the buyer.`,
      actor: "seller",
      status: "success",
    });

    set({ transfer: updatedTransfer });
  },

  confirmFinalReview: (role: "seller" | "buyer") => {
  const { transfer } = get();

  const taskId =
    role === "buyer"
      ? "buyer-final-review"
      : "seller-final-review";

  let updatedTransfer = updateTask(
    transfer,
    taskId,
    "completed",
  );

  updatedTransfer = addEvent(updatedTransfer, {
    title: `${role === "buyer" ? "Buyer" : "Seller"} review confirmed`,
    description:
      `${role === "buyer" ? "Buyer" : "Seller"} reviewed and confirmed their submission.`,
    actor: role,
    status: "success",
  });

  const buyerReviewDone = updatedTransfer.tasks.some(
    (task) =>
      task.id === "buyer-final-review" &&
      task.status === "completed",
  );

  const sellerReviewDone = updatedTransfer.tasks.some(
    (task) =>
      task.id === "seller-final-review" &&
      task.status === "completed",
  );

  if (buyerReviewDone && sellerReviewDone) {
    updatedTransfer = {
      ...updatedTransfer,
      status: "READY_FOR_RTO",
    };

    updatedTransfer = updateTask(
      updatedTransfer,
      "rto-review",
      "pending",
    );

    updatedTransfer = addEvent(updatedTransfer, {
      title: "Application ready for RTO review",
      description:
        "Both parties reviewed and confirmed their submissions.",
      actor: "shared",
      status: "success",
    });
  }

  set({ transfer: updatedTransfer });
},

  joinTransfer: () => {
    const { transfer } = get();

    if (transfer.status !== "BUYER_INVITED") {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      status: "BUYER_JOINED",
      buyer: {
        ...transfer.buyer,
        joinedAt: getNow(),
      },
      invite: {
        ...transfer.invite,
        status: "joined",
        joinedAt: getNow(),
      },
    };

    updatedTransfer = updateTask(updatedTransfer, "buyer-join", "completed");
    updatedTransfer = updateTask(
  updatedTransfer,
  "buyer-confirm-details",
  "pending",
);

updatedTransfer = updateTask(
  updatedTransfer,
  "seller-confirm-details",
  "pending",
);
    updatedTransfer = addEvent(updatedTransfer, {
      title: "Buyer joined the transfer",
      description: `${transfer.buyer.name} joined the shared transfer workspace.`,
      actor: "buyer",
      status: "success",
    });

    set({ transfer: updatedTransfer });
  },

  updatePartyDetails: (role, details) => {
    const { transfer } = get();

    if (transfer.status !== "BUYER_JOINED") {
      return;
    }

    set({
      transfer: {
        ...transfer,
        updatedAt: getNow(),
        seller:
          role === "seller"
            ? { ...transfer.seller, ...details }
            : transfer.seller,
        buyer:
          role === "buyer"
            ? { ...transfer.buyer, ...details }
            : transfer.buyer,
      },
    });
  },

  confirmPartyDetails: (role) => {
  const { transfer } = get();

  if (
    ![
      "BUYER_JOINED",
      "PAYMENT_PENDING",
      "BUYER_ESIGN_PENDING",
      "SELLER_ESIGN_PENDING",
    ].includes(transfer.status)
  ) {
    return;
  }

  let updatedTransfer: Transfer = {
    ...transfer,
    [role]: {
      ...transfer[role],
      detailsConfirmedAt: getNow(),
    },
  };

  updatedTransfer = updateTask(
    updatedTransfer,
    role === "seller"
      ? "seller-confirm-details"
      : "buyer-confirm-details",
    "completed",
  );

  updatedTransfer = addEvent(updatedTransfer, {
    title: `${role === "seller" ? "Seller" : "Buyer"} details confirmed`,
    description: `${transfer[role].name} confirmed their transfer details.`,
    actor: role,
    status: "success",
  });

  if (role === "buyer" && transfer.status === "BUYER_JOINED") {
    updatedTransfer = {
      ...updatedTransfer,
      status: "PAYMENT_PENDING",
    };

    updatedTransfer = updateTask(
      updatedTransfer,
      "buyer-payment",
      "pending",
    );

    updatedTransfer = addEvent(updatedTransfer, {
      title: "Buyer details confirmed",
      description:
        "Buyer details have been confirmed. Payment can now continue.",
      actor: "buyer",
      status: "success",
    });
  }

  set({ transfer: updatedTransfer });
},

  completeTransferDetails: () => {
    const { transfer } = get();

    if (transfer.status !== "BUYER_JOINED") {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      status: "PAYMENT_PENDING",
    };

    updatedTransfer = updateTask(
      updatedTransfer,
      "complete-details",
      "completed",
    );
    updatedTransfer = updateTask(updatedTransfer, "buyer-payment", "pending");
    updatedTransfer = addEvent(updatedTransfer, {
      title: "Transfer details confirmed",
      description: "Seller and buyer details have been confirmed.",
      actor: "shared",
      status: "success",
    });

    set({ transfer: updatedTransfer });
  },

  completePayment: () => {
    const { transfer } = get();

    if (transfer.status !== "PAYMENT_PENDING") {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      status: "BUYER_ESIGN_PENDING",
      payment: {
        ...transfer.payment,
        status: "completed",
        transactionId: `MOCK-PAY-${Date.now()}`,
        paidAt: getNow(),
      },
    };

    updatedTransfer = updateTask(
      updatedTransfer,
      "buyer-payment",
      "completed",
    );
    updatedTransfer = updateTask(updatedTransfer, "buyer-esign", "pending");
    updatedTransfer = addEvent(updatedTransfer, {
      title: "Transfer fee paid",
      description: `Mock payment of ₹${transfer.payment.amount} was completed by the buyer.`,
      actor: "buyer",
      status: "success",
    });

    set({ transfer: updatedTransfer });
  },

  uploadDocument: (
    documentId,
    fileName,
    validationStatus = "valid",
    issueMessage,
  ) => {
    const { transfer } = get();
    const document = transfer.documents.find((item) => item.id === documentId);

    const canUploadDocument =
      document &&
      (document.requiredAt === transfer.status ||
        (transfer.status === "ACTION_REQUIRED" &&
          (document.status === "invalid" ||
            document.status === "needs_reupload")));

    if (!canUploadDocument) {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      documents: transfer.documents.map((item) =>
        item.id === documentId
          ? {
              ...item,
              fileName,
              status: validationStatus,
              uploadedAt: getNow(),
              validatedAt: getNow(),
              issueMessage,
            }
          : item,
      ),
    };

    updatedTransfer = addEvent(updatedTransfer, {
      title:
        validationStatus === "valid"
          ? `${document.label} accepted`
          : `${document.label} needs attention`,
      description:
        issueMessage ??
        `${document.label} was uploaded by the ${document.owner}.`,
      actor: document.owner,
      status: validationStatus === "valid" ? "success" : "warning",
    });

    set({ transfer: updatedTransfer });
  },

  sendBuyerOtp: () => {
    const { transfer } = get();

    if (transfer.status !== "BUYER_ESIGN_PENDING") {
      return;
    }

    const updatedTransfer = addEvent(
      {
        ...transfer,
        eSign: {
          ...transfer.eSign,
          buyer: "otp_sent" as ESignStatus,
        },
      },
      {
        title: "Buyer e-sign OTP sent",
        description: "A mock Aadhaar OTP has been sent to the buyer.",
        actor: "system",
        status: "info",
      },
    );

    set({ transfer: updatedTransfer });
  },

  completeBuyerESign: () => {
    const { transfer } = get();

    if (
      transfer.status !== "BUYER_ESIGN_PENDING" ||
      transfer.eSign.buyer !== "otp_sent" ||
      !areDocumentsValidForStage(transfer, "BUYER_ESIGN_PENDING")
    ) {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      status: "SELLER_ESIGN_PENDING",
      eSign: {
        ...transfer.eSign,
        buyer: "completed",
        buyerSignedAt: getNow(),
      },
    };

    updatedTransfer = updateTask(updatedTransfer, "buyer-esign", "completed");
    updatedTransfer = updateTask(updatedTransfer, "seller-esign", "pending");
    updatedTransfer = addEvent(updatedTransfer, {
      title: "Buyer e-sign completed",
      description: "Buyer documents, Form 30, and mock Aadhaar e-sign were submitted.",
      actor: "buyer",
      status: "success",
    });

    set({ transfer: updatedTransfer });
  },

  sendSellerOtp: () => {
    const { transfer } = get();

    if (transfer.status !== "SELLER_ESIGN_PENDING") {
      return;
    }

    const updatedTransfer = addEvent(
      {
        ...transfer,
        eSign: {
          ...transfer.eSign,
          seller: "otp_sent" as ESignStatus,
        },
      },
      {
        title: "Seller e-sign OTP sent",
        description: "A mock Aadhaar OTP has been sent to the seller.",
        actor: "system",
        status: "info",
      },
    );

    set({ transfer: updatedTransfer });
  },

  completeSellerESign: () => {
  const { transfer } = get();

  if (
    transfer.status !== "SELLER_ESIGN_PENDING" ||
    transfer.eSign.seller !== "otp_sent" ||
    !areDocumentsValidForStage(transfer, "SELLER_ESIGN_PENDING")
  ) {
    return;
  }

  let updatedTransfer: Transfer = {
    ...transfer,
    status: "FINAL_REVIEW_PENDING",
    eSign: {
      ...transfer.eSign,
      seller: "completed",
      sellerSignedAt: getNow(),
    },
  };

  updatedTransfer = updateTask(
    updatedTransfer,
    "seller-esign",
    "completed",
  );

  updatedTransfer = addEvent(updatedTransfer, {
    title: "Seller e-sign completed",
    description:
      "Seller documents, Forms 29 and 30, and mock Aadhaar e-sign were submitted.",
    actor: "seller",
    status: "success",
  });

  set({ transfer: updatedTransfer });
},

  submitToRto: () => {
    const { transfer } = get();

    if (transfer.status !== "READY_FOR_RTO") {
      return;
    }

    const updatedTransfer = addEvent(
      {
        ...transfer,
        status: "RTO_PROCESSING",
        rto: {
          ...transfer.rto,
          status: "processing",
          assignedOfficerName: "RTO Officer",
          submittedAt: getNow(),
        },
      },
      {
        title: "Application submitted to RTO",
        description: "All requirements are complete and the RTO review has started.",
        actor: "system",
        status: "info",
      },
    );

    set({ transfer: updatedTransfer });
  },

  requestReupload: (
    documentId,
    reasonCode,
    message,
    responsibleParty,
  ) => {
    const { transfer } = get();
    const document = transfer.documents.find((item) => item.id === documentId);

    if (!document || transfer.status !== "RTO_PROCESSING") {
      return;
    }

    const updatedTransfer = addEvent(
      {
        ...transfer,
        status: "ACTION_REQUIRED",
        documents: transfer.documents.map((item) =>
          item.id === documentId
            ? {
                ...item,
                status: "needs_reupload",
                issueMessage: message,
              }
            : item,
        ),
        rto: {
          ...transfer.rto,
          status: "action_required",
          reviewedAt: getNow(),
          reasonCode,
          message,
          responsibleParty,
          requiredAction: `Upload ${document.label} again and resubmit the application.`,
          requestedDocumentId: documentId,
        },
      },
      {
        title: "RTO requested a correction",
        description: message,
        actor: "rto",
        status: "warning",
      },
    );

    set({ transfer: updatedTransfer });
  },

  resubmitToRto: () => {
    const { transfer } = get();

    const allDocumentsValid = transfer.documents.every(
      (document) => document.status === "valid",
    );

    if (transfer.status !== "ACTION_REQUIRED" || !allDocumentsValid) {
      return;
    }

    const updatedTransfer = addEvent(
      {
        ...transfer,
        status: "RTO_PROCESSING",
        rto: {
          ...transfer.rto,
          status: "processing",
          submittedAt: getNow(),
          reasonCode: undefined,
          message: undefined,
          responsibleParty: undefined,
          requiredAction: undefined,
          requestedDocumentId: undefined,
        },
      },
      {
        title: "Corrected application resubmitted",
        description: "The corrected document was submitted for another RTO review.",
        actor: "system",
        status: "info",
      },
    );

    set({ transfer: updatedTransfer });
  },

  approveTransfer: () => {
    const { transfer } = get();

    if (transfer.status !== "RTO_PROCESSING") {
      return;
    }

    const updatedTransfer = addEvent(
      {
        ...transfer,
        status: "RTO_APPROVED",
        rto: {
          ...transfer.rto,
          status: "approved",
          reviewedAt: getNow(),
        },
      },
      {
        title: "Transfer approved by RTO",
        description: "The RTO has approved the ownership transfer application.",
        actor: "rto",
        status: "success",
      },
    );

    set({ transfer: updatedTransfer });
  },

  



  completeTransfer: () => {
    const { transfer } = get();

    if (transfer.status !== "RTO_APPROVED") {
      return;
    }

    let updatedTransfer: Transfer = {
      ...transfer,
      status: "TRANSFER_COMPLETED",
      completedAt: getNow(),
    };

    updatedTransfer = updateTask(updatedTransfer, "rto-review", "completed");
    updatedTransfer = addEvent(updatedTransfer, {
      title: "Ownership transfer completed",
      description: `Transfer ${transfer.id} has been successfully completed.`,
      actor: "system",
      status: "success",
    });

    set({ transfer: updatedTransfer });
  },
}),
    {
      name: "transfershield-transfer-store",
      partialize: (state) => ({
        transfer: state.transfer,
      }),
    },
  ),
);