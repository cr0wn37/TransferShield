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
  TransferDocument,
} from "../types/transfer";

import {
  createLiveTransfer,
  getLiveTransferBySessionCode,
  updateLiveTransfer,
  subscribeToLiveTransfer,
} from "../lib/liveTransferSync";

import { rejectionReasons } from "../lib/rtoRejectionReasons";
import {
  calculateTimelineEventHash,
  getGenesisHash,
} from "../lib/timelineHash";

import {
  subscribeToLivePresence,
} from "../lib/liveTransferSync";

import type { VehicleCompliance } from "../types/vehicleCompliance";

interface TransferStore {
  transfer: Transfer;

  liveSync: {
  enabled: boolean;
  sessionCode?: string;
  role?: "seller" | "buyer";
  status: "offline" | "connecting" | "connected" | "error";
  error?: string;
};

 livePresence: {
    seller: boolean;
    buyer: boolean;
  };

startLiveSync: (
  role?: "seller" | "buyer"
) => Promise<string>;

joinLiveSync: (
  sessionCode: string,
  role?: "seller" | "buyer"
) => Promise<void>;

disableLiveSync: () => void;

  confirmFinalReview: (role: "seller" | "buyer") => void;
  resetTransfer: () => void;
  inviteBuyer: () => void;
  loadScenario: (scenarioId: DemoScenario["id"]) => void;
  createTransfer: (
  registrationNumber: string,
  chassisLast5: string,
  compliance?: VehicleCompliance,
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

  completeDigitalHandover: (payload: {
  odometerKm: number;
  handoverLocation: string;
  statutoryRefId: string;
}) => void;

  uploadDocument: (
    documentId: string,
    fileName: string,
    validationStatus?: Extract<
      DocumentStatus,
      "valid" | "invalid" | "needs_reupload"
    >,
    issueMessage?: string,
  ) => void;

  setDocumentVerification: (
  documentId: string,
  verification: NonNullable<
    TransferDocument["verification"]
  >,
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
  reviewDocument: (
  documentId: string,
  decision: "approved" | "rejected",
  reasonCode?: RejectionReasonCode,
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
  event: Omit<
    TimelineEvent,
    "id" | "timestamp" | "previousHash" | "hash"
  >,
): Transfer {
  const timestamp = getNow();

  const id = `event-${Date.now()}-${transfer.timeline.length + 1}`;

  const previousHash =
    transfer.timeline.length > 0
      ? transfer.timeline[transfer.timeline.length - 1].hash ??
        getGenesisHash()
      : getGenesisHash();

  const baseEvent: TimelineEvent = {
    id,
    timestamp,
    ...event,
  };

  const hash = calculateTimelineEventHash(
    baseEvent,
    previousHash,
  );

  const newEvent: TimelineEvent = {
    ...baseEvent,
    previousHash,
    hash,
  };

  return {
    ...transfer,
    updatedAt: timestamp,
    timeline: [
      ...transfer.timeline,
      newEvent,
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

let liveSyncCleanup: (() => void) | null = null;

let isApplyingRemoteUpdate = false;

let activeLiveTransferId: string | null = null;

let livePresenceCleanup: (() => void) | null = null;




const stopLiveSyncConnection = () => {
  if (liveSyncCleanup) {
    liveSyncCleanup();
    liveSyncCleanup = null;
  }

   if (livePresenceCleanup) {
    livePresenceCleanup();
    livePresenceCleanup = null;
  }

  activeLiveTransferId = null;
};



export const useTransferStore = create<TransferStore>()(
  persist(
    (set, get) => ({
  transfer: cloneInitialTransfer(),

  liveSync: {
  enabled: false,
  status: "offline",
},



livePresence: {
  seller: false,
  buyer: false,
},

startLiveSync: async (role = "seller") => {
  const { transfer } = get();

  try {
    set({
      liveSync: {
        enabled: true,
        role,
        status: "connecting",
      },
    });

    const sessionCode = await createLiveTransfer(transfer);

    stopLiveSyncConnection();

    activeLiveTransferId = transfer.id;

    liveSyncCleanup = subscribeToLiveTransfer(
      transfer.id,
      (remoteTransfer) => {
        isApplyingRemoteUpdate = true;

        set({
          transfer: remoteTransfer,
          liveSync: {
            enabled: true,
            sessionCode,
            role,
            status: "connected",
            error: undefined,
          },
        });

        isApplyingRemoteUpdate = false;
      },
      (status) => {
        set((state) => ({
          liveSync: {
            ...state.liveSync,
            status,
            error:
              status === "error"
                ? "Live connection lost. Demo Mode remains available."
                : undefined,
          },
        }));
      }
    );

    livePresenceCleanup = subscribeToLivePresence(
        transfer.id,
        role,
        (presence) => {
          set({
            livePresence: presence,
          });
        },
        (status) => {
          set((state) => ({
            liveSync: {
              ...state.liveSync,
              status,
              error:
                status === "error"
                  ? "Live connection lost. Demo Mode remains available."
                  : undefined,
            },
          }));
        }
      );

    set({
      liveSync: {
        enabled: true,
        sessionCode,
        role,
        status: "connected",
        error: undefined,
      },
    });

    return sessionCode;
  } catch (error) {
    console.error("Failed to start live sync:", error);

    set({
      liveSync: {
        enabled: false,
        role,
        status: "error",
        error: "Unable to create live session.",
      },
    });

    throw error;
  }
},

joinLiveSync: async (
  sessionCode,
  role = "buyer"
) => {
  try {
    set({
      liveSync: {
        enabled: true,
        role,
        status: "connecting",
      },
    });

    const remoteTransfer =
      await getLiveTransferBySessionCode(sessionCode);

    if (!remoteTransfer) {
      throw new Error("Live session not found.");
    }

    stopLiveSyncConnection();

    isApplyingRemoteUpdate = true;

    set({
      transfer: remoteTransfer,
      liveSync: {
        enabled: true,
        sessionCode: sessionCode.trim().toUpperCase(),
        role,
        status: "connecting",
      },
    });

    isApplyingRemoteUpdate = false;

    activeLiveTransferId = remoteTransfer.id;

    liveSyncCleanup = subscribeToLiveTransfer(
      remoteTransfer.id,
      (updatedTransfer) => {
        isApplyingRemoteUpdate = true;

        set({
          transfer: updatedTransfer,
          liveSync: {
            enabled: true,
            sessionCode: sessionCode.trim().toUpperCase(),
            role,
            status: "connected",
            error: undefined,
          },
        });

        isApplyingRemoteUpdate = false;
      },
      (status) => {
        set((state) => ({
          liveSync: {
            ...state.liveSync,
            status,
            error:
              status === "error"
                ? "Live connection lost. Demo Mode remains available."
                : undefined,
          },
        }));
      }
    );

   livePresenceCleanup = subscribeToLivePresence(
        remoteTransfer.id,
        role,
        (presence) => {
          set({
            livePresence: presence,
          });
        },
        (status) => {
          set((state) => ({
            liveSync: {
              ...state.liveSync,
              status,
              error:
                status === "error"
                  ? "Live connection lost. Demo Mode remains available."
                  : undefined,
            },
          }));
        }
      );

    set({
      liveSync: {
        enabled: true,
        sessionCode: sessionCode.trim().toUpperCase(),
        role,
        status: "connected",
        error: undefined,
      },
    });
  } catch (error) {
    console.error("Failed to join live sync:", error);

    set({
      liveSync: {
        enabled: false,
        role,
        status: "error",
        error:
          error instanceof Error
            ? error.message
            : "Unable to join live session.",
      },
    });

    throw error;
  }
},

disableLiveSync: () => {
  stopLiveSyncConnection();

  set({
    liveSync: {
      enabled: false,
      status: "offline",
    },
    livePresence: {
      seller: false,
      buyer: false,
    },
  });
},

  resetTransfer: () => {
  set({ transfer: cloneInitialTransfer() });
},

createTransfer: (
  registrationNumber,
  chassisLast5,
  compliance,
) => {
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
  newTransfer.transferDeadline = {
  type: "same_state",
  days: 14,
  startsAt: now,
};
  newTransfer.vehicle.registrationNumber = normalizedRegistrationNumber;
  newTransfer.vehicle.chassisLast5 = chassisLast5;
  newTransfer.compliance = compliance;
  const initialEvent: TimelineEvent = {
  id: `event-transfer-created-${Date.now()}`,
  timestamp: now,
  title: "Transfer started",
  description: `A vehicle ownership transfer was started for ${normalizedRegistrationNumber}.`,
  actor: "seller",
  status: "success",
};

const initialEventHash = calculateTimelineEventHash(
  initialEvent,
  getGenesisHash(),
);

newTransfer.timeline = [
  {
    ...initialEvent,
    previousHash: getGenesisHash(),
    hash: initialEventHash,
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

completeDigitalHandover: (payload: {
  odometerKm: number;
  handoverLocation: string;
  statutoryRefId: string;
}) => {
  const now = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(now.getDate() + 30); // 30-day legal validity window

  const formattedCompletedAt = now.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedExpiresAt = expiryDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  

  const handoverEvent: TimelineEvent = {
    id: `timeline-${Date.now()}`,
    title: "Key Handover & Interim Legal Shield Activated",
    description: `Physical custody exchanged with odometer reading ${payload.odometerKm.toLocaleString()} km at ${payload.handoverLocation}. Digital handover record issued. Ref: ${payload.statutoryRefId}.`,
    timestamp: formattedCompletedAt,
    actor: "system",   
    status: "success",
  };

  set((state) => ({
    transfer: {
      ...state.transfer,
      handover: {
        status: "active",
        odometerKm: payload.odometerKm,
        handoverLocation: payload.handoverLocation,
        completedAt: formattedCompletedAt,
        expiresAt: formattedExpiresAt,
        complianceFeePaid: true,
        statutoryRefId: payload.statutoryRefId,
      },
      // Appends the legal event to the top of your existing audit history
      timeline: [handoverEvent, ...(state.transfer.timeline || [])],
    },
  }));
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

  if (transfer.status !== "BUYER_JOINED") {
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

  if (
    updatedTransfer.buyer.detailsConfirmedAt &&
    updatedTransfer.seller.detailsConfirmedAt
  ) {
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
      title: "Transfer details confirmed by both parties",
      description:
        "Seller and buyer have both confirmed their details. Payment can now continue.",
      actor: "shared",
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
    // Spread existing handover first so the new "ready" status doesn't get overwritten
    handover: {
      ...(transfer.handover || {}),
      status: transfer.handover?.status === "active" ? "active" : "ready",
      complianceFeePaid: transfer.handover?.complianceFeePaid ?? false,
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

    if (
  transfer.status === "ACTION_REQUIRED" &&
  transfer.rto.corrections?.length
) {
  updatedTransfer = {
    ...updatedTransfer,
    rto: {
      ...updatedTransfer.rto,
      corrections:
  (updatedTransfer.rto.corrections ?? []).map(
    (correction) =>
      correction.documentId === documentId
        ? {
            ...correction,
            status: "resolved",
          }
        : correction,
  ),
    },
  };
}

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
  setDocumentVerification: (
  documentId,
  verification,
) => {
  const { transfer } = get();

  const documentExists =
    transfer.documents.some(
      (document) =>
        document.id === documentId,
    );

  if (!documentExists) {
    return;
  }

  const updatedTransfer: Transfer = {
    ...transfer,

    documents:
      transfer.documents.map(
        (document) =>
          document.id === documentId
            ? {
                ...document,
                verification,
                validatedAt:
                  getNow(),
                issueMessage:
                  verification.status ===
                  "verified"
                    ? undefined
                    : verification.issues[0]
                        ?.message ??
                      verification.summary,
              }
            : document,
      ),
  };

  set({
    transfer: updatedTransfer,
  });
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

  const document =
    transfer.documents.find(
      (item) => item.id === documentId,
    );

  if (
    !document ||
    ![
      "RTO_PROCESSING",
      "ACTION_REQUIRED",
    ].includes(transfer.status)
  ) {
    return;
  }

  const now = getNow();

  const existingCorrections =
    transfer.rto.corrections ?? [];

  const updatedCorrections = [
    ...existingCorrections.filter(
      (correction) =>
        correction.documentId !== documentId,
    ),

    {
      documentId,
      reasonCode,
      message,
      responsibleParty:
        responsibleParty as Extract<
          PartyRole,
          "seller" | "buyer"
        >,
      status: "open" as const,
      requestedAt: now,
    },
  ];

  const updatedTransfer =
    addEvent(
      {
        ...transfer,

        status: "ACTION_REQUIRED",

        documents:
          transfer.documents.map(
            (item) =>
              item.id === documentId
                ? {
                    ...item,

                    status:
                      "needs_reupload",

                    issueMessage:
                      message,

                    rtoReview: {
                      ...item.rtoReview,

                      status:
                        "rejected",

                      reasonCode,

                      reviewedAt: now,

                      message,
                    },
                  }
                : item,
          ),

        rto: {
          ...transfer.rto,

          status:
            "action_required",

          reviewedAt: now,

          /*
           * Legacy fields:
           * keep these pointing to the
           * most recently rejected document.
           */
          reasonCode,

          message,

          responsibleParty,

          requiredAction:
            `Upload ${document.label} again and resubmit the application.`,

          requestedDocumentId:
            documentId,

          corrections:
            updatedCorrections,
        },
      },
      {
        title:
          "RTO requested a correction",

        description:
          `${document.label}: ${message}`,

        actor: "rto",

        status: "warning",
      },
    );

  set({
    transfer: updatedTransfer,
  });
},

 reviewDocument: (
  documentId,
  decision,
  reasonCode,
) => {
  const state = get();
  const { transfer } = state;

  const document =
    transfer.documents.find(
      (item) => item.id === documentId,
    );

  if (!document) {
    return;
  }

  const reason = reasonCode
    ? rejectionReasons.find(
        (item) =>
          item.code === reasonCode,
      )
    : undefined;

  const updatedTransfer: Transfer = {
    ...transfer,

    documents:
      transfer.documents.map(
        (item) =>
          item.id === documentId
            ? {
                ...item,
                rtoReview: {
                  status: decision,
                  reasonCode,
                  reviewedAt: getNow(),
                  message:
                    decision === "rejected"
                      ? reason?.defaultMessage
                      : undefined,
                },
              }
            : item,
      ),
  };

  const event =
    decision === "approved"
      ? {
          title:
            `${document.label} approved by RTO`,
          description:
            `${document.label} was individually approved during RTO review.`,
          actor: "rto" as const,
          status:
            "success" as const,
        }
      : {
          title:
            `${document.label} requires correction`,
          description:
            reason?.defaultMessage ??
            `${document.label} was rejected during RTO review.`,
          actor: "rto" as const,
          status:
            "warning" as const,
        };

  set({
    transfer: addEvent(
      updatedTransfer,
      event,
    ),
  });

  if (decision === "rejected") {
    state.requestReupload(
      documentId,
      reasonCode ??
        "DOCUMENT_UNCLEAR",
      reason?.defaultMessage ??
        "Please correct the requested document and resubmit.",
      document.owner,
    );
  }
},

  resubmitToRto: () => {
    const { transfer } = get();

    if (transfer.status !== "ACTION_REQUIRED") {
  return;
}

const allDocumentsValid = transfer.documents.every(
  (document) => document.status === "valid",
);

if (!allDocumentsValid) {
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
          corrections: [],
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

useTransferStore.subscribe((state, previousState) => {
  if (isApplyingRemoteUpdate) {
    return;
  }

  if (!activeLiveTransferId) {
    return;
  }

  if (state.transfer === previousState.transfer) {
    return;
  }

  if (state.transfer.id !== activeLiveTransferId) {
    return;
  }

  void updateLiveTransfer(state.transfer).catch((error) => {
    console.error("Live sync update failed:", error);

    useTransferStore.setState((currentState) => ({
      liveSync: {
        ...currentState.liveSync,
        status: "error",
        error: "Live connection update failed.",
      },
    }));
  });
});