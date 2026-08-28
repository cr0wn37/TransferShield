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

export function TaskCard({ task, status, onAction }: TaskCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isActionable = status === "pending" || status === "blocked";

  return (
    <article className={`rounded-xl border p-4 ${config.cardClassName}`}>
      <div className="flex items-start gap-3">
        <StatusIcon
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            status === "completed"
              ? "text-emerald-600"
              : status === "blocked"
                ? "text-amber-700"
                : "text-slate-500"
          }`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-900">{task.title}</p>

            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClassName}`}
            >
              {config.label}
            </span>
          </div>

          <p className="mt-2 text-sm leading-5 text-slate-600">
            {task.description}
          </p>

          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {ownerLabels[task.owner]}
          </p>

          {status === "locked" ? (
            <p className="mt-2 text-xs text-slate-500">
              Complete the earlier step to unlock this task.
            </p>
          ) : null}

          {status === "blocked" && task.blockedReason ? (
            <p className="mt-2 text-xs font-medium text-amber-800">
              {task.blockedReason}
            </p>
          ) : null}

          {isActionable && task.actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              {status === "blocked" ? "Fix & re-upload" : task.actionLabel}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}