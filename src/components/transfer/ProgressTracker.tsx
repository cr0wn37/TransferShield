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
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Ownership transfer progress
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {progress.label}
          </h2>
        </div>

        <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          Step {progress.currentStep} of {progress.totalSteps}
        </span>
      </div>

      <div className="mt-5">
        <div
          aria-valuemax={progress.totalSteps}
          aria-valuemin={0}
          aria-valuenow={progress.currentStep}
          aria-valuetext={`${progress.percentage}% complete`}
          className="h-3 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            {progress.percentage}% complete
          </span>
          <span className="text-slate-500">
            The transfer is complete only after RTO approval.
          </span>
        </div>
      </div>
    </section>
  );
}