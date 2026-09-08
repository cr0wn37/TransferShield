import type { TransferStatus } from "../../types/transfer";
import { getWorkflowProgress } from "../../utils/workflow";

interface ProgressTrackerProps {
  status: TransferStatus;
}

export function ProgressTracker({ status }: ProgressTrackerProps) {
  const progress = getWorkflowProgress(status);

 return (
  <section
    aria-label="Transfer progress"
    className="bg-transparent"
  >
    <div className="flex items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
          Ownership transfer progress
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
          {progress.label}
        </h2>
      </div>

      <p className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-[#8a7d72]">
        Step {progress.currentStep} / {progress.totalSteps}
      </p>
    </div>

    <div className="mt-5">
      <div
        aria-valuemax={progress.totalSteps}
        aria-valuemin={0}
        aria-valuenow={progress.currentStep}
        aria-valuetext={`${progress.percentage}% complete`}
        className="h-2 overflow-hidden bg-[#eee8e1]"
        role="progressbar"
      >
        <div
          className="h-full bg-[#24201d] transition-all duration-500"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      <div className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs font-semibold text-[#24201d]">
          {progress.percentage}% complete
        </span>

        <span className="text-[11px] leading-5 text-[#8a7d72] sm:text-right">
          Complete after RTO approval
        </span>
      </div>
    </div>
  </section>
);}