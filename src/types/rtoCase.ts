import type { TransferStatus } from "./transfer";

export type RtoQueueStatus =
  | "READY_FOR_REVIEW"
  | "UNDER_REVIEW"
  | "CORRECTION_REQUIRED"
  | "RESUBMITTED"
  | "OVERDUE"
  | "APPROVED";

export interface RtoQueueCase {
  id: string;
  vehicleNumber: string;
  sellerName: string;
  buyerName: string;
  submittedAt: string;
  status: RtoQueueStatus;
  transferStatus: TransferStatus;
  priority: "normal" | "high";
  isDemo: boolean;
}