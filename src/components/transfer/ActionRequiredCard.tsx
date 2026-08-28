import {
  AlertCircle,
  ArrowRight,
  Clock3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import type { PartyRole, Transfer } from "../../types/transfer";
import { getActionRequired } from "../../utils/workflow";

interface ActionRequiredCardProps {
  transfer: Transfer;
  onAction?: () => void;
}

const roleLabels: Record<PartyRole | "system", string> = {
  seller: "Seller action required",
  buyer: "Buyer action required",
  rto: "RTO action required",
  shared: "Seller and buyer action required",
  system: "Transfer status",
};

function getRoleIcon(role: PartyRole | "system") {
  if (role === "shared") {
    return UsersRound;
  }

  if (role === "system") {
    return ShieldCheck;
  }

  return role === "rto" ? AlertCircle : Clock3;
}

export function ActionRequiredCard({
  transfer,
  onAction,
}: ActionRequiredCardProps) {
  const action = getActionRequired(transfer);
  const Icon = getRoleIcon(action.role);
  const needsAttention = transfer.status === "ACTION_REQUIRED";

  return (
  <section
    aria-label="Required next action"
    className={`rounded-2xl border p-5 shadow-sm sm:p-6 ${
      needsAttention
        ? "border-amber-200 bg-amber-50"
        : "border-blue-100 bg-blue-50"
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          needsAttention
            ? "bg-amber-100 text-amber-800"
            : "bg-blue-100 text-blue-700"
        }`}
      >
        <Icon aria-hidden="true" className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-semibold ${
            needsAttention ? "text-amber-800" : "text-blue-700"
          }`}
        >
          {roleLabels[action.role]}
        </p>

        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          {action.title}
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
          {action.description}
        </p>

        {needsAttention ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-200 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Responsible party
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {action.role === "buyer"
                  ? "Buyer"
                  : action.role === "seller"
                    ? "Seller"
                    : action.role === "rto"
                      ? "RTO"
                      : "Shared"}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Issue
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {transfer.rto.reasonCode?.replaceAll("_", " ") ??
                  "Correction requested"}
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-white/70 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Affected document
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">
                {transfer.rto.requestedDocumentId
                  ? transfer.documents.find(
                      (document) =>
                        document.id === transfer.rto.requestedDocumentId,
                    )?.label ?? "Document"
                  : "See correction details"}
              </p>
            </div>
          </div>
        ) : null}

        {needsAttention ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              What you need to do
            </p>

            <p className="mt-1 text-sm leading-6 text-slate-700">
              {transfer.rto.requiredAction ??
                "Review the correction request and update the affected information."}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Your completed steps are preserved. You do not need to restart
              the transfer.
            </p>
          </div>
        ) : null}

        {action.actionLabel && onAction ? (
          <button
            type="button"
            onClick={onAction}
            className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
              needsAttention
                ? "bg-amber-700 hover:bg-amber-800"
                : "bg-blue-700 hover:bg-blue-800"
            }`}
          >
            {action.actionLabel}
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  </section>
);}