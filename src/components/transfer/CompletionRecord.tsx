import {
  CheckCircle2,
  
  Landmark,

} from "lucide-react";
import { FileDown } from "lucide-react";
import { generateTransferCompletionCertificate } from "../../lib/generateTransferCompletionCertificate";

import type { Transfer } from "../../types/transfer";

interface CompletionRecordProps {
  transfer: Transfer;
}

function formatTimestamp(timestamp?: string) {
  if (!timestamp) {
    return "Completion time not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function CompletionRecord({ transfer }: CompletionRecordProps) {
 return (
  <section
    aria-label="Transfer completion record"
    className="border border-[#cdddcf] bg-[#fffdf9]"
  >
    {/* Completion header */}
    <div className="border-b border-[#cdddcf] bg-[#f4f8f4] px-5 py-4 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#cdddcf] bg-[#fffdf9] text-[#5d7c60]">
            <CheckCircle2
              aria-hidden="true"
              className="h-4 w-4"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5d7c60]">
              Government transfer status
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
              Transfer completed
            </h2>

            <p className="mt-1 text-xs text-[#6b635d]">
              RTO approved the ownership transfer.
            </p>
          </div>
        </div>

       <button
          type="button"
          onClick={() => {
            generateTransferCompletionCertificate({
              applicationId: transfer.id,
              recordNumber: `TS-TRF-${transfer.id}`,
              vehicleNumber: transfer.vehicle.registrationNumber,
              chassisLast5: transfer.vehicle.chassisLast5,
              sellerName: transfer.seller.name,
              buyerName: transfer.buyer.name,
              rtoName: "Maharashtra Motor Vehicle Department",
              transferType: "Sale / ownership transfer",
              completedAt: new Date().toLocaleString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }),
            });
          }}
          className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
        >
          <FileDown
            aria-hidden="true"
            className="h-3.5 w-3.5"
          />
          Download transfer certificate
        </button>
      </div>
    </div>

    {/* Core details */}
    <div className="grid grid-cols-2">
      <div className="border-b border-[#e5ddd5] px-4 py-3 sm:px-5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          Application ID
        </p>

        <p className="mt-1 font-mono text-xs font-bold tracking-wide text-[#24201d]">
          {transfer.id}
        </p>
      </div>

      <div className="border-b border-l border-[#e5ddd5] px-4 py-3 sm:px-5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          Completed
        </p>

        <p className="mt-1 text-xs font-semibold text-[#24201d]">
          {formatTimestamp(transfer.completedAt)}
        </p>
      </div>

      <div className="px-4 py-3 sm:px-5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          Vehicle
        </p>

        <p className="mt-1 text-xs font-bold tracking-wide text-[#24201d]">
          {transfer.vehicle.registrationNumber}
        </p>
      </div>

      <div className="border-l border-[#e5ddd5] px-4 py-3 sm:px-5">
        <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          RTO decision
        </p>

        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-[#5d7c60]">
          <Landmark
            aria-hidden="true"
            className="h-3.5 w-3.5"
          />
          Approved
        </p>
      </div>
    </div>

    {/* Parties */}
    <div className="border-t border-[#e5ddd5] px-4 py-3 sm:px-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Seller
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-[#24201d]">
            {transfer.seller.name}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Buyer
          </p>

          <p className="mt-1 truncate text-xs font-semibold text-[#24201d]">
            {transfer.buyer.name}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-[#e5ddd5] pt-4">
  <div className="border-l-2 border-[#7c9a7f] bg-[#f4f8f4] px-3 py-3">
    <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5d7c60]">
      What happens next
    </p>

    <p className="mt-1 text-xs leading-5 text-[#5d635d]">
      Your TransferShield workflow is complete. No further online action is
      needed unless the RTO requests additional documents or an in-person
      visit.
    </p>
  </div>
</div>
    </div>
  </section>
);}