import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Search, CarFront,FileCheck2,Landmark,UserRound,ShieldCheck, Users,FileText,
  Zap,} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useTransferStore } from "../state/transferStore";
import { TransferReadinessCheck } from "../components/transfer/TransferReadinessCheck";
import {
  checkTransferReadiness,
  getBuyerRtoFromPincode,
  type TransferReadinessResult,
} from "../utils/transferReadiness";

import type { VehicleCompliance } from "../types/vehicleCompliance";
import type { ComplianceScenario } from "../lib/vehicleCompliance";

import VehicleComplianceGate from "../components/transfer/VehicleComplianceGate";
import { LanguageToggle } from "../components/LanguageToggle";
import { useLanguage } from "../context/LanguageContext";

const mockVehicleDetails = {
  chassisLast5: "7K921",
  insuranceValidUpto: "18 Mar 2027",
  puccValidUpto: "05 Dec 2026",
};

export function StartTransferPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const createTransfer = useTransferStore((state) => state.createTransfer);

  const location = useLocation();

    const demoComplianceScenario =
      location.state?.demoComplianceScenario as
        | ComplianceScenario
        | undefined;

    const isDemoComplianceScenario =
      demoComplianceScenario !== undefined;

  const [entryMode, setEntryMode] = useState<"seller" | "buyer">("seller");

  const [vehicleCompliance, setVehicleCompliance] =
  useState<VehicleCompliance | null>(null);

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [hasLookedUpVehicle, setHasLookedUpVehicle] = useState(false);
  const [error, setError] = useState("");
  const [buyerPincode, setBuyerPincode] = useState("");

  const [selectedRto, setSelectedRto] = useState("MH-01");
  const [chassisLast5, setChassisLast5] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [vehicleVerified, setVehicleVerified] = useState(false);

  const [buyerSessionCode, setBuyerSessionCode] = useState("");
const [isBuyerJoining, setIsBuyerJoining] = useState(false);
const [buyerJoinError, setBuyerJoinError] = useState("");

const handleBuyerJoin = async () => {
  try {
    setIsBuyerJoining(true);
    setBuyerJoinError("");

    await joinLiveSync(buyerSessionCode, "buyer");

    const joinedTransferId =
      useTransferStore.getState().transfer.id;

    navigate(`/transfer/${joinedTransferId}`);
  } catch (error) {
    console.error("Buyer join failed:", error);

    setBuyerJoinError(
      error instanceof Error
        ? error.message
        : "Unable to join this transfer."
    );
  } finally {
    setIsBuyerJoining(false);
  }
};

  const registeredMobile = "+91 XXXXXXX4210";
  const mockOtp = "123456";

  const joinLiveSync = useTransferStore(
  (state) => state.joinLiveSync
);

  const normalizedRegistrationNumber = registrationNumber
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

  const handleLookup = () => {
 const vehicleRegPattern = /^[A-Z]{2}\s?\d{2}\s?[A-Z]{2}\s?\d{4}$/;

if (!vehicleRegPattern.test(normalizedRegistrationNumber)) {
  setError("Enter registration number in format: MH 01 AB 4821");
  setHasLookedUpVehicle(false);
  return;
}

  if (!selectedRto) {
    setError("Select the RTO.");
    return;
  }

  if (chassisLast5.length !== 5) {
    setError("Enter the last 5 digits of the chassis number.");
    return;
  }

  setError("");
  setOtpSent(true);
};

  const handleCreateTransfer = () => {
    createTransfer(normalizedRegistrationNumber, chassisLast5, vehicleCompliance ?? undefined);
    navigate("/transfer/new");
  };

  const handleVerifyVehicle = () => {
  if (otp !== mockOtp) {
    setError("Incorrect OTP. For this demo, use 123456.");
    return;
  }

  setError("");
  setVehicleVerified(true);
  setHasLookedUpVehicle(true);

  const result = checkTransferReadiness({
    registrationNumber: normalizedRegistrationNumber,
    buyerPincode,
    sellerRto: selectedRto,
    buyerRto: getBuyerRtoFromPincode(buyerPincode).rto,
    insuranceValidUpto: mockVehicleDetails.insuranceValidUpto,
    puccValidUpto: mockVehicleDetails.puccValidUpto,
    hypothecation: false,
  });

  setReadinessResult(result);
};

  const [readinessResult, setReadinessResult] =
  useState<TransferReadinessResult | null>(null);

  useEffect(() => {
  if (!isDemoComplianceScenario) {
    return;
  }

  const demoRegistrationNumber = "MH 01 AB 4821";
  const demoChassisLast5 = "7K921";
  const demoRto = "MH-01";

  setEntryMode("seller");
  setRegistrationNumber(demoRegistrationNumber);
  setSelectedRto(demoRto);
  setChassisLast5(demoChassisLast5);

  setHasLookedUpVehicle(true);
  setVehicleVerified(true);
  setOtpSent(false);
  setOtp("");
  setError("");

  const result = checkTransferReadiness({
    registrationNumber: demoRegistrationNumber,
    buyerPincode,
    sellerRto: demoRto,
    buyerRto: getBuyerRtoFromPincode(buyerPincode).rto,
    insuranceValidUpto:
      mockVehicleDetails.insuranceValidUpto,
    puccValidUpto:
      mockVehicleDetails.puccValidUpto,
    hypothecation: false,
  });

  setReadinessResult(result);
  setVehicleCompliance(null);

  window.history.replaceState(
    {},
    document.title,
    window.location.pathname,
  );
}, [isDemoComplianceScenario]);

  return (
  <main className="min-h-screen bg-[#f8f1e8] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-[1600px]">
      <header className="flex items-center justify-between border-b border-[#e5ddd5] pb-5">
  <Link
    to="/"
    className="text-2xl font-bold tracking-[-0.04em] text-[#24201d] sm:text-3xl"
  >
    TransferShield
  </Link>

  <nav className="flex items-center gap-2 sm:gap-3">
    <Link
      to="/about"
      className="px-3 py-2 text-sm font-medium text-[#4f4944] transition-colors hover:text-[#b56f52]"
    >
      {t("howItWorks")}
    </Link>

    <Link
      to="/demo"
      className="px-3 py-2 text-sm font-medium text-[#4f4944] transition-colors hover:text-[#b56f52]"
    >
      Demo scenarios
    </Link>

    <Link
      to="/"
      className="border border-[#e99b79] bg-[#e99b79] px-4 py-2.5 text-sm font-semibold text-[#24201d] transition-colors hover:bg-[#e3906c]"
    >
      Get started
    </Link>

    <LanguageToggle />
  </nav>
</header>

          <div className="mt-8 grid gap-0 lg:grid-cols-[3fr_2fr] lg:items-start">
            <section className="relative aspect-square overflow-hidden bg-[#f8f1e8]">
              <img
                src="/images/transfershield-hero.png"
                alt="TransferShield — smoother vehicle ownership transfers"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </section>

            <div className="min-w-0">
  <section className="w-full border border-[#d9d0c7] bg-transparent">
    {/* Panel header */}
    <div className="border-b border-[#e5ddd5] px-6 py-5 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#24201d]">
            Let’s get started
          </h2>

          <p className="mt-1 text-sm text-[#6b635d]">
            First, tell us your role in this transfer.
          </p>
        </div>

        <div className="hidden h-1.5 w-24 bg-[#eee7df] sm:block">
          <div className="h-full w-1/3 bg-[#e99b79]" />
        </div>
      </div>
    </div>

    {/* Role selector */}
    <div className="px-6 pt-6 sm:px-8">
     <div className="grid grid-cols-2 gap-3">
  <button
    type="button"
    onClick={() => {
      setEntryMode("buyer");
      setError("");
      setBuyerJoinError("");
      setHasLookedUpVehicle(false);
      setVehicleVerified(false);
      setOtpSent(false);
      setOtp("");
      setReadinessResult(null);
      setVehicleCompliance(null);
    }}
    className={[
      "flex min-h-[76px] items-center gap-4 border px-5 py-4 text-left transition-colors",
      entryMode === "buyer"
        ? "border-[#e99b79] bg-[#fcf0e9]"
        : "border-[#d9d0c7] bg-white hover:border-[#bdb2a8]",
    ].join(" ")}
  >
    <CarFront
      aria-hidden="true"
      className="h-7 w-7 shrink-0 text-[#24201d]"
      strokeWidth={1.8}
    />

    <span>
      <span className="block text-sm font-semibold text-[#24201d]">
        I’m buying
      </span>

      <span className="mt-1 block text-sm text-[#6b635d]">
        a vehicle
      </span>
    </span>
  </button>

  <button
    type="button"
    onClick={() => {
      setEntryMode("seller");
      setBuyerJoinError("");
      setVehicleCompliance(null);
    }}
    className={[
      "flex min-h-[76px] items-center gap-4 border px-5 py-4 text-left transition-colors",
      entryMode === "seller"
        ? "border-[#e99b79] bg-[#fcf0e9]"
        : "border-[#d9d0c7] bg-white hover:border-[#bdb2a8]",
    ].join(" ")}
  >
    <CarFront
      aria-hidden="true"
      className="h-7 w-7 shrink-0 text-[#24201d]"
      strokeWidth={1.8}
    />

    <span>
      <span className="block text-sm font-semibold text-[#24201d]">
        I’m selling
      </span>

      <span className="mt-1 block text-sm text-[#6b635d]">
        a vehicle
      </span>
    </span>
  </button>
</div>
    </div>

    {entryMode === "seller" ? (
      <>
      {!vehicleVerified ? (
      <>
        {/* Seller verification */}
        <div className="px-6 py-7 sm:px-8">
          <div className="border-t border-[#e5ddd5] pt-7">
            <p className="text-sm font-semibold text-[#b56f52]">
              Verify your vehicle
            </p>

            <h3 className="mt-1 text-xl font-bold tracking-tight text-[#24201d]">
              Enter your vehicle details
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b635d]">
              Use the registered vehicle details to verify access before
              starting the ownership transfer.
            </p>
          </div>

          {/* Registration number */}
          <label className="mt-7 block text-sm font-semibold text-[#24201d]">
            {t("vehicleRegistrationNumber")}

            <input
              value={registrationNumber}
              onChange={(event) => {
                setRegistrationNumber(
                  event.target.value.toUpperCase(),
                );
                setHasLookedUpVehicle(false);
                setVehicleVerified(false);
                setOtpSent(false);
                setOtp("");
                setReadinessResult(null);
                setError("");
                setVehicleCompliance(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleLookup();
                }
              }}
              placeholder="Example: MH 01 AB 4821"
              className="mt-2 min-h-12 w-full border border-[#cfc6bd] bg-white px-4 text-base font-medium uppercase text-[#24201d] outline-none transition focus:border-[#e99b79] focus:ring-2 focus:ring-[#f4d3c3]"
            />
          </label>

          <p className="mt-2 text-xs text-[#7b7169]">
            Demo vehicle:{" "}
            <button
              type="button"
              onClick={() =>
                setRegistrationNumber("MH 01 AB 4821")
              }
              className="font-semibold text-[#b56f52] underline-offset-2 hover:underline"
            >
              MH 01 AB 4821
            </button>
          </p>

          {/* RTO */}
          <label className="mt-5 block text-sm font-semibold text-[#24201d]">
            RTO office

            <select
              value={selectedRto}
              onChange={(event) => {
                setSelectedRto(event.target.value);
                setHasLookedUpVehicle(false);
                setVehicleVerified(false);
                setOtpSent(false);
                setOtp("");
                setReadinessResult(null);
                setError("");
                setVehicleCompliance(null);
              }}
              className="mt-2 min-h-12 w-full border border-[#cfc6bd] bg-white px-4 text-base text-[#24201d] outline-none transition focus:border-[#e99b79] focus:ring-2 focus:ring-[#f4d3c3]"
            >
              <option value="MH-01">
                Mumbai Central — MH-01
              </option>
            </select>
          </label>

          {/* Chassis */}
          <label className="mt-5 block text-sm font-semibold text-[#24201d]">
            Chassis last 5 digits

            <input
              value={chassisLast5}
              onChange={(event) => {
                setChassisLast5(
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 5),
                );
                setHasLookedUpVehicle(false);
                setVehicleVerified(false);
                setOtpSent(false);
                setOtp("");
                setReadinessResult(null);
                setError("");
                setVehicleCompliance(null);
              }}
              inputMode="numeric"
              maxLength={5}
              placeholder="Example: 48219"
              className="mt-2 min-h-12 w-full border border-[#cfc6bd] bg-white px-4 text-base font-medium text-[#24201d] outline-none transition focus:border-[#e99b79] focus:ring-2 focus:ring-[#f4d3c3]"
            />
          </label>

          {/* Buyer destination */}
          <label className="mt-5 block text-sm font-semibold text-[#24201d]">
            {t("buyerDestination")}

            <select
              value={buyerPincode}
              onChange={(event) => {
                setBuyerPincode(event.target.value);
                setReadinessResult(null);
                setError("");
              }}
              className="mt-2 min-h-12 w-full border border-[#cfc6bd] bg-white px-4 text-base font-medium text-[#24201d] outline-none transition focus:border-[#e99b79] focus:ring-2 focus:ring-[#f4d3c3]"
            >
              <option value="">
                {t("selectBuyerLocation")}
              </option>

              <option value="400001">
                400001 — Mumbai (MH-01) · Same RTO
              </option>

              <option value="411001">
                411001 — Pune (MH-12) · Different RTO
              </option>

              <option value="560001">
                560001 — Bengaluru (KA-01) · Interstate
              </option>
            </select>
          </label>

          {/* Demo locations */}
          <div className="mt-4 border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Demo PIN codes
            </p>

            <p className="mt-2 text-xs leading-5 text-[#6b635d]">
              400001 → MH-01 (Same RTO)
              <br />
              411001 → MH-12 (Same state, different RTO)
              <br />
              560001 → KA-01 (Interstate)
            </p>
          </div>

          {error ? (
            <p className="mt-4 border-l-2 border-[#c96262] bg-[#fbefef] px-3 py-2 text-sm font-medium text-[#a94444]">
              {error}
            </p>
          ) : null}

          {!otpSent && !vehicleVerified ? (
            <button
              type="button"
              onClick={handleLookup}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[#e99b79] bg-[#e99b79] px-5 py-3 text-sm font-semibold text-[#24201d] transition hover:bg-[#e3906c]"
            >
              <Search
                aria-hidden="true"
                className="h-4 w-4"
              />

              {t("verifyVehicle")}

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </button>
          ) : null}

          {/* OTP */}
          {otpSent && !vehicleVerified ? (
            <div className="mt-6 border border-[#e5ddd5] bg-[#f8f3ee] p-5">
              <p className="text-sm font-semibold text-[#24201d]">
                {t("verifyRegisteredMobile")}
              </p>

              <p className="mt-1 text-sm leading-6 text-[#6b635d]">
                {t("otpSentMessage")}
              </p>

              <div className="mt-4 border border-[#e5ddd5] bg-white px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  {t("registeredMobile")}
                </p>

                <p className="mt-1 text-sm font-semibold text-[#24201d]">
                  {registeredMobile}
                </p>
              </div>

              <label className="mt-4 block text-sm font-semibold text-[#24201d]">
                {t("enterOtp")}

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
                  className="mt-2 min-h-12 w-full border border-[#cfc6bd] bg-white px-4 text-center text-base font-medium tracking-[0.3em] text-[#24201d] outline-none transition focus:border-[#e99b79] focus:ring-2 focus:ring-[#f4d3c3]"
                />
              </label>

              <p className="mt-2 text-xs text-[#7b7169]">
                Demo OTP: 123456
              </p>

              <button
                type="button"
                onClick={handleVerifyVehicle}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
              >
                {t("verifyVehicleAccess")}

                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </button>
            </div>
           ) : null}
        </div>
      </>
    ) : null}

    {/* Verified vehicle */}
    {hasLookedUpVehicle && vehicleVerified ? (
  <div className="px-6 py-7 sm:px-8">
    {!vehicleCompliance ? (
      <>
        {/* Compact verified vehicle summary */}
        <div className="border-b border-[#e5ddd5] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
            Vehicle verified
          </p>

          <div className="mt-1 flex items-baseline justify-between gap-4">
            <h3 className="text-xl font-bold tracking-tight text-[#24201d]">
              {normalizedRegistrationNumber}
            </h3>

            <span className="text-xs font-medium text-[#6b635d]">
              Verified
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-[#6b635d]">
            {t("registeredMobileVerificationSuccess")}
          </p>
        </div>

        {/* Compliance becomes the primary next step */}
        {readinessResult ? (
          <div className="mt-6">
            <VehicleComplianceGate
              registrationNumber={normalizedRegistrationNumber}
              initialScenario={
                demoComplianceScenario ?? "both"
              }
              autoRun={isDemoComplianceScenario}
              onCleared={(result) => {
                setVehicleCompliance(result);
              }}
            />
          </div>
        ) : null}
      </>
    ) : (
      <>
        {/* Vehicle details after compliance has been checked */}
        <div className="border-b border-[#e5ddd5] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f8a72]">
            Vehicle verified
          </p>

          <h3 className="mt-1 text-xl font-bold tracking-tight text-[#24201d]">
            {normalizedRegistrationNumber}
          </h3>

          <p className="mt-1 text-sm leading-6 text-[#6b635d]">
            {t("registeredMobileVerificationSuccess")}
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <div className="border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
              Chassis number
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              XXXXX{chassisLast5}
            </p>
          </div>

          <div className="border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
              Insurance valid up to
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              {mockVehicleDetails.insuranceValidUpto}
            </p>
          </div>

          <div className="border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
              PUCC valid up to
            </p>

            <p className="mt-1 text-sm font-semibold text-[#24201d]">
              {mockVehicleDetails.puccValidUpto}
            </p>
          </div>
        </div>

        {/* Only show readiness after compliance clears */}
        {readinessResult && vehicleCompliance?.status === "clear" ? (
          <div className="mt-6 border-t border-[#e5ddd5] pt-6">
            <TransferReadinessCheck
              result={readinessResult}
              onContinue={handleCreateTransfer}
            />
          </div>
        ) : null}
      </>
    )}
  </div>
) : null}
        
      </>
    ) : (
      <>
        {/* Buyer join */}
        <div className="px-6 py-7 sm:px-8">
          <div className="border-t border-[#e5ddd5] pt-7">
            <p className="text-sm font-semibold text-[#b56f52]">
              Join an existing transfer
            </p>

            <h3 className="mt-1 text-xl font-bold tracking-tight text-[#24201d]">
              {t("joinVehicleTransfer")}
            </h3>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#6b635d]">
              {t("sellerAlreadyStartedTransfer")}
            </p>
          </div>

          <div className="mt-7">
            <label className="block text-sm font-semibold text-[#24201d]">
              {t("transferCode")}

              <input
                type="text"
                value={buyerSessionCode}
                onChange={(event) =>
                  setBuyerSessionCode(
                    event.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 6),
                  )
                }
                maxLength={6}
                placeholder="ABC123"
                className="mt-2 min-h-14 w-full border border-[#cfc6bd] bg-white px-4 text-center text-xl font-bold tracking-[0.22em] text-[#24201d] outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-[#a49a91] focus:border-[#e99b79] focus:ring-2 focus:ring-[#f4d3c3]"
              />
            </label>

            {buyerJoinError ? (
              <p className="mt-4 border-l-2 border-[#c96262] bg-[#fbefef] px-3 py-2 text-sm font-medium text-[#a94444]">
                {buyerJoinError}
              </p>
            ) : null}

            <button
              type="button"
              disabled={
                buyerSessionCode.length !== 6 ||
                isBuyerJoining
              }
              onClick={handleBuyerJoin}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[#e99b79] bg-[#e99b79] px-5 py-3 text-sm font-semibold text-[#24201d] transition hover:bg-[#e3906c] disabled:cursor-not-allowed disabled:border-[#ddd5cd] disabled:bg-[#eee9e4] disabled:text-[#9a918a]"
            >
              {isBuyerJoining
                ? "Joining transfer..."
                : "Join transfer"}

              {!isBuyerJoining ? (
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              ) : null}
            </button>

            <p className="mt-4 text-xs leading-5 text-[#8a7d72]">
              {t("transferCodeDescription")}
            </p>
          </div>
        </div>
      </>
    )}
  </section>
</div>
</div>
    </div>
  </main>
);}