import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  IndianRupee,
  ShieldCheck,
  X,
} from "lucide-react";


interface MockPaymentDialogProps {
  amount: number;
  vehicleRegistrationNumber: string;
  onClose: () => void;
  onPaymentComplete: () => void;
}

export function MockPaymentDialog({
  amount,
  vehicleRegistrationNumber,
  onClose,
  onPaymentComplete,
}: MockPaymentDialogProps) {
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center sm:justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-dialog-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        {!isPaymentSuccessful ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-700">
                  Mock payment
                </p>
                <h2
                  id="payment-dialog-title"
                  className="mt-1 text-xl font-bold text-slate-950"
                >
                  Pay transfer fee
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This is a demo-only payment. No money will be charged.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close payment dialog"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 rounded-xl bg-slate-950 p-5 text-white">
              <p className="text-sm text-slate-300">Transfer fee</p>
              <p className="mt-1 flex items-center gap-1 text-3xl font-bold">
                <IndianRupee aria-hidden="true" className="h-6 w-6" />
                {amount.toLocaleString("en-IN")}
              </p>

              <div className="mt-5 border-t border-white/15 pt-4 text-sm">
                <p className="text-slate-300">Vehicle</p>
                <p className="mt-1 font-semibold">{vehicleRegistrationNumber}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-900">
              <ShieldCheck
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-blue-700"
              />
              The buyer pays once before completing buyer documents and e-sign.
            </div>

            <button
              type="button"
              onClick={() => setIsPaymentSuccessful(true)}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <CreditCard aria-hidden="true" className="h-4 w-4" />
              Pay ₹{amount.toLocaleString("en-IN")}
            </button>
          </>
        ) : (
          <div className="py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 aria-hidden="true" className="h-7 w-7" />
            </div>

            <p className="mt-5 text-sm font-semibold text-emerald-700">
              Mock payment successful
            </p>
            <h2
              id="payment-dialog-title"
              className="mt-1 text-2xl font-bold text-slate-950"
            >
              ₹{amount.toLocaleString("en-IN")} paid
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">
              The buyer can now upload required documents and complete the mock
              Aadhaar OTP e-sign.
            </p>

            <button
              type="button"
              onClick={onPaymentComplete}
              className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Continue to buyer documents
            </button>
          </div>
        )}
      </section>
    </div>
  );
}