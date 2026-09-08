import React, { useState } from 'react';
import type { DigitalHandoverState } from '../../types/transfer';
import { DigitalHandoverDialog } from './DigitalHandoverDialog';
import { generateHandoverCertificate } from "../../utils/generateHandoverCertificate";

interface DigitalHandoverCardProps {
  handoverState?: DigitalHandoverState;
  onComplete: (data: {
  odometerKm: number;
  handoverLocation: string;
  statutoryRefId: string;
}) => void;
  sellerName: string;
  buyerName: string;
  vehicleNumber: string;
  isUnlocked: boolean; // Set to true once buyer has joined / paid
}

export const DigitalHandoverCard: React.FC<DigitalHandoverCardProps> = ({
  handoverState,
  onComplete,
  sellerName,
  buyerName,
  vehicleNumber,
  isUnlocked,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const isActive = handoverState?.status === "active";

    // 1. ACTIVE STATE
  if (isActive) {
    return (
      <>
        <section className="border border-[#b8cdbb] bg-[#eef5ef]">
          <div className="px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#c7d8ca] bg-[#e3eee5] text-sm">
                🛡️
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-[#24201d]">
                    Digital handover active
                  </h3>

                  <span className="border border-[#c7d8ca] bg-[#f4f8f4] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#56715a]">
                    30 days
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#6b635d]">
                  Keys handed over at{" "}
                  <strong className="text-[#24201d]">
                    {handoverState?.handoverLocation}
                  </strong>
                  . Odometer:{" "}
                  <strong className="text-[#24201d]">
                    {handoverState?.odometerKm?.toLocaleString()} km
                  </strong>
                  .
                </p>

                <p className="mt-2 text-[10px] leading-5 text-[#6f8572]">
                  Ref: {handoverState?.statutoryRefId} ·{" "}
                  {handoverState?.completedAt} · Valid until{" "}
                  {handoverState?.expiresAt}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!handoverState) return;

                generateHandoverCertificate({
                  vehicleNumber,
                  sellerName,
                  buyerName,
                  odometerKm: handoverState.odometerKm ?? 0,
                  handoverLocation:
                    handoverState.handoverLocation ?? "Not recorded",
                  statutoryRefId:
                    handoverState.statutoryRefId ?? "TS-HANDOVER",
                  completedAt:
                    handoverState.completedAt ??
                    new Date().toLocaleString("en-IN"),
                  expiresAt:
                    handoverState.expiresAt ??
                    new Date(
                      Date.now() + 30 * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString("en-IN"),
                });
              }}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center border border-[#56715a] bg-[#56715a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#48604d]"
            >
              📄 Download certificate
            </button>
          </div>
        </section>
      </>
    );
  }

  // 2. READY STATE
  if (isUnlocked) {
    return (
      <>
        <section className="border border-[#dfc4b6] bg-[#fbf3ef]">
          <div className="px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#e5c7b8] bg-[#f7e5dc] text-sm">
                🔑
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-[#24201d]">
                    Digital handover
                  </h3>

                  <span className="border border-[#dfc4b6] bg-[#fff8f4] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9a604a]">
                    Ready
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-[#6b635d]">
                  Record the physical key exchange, odometer reading and
                  handover acknowledgement.
                </p>

                <p className="mt-2 text-[11px] font-semibold text-[#8a7d72]">
                  Legal Shield · ₹149
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
            >
              Start handover
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>

        <DigitalHandoverDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onComplete={onComplete}
          sellerName={sellerName}
          buyerName={buyerName}
          vehicleNumber={vehicleNumber}
        />
      </>
    );
  }

  // 3. LOCKED STATE
  return (
    <section className="border border-[#e5ddd5] bg-[#f8f3ee]">
      <div className="px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#eee8e1] text-sm">
            🔒
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-semibold text-[#6b635d]">
                Digital handover
              </h4>

              <span className="border border-[#d9d0c7] bg-[#fffdf9] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8a7d72]">
                Locked
              </span>
            </div>

            <p className="mt-2 text-xs leading-5 text-[#8a7d72]">
              Unlocks after the buyer completes identity verification and
              transfer fee payment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );}