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
      className={`rounded-2xl border p-4 shadow-sm sm:p-5 ${
        isExpired
          ? "border-rose-200 bg-rose-50"
          : isUrgent
            ? "border-amber-200 bg-amber-50"
            : "border-amber-100 bg-amber-50/40"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isExpired
              ? "bg-rose-100 text-rose-700"
              : isUrgent
                ? "bg-amber-100 text-amber-700"
                : "bg-amber-50 text-amber-700"
          }`}
        >
          {isExpired ? (
            <AlertCircle aria-hidden="true" className="h-5 w-5" />
          ) : (
            <CalendarClock aria-hidden="true" className="h-5 w-5" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Statutory transfer deadline
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {transferType} · {days}-day application window
              </p>
            </div>

            <span
                className={`rounded-full px-3 py-1 text-sm font-bold ${
                  isExpired
                    ? "bg-rose-100 text-rose-700"
                    : isUrgent
                      ? "bg-amber-100 text-amber-800"
                      : "bg-amber-50 text-amber-700"
                }`}
              >
              {isExpired
                ? "Deadline reached"
                : `${daysRemaining} ${
                    daysRemaining === 1 ? "day" : "days"
                  } remaining`}
            </span>
          </div>

          <p className="mt-3 text-sm leading-5 text-slate-600">
            Complete the ownership transfer within the applicable statutory
            window. TransferShield keeps the remaining time visible so
            neither party loses track of the deadline.
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Deadline:{" "}
            <span className="font-semibold text-slate-700">
              {deadlineDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}