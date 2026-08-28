export type TransferStatus =
  | "INITIATED"
  | "BUYER_INVITED"
  | "BUYER_JOINED"
  | "DETAILS_COMPLETED"
  | "DOCUMENTS_PENDING"
  | "DOCUMENTS_VERIFIED"
  | "PAYMENT_PENDING"
  | "BUYER_ESIGN_PENDING"
  | "SELLER_ESIGN_PENDING"
  | "READY_FOR_RTO"
  | "RTO_PROCESSING"
  | "ACTION_REQUIRED"
  | "RESUBMISSION"
  | "RTO_APPROVED"
  | "TRANSFER_COMPLETED"
  | "FINAL_REVIEW_PENDING";

export type PartyRole = "seller" | "buyer" | "rto" | "shared";

export type TaskStatus = "locked" | "pending" | "completed" | "blocked";

export type DocumentStatus =
  | "missing"
  | "pending_review"
  | "valid"
  | "invalid"
  | "needs_reupload";

export type PaymentStatus = "not_started" | "pending" | "completed";

export type ESignStatus = "not_started" | "otp_sent" | "completed";

export type InviteStatus = "not_sent" | "sent" | "joined";

export type RtoStatus =
  | "not_ready"
  | "processing"
  | "action_required"
  | "approved"
  | "rejected";

export type RejectionReasonCode =
  | "DOCUMENT_UNCLEAR"
  | "DOCUMENT_MISMATCH"
  | "ADDRESS_MISMATCH"
  | "FORM_INCOMPLETE"
  | "VEHICLE_DETAILS_MISMATCH"
  | "OTHER";

export interface Vehicle {
  registrationNumber: string;
  chassisLast5: string;
  insuranceValidUpto: string;
  puccValidUpto: string;
}

export interface Party {
  name: string;
  phoneMasked: string;
  address?: string;
  joinedAt?: string;
  detailsConfirmedAt?: string;
}

export interface TransferInvite {
  code: string;
  link: string;
  status: InviteStatus;
  sentAt?: string;
  joinedAt?: string;
}

export interface TransferTask {
  id: string;
  title: string;
  description: string;
  owner: PartyRole;
  status: TaskStatus;
  prerequisiteTaskIds: string[];
  actionLabel?: string;
  completedAt?: string;
  blockedReason?: string;
}

export interface TransferDocument {
  id: string;
  label: string;
  description: string;
  owner: Extract<PartyRole, "seller" | "buyer">;
  requiredAt: "BUYER_ESIGN_PENDING" | "SELLER_ESIGN_PENDING";
  alsoRequiredAt?: "BUYER_ESIGN_PENDING" | "SELLER_ESIGN_PENDING";
  signers?: Extract<PartyRole, "seller" | "buyer">[];
  status: DocumentStatus;
  fileName?: string;
  uploadedAt?: string;
  validatedAt?: string;
  issueMessage?: string;
}

export interface RtoReview {
  status: RtoStatus;
  assignedOfficerName?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reasonCode?: RejectionReasonCode;
  message?: string;
  responsibleParty?: PartyRole;
  requiredAction?: string;
  requestedDocumentId?: string;
}

export interface Payment {
  status: PaymentStatus;
  amount: number;
  currency: "INR";
  transactionId?: string;
  paidAt?: string;
}

export interface ESign {
  buyer: ESignStatus;
  seller: ESignStatus;
  buyerSignedAt?: string;
  sellerSignedAt?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  actor: PartyRole | "system";
  status?: "success" | "info" | "warning" | "error";
}

export interface Transfer {
  id: string;
  status: TransferStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;

  vehicle: Vehicle;
  seller: Party;
  buyer: Party;

  invite: TransferInvite;
  tasks: TransferTask[];
  documents: TransferDocument[];
  payment: Payment;
  eSign: ESign;
  rto: RtoReview;
  timeline: TimelineEvent[];
}