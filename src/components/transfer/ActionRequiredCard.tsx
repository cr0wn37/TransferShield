import {
 
  ArrowRight,
 
} from "lucide-react";

import type {  Transfer } from "../../types/transfer";
import { getActionRequired } from "../../utils/workflow";


interface ActionRequiredCardProps {
  transfer: Transfer;
  onAction?: () => void;
}





export function ActionRequiredCard({
  transfer,
  onAction,
}: ActionRequiredCardProps) {
  
  const action = getActionRequired(transfer);

if (!action) {
  return null;
}



const needsAttention =
  transfer.status === "ACTION_REQUIRED";

 return (
  <section
    aria-label="Required next action"
    className={
      needsAttention
        ? "border-l-2 border-[#d49a45] bg-[#fbf3e3] p-3"
        : ""
    }
  >
    {needsAttention ? (
      <>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8c6427]">
          Correction
        </p>

        <div className="mt-3 divide-y divide-[#eadfc9] border border-[#e3cfaa] bg-[#fffaf1]">
          <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5">
            <span className="text-xs text-[#8a7d72]">
              Responsible party
            </span>

            <span className="text-right text-xs font-semibold text-[#24201d]">
              {action.role === "buyer"
                ? "Buyer"
                : action.role === "seller"
                  ? "Seller"
                  : action.role === "rto"
                    ? "RTO"
                    : "Shared"}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5">
            <span className="text-xs text-[#8a7d72]">
              Issue
            </span>

            <span className="max-w-[150px] text-right text-xs font-semibold capitalize text-[#24201d]">
              {transfer.rto.reasonCode?.replaceAll("_", " ") ??
                "Correction requested"}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2.5">
            <span className="text-xs text-[#8a7d72]">
              Affected document
            </span>

            <span className="max-w-[150px] text-right text-xs font-semibold text-[#24201d]">
              {transfer.rto.requestedDocumentId
                ? transfer.documents.find(
                    (document) =>
                      document.id === transfer.rto.requestedDocumentId,
                  )?.label ?? "Document"
                : "See correction details"}
            </span>
          </div>
        </div>

        <div className="mt-3 border-l-2 border-[#d49a45] bg-[#fffaf1] px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8c6427]">
            What to do
          </p>

          <p className="mt-1 text-xs leading-5 text-[#6b635d]">
            {transfer.rto.requiredAction ??
              "Review the correction request and update the affected information."}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[#8a7d72]">
            Completed steps are preserved. You do not need to restart the
            transfer.
          </p>
        </div>
      </>
    ) : null}

    {action.actionLabel && onAction ? (
      <button
        type="button"
        onClick={onAction}
        className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
      >
        {action.actionLabel}

        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4"
        />
      </button>
    ) : null}
  </section>
);}