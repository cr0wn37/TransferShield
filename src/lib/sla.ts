import type {
  PartyRole,
  Transfer,
  TransferStatus,
} from "../types/transfer";

import { getActionRequired } from "../utils/workflow";

export type SlaOwner =
  | "buyer"
  | "seller"
  | "rto"
  | "shared"
  | "system";

export interface SlaStage {
  status: TransferStatus;
  label: string;
  owner: SlaOwner;
  expectedHours: number;
}

export interface SlaAttribution {
  owner: SlaOwner;
  milliseconds: number;
}

export interface SlaSummary {
  totalElapsedMs: number;

  buyerMs: number;
  sellerMs: number;
  rtoMs: number;
  sharedMs: number;
  systemMs: number;

  currentStage: SlaStage;
  currentStageElapsedMs: number;
  currentStageBreached: boolean;
  currentStageRemainingMs: number;
  currentStageOverdueMs: number;

  currentOwner: SlaOwner;
currentActionTitle: string | null;

  attributed: SlaAttribution[];
}

const SLA_STAGES: Partial<
  Record<TransferStatus, SlaStage>
> = {
  INITIATED: {
    status: "INITIATED",
    label: "Waiting for seller",
    owner: "seller",
    expectedHours: 24,
  },

  BUYER_INVITED: {
    status: "BUYER_INVITED",
    label: "Waiting on buyer to join",
    owner: "buyer",
    expectedHours: 24,
  },

  BUYER_JOINED: {
    status: "BUYER_JOINED",
    label: "Waiting on seller to confirm",
    owner: "seller",
    expectedHours: 0.0167,
  },

  DETAILS_COMPLETED: {
    status: "DETAILS_COMPLETED",
    label: "Details completed",
    owner: "shared",
    expectedHours: 24,
  },

  DOCUMENTS_PENDING: {
    status: "DOCUMENTS_PENDING",
    label: "Documents being completed",
    owner: "shared",
    expectedHours: 48,
  },

  DOCUMENTS_VERIFIED: {
    status: "DOCUMENTS_VERIFIED",
    label: "Documents verified",
    owner: "shared",
    expectedHours: 12,
  },

  PAYMENT_PENDING: {
    status: "PAYMENT_PENDING",
    label: "Waiting on buyer payment",
    owner: "buyer",
    expectedHours: 24,
  },

  BUYER_ESIGN_PENDING: {
    status: "BUYER_ESIGN_PENDING",
    label: "Waiting on buyer e-sign",
    owner: "buyer",
    expectedHours: 24,
  },

  SELLER_ESIGN_PENDING: {
    status: "SELLER_ESIGN_PENDING",
    label: "Waiting on seller e-sign",
    owner: "seller",
    expectedHours: 24,
  },

  FINAL_REVIEW_PENDING: {
    status: "FINAL_REVIEW_PENDING",
    label: "Waiting for final review",
    owner: "shared",
    expectedHours: 12,
  },

  READY_FOR_RTO: {
    status: "READY_FOR_RTO",
    label: "Waiting for RTO processing",
    owner: "rto",
    expectedHours: 48,
  },

  RTO_PROCESSING: {
    status: "RTO_PROCESSING",
    label: "RTO processing",
    owner: "rto",
    expectedHours: 48,
  },

  ACTION_REQUIRED: {
    status: "ACTION_REQUIRED",
    label: "Waiting for correction",
    owner: "shared",
    expectedHours: 24,
  },

  RESUBMISSION: {
    status: "RESUBMISSION",
    label: "Waiting for RTO review",
    owner: "rto",
    expectedHours: 48,
  },

  RTO_APPROVED: {
    status: "RTO_APPROVED",
    label: "RTO approved",
    owner: "rto",
    expectedHours: 24,
  },

  TRANSFER_COMPLETED: {
    status: "TRANSFER_COMPLETED",
    label: "Transfer completed",
    owner: "system",
    expectedHours: 0,
  },
};

function getCurrentStage(
  transfer: Transfer,
): SlaStage {
  const configured =
    SLA_STAGES[transfer.status];

  if (configured) {
    if (
      transfer.status ===
      "ACTION_REQUIRED"
    ) {
      const responsible =
        transfer.rto.responsibleParty;

      if (
        responsible === "buyer" ||
        responsible === "seller"
      ) {
        return {
          ...configured,
          label:
            `Waiting on ${
              responsible === "buyer"
                ? "buyer"
                : "seller"
            }`,
          owner:
            responsible,
        };
      }
    }

    return configured;
  }

  return {
    status: transfer.status,
    label: "Transfer in progress",
    owner: "shared",
    expectedHours: 24,
  };
}

function getAttributionOwner(
  transfer: Transfer,
): SlaOwner {
  const stage =
    getCurrentStage(transfer);

  return stage.owner;
}

function getStageStart(
  transfer: Transfer,
): string {
  const lastEvent =
    transfer.timeline[
      transfer.timeline.length - 1
    ];

  return (
    lastEvent?.timestamp ??
    transfer.createdAt
  );
}

function addDuration(
  totals: Record<SlaOwner, number>,
  owner: SlaOwner,
  milliseconds: number,
) {
  totals[owner] += Math.max(
    0,
    milliseconds,
  );
}

export function calculateSlaSummary(
  transfer: Transfer,
): SlaSummary {
  const now =
    Date.now();

  const events = [
    ...transfer.timeline,
  ].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() -
      new Date(b.timestamp).getTime(),
  );

  const totals: Record<
    SlaOwner,
    number
  > = {
    buyer: 0,
    seller: 0,
    rto: 0,
    shared: 0,
    system: 0,
  };

  for (
    let index = 0;
    index < events.length;
    index++
  ) {
    const current =
      events[index];

    const start =
      new Date(
        current.timestamp,
      ).getTime();

    const end =
      index <
      events.length - 1
        ? new Date(
            events[index + 1]
              .timestamp,
          ).getTime()
        : now;

    const duration =
      end - start;

    /*
     * The actor associated with the milestone
     * is treated as the party responsible for the
     * time spent before the next milestone.
     */
    const owner =
      current.actor === "buyer"
        ? "buyer"
        : current.actor === "seller"
          ? "seller"
          : current.actor === "rto"
            ? "rto"
            : current.actor === "shared"
              ? "shared"
              : "system";

    addDuration(
      totals,
      owner,
      duration,
    );
  }

  /*
   * If there are no useful events,
   * fall back to creation time.
   */
  if (events.length === 0) {
    const elapsed =
      now -
      new Date(
        transfer.createdAt,
      ).getTime();

    addDuration(
      totals,
      getAttributionOwner(
        transfer,
      ),
      elapsed,
    );
  }

  const totalElapsedMs =
    totals.buyer +
    totals.seller +
    totals.rto +
    totals.shared +
    totals.system;

  const currentStage =
    getCurrentStage(
      transfer,
    );

    const actionRequired =
  getActionRequired(transfer);

  const currentOwner: SlaOwner =
  actionRequired?.role === "buyer"
    ? "buyer"
    : actionRequired?.role === "seller"
      ? "seller"
      : actionRequired?.role === "rto"
        ? "rto"
        : actionRequired?.role === "shared"
          ? "shared"
          : currentStage.owner;

  const stageStart =
    getStageStart(
      transfer,
    );

  const currentStageElapsedMs =
    Math.max(
      0,
      now -
        new Date(
          stageStart,
        ).getTime(),
    );

  const expectedMs =
    currentStage.expectedHours *
    60 *
    60 *
    1000;

  const currentStageBreached =
    currentStage.expectedHours >
      0 &&
    currentStageElapsedMs >
      expectedMs;

  const currentStageOverdueMs =
  Math.max(
    0,
    currentStageElapsedMs -
      expectedMs,
  );

  

  return {
    totalElapsedMs,

    buyerMs:
      totals.buyer,

    sellerMs:
      totals.seller,

    rtoMs:
      totals.rto,

    sharedMs:
      totals.shared,

    systemMs:
      totals.system,

    currentStage,

    currentOwner,
currentActionTitle:
  actionRequired?.title ?? null,

    

    currentStageElapsedMs,

    currentStageBreached,

    currentStageOverdueMs,

    currentStageRemainingMs:
      Math.max(
        0,
        expectedMs -
          currentStageElapsedMs,
      ),

    attributed: [
      {
        owner: "buyer",
        milliseconds:
          totals.buyer,
      },
      {
        owner: "seller",
        milliseconds:
          totals.seller,
      },
      {
        owner: "rto",
        milliseconds:
          totals.rto,
      },
      {
        owner: "shared",
        milliseconds:
          totals.shared,
      },
      {
        owner: "system",
        milliseconds:
          totals.system,
      },
    ],
  };
}

export function formatDuration(
  milliseconds: number,
): string {
  const totalMinutes =
    Math.floor(
      Math.max(
        0,
        milliseconds,
      ) /
        (1000 * 60),
    );

  const days =
    Math.floor(
      totalMinutes /
        (60 * 24),
    );

  const hours =
    Math.floor(
      (totalMinutes %
        (60 * 24)) /
        60,
    );

  const minutes =
    totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function ownerLabel(
  owner: SlaOwner,
): string {
  switch (owner) {
    case "buyer":
      return "Buyer";

    case "seller":
      return "Seller";

    case "rto":
      return "RTO";

    case "shared":
      return "Both parties";

    case "system":
      return "TransferShield";
  }
}