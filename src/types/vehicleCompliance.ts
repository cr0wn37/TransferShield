export type ComplianceStatus = "clear" | "blocked";

export type ComplianceIssueType =
  | "pending_challan"
  | "active_hypothecation";

export type ComplianceIssueStatus = "open" | "resolved";

export interface PendingChallan {
  id: string;
  amount: number;
  description: string;
  issuedOn: string;
  status: "pending";
}

export interface HypothecationDetails {
  financierName: string;
  loanReference: string;
  status: "active";
}

export interface ComplianceIssue {
  id: string;
  type: ComplianceIssueType;
  title: string;
  summary: string;
  responsibleParty: "seller";
  status: ComplianceIssueStatus;
  challan?: PendingChallan;
  hypothecation?: HypothecationDetails;
}

export interface VehicleCompliance {
  vehicleRegistrationNumber: string;
  checkedAt: string;
  status: ComplianceStatus;
  issues: ComplianceIssue[];
}