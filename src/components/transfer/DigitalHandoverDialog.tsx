import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileCheck2,
  Fingerprint,
  KeyRound,
  MapPin,
  Gauge,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { generateHandoverCertificate } from "../../utils/generateHandoverCertificate";

interface DigitalHandoverDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: {
  odometerKm: number;
  handoverLocation: string;
  statutoryRefId: string;
}) => void;
  sellerName: string;
  buyerName: string;
  vehicleNumber: string;
}

type Step = "details" | "payment" | "confirmation" | "issued";

const HANDOVER_FEE = 149;

export const DigitalHandoverDialog: React.FC<
  DigitalHandoverDialogProps
> = ({
  isOpen,
  onClose,
  onComplete,
  sellerName,
  buyerName,
  vehicleNumber,
}) => {
  const handoverStorageKey = `transfershield-handover-${vehicleNumber}`;

const [step, setStep] = useState<
  "details" | "payment" | "confirmation" | "issued"
>(() => {
  const saved = sessionStorage.getItem(
    `${handoverStorageKey}-step`,
  );

  return saved === "payment" ||
    saved === "confirmation" ||
    saved === "issued"
    ? saved
    : "details";
});

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-step`,
    step,
  );
}, [handoverStorageKey, step]);

  const [odometerKm, setOdometerKm] = useState<string>(() => {
  return (
    sessionStorage.getItem(
      `${handoverStorageKey}-odometer`,
    ) ?? "42150"
  );
});

const [location, setLocation] = useState<string>(() => {
  return (
    sessionStorage.getItem(
      `${handoverStorageKey}-location`,
    ) ?? "Bandra West, Mumbai"
  );
});

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-odometer`,
    odometerKm,
  );
}, [handoverStorageKey, odometerKm]);

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-location`,
    location,
  );
}, [handoverStorageKey, location]);

  const [handoverConfirmed, setHandoverConfirmed] = useState<boolean>(
  () =>
    sessionStorage.getItem(
      `${handoverStorageKey}-handover-confirmed`,
    ) === "true",
);

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-handover-confirmed`,
    String(handoverConfirmed),
  );
}, [handoverStorageKey, handoverConfirmed]);

  const [paymentComplete, setPaymentComplete] =
    useState<boolean>(false);

  const [sellerConfirmed, setSellerConfirmed] = useState(() => {
  return (
    sessionStorage.getItem(
      `${handoverStorageKey}-seller-confirmed`,
    ) === "true"
  );
});

const [buyerConfirmed, setBuyerConfirmed] = useState(() => {
  return (
    sessionStorage.getItem(
      `${handoverStorageKey}-buyer-confirmed`,
    ) === "true"
  );
});

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-seller-confirmed`,
    String(sellerConfirmed),
  );
}, [handoverStorageKey, sellerConfirmed]);

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-buyer-confirmed`,
    String(buyerConfirmed),
  );
}, [handoverStorageKey, buyerConfirmed]);

  const [sellerOtpSent, setSellerOtpSent] = useState(() => {
  return (
    sessionStorage.getItem(
      `${handoverStorageKey}-seller-otp-sent`,
    ) === "true"
  );
});
  const [sellerOtp, setSellerOtp] = useState("");

  const [buyerOtpSent, setBuyerOtpSent] = useState(() => {
  return (
    sessionStorage.getItem(
      `${handoverStorageKey}-buyer-otp-sent`,
    ) === "true"
  );
});
  const [buyerOtp, setBuyerOtp] = useState("");

  useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-seller-otp-sent`,
    String(sellerOtpSent),
  );
}, [handoverStorageKey, sellerOtpSent]);

useEffect(() => {
  sessionStorage.setItem(
    `${handoverStorageKey}-buyer-otp-sent`,
    String(buyerOtpSent),
  );
}, [handoverStorageKey, buyerOtpSent]);

  const [otpError, setOtpError] = useState<string | null>(null);

  const [showMockPayment, setShowMockPayment] = useState(false);

  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [recordId, setRecordId] = useState<string>("");

  /**
   * Reset the mini-flow whenever the dialog is opened.
   * This prevents the previous completed state from appearing
   * when the user starts a new demo.
   */
  

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    []
  );

  const formattedDateTime = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    []
  );

  const validityDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30);

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }, []);

  const steps = [
    { id: "details", label: "Record Handover" },
    { id: "payment", label: "Review & Pay" },
    { id: "confirmation", label: "Confirm" },
    { id: "issued", label: "Issued" },
  ] as const;

  const currentStepIndex = steps.findIndex((item) => item.id === step);

  const handleDetailsContinue = () => {
    if (!handoverConfirmed) return;
    if (!odometerKm || Number(odometerKm) < 0) return;
    if (!location.trim()) return;

    setStep("payment");
  };

  const handlePayment = () => {
    setPaymentComplete(true);
    setStep("confirmation");
  };

  const handleSendPartyOtp = (role: "seller" | "buyer") => {
  setOtpError(null);

  if (role === "seller") {
    setSellerOtpSent(true);
    setSellerOtp("");
  } else {
    setBuyerOtpSent(true);
    setBuyerOtp("");
  }
};

const handleVerifyPartyOtp = (role: "seller" | "buyer") => {
  const otp = role === "seller" ? sellerOtp : buyerOtp;

  if (otp !== "123456") {
    setOtpError(
      `${role === "seller" ? "Seller" : "Buyer"} OTP is incorrect. Use 123456 for the demo.`,
    );
    return;
  }

  setOtpError(null);

  if (role === "seller") {
    setSellerConfirmed(true);
  } else {
    setBuyerConfirmed(true);
  }
};

  const handleIssueRecord = () => {
  if (!sellerConfirmed || !buyerConfirmed) return;

  setIsSigning(true);

  setTimeout(() => {
    const newRecordId = `TH-${new Date().getFullYear()}-${String(
      Date.now()
    ).slice(-6)}`;

    setRecordId(newRecordId);
    setIsSigning(false);
    setStep("issued");
  }, 1200);
};

 

const clearHandoverDraft = () => {
  sessionStorage.removeItem(
    `${handoverStorageKey}-step`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-seller-confirmed`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-buyer-confirmed`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-seller-otp-sent`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-buyer-otp-sent`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-handover-confirmed`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-odometer`,
  );

  sessionStorage.removeItem(
    `${handoverStorageKey}-location`,
  );
};

 const handleFinishHandover = () => {
  if (step === "issued" && recordId) {
    onComplete({
      odometerKm: Number(odometerKm),
      handoverLocation: location,
      statutoryRefId: recordId,
    });

    clearHandoverDraft();
  }

  onClose();
};

  const goBack = () => {
    if (step === "payment") {
      setStep("details");
      return;
    }

    if (step === "confirmation") {
      setStep("payment");
      return;
    }
  };

  if (!isOpen) return null;

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#24201d]/50 p-3 sm:p-5">
    <div className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden border border-[#d9d0c7] bg-[#fffdf9] shadow-2xl">
      {/* ========================================================= */}
      {/* HEADER */}
      {/* ========================================================= */}

      <div className="shrink-0 border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#b56f52]">
                <KeyRound aria-hidden="true" size={16} />
              </div>

              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                TransferShield handover
              </span>
            </div>

            <h2 className="mt-2 text-lg font-bold tracking-tight text-[#24201d]">
              Digital Handover Record
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#6b635d]">
              Record the physical vehicle handover before the RC transfer is
              completed.
            </p>
          </div>

          <button
            type="button"
            onClick={handleFinishHandover}
            disabled={isSigning}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] text-[#8a7d72] transition hover:bg-[#f8f3ee] hover:text-[#24201d] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        {/* Stepper */}
        <div className="mt-5 flex items-center">
          {steps.map((item, index) => {
            const isCurrent = index === currentStepIndex;
            const isComplete = index < currentStepIndex;

            return (
              <React.Fragment key={item.id}>
                <div className="flex min-w-0 items-center gap-2">
                  <div
                    className={[
                      "flex h-7 w-7 shrink-0 items-center justify-center border text-[10px] font-bold transition",
                      isComplete
                        ? "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]"
                        : isCurrent
                          ? "border-[#24201d] bg-[#24201d] text-white"
                          : "border-[#d9d0c7] bg-[#f8f3ee] text-[#aaa098]",
                    ].join(" ")}
                  >
                    {isComplete ? <Check size={13} /> : index + 1}
                  </div>

                  <span
                    className={[
                      "hidden text-[10px] font-semibold sm:block",
                      isCurrent
                        ? "text-[#24201d]"
                        : isComplete
                          ? "text-[#5d7c60]"
                          : "text-[#aaa098]",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </div>

                {index !== steps.length - 1 ? (
                  <div
                    className={[
                      "mx-2 h-px flex-1",
                      index < currentStepIndex
                        ? "bg-[#b7cbb9]"
                        : "bg-[#e5ddd5]",
                    ].join(" ")}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* CONTENT */}
      {/* ========================================================= */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* ======================================================= */}
        {/* STEP 1 — RECORD HANDOVER */}
        {/* ======================================================= */}

        {step === "details" && (
          <div className="space-y-5 px-5 py-5 sm:px-6">
            {/* Explanation */}
            <div className="border-l-2 border-[#e99b79] bg-[#f8f3ee] px-4 py-4">
              <div className="flex gap-3">
                <ShieldCheck
                  aria-hidden="true"
                  size={17}
                  className="mt-0.5 shrink-0 text-[#b56f52]"
                />

                <div>
                  <p className="text-xs font-bold text-[#24201d]">
                    Why create a Digital Handover Record?
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                    The vehicle may be physically handed over before the RC
                    transfer is completed. This record captures the handover
                    time, location, odometer reading and both parties'
                    acknowledgement in one transaction record.
                  </p>

                  <div className="mt-3 grid gap-1.5 text-[11px] text-[#6b635d] sm:grid-cols-2">
                    <p>✓ Records when physical possession changed</p>
                    <p>✓ Captures vehicle condition at handover</p>
                    <p>✓ Creates a shared record for buyer and seller</p>
                    <p>✓ Remains active for 30 days or until RC transfer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle summary */}
            <div className="grid border border-[#d9d0c7] bg-[#f8f3ee] sm:grid-cols-2">
              <div className="border-b border-[#e5ddd5] px-4 py-3 sm:border-b-0 sm:border-r">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Vehicle
                </p>

                <p className="mt-1 text-sm font-bold tracking-wide text-[#24201d]">
                  {vehicleNumber}
                </p>
              </div>

              <div className="px-4 py-3 sm:text-right">
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Physical transfer
                </p>

                <p className="mt-1 text-xs font-semibold text-[#24201d]">
                  {sellerName} → {buyerName}
                </p>
              </div>
            </div>

            {/* Handover details */}
            <div>
              <p className="text-sm font-bold text-[#24201d]">
                Record the handover
              </p>

              <p className="mt-1 text-xs leading-5 text-[#8a7d72]">
                Capture the key facts that both parties are acknowledging at
                the moment of physical delivery.
              </p>
            </div>

            {/* Evidence */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="border border-[#d9d0c7] bg-[#fffdf9] p-4">
                <div className="flex items-center gap-2">
                  <Gauge
                    aria-hidden="true"
                    size={16}
                    className="text-[#b56f52]"
                  />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
                      Odometer
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#24201d]">
                      Vehicle reading at handover
                    </p>
                  </div>
                </div>

                <div className="mt-3 relative">
                  <input
                    type="number"
                    min="0"
                    required
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(e.target.value)}
                    className="min-h-11 w-full border border-[#d9d0c7] bg-white px-3 py-2.5 pr-12 text-sm font-semibold text-[#24201d] outline-none transition focus:border-[#24201d]"
                    placeholder="42150"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8a7d72]">
                    km
                  </span>
                </div>
              </div>

              <div className="border border-[#d9d0c7] bg-[#fffdf9] p-4">
                <div className="flex items-center gap-2">
                  <MapPin
                    aria-hidden="true"
                    size={16}
                    className="text-[#b56f52]"
                  />

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
                      Handover location
                    </p>

                    <p className="mt-0.5 text-xs font-semibold text-[#24201d]">
                      Where possession changed
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="min-h-11 w-full border border-[#d9d0c7] bg-white px-3 py-2.5 text-sm font-medium text-[#24201d] outline-none transition focus:border-[#24201d]"
                    placeholder="Bandra West, Mumbai"
                  />
                </div>
              </div>
            </div>

            {/* Acknowledgement */}
            <div className="border border-[#e3cfaa] bg-[#fbf3e3] px-4 py-4">
              <div className="flex gap-3">
                <KeyRound
                  aria-hidden="true"
                  size={17}
                  className="mt-0.5 shrink-0 text-[#8c6427]"
                />

                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#24201d]">
                    Physical handover acknowledgement
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                    Both parties confirm that the vehicle has been inspected,
                    the keys have been exchanged, and physical possession is
                    now with <strong>{buyerName}</strong>.
                  </p>

                  <label className="mt-3 flex cursor-pointer items-start gap-3 border border-[#dfc997] bg-[#fffaf1] px-3 py-3">
                    <input
                      type="checkbox"
                      checked={handoverConfirmed}
                      onChange={(e) =>
                        setHandoverConfirmed(e.target.checked)
                      }
                      className="mt-0.5 h-4 w-4 accent-[#24201d]"
                    />

                    <span className="text-xs font-medium leading-5 text-[#6b635d]">
                      I confirm the physical vehicle handover details above are
                      accurate.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer */}
            <button
              type="button"
              onClick={handleDetailsContinue}
              disabled={
                !handoverConfirmed ||
                !odometerKm ||
                !location.trim()
              }
              className="flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9a8d82]"
            >
              Review handover record
              <ChevronRight aria-hidden="true" size={17} />
            </button>
          </div>
        )}

        {/* ======================================================= */}
        {/* STEP 2 — REVIEW & PAY */}
        {/* ======================================================= */}

        {step === "payment" && (
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b56f52]">
                Review before issuing
              </p>

              <h3 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Your Digital Handover Record
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#8a7d72]">
                Review the information that will be captured in the handover
                record.
              </p>
            </div>

            {/* Record preview */}
            <div className="border border-[#d9d0c7] bg-[#fffdf9]">
              <div className="border-b border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
                <div className="flex items-center gap-2">
                  <FileCheck2
                    aria-hidden="true"
                    className="text-[#b56f52]"
                    size={16}
                  />

                  <span className="text-xs font-bold text-[#24201d]">
                    Handover summary
                  </span>
                </div>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                <SummaryItem
                  label="Vehicle"
                  value={vehicleNumber}
                />

                <SummaryItem
                  label="Handover date"
                  value={formattedDate}
                />

                <SummaryItem
                  label="Odometer"
                  value={`${Number(odometerKm).toLocaleString("en-IN")} km`}
                />

                <SummaryItem
                  label="Location"
                  value={location}
                />

                <SummaryItem
                  label="Seller"
                  value={sellerName}
                />

                <SummaryItem
                  label="Buyer"
                  value={buyerName}
                />
              </div>
            </div>

            {/* Fee */}
            <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-4">
              <div className="flex items-start gap-3">
                <WalletCards
                  aria-hidden="true"
                  size={17}
                  className="mt-0.5 text-[#5d7c60]"
                />

                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#24201d]">
                    One-time record issuance
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#8a7d72]">
                    Prevents repeated issuance for the same handover.
                  </p>
                </div>

                <div className="ml-auto shrink-0 text-lg font-bold text-[#24201d]">
                  ₹{HANDOVER_FEE}
                </div>
              </div>

              <div className="mt-4 grid gap-2 border-t border-[#e5ddd5] pt-4 sm:grid-cols-2">
                <FeatureRow text="Timestamped handover record" />
                <FeatureRow text="Location & odometer evidence" />
                <FeatureRow text="Dual-party acknowledgement" />
                <FeatureRow text="30-day validity window" />
                <FeatureRow text="Downloadable completion record" />
              </div>
            </div>

            {/* Validity */}
            <div className="border-l-2 border-[#d9d0c7] bg-[#f8f3ee] px-3 py-3">
              <div className="flex items-start gap-3">
                <Clock3
                  aria-hidden="true"
                  size={17}
                  className="mt-0.5 shrink-0 text-[#b56f52]"
                />

                <div>
                  <p className="text-xs font-semibold text-[#24201d]">
                    Record validity
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                    The handover record remains active for{" "}
                    <strong>30 days</strong> or until the RC transfer is
                    completed, whichever occurs first.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={goBack}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold text-[#6b635d] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
              >
                <ChevronLeft aria-hidden="true" size={17} />
                Back
              </button>

              <button
                type="button"
                onClick={() => setShowMockPayment(true)}
                className="flex min-h-11 flex-[2] items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
              >
                Make payment ₹{HANDOVER_FEE}
                <ChevronRight aria-hidden="true" size={17} />
              </button>
            </div>

            <p className="text-center text-[10px] leading-5 text-[#aaa098]">
              Demo payment only — no real payment is processed in this
              prototype.
            </p>
          </div>
        )}

        {/* ======================================================= */}
        {/* STEP 3 — DUAL CONFIRMATION */}
        {/* ======================================================= */}

        {step === "confirmation" && (
          <div className="space-y-5 px-5 py-5 sm:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#b56f52]">
                Final confirmation
              </p>

              <h3 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Both parties digitally e-sign the handover
              </h3>

              <p className="mt-1 text-xs leading-5 text-[#8a7d72]">
                Each party confirms the same handover record before it is
                issued.
              </p>
            </div>

            {/* Parties */}
            <div className="grid gap-3 sm:grid-cols-2">
              <PartyConfirmationCard
                role="Seller"
                name={sellerName}
                confirmed={sellerConfirmed}
                onConfirm={() => setSellerConfirmed(true)}
                otpSent={sellerOtpSent}
                otp={sellerOtp}
                onSendOtp={() => handleSendPartyOtp("seller")}
                onVerifyOtp={() => handleVerifyPartyOtp("seller")}
                onOtpChange={setSellerOtp}
              />

              <PartyConfirmationCard
                role="Buyer"
                name={buyerName}
                confirmed={buyerConfirmed}
                onConfirm={() => setBuyerConfirmed(true)}
                otpSent={buyerOtpSent}
                otp={buyerOtp}
                onSendOtp={() => handleSendPartyOtp("buyer")}
                onVerifyOtp={() => handleVerifyPartyOtp("buyer")}
                onOtpChange={setBuyerOtp}
              />
            </div>

            {/* Preview */}
            <div className="border border-[#d9d0c7] bg-[#fffdf9]">
              <div className="border-b border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
                <div className="flex items-start gap-2">
                  <FileCheck2
                    aria-hidden="true"
                    className="mt-0.5 text-[#b56f52]"
                    size={16}
                  />

                  <div>
                    <p className="text-xs font-bold text-[#24201d]">
                      Record preview
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#8a7d72]">
                      This information will appear on the issued record.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                <PreviewRow
                  label="Vehicle"
                  value={vehicleNumber}
                />

                <PreviewRow
                  label="Handover date"
                  value={formattedDate}
                />

                <PreviewRow
                  label="Location"
                  value={location}
                />

                <PreviewRow
                  label="Odometer"
                  value={`${Number(odometerKm).toLocaleString("en-IN")} km`}
                />

                <PreviewRow
                  label="Physical possession"
                  value={buyerName}
                />

                <PreviewRow
                  label="Validity"
                  value={`Until ${validityDate}`}
                />
              </div>
            </div>

            {/* Trust message */}
            <div className="border-l-2 border-[#d9d0c7] bg-[#f8f3ee] px-3 py-3">
              <div className="flex items-start gap-3">
                <Fingerprint
                  aria-hidden="true"
                  size={18}
                  className="mt-0.5 shrink-0 text-[#8a7d72]"
                />

                <div>
                  <p className="text-xs font-semibold text-[#24201d]">
                    Both parties are signing the same handover record
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-[#8a7d72]">
                    Once both confirmations are complete, the handover record
                    is issued with the captured timestamp and transaction
                    details.
                  </p>
                </div>
              </div>
            </div>

            {otpError ? (
  <div className="border-l-2 border-[#c96262] bg-[#fbefef] px-3 py-3">
    <p className="text-xs font-medium leading-5 text-[#9a4f4f]">
      {otpError}
    </p>
  </div>
) : null}

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={goBack}
                disabled={isSigning}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold text-[#6b635d] transition hover:bg-[#f8f3ee] hover:text-[#24201d] disabled:opacity-50"
              >
                <ChevronLeft aria-hidden="true" size={17} />
                Back
              </button>

              <button
                type="button"
                onClick={handleIssueRecord}
                disabled={
                  !sellerConfirmed ||
                  !buyerConfirmed ||
                  isSigning
                }
                className="flex min-h-11 flex-[2] items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9a8d82]"
              >
                {isSigning ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Issuing record...
                  </>
                ) : (
                  <>
                    <ShieldCheck
                      aria-hidden="true"
                      size={17}
                    />
                    Issue Digital Handover Record
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* STEP 4 — ISSUED */}
        {/* ======================================================= */}

        {step === "issued" && (
          <div className="px-5 py-5 sm:px-6">
            {/* Success */}
            <div className="border border-[#cdddcf] bg-[#f4f8f4] px-5 py-6 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center border border-[#cdddcf] bg-[#fffdf9] text-[#5d7c60]">
                <CheckCircle2 aria-hidden="true" size={24} />
              </div>

              <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5d7c60]">
                Record issued
              </p>

              <h3 className="mt-1 text-xl font-bold tracking-tight text-[#24201d]">
                Digital Handover Record Issued
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#6b635d]">
                The physical handover between{" "}
                <strong>{sellerName}</strong> and{" "}
                <strong>{buyerName}</strong> has been recorded.
              </p>

              {/* Record ID */}
              <div className="mx-auto mt-4 inline-flex items-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-3 py-2">
                <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
                  Record ID
                </span>

                <span className="font-mono text-xs font-bold text-[#24201d]">
                  {recordId}
                </span>
              </div>
            </div>

            {/* Issued record */}
            <div className="mt-5 border border-[#d9d0c7] bg-[#fffdf9]">
              <div className="flex items-center justify-between gap-3 border-b border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
                <div>
                  <p className="text-xs font-bold text-[#24201d]">
                    Digital Handover Record
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#8a7d72]">
                    TransferShield transaction record
                  </p>
                </div>

                <span className="border border-[#cdddcf] bg-[#f4f8f4] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#5d7c60]">
                  Verified
                </span>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                <PreviewRow
                  label="Vehicle"
                  value={vehicleNumber}
                />

                <PreviewRow
                  label="Issued"
                  value={formattedDateTime}
                />

                <PreviewRow
                  label="Seller"
                  value={sellerName}
                />

                <PreviewRow
                  label="Buyer"
                  value={buyerName}
                />

                <PreviewRow
                  label="Location"
                  value={location}
                />

                <PreviewRow
                  label="Odometer"
                  value={`${Number(odometerKm).toLocaleString("en-IN")} km`}
                />

                <PreviewRow
                  label="Possession"
                  value="Transferred to buyer"
                />

                <PreviewRow
                  label="Valid until"
                  value={validityDate}
                />
              </div>
            </div>

            {/* Evidence */}
            <div className="mt-5 border border-[#d9d0c7] bg-[#fffdf9] p-4">
              <p className="text-xs font-bold text-[#24201d]">
                Recorded evidence
              </p>

              <div className="mt-3 grid gap-0 border border-[#e5ddd5] sm:grid-cols-2">
                <EvidenceRow text="Timestamp captured" />
                <EvidenceRow text="Handover location recorded" />
                <EvidenceRow text="Odometer recorded" />
                <EvidenceRow text="Seller acknowledgement" />
                <EvidenceRow text="Buyer acknowledgement" />
                <EvidenceRow text="30-day validity applied" />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  generateHandoverCertificate({
                    vehicleNumber,
                    sellerName,
                    buyerName,
                    odometerKm: Number(odometerKm),
                    handoverLocation: location,
                    statutoryRefId: recordId,
                    completedAt: formattedDateTime,
                    expiresAt: validityDate,
                  });
                }}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold text-[#6b635d] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
              >
                Download Certificate
              </button>

              <button
                type="button"
                onClick={handleFinishHandover}
                className="flex min-h-11 flex-[1.4] items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
              >
                Done
                <Check aria-hidden="true" size={17} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MOCK PAYMENT */}
      {/* ========================================================= */}

      {showMockPayment && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#24201d]/45 p-3 sm:p-5">
          <div className="w-full max-w-md border border-[#d9d0c7] bg-[#fffdf9] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#e5ddd5] px-5 py-4">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#b56f52]">
                  TransferShield checkout
                </p>

                <h3 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                  Mock payment gateway
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowMockPayment(false)}
                className="flex h-8 w-8 items-center justify-center border border-[#d9d0c7] text-[#8a7d72] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
              >
                <X aria-hidden="true" size={16} />
              </button>
            </div>

            <div className="px-5 py-5">
              <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#6b635d]">
                    Digital Handover Record
                  </span>

                  <span className="text-lg font-bold text-[#24201d]">
                    ₹149
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-[#e5ddd5] pt-3 text-[11px] text-[#8a7d72]">
                  <div className="flex justify-between gap-4">
                    <span>Record issuance</span>
                    <span>₹149</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span>Payment method</span>
                    <span>UPI •••• 4821</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowMockPayment(false);
                  handlePayment();
                }}
                className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
              >
                Pay ₹149
                <ChevronRight aria-hidden="true" size={17} />
              </button>

              <p className="mt-3 text-center text-[10px] text-[#aaa098]">
                Demo payment gateway — no real payment is processed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

/* =============================================================== */
/* SMALL UI COMPONENTS */
/* =============================================================== */

interface SummaryItemProps {
  label: string;
  value: string;
}

const SummaryItem: React.FC<SummaryItemProps> = ({
  label,
  value,
}) => (
  <div className="border-b border-[#e5ddd5] px-4 py-3 last:border-b-0 sm:[&:nth-child(even)]:border-l">
    <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#8a7d72]">
      {label}
    </p>

    <p className="mt-1 text-xs font-semibold leading-5 text-[#24201d]">
      {value}
    </p>
  </div>
);
interface FeatureRowProps {
  text: string;
}

const FeatureRow: React.FC<FeatureRowProps> = ({ text }) => (
  <div className="flex items-center gap-2">
    <Check
      aria-hidden="true"
      size={12}
      className="shrink-0 text-[#5d7c60]"
    />

    <span className="text-[11px] text-[#6b635d]">
      {text}
    </span>
  </div>
);

interface PartyConfirmationCardProps {
  role: "Seller" | "Buyer";
  name: string;
  confirmed: boolean;
  onConfirm: () => void;

  otpSent: boolean;
  otp: string;
  onSendOtp: () => void;
  onVerifyOtp: () => void;
  onOtpChange: (value: string) => void;
}

const PartyConfirmationCard: React.FC<
  PartyConfirmationCardProps
> = ({
  role,
  name,
  confirmed,
  onConfirm,
  otpSent,
  otp,
  onSendOtp,
  onVerifyOtp,
  onOtpChange,
}) => (
  <div
    className={[
      "border p-4 transition",
      confirmed
        ? "border-[#cdddcf] bg-[#f4f8f4]"
        : "border-[#d9d0c7] bg-[#fffdf9]",
    ].join(" ")}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center border",
            confirmed
              ? "border-[#cdddcf] bg-[#fffdf9] text-[#5d7c60]"
              : "border-[#d9d0c7] bg-[#f8f3ee] text-[#8a7d72]",
          ].join(" ")}
        >
          <UserRound
            aria-hidden="true"
            size={15}
          />
        </div>

        <div className="min-w-0">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            {role}
          </p>

          <p className="mt-0.5 truncate text-sm font-bold text-[#24201d]">
            {name}
          </p>
        </div>
      </div>

      {confirmed ? (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-[#cdddcf] bg-[#fffdf9] text-[#5d7c60]">
          <Check aria-hidden="true" size={13} />
        </div>
      ) : null}
    </div>

    <div className="mt-4">
      {confirmed ? (
        <div className="border border-[#cdddcf] bg-[#fffdf9] px-3 py-2 text-[11px] font-semibold text-[#5d7c60]">
          Digitally e-signed
        </div>
      ) : (
         <div className="space-y-3">
    {!otpSent ? (
      <button
        type="button"
        onClick={onSendOtp}
        className="min-h-10 w-full border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
      >
        Verify & eSign as {role}
      </button>
    ) : (
      <>
        <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-3 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
            Mock OTP verification
          </p>

          <p className="mt-1 text-[11px] leading-5 text-[#6b635d]">
            Enter the 6-digit OTP sent to the registered mobile number.
          </p>

          <input
            value={otp}
            onChange={(event) =>
              onOtpChange(
                event.target.value.replace(/\D/g, "").slice(0, 6),
              )
            }
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="mt-3 min-h-10 w-full border border-[#d9d0c7] bg-white px-3 text-center text-sm font-semibold tracking-[0.3em] text-[#24201d] outline-none focus:border-[#24201d]"
          />

          <p className="mt-2 text-[10px] text-[#8a7d72]">
            Demo OTP: 123456
          </p>
        </div>

        <button
          type="button"
          onClick={onVerifyOtp}
          disabled={otp.length !== 6}
          className="min-h-10 w-full border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9a8d82]"
        >
          Confirm {role} e-sign
        </button>
      </>
    )}
  </div>

      )}
    </div>
  </div>
);

interface PreviewRowProps {
  label: string;
  value: string;
}

const PreviewRow: React.FC<PreviewRowProps> = ({
  label,
  value,
}) => (
  <div className="border-b border-[#e5ddd5] px-4 py-3 last:border-b-0 sm:[&:nth-child(even)]:border-l">
    <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-[#8a7d72]">
      {label}
    </p>

    <p className="mt-1 text-xs font-semibold leading-5 text-[#24201d]">
      {value}
    </p>
  </div>
);

interface EvidenceRowProps {
  text: string;
}

const EvidenceRow: React.FC<EvidenceRowProps> = ({ text }) => (
  <div className="flex items-center gap-2 border-b border-[#e5ddd5] px-3 py-2.5 last:border-b-0 sm:[&:nth-child(even)]:border-l">
    <CheckCircle2
      aria-hidden="true"
      size={14}
      className="shrink-0 text-[#5d7c60]"
    />

    <span className="text-[11px] font-medium text-[#6b635d]">
      {text}
    </span>
  </div>
);