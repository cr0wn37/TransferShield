import type {
  ComplianceIssue,
  VehicleCompliance,
} from "../types/vehicleCompliance";

export type ComplianceScenario =
  | "clear"
  | "challan"
  | "hypothecation"
  | "both"
  | "resolved";

export interface VehicleComplianceAdapter {
  checkVehicle(
    registrationNumber: string,
    scenario: ComplianceScenario,
  ): Promise<VehicleCompliance>;
}

/**
 * Mock government-data adapter.
 *
 * In the prototype this simulates the data that would be
 * returned by authorized VAHAN / e-Challan integrations.
 *
 * The compliance engine does not depend on how this data
 * was obtained.
 */
class MockVehicleComplianceAdapter
  implements VehicleComplianceAdapter
{
  async checkVehicle(
    registrationNumber: string,
    scenario: ComplianceScenario,
  ): Promise<VehicleCompliance> {
    // Simulate network/API latency.
    await new Promise((resolve) => setTimeout(resolve, 700));

    const issues: ComplianceIssue[] = [];

    if (scenario === "challan" || scenario === "both") {
      issues.push({
        id: "challan-001",
        type: "pending_challan",
        title: "Pending e-Challan",
        summary:
          "An outstanding traffic challan was found against this vehicle.",
        responsibleParty: "seller",
        status: "open",
        challan: {
          id: "MH-CH-2026-001245",
          amount: 2000,
          description: "Traffic violation",
          issuedOn: "2026-08-14",
          status: "pending",
        },
      });
    }

    if (scenario === "hypothecation" || scenario === "both") {
      issues.push({
        id: "hypothecation-001",
        type: "active_hypothecation",
        title: "Active hypothecation",
        summary:
          "The vehicle currently has an active financier record attached to it.",
        responsibleParty: "seller",
        status: "open",
        hypothecation: {
          financierName: "HDFC Bank",
          loanReference: "HDFC-AUTO-48291",
          status: "active",
        },
      });
    }

    return {
      vehicleRegistrationNumber: registrationNumber,
      checkedAt: new Date().toISOString(),
      status: issues.length > 0 ? "blocked" : "clear",
      issues,
    };
  }
}

/**
 * Single adapter instance used by TransferShield.
 *
 * If the government integration changes later,
 * this is the only layer that needs to change.
 */
const complianceAdapter: VehicleComplianceAdapter =
  new MockVehicleComplianceAdapter();

export const checkVehicleCompliance = (
  registrationNumber: string,
  scenario: ComplianceScenario,
) => {
  return complianceAdapter.checkVehicle(
    registrationNumber,
    scenario,
  );
};