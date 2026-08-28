export type TransferRouteType =
  | "same-rto"
  | "same-state-different-rto"
  | "interstate";

export type ReadinessStatus = "ready" | "action_required" | "blocked";

export interface TransferReadinessInput {
  registrationNumber: string;
  buyerPincode: string;
  sellerRto: string;
  buyerRto: string;
  insuranceValidUpto: string;
  puccValidUpto: string;
  hypothecation: boolean;
}

export interface TransferReadinessResult {
  routeType: TransferRouteType;
  sellerRto: string;
  buyerRto: string;
  additionalRequirements: string[];
  blockers: string[];
  warnings: string[];
  readinessStatus: ReadinessStatus;
}

const MOCK_PIN_RTO_MAP: Record<
  string,
  { rto: string; state: string }
> = {
  "400001": { rto: "MH-01", state: "Maharashtra" },
  "411001": { rto: "MH-12", state: "Maharashtra" },
  "560001": { rto: "KA-01", state: "Karnataka" },
};

export function getBuyerRtoFromPincode(
  pincode: string,
): { rto: string; state: string } {
  return (
    MOCK_PIN_RTO_MAP[pincode] ?? {
      rto: "MH-01",
      state: "Maharashtra",
    }
  );
}

export function checkTransferReadiness(
  input: TransferReadinessInput,
): TransferReadinessResult {
  const additionalRequirements: string[] = [];
  const blockers: string[] = [];
  const warnings: string[] = [];

  

  let routeType: TransferRouteType;

  if (input.sellerRto === input.buyerRto) {
    routeType = "same-rto";
  } else if (
    input.registrationNumber.toUpperCase().startsWith("MH")
  ) {
    routeType = "same-state-different-rto";
    additionalRequirements.push("Clearance-related requirement");
  } else {
    routeType = "interstate";
    additionalRequirements.push("Interstate NOC-related requirement");
  }

  if (input.hypothecation) {
    blockers.push(
      "Active hypothecation record may need to be resolved before transfer.",
    );
  }

  if (!input.insuranceValidUpto) {
    warnings.push("Valid insurance details are required.");
  }

  if (!input.puccValidUpto) {
    warnings.push("Valid PUCC details are required.");
  }

  const readinessStatus =
    blockers.length > 0
      ? "blocked"
      : warnings.length > 0 || additionalRequirements.length > 0
        ? "action_required"
        : "ready";

  return {
    routeType,
    sellerRto: input.sellerRto,
    buyerRto: input.buyerRto,
    additionalRequirements,
    blockers,
    warnings,
    readinessStatus,
  };
}