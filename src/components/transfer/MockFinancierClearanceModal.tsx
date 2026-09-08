import { useState } from "react";
import {
  CheckCircle2,
  FileCheck2,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  submitMockFinancierClearance,
  type FinancierClearanceResult,
} from "../../lib/mockFinancierClearance";

interface MockFinancierClearanceModalProps {
  isOpen: boolean;
  financierName: string;
  loanReference: string;
  registrationNumber: string;
  onSuccess: (result: FinancierClearanceResult) => void;
  onClose: () => void;
}

export default function MockFinancierClearanceModal({
  isOpen,
  financierName,
  loanReference,
  registrationNumber,
  onSuccess,
  onClose,
}: MockFinancierClearanceModalProps) {
  const [isProcessing, setIsProcessing] =
    useState(false);

  const [result, setResult] =
    useState<FinancierClearanceResult | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async () => {
    setIsProcessing(true);

    try {
      const clearance =
        await submitMockFinancierClearance({
          financierName,
          loanReference,
          registrationNumber,
        });

      setResult(clearance);
      onSuccess(clearance);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (isProcessing) {
      return;
    }

    setResult(null);
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
                Financier clearance
              </p>

              <p className="text-xs text-slate-500">
                Hypothecation termination
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isProcessing}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {result ? (
          /* Success */
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-950">
                Clearance submitted
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                The financier clearance request has been
                recorded.
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Financier
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {result.financierName}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Loan reference
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {result.loanReference}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Clearance ID
                </span>

                <span className="text-xs font-semibold text-slate-800">
                  {result.clearanceId}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5">
              <p className="text-xs leading-5 text-blue-800">
                Clearance recorded. Re-check the vehicle to
                verify that the hypothecation has been removed
                from the latest compliance record.
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
              Demo financier integration · No real request is
              submitted
            </p>
          </div>
        ) : (
          /* Submission */
          <div className="p-6">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

              <div>
                <p className="text-sm font-semibold text-amber-900">
                  Active hypothecation detected
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  A financier record is still attached to
                  this vehicle.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Vehicle
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {registrationNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Financier
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {financierName}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Loan reference
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-950">
                  {loanReference}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Before ownership transfer
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-600">
                Obtain the required loan closure/NOC and
                complete the applicable hypothecation
                termination process.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting clearance...
                </>
              ) : (
                <>
                  <FileCheck2 className="h-4 w-4" />
                  Submit financier clearance
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Demo financier integration · No real request is
              submitted
            </p>
          </div>
        )}
      </div>
    </div>
  );
}