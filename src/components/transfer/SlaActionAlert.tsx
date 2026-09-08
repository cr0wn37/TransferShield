import { AlertTriangle, ArrowRight } from "lucide-react";
import type { Transfer } from "../../types/transfer";
import { calculateSlaSummary, formatDuration, ownerLabel } from "../../lib/sla";

interface SlaActionAlertProps {
  transfer: Transfer;
  onAction?: () => void;
}

export function SlaActionAlert({
  transfer,
  onAction,
}: SlaActionAlertProps) {
  const summary = calculateSlaSummary(transfer);
  const current = summary.currentStage;

if (!summary.currentStageBreached) {
  return null;
}

  const owner = ownerLabel(current.owner);

  return (
  <div className="mb-4 border border-[#d9b5b5] bg-[#fbefef] px-4 py-3">
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9b5b5] bg-[#fff7f7] text-[#9a4f4f]">
        <AlertTriangle
          aria-hidden="true"
          className="h-4 w-4"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#9a4f4f]">
          Action overdue
        </p>

        <p className="mt-1 text-sm font-semibold text-[#24201d]">
          {owner} is responsible for the delay
        </p>

        <p className="mt-1 text-xs leading-5 text-[#6b635d]">
          This stage is{" "}
          <span className="font-semibold text-[#24201d]">
            {formatDuration(summary.currentStageOverdueMs)}
          </span>{" "}
          past the expected handling window.
        </p>

        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-3 inline-flex min-h-10 items-center gap-2 border border-[#24201d] bg-[#24201d] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
          >
            Take action
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        ) : null}
      </div>
    </div>
  </div>
);}