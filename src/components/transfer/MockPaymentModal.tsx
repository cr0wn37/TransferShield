import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  processMockPayment,
  type MockPaymentResult,
} from "../../lib/mockPayment";

interface MockPaymentModalProps {
  isOpen: boolean;
  amount: number;
  challanId: string;
  registrationNumber: string;
  onSuccess: (result: MockPaymentResult) => void;
  onClose: () => void;
}

type PaymentMethod = "upi" | "card" | "netbanking";

export default function MockPaymentModal({
  isOpen,
  amount,
  challanId,
  registrationNumber,
  onSuccess,
  onClose,
}: MockPaymentModalProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("upi");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [paymentResult, setPaymentResult] =
    useState<MockPaymentResult | null>(null);

  if (!isOpen) {
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      const result = await processMockPayment({
        amount,
        challanId,
        registrationNumber,
      });

      setPaymentResult(result);
      onSuccess(result);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) {
      return;
    }

    setPaymentResult(null);
    setPaymentMethod("upi");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ShieldCheck className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-950">
                TransferShield Payments
              </p>

              <p className="text-xs text-slate-500">
                e-Challan payment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close payment"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success */}
        {paymentResult ? (
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-950">
                Payment successful
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your e-Challan payment has been recorded.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Amount paid
                </span>

                <span className="text-sm font-bold text-slate-950">
                  ₹
                  {paymentResult.amount.toLocaleString(
                    "en-IN",
                  )}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Challan
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {paymentResult.challanId}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Transaction ID
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {paymentResult.transactionId}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
              <p className="text-xs leading-5 text-blue-800">
                Payment recorded. Return to the compliance
                check and re-check the vehicle status.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Return to compliance
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Demo payment · No real money is charged
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Vehicle */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-950">
                {registrationNumber}
              </p>
            </div>

            {/* Challan */}
            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Challan
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {challanId}
              </p>
            </div>

            {/* Amount */}
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">
                Amount due
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-950">
                ₹{amount.toLocaleString("en-IN")}
              </p>
            </div>

            {/* Payment method */}
            <div className="mt-5">
              <p className="text-sm font-semibold text-slate-900">
                Payment method
              </p>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {(
                  [
                    ["upi", "UPI"],
                    ["card", "Card"],
                    ["netbanking", "Net Banking"],
                  ] as const
                ).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setPaymentMethod(value)
                    }
                    className={`rounded-lg border px-2 py-2.5 text-xs font-semibold transition ${
                      paymentMethod === value
                        ? "border-slate-900 bg-slate-950 text-white"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pay */}
            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing payment...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Pay ₹{amount.toLocaleString("en-IN")}
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Demo payment · No real money will be charged
            </p>
          </div>
        )}
      </div>
    </div>
  );
}