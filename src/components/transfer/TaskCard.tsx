import {
  CheckCircle2,
  CircleAlert,
  Clock3,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

import type { PartyRole, TaskStatus, TransferTask } from "../../types/transfer";

interface TaskCardProps {
  task: TransferTask;
  status: TaskStatus;
  onAction?: () => void;
  correctionsResolved?: boolean;
onResubmitToRto?: () => void;
}

const ownerLabels: Record<PartyRole, string> = {
  seller: "Seller",
  buyer: "Buyer",
  rto: "RTO",
  shared: "Seller + Buyer",
};

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    icon: typeof Clock3;
    cardClassName: string;
    badgeClassName: string;
  }
> = {
  locked: {
    label: "Locked",
    icon: LockKeyhole,
    cardClassName: "border-slate-200 bg-slate-50",
    badgeClassName: "bg-slate-200 text-slate-600",
  },
  pending: {
    label: "To do",
    icon: Clock3,
    cardClassName: "border-blue-200 bg-white",
    badgeClassName: "bg-blue-100 text-blue-700",
  },
  completed: {
    label: "Done",
    icon: CheckCircle2,
    cardClassName: "border-emerald-200 bg-emerald-50",
    badgeClassName: "bg-emerald-100 text-emerald-700",
  },
  blocked: {
    label: "Needs attention",
    icon: CircleAlert,
    cardClassName: "border-amber-200 bg-amber-50",
    badgeClassName: "bg-amber-100 text-amber-800",
  },
};

export function TaskCard({ task, status, onAction, correctionsResolved, onResubmitToRto }: TaskCardProps) {
  console.log(
    "TASK CARD:",
    task.title,
    "status:",
    status,
    "correctionsResolved:",
    correctionsResolved,
  );
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isActionable = status === "pending" || status === "blocked";

 return (
  <article
    className={[
      "border p-4 transition",
      status === "completed"
        ? "border-[#d8e5d9] bg-[#f4f8f4]"
        : status === "locked"
          ? "border-[#e5ddd5] bg-[#f8f3ee]"
          : status === "blocked"
            ? "border-[#ead7ad] bg-[#fbf3e3]"
            : "border-[#e1d3cb] bg-[#fffdf9]",
    ].join(" ")}
  >
    <div className="flex items-start gap-3">
      <StatusIcon
        aria-hidden="true"
        className={[
          "mt-0.5 h-5 w-5 shrink-0",
          status === "completed"
            ? "text-[#6f8a72]"
            : status === "blocked"
              ? "text-[#a46f24]"
              : status === "locked"
                ? "text-[#a79b91]"
                : "text-[#6b635d]",
        ].join(" ")}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p
            className={[
              "text-sm font-semibold",
              status === "locked"
                ? "text-[#7b7169]"
                : "text-[#24201d]",
            ].join(" ")}
          >
            {task.title}
          </p>

          <span
            className={[
              "border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
              status === "completed"
                ? "border-[#c7d8ca] bg-[#eef5ef] text-[#56715a]"
                : status === "blocked"
                  ? "border-[#e0c487] bg-[#fbf3e3] text-[#8c6427]"
                  : status === "locked"
                    ? "border-[#d9d0c7] bg-[#f1ece7] text-[#8a7d72]"
                    : "border-[#d9c2b7] bg-[#f8ece7] text-[#9a604a]",
            ].join(" ")}
          >
            {config.label}
          </span>
        </div>

        <p
          className={[
            "mt-2 text-sm leading-5",
            status === "locked"
              ? "text-[#9b9188]"
              : "text-[#6b635d]",
          ].join(" ")}
        >
          {task.description}
        </p>

        <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          {ownerLabels[task.owner]}
        </p>

        {status === "locked" ? (
          <p className="mt-2 text-xs leading-5 text-[#9b9188]">
            Complete the earlier step to unlock this task.
          </p>
        ) : null}

        {status === "blocked" && task.blockedReason ? (
          <p className="mt-2 text-xs font-medium leading-5 text-[#8c6427]">
            {task.blockedReason}
          </p>
        ) : null}

        {isActionable &&
        task.actionLabel &&
        (onAction || onResubmitToRto) ? (
          <button
            type="button"
            onClick={onAction}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
          >
            {status === "blocked"
              ? "Fix & re-upload"
              : task.actionLabel}

            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </button>
        ) : null}
      </div>
    </div>
  </article>
);}