import { AlertCircle, CalendarClock } from "lucide-react";

import type { Transfer } from "../../types/transfer";

interface TransferDeadlineProps {
  transfer: Transfer;
}

export function TransferDeadline({ transfer }: TransferDeadlineProps) {
  const { startsAt, days, type } = transfer.transferDeadline;

  const startDate = new Date(startsAt);
  const deadlineDate = new Date(startDate);
  deadlineDate.setDate(deadlineDate.getDate() + days);

  const now = new Date();

  const millisecondsRemaining =
    deadlineDate.getTime() - now.getTime();

  const daysRemaining = Math.max(
    0,
    Math.ceil(millisecondsRemaining / (1000 * 60 * 60 * 24)),
  );

  const isExpired = daysRemaining === 0;
  const isUrgent = daysRemaining <= 3 && !isExpired;

  const transferType =
    type === "interstate" ? "Interstate transfer" : "Same-state transfer";

  return (
  <section
    aria-label="Statutory transfer deadline"
    className={[
      "border bg-[#fffdf9]",
      isExpired
        ? "border-[#d9b5b5]"
        : isUrgent
          ? "border-[#dfc58e]"
          : "border-[#d9d0c7]",
    ].join(" ")}
  >
    {/* Header */}
    <div className="border-b border-[#e5ddd5] px-4 py-3">
      <div className="flex items-center gap-2">
        {isExpired ? (
          <AlertCircle
            aria-hidden="true"
            className="h-4 w-4 text-[#a94444]"
          />
        ) : (
          <CalendarClock
            aria-hidden="true"
            className="h-4 w-4 text-[#b56f52]"
          />
        )}

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
          Statutory deadline
        </p>
      </div>
    </div>

    {/* Main deadline */}
    <div className="px-4 py-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p
            className={[
              "text-2xl font-bold tracking-tight",
              isExpired
                ? "text-[#a94444]"
                : isUrgent
                  ? "text-[#a46f24]"
                  : "text-[#24201d]",
            ].join(" ")}
          >
            {isExpired
              ? "Expired"
              : `${daysRemaining} ${
                  daysRemaining === 1 ? "day" : "days"
                }`}
          </p>

          {!isExpired ? (
            <p className="mt-0.5 text-xs text-[#8a7d72]">
              remaining
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
            Deadline
          </p>

          <p className="mt-1 text-xs font-semibold text-[#24201d]">
            {deadlineDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Transfer type */}
      <div className="mt-4 border-t border-[#e5ddd5] pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
          Application window
        </p>

        <p className="mt-1 text-xs font-semibold text-[#24201d]">
          {transferType} · {days}-day window
        </p>
      </div>

      {/* Status message */}
      <p className="mt-3 text-xs leading-5 text-[#6b635d]">
        Complete the ownership transfer within the applicable statutory
        window.
      </p>

      {/* Urgency state */}
      {isExpired ? (
        <div className="mt-3 border-l-2 border-[#c96262] bg-[#fbefef] px-3 py-2">
          <p className="text-xs font-semibold text-[#8f3d3d]">
            Deadline reached
          </p>
        </div>
      ) : isUrgent ? (
        <div className="mt-3 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-3 py-2">
          <p className="text-xs font-semibold text-[#8c6427]">
            Deadline approaching
          </p>
        </div>
      ) : null}
    </div>
  </section>
);}