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
  <div className="fixed inset-0 z-50 flex items-end bg-[#24201d]/45 p-3 sm:items-center sm:justify-center sm:p-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="continue-transfer-title"
      className="w-full max-w-md border border-[#d9d0c7] bg-[#fffdf9] shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              TransferShield
            </p>

            <h2
              id="continue-transfer-title"
              className="mt-1 text-lg font-bold tracking-tight text-[#24201d]"
            >
              Continue existing transfer
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#6b635d]">
              Verify your transfer and mobile number to continue safely.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] text-[#8a7d72] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
          >
            <X
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 sm:px-6">
        <div className="space-y-4">
          {/* Transfer ID */}
          <label className="block text-xs font-semibold text-[#24201d]">
            Transfer ID

            <input
              value={transferId}
              onChange={(event) => setTransferId(event.target.value)}
              placeholder="e.g. TS-2026-482193"
              className="mt-1.5 min-h-11 w-full border border-[#d9d0c7] bg-white px-3 text-sm text-[#24201d] outline-none transition placeholder:text-[#aaa098] focus:border-[#24201d]"
            />
          </label>

          {/* Role */}
          <div>
            <p className="text-xs font-semibold text-[#24201d]">
              Continue as
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["seller", "buyer"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRoleChange(option)}
                  className={[
                    "min-h-11 border px-4 py-2.5 text-sm font-semibold capitalize transition",
                    role === option
                      ? "border-[#24201d] bg-[#f8f3ee] text-[#24201d]"
                      : "border-[#d9d0c7] bg-[#fffdf9] text-[#6b635d] hover:bg-[#f8f3ee] hover:text-[#24201d]",
                  ].join(" ")}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Registered mobile */}
          <label className="block text-xs font-semibold text-[#24201d]">
            Registered mobile number

            <input
              value={registeredMobile}
              readOnly
              className="mt-1.5 min-h-11 w-full border border-[#d9d0c7] bg-[#f8f3ee] px-3 text-sm text-[#6b635d] outline-none"
            />
          </label>

          {/* OTP destination */}
          <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#fffdf9] text-[#b56f52]">
                <ShieldCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#24201d]">
                  OTP destination
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                  OTP will be sent to the mobile number registered for the{" "}
                  <span className="font-semibold text-[#24201d]">
                    {role}
                  </span>
                  .
                </p>

                <p className="mt-1 text-[11px] font-medium text-[#8a7d72]">
                  Registered number: {registeredMobile}
                </p>
              </div>
            </div>
          </div>

          {/* OTP */}
          {otpSent ? (
            <label className="block text-xs font-semibold text-[#24201d]">
              Enter OTP

              <input
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6),
                  )
                }
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="mt-1.5 min-h-11 w-full border border-[#d9d0c7] bg-white px-3 text-center text-base tracking-[0.3em] text-[#24201d] outline-none transition placeholder:text-[#b8aea6] focus:border-[#24201d]"
              />

              <p className="mt-2 text-[11px] font-medium text-[#8a7d72]">
                Demo OTP: 123456
              </p>
            </label>
          ) : null}

          {/* Error */}
          {error ? (
            <div className="border-l-2 border-[#c96262] bg-[#fbefef] px-3 py-3">
              <p className="text-xs font-medium leading-5 text-[#9a4f4f]">
                {error}
              </p>
            </div>
          ) : null}

          {/* Primary action */}
          <button
            type="button"
            onClick={otpSent ? handleVerify : handleRequestOtp}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
          >
            {otpSent ? "Verify & continue" : "Request OTP"}

            <ArrowRight
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>

          {/* Demo credentials */}
          <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#b56f52]">
              Demo credentials
            </p>

            <div className="mt-2 space-y-1 text-xs text-[#6b635d]">
              <p>
                <span className="font-semibold text-[#24201d]">
                  Transfer ID:
                </span>{" "}
                {transfer.id}
              </p>

              <p>
                <span className="font-semibold text-[#24201d]">
                  Demo OTP:
                </span>{" "}
                123456
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
);}