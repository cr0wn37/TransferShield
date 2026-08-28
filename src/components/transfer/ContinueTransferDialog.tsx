import { useState } from "react";
import { ArrowRight, ShieldCheck, X } from "lucide-react";

import { useTransferStore } from "../../state/transferStore";

type Role = "seller" | "buyer";

interface ContinueTransferDialogProps {
  onClose: () => void;
  onVerified: () => void;
}

export function ContinueTransferDialog({
  onClose,
  onVerified,
}: ContinueTransferDialogProps) {
  const transfer = useTransferStore((state) => state.transfer);

  const [transferId, setTransferId] = useState("");
  const [role, setRole] = useState<Role>("seller");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const registeredMobile =
  role === "seller" ? "9842144210" : "9978677284";
  const handleRequestOtp = () => {
    setError("");

    if (!transferId.trim()) {
      setError("Enter your Transfer ID.");
      return;
    }

    if (
      transferId.trim().toUpperCase() !== transfer.id.toUpperCase()
    ) {
      setError("We could not find a transfer with that Transfer ID.");
      return;
    }


    setOtpSent(true);
    setOtp("");
  };

  const handleVerify = () => {
    setError("");

    if (otp !== "123456") {
      setError("Incorrect OTP. For this demo, use 123456.");
      return;
    }

    onVerified();
  };

  const handleRoleChange = (nextRole: Role) => {
    setRole(nextRole);
    setOtpSent(false);
    setOtp("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-4 sm:items-center sm:justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="continue-transfer-title"
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              TransferShield
            </p>

            <h2
              id="continue-transfer-title"
              className="mt-1 text-xl font-bold text-slate-950"
            >
              Continue existing transfer
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Verify your transfer and mobile number to continue safely.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">
            Transfer ID
            <input
              value={transferId}
              onChange={(event) => setTransferId(event.target.value)}
              placeholder="e.g. TS-2026-482193"
              className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <div>
            <p className="text-sm font-semibold text-slate-700">
              Continue as
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["seller", "buyer"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRoleChange(option)}
                  className={`min-h-11 rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${
                    role === option
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Registered mobile number
            <input
              value={registeredMobile}
              readOnly
              className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600 outline-none"
            />
          </label>

          <div className="rounded-xl bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  OTP destination
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  OTP will be sent to the mobile number registered for the{" "}
                  {role}.
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  Registered number: {registeredMobile}
                </p>
              </div>
            </div>
          </div>

          {otpSent ? (
            <label className="block text-sm font-semibold text-slate-700">
              Enter OTP
              <input
                value={otp}
                onChange={(event) =>
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                }
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-center text-base tracking-[0.3em] text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs font-medium text-slate-500">
                Demo OTP: 123456
              </p>
            </label>
          ) : null}

          {error ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
              {error}
            </p>
          ) : null}

          <button
            type="button"
            onClick={otpSent ? handleVerify : handleRequestOtp}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            {otpSent ? "Verify & continue" : "Request OTP"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Demo credentials
            </p>

            <div className="mt-2 space-y-1 text-sm text-blue-900">
              <p>
                <span className="font-semibold">Transfer ID:</span> {transfer.id}
              </p>
              <p>
                <span className="font-semibold">Demo OTP:</span> 123456
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}