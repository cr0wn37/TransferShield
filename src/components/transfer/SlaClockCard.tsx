import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Bell,
} from "lucide-react";

import type { Transfer } from "../../types/transfer";

import {
  calculateSlaSummary,
  formatDuration,
  ownerLabel,
} from "../../lib/sla";

import { useEffect, useMemo, useState } from "react";

interface SlaClockCardProps {
  transfer: Transfer;
  activeRole: "seller" | "buyer" | "rto";
  onAction?: () => void;
}

function getBarWidth(
  value: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(
      0,
      (value / total) * 100,
    ),
  );
}

export function SlaClockCard({
  transfer,
  activeRole,
  onAction,
}: SlaClockCardProps) {
   const [tick, setTick] = useState(0);

useEffect(() => {
  const interval = window.setInterval(() => {
    setTick((value) => value + 1);
  }, 60_000);

  return () => window.clearInterval(interval);
}, []);

const summary = useMemo(
  () => calculateSlaSummary(transfer),
  [transfer, tick],
);

const isCitizenRole =
  activeRole === "buyer" ||
  activeRole === "seller";

const isResponsibleParty =
  isCitizenRole &&
  summary.currentOwner === activeRole;

const reminderThresholdMs =
  6 * 60 * 60 * 1000;

const isApproachingSla =
  !summary.currentStageBreached &&
  summary.currentStageRemainingMs > 0 &&
  summary.currentStageRemainingMs <=
    reminderThresholdMs;

const isOverdue =
  summary.currentStageBreached;

const showActionReminder =
  isResponsibleParty &&
  (isApproachingSla || isOverdue);

  const totalAttributed =
    summary.buyerMs +
    summary.sellerMs +
    summary.rtoMs +
    summary.sharedMs +
    summary.systemMs;

  const stage = summary.currentStage;

  const expectedMs =
    stage.expectedHours *
    60 *
    60 *
    1000;

  const stageProgress =
    expectedMs > 0
      ? Math.min(
          100,
          (summary.currentStageElapsedMs /
            expectedMs) *
            100,
        )
      : 0;

  return (
  <section
    aria-label="SLA clock and attributed delay"
    className="border border-[#d9d0c7] bg-[#fffdf9]"
  >
    {/* Header */}
    <div className="border-b border-[#e5ddd5] px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#b56f52]">
            <Clock3
              aria-hidden="true"
              className="h-4 w-4"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Transfer timing
            </p>

            <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
              SLA clock & attributed delay
            </h2>

            <p className="mt-1.5 text-xs leading-5 text-[#6b635d]">
              See where the transfer time is being spent.
            </p>
          </div>
        </div>

        {/* Total elapsed */}
        <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Total elapsed
          </p>

          <p className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
            {formatDuration(summary.totalElapsedMs)}
          </p>
        </div>
      </div>
    </div>

    {/* Current stage */}
    <div className="px-5 py-5 sm:px-6">
      <div
        className={[
          "border px-4 py-4",
          summary.currentStageBreached
            ? "border-[#d9b5b5] bg-[#fbefef]"
            : "border-[#d9d0c7] bg-[#f8f3ee]",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-8 w-8 shrink-0 items-center justify-center border",
              summary.currentStageBreached
                ? "border-[#d9b5b5] bg-[#fff7f7] text-[#9a4f4f]"
                : "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]",
            ].join(" ")}
          >
            {summary.currentStageBreached ? (
              <AlertTriangle
                aria-hidden="true"
                className="h-4 w-4"
              />
            ) : (
              <CheckCircle2
                aria-hidden="true"
                className="h-4 w-4"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                  Current stage
                </p>

                <p className="mt-1 text-base font-bold text-[#24201d]">
                  {summary.currentActionTitle ?? stage.label}
                </p>

                <p className="mt-1 text-xs text-[#8a7d72]">
                  Waiting on{" "}
                  <span className="font-semibold text-[#24201d]">
                    {ownerLabel(summary.currentOwner)}
                  </span>
                </p>
              </div>

              <span
                className={[
                  "w-fit border px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em]",
                  summary.currentStageBreached
                    ? "border-[#d9b5b5] bg-[#fbefef] text-[#9a4f4f]"
                    : "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]",
                ].join(" ")}
              >
                {summary.currentStageBreached
                  ? "SLA breached"
                  : "Within expected time"}
              </span>
            </div>

            {/* Stage progress */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-[10px] font-medium text-[#8a7d72]">
                <span>
                  {formatDuration(summary.currentStageElapsedMs)} elapsed
                </span>

                <span>
                  Expected {stage.expectedHours}h
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden bg-[#e8e1da]">
                <div
                  className={[
                    "h-full transition-all",
                    summary.currentStageBreached
                      ? "bg-[#b85b5b]"
                      : "bg-[#24201d]",
                  ].join(" ")}
                  style={{
                    width: `${stageProgress}%`,
                  }}
                />
              </div>
            </div>

            <p
              className={[
                "mt-3 text-xs font-medium",
                summary.currentStageBreached
                  ? "text-[#9a4f4f]"
                  : "text-[#6b635d]",
              ].join(" ")}
            >
              {summary.currentStageBreached
                ? `${ownerLabel(
                    summary.currentOwner,
                  )} is ${formatDuration(
                    summary.currentStageOverdueMs,
                  )} overdue.`
                : `${formatDuration(
                    summary.currentStageRemainingMs,
                  )} remaining in the expected handling window.`}
            </p>

            {/* Action reminder */}
            {showActionReminder ? (
              <div
                className={[
                  "mt-4 border-l-2 px-3 py-3",
                  isOverdue
                    ? "border-[#c96262] bg-[#fbefef]"
                    : "border-[#d49a45] bg-[#fbf3e3]",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  {isOverdue ? (
                    <AlertTriangle
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#9a4f4f]"
                    />
                  ) : (
                    <Bell
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#8c6427]"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p
                      className={[
                        "text-[9px] font-semibold uppercase tracking-[0.12em]",
                        isOverdue
                          ? "text-[#9a4f4f]"
                          : "text-[#8c6427]",
                      ].join(" ")}
                    >
                      {isOverdue
                        ? "Action overdue"
                        : "Action due soon"}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#24201d]">
                      {isOverdue
                        ? `Your action is ${formatDuration(
                            summary.currentStageOverdueMs,
                          )} overdue.`
                        : `Your action is due in ${formatDuration(
                            summary.currentStageRemainingMs,
                          )}.`}
                    </p>

                    <p className="mt-1 text-xs text-[#6b635d]">
                      {summary.currentActionTitle ?? stage.label}
                    </p>

                    {onAction ? (
                      <button
                        type="button"
                        onClick={onAction}
                        className="mt-3 inline-flex min-h-9 items-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
                      >
                        Take action
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="mt-7 border-t border-[#e5ddd5] pt-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[#24201d]">
              Where the time went
            </p>

            <p className="mt-1 text-xs leading-5 text-[#8a7d72]">
              Attribution is based on the responsible workflow milestone.
            </p>
          </div>

          <p className="text-xs font-semibold text-[#6b635d]">
            {formatDuration(totalAttributed)}
          </p>
        </div>

        {/* Attribution bar */}
        <div className="mt-4 h-2 overflow-hidden bg-[#e8e1da]">
          <div className="flex h-full w-full">
            <div
              className="bg-[#24201d]"
              style={{
                width: `${getBarWidth(
                  summary.buyerMs,
                  totalAttributed,
                )}%`,
              }}
            />

            <div
              className="bg-[#8a7d72]"
              style={{
                width: `${getBarWidth(
                  summary.sellerMs,
                  totalAttributed,
                )}%`,
              }}
            />

            <div
              className="bg-[#bcb2a9]"
              style={{
                width: `${getBarWidth(
                  summary.rtoMs,
                  totalAttributed,
                )}%`,
              }}
            />

            <div
              className="bg-[#e1d8d1]"
              style={{
                width: `${getBarWidth(
                  summary.sharedMs + summary.systemMs,
                  totalAttributed,
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Attribution values */}
        <div className="mt-4 grid gap-0 border border-[#d9d0c7] sm:grid-cols-3">
          <div className="border-b border-[#e5ddd5] px-4 py-3 sm:border-b-0 sm:border-r">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Buyer
            </p>

            <p className="mt-1 text-sm font-bold text-[#24201d]">
              {formatDuration(summary.buyerMs)}
            </p>
          </div>

          <div className="border-b border-[#e5ddd5] px-4 py-3 sm:border-b-0 sm:border-r">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Seller
            </p>

            <p className="mt-1 text-sm font-bold text-[#24201d]">
              {formatDuration(summary.sellerMs)}
            </p>
          </div>

          <div className="px-4 py-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              RTO
            </p>

            <p className="mt-1 text-sm font-bold text-[#24201d]">
              {formatDuration(summary.rtoMs)}
            </p>
          </div>
        </div>
      </div>

      {/* Current accountability */}
      {summary.currentStage.owner !== "shared" &&
      summary.currentStage.owner !== "system" ? (
        <div className="mt-5 border-l-2 border-[#e99b79] bg-[#f8f3ee] px-3 py-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Current accountability
          </p>

          <p className="mt-1 text-sm font-semibold text-[#24201d]">
            {ownerLabel(summary.currentStage.owner)}
          </p>
        </div>
      ) : null}
    </div>
  </section>
);
}