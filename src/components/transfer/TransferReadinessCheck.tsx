import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  MapPin,
} from "lucide-react";

import type {
  ReadinessStatus,
  TransferReadinessResult,
} from "../../utils/transferReadiness";

interface TransferReadinessCheckProps {
  result: TransferReadinessResult;
  onContinue: () => void;
}

const routeLabels = {
  "same-rto": "Same RTO",
  "same-state-different-rto": "Same state • Different RTO",
  interstate: "Interstate transfer",
};

const statusCopy: Record<
  ReadinessStatus,
  { label: string; className: string }
> = {
  ready: {
    label: "Ready to start",
    className: "bg-emerald-100 text-emerald-800",
  },
  action_required: {
    label: "Action required",
    className: "bg-amber-100 text-amber-800",
  },
  blocked: {
    label: "Blocked",
    className: "bg-rose-100 text-rose-800",
  },
};

export function TransferReadinessCheck({
  result,
  onContinue,
}: TransferReadinessCheckProps) {
  const status = statusCopy[result.readinessStatus];

  const canContinue = result.readinessStatus !== "blocked";

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Transfer readiness
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-950">
            Your transfer route
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We checked the basic transfer route and mock vehicle
            requirements before starting the application.
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Seller RTO
            </span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {result.sellerRto}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Buyer RTO
            </span>
          </div>

          <p className="mt-2 font-semibold text-slate-900">
            {result.buyerRto}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Transfer route
          </p>

          <p className="mt-2 font-semibold text-slate-900">
            {routeLabels[result.routeType]}
          </p>
        </div>
      </div>

      {result.additionalRequirements.length > 0 ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Additional requirements detected
              </p>

              <ul className="mt-2 space-y-1 text-sm text-amber-800">
                {result.additionalRequirements.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {result.warnings.length > 0 ? (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Checks to complete
          </p>

          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {result.warnings.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.blockers.length > 0 ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-semibold text-rose-900">
            Transfer cannot start yet
          </p>

          <ul className="mt-2 space-y-1 text-sm text-rose-800">
            {result.blockers.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {canContinue ? (
            <CheckCircle2
              className="h-5 w-5 text-emerald-600"
              aria-hidden="true"
            />
          ) : (
            <AlertCircle
              className="h-5 w-5 text-rose-600"
              aria-hidden="true"
            />
          )}

          <span>
            {canContinue
              ? "You can continue to the TransferShield workspace."
              : "Resolve the blocker before starting the transfer."}
          </span>
        </div>

        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Start transfer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}