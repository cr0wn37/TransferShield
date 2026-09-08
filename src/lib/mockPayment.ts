export interface MockPaymentRequest {
  amount: number;
  challanId: string;
  registrationNumber: string;
}

export interface MockPaymentResult {
  success: boolean;
  transactionId: string;
  amount: number;
  paidAt: string;
  challanId: string;
}

export const processMockPayment = async (
  request: MockPaymentRequest,
): Promise<MockPaymentResult> => {
  // Simulate payment gateway processing.
  await new Promise((resolve) =>
    setTimeout(resolve, 1800),
  );

  const transactionId = `TS-PAY-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  return {
    success: true,
    transactionId,
    amount: request.amount,
    paidAt: new Date().toISOString(),
    challanId: request.challanId,
  };
};