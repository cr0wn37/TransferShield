import { useState } from "react";
import { ArrowRight, CheckCircle2, Search} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useTransferStore } from "../state/transferStore";
import { TransferReadinessCheck } from "../components/transfer/TransferReadinessCheck";
import {
  checkTransferReadiness,
  getBuyerRtoFromPincode,
  type TransferReadinessResult,
} from "../utils/transferReadiness";

const mockVehicleDetails = {
  chassisLast5: "7K921",
  insuranceValidUpto: "18 Mar 2027",
  puccValidUpto: "05 Dec 2026",
};

export function StartTransferPage() {
  const navigate = useNavigate();
  const createTransfer = useTransferStore((state) => state.createTransfer);

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [hasLookedUpVehicle, setHasLookedUpVehicle] = useState(false);
  const [error, setError] = useState("");
  const [buyerPincode, setBuyerPincode] = useState("");

  const [selectedRto, setSelectedRto] = useState("");
  const [chassisLast5, setChassisLast5] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [vehicleVerified, setVehicleVerified] = useState(false);

  const registeredMobile = "+91 XXXXXXX4210";
  const mockOtp = "123456";

  const normalizedRegistrationNumber = registrationNumber
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ");

  const handleLookup = () => {
  if (normalizedRegistrationNumber.length < 6) {
    setError("Enter a valid vehicle registration number.");
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
    createTransfer(normalizedRegistrationNumber, chassisLast5);
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

  

  return (
  <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            TransferShield
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Start a vehicle transfer
          </h1>
        </div>

       
       <div className="flex items-center gap-2">
        <Link
          to="/about"
          className="inline-flex min-h-10 items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
        >
          How it works
        </Link>

        <Link
          to="/demo"
          className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white"
        >
          Demo scenarios
        </Link>
      </div>
            </header>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Search aria-hidden="true" className="h-5 w-5" />
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-950">
          Verify your vehicle
        </h2>

        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
          Enter the vehicle details used to verify access to the registered
          vehicle before starting the ownership transfer.
        </p>

        <label className="mt-6 block text-sm font-semibold text-slate-800">
          Vehicle registration number
          <input
            value={registrationNumber}
            onChange={(event) => {
              setRegistrationNumber(event.target.value);
              setHasLookedUpVehicle(false);
              setVehicleVerified(false);
              setOtpSent(false);
              setOtp("");
              setReadinessResult(null);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleLookup();
              }
            }}
            placeholder="Example: MH 01 AB 4821"
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-medium uppercase text-slate-950 outline-none placeholder:normal-case placeholder:font-normal placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-800">
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
            }}
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select RTO</option>
            <option value="MH-01">Mumbai Central — MH-01</option>
            <option value="MH-12">Pune — MH-12</option>
            <option value="KA-01">Bengaluru Central — KA-01</option>
          </select>
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-800">
          Chassis last 5 digits
          <input
            value={chassisLast5}
            onChange={(event) => {
              setChassisLast5(
                event.target.value.replace(/\D/g, "").slice(0, 5),
              );
              setHasLookedUpVehicle(false);
              setVehicleVerified(false);
              setOtpSent(false);
              setOtp("");
              setReadinessResult(null);
              setError("");
            }}
            inputMode="numeric"
            maxLength={5}
            placeholder="Example: 48219"
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-medium text-slate-950 outline-none placeholder:font-normal placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </label>

       <label className="mt-4 block text-sm font-semibold text-slate-800">
          Buyer destination
          <select
            value={buyerPincode}
            onChange={(event) => {
              setBuyerPincode(event.target.value);
              setReadinessResult(null);
              setError("");
            }}
            className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base font-medium text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select buyer location</option>
            <option value="400001">400001 — Mumbai (MH-01) · Same RTO</option>
            <option value="411001">411001 — Pune (MH-12) · Different RTO</option>
            <option value="560001">560001 — Bengaluru (KA-01) · Interstate</option>
          </select>
        </label>

        <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            Demo PIN codes
          </p>
          <p className="mt-1 text-xs leading-5 text-blue-800">
            400001 → MH-01 (Same RTO)
            <br />
            411001 → MH-12 (Same state, different RTO)
            <br />
            560001 → KA-01 (Interstate)
          </p>
        </div>

        {error ? (
          <p className="mt-3 text-sm font-medium text-rose-700">{error}</p>
        ) : null}

        {!otpSent && !vehicleVerified ? (
          <button
            type="button"
            onClick={handleLookup}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Search aria-hidden="true" className="h-4 w-4" />
            Verify vehicle
          </button>
        ) : null}

        {otpSent && !vehicleVerified ? (
          <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Verify registered mobile number
            </p>

            <p className="mt-1 text-sm leading-6 text-blue-800">
              An OTP has been sent to the mobile number registered with this
              vehicle.
            </p>

            <div className="mt-4 rounded-lg bg-white px-3 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Registered mobile
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {registeredMobile}
              </p>
            </div>

            <label className="mt-4 block text-sm font-semibold text-slate-800">
              Enter OTP
              <input
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value.replace(/\D/g, "").slice(0, 6),
                  )
                }
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-center text-base font-medium tracking-[0.3em] text-slate-950 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <p className="mt-2 text-xs text-slate-500">
              Demo OTP: 123456
            </p>

            <button
              type="button"
              onClick={handleVerifyVehicle}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Verify vehicle access
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </section>

      {hasLookedUpVehicle && vehicleVerified ? (
        <section className="mt-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-700">
                Registered vehicle access verified
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-950">
                {normalizedRegistrationNumber}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                The registered mobile verification was successful. These are
                mock vehicle details for the TransferShield prototype.
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Chassis number
              </dt>
              <dd className="mt-2 font-semibold text-slate-950">
                XXXXX{chassisLast5}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Insurance valid up to
              </dt>
              <dd className="mt-2 font-semibold text-slate-950">
                {mockVehicleDetails.insuranceValidUpto}
              </dd>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                PUCC valid up to
              </dt>
              <dd className="mt-2 font-semibold text-slate-950">
                {mockVehicleDetails.puccValidUpto}
              </dd>
            </div>
          </dl>

          {readinessResult ? (
            <TransferReadinessCheck
              result={readinessResult}
              onContinue={handleCreateTransfer}
            />
          ) : null}
        </section>
      ) : null}
    </div>
  </main>
);}