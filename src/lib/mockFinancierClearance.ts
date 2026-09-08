export interface FinancierClearanceRequest {
  financierName: string;
  loanReference: string;
  registrationNumber: string;
}

export interface FinancierClearanceResult {
  success: boolean;
  clearanceId: string;
  financierName: string;
  loanReference: string;
  submittedAt: string;
}

export const submitMockFinancierClearance = async (
  request: FinancierClearanceRequest,
): Promise<FinancierClearanceResult> => {
  // Simulate communication with the financier.
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const clearanceId = `TS-NOC-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  return {
    success: true,
    clearanceId,
    financierName: request.financierName,
    loanReference: request.loanReference,
    submittedAt: new Date().toISOString(),
  };
};