import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  
} from "lucide-react";

import type {
  ReadinessStatus,
  TransferReadinessResult,
} from "../../utils/transferReadiness";
import { useLanguage } from "../../context/LanguageContext";

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

  const { t } = useLanguage();

  return (
  <section className="border-t border-[#e5ddd5] pt-6">
    {/* Header */}
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
          {t("transferReadiness")}
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
          {t("yourTransferRoute")}
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#6b635d]">
          {t("transferRouteDescription")}
        </p>
      </div>

      <span
        className={`shrink-0 border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] ${status.className}`}
      >
        {status.label}
      </span>
    </div>

    {/* Route summary */}
    <div className="mt-5 border border-[#e5ddd5] bg-[#f8f3ee]">
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 px-4 py-4 text-sm">
        <span className="text-[#8a7d72]">
          Seller RTO
        </span>
        <span className="text-right font-semibold text-[#24201d]">
          {result.sellerRto}
        </span>

        <span className="border-t border-[#e5ddd5] pt-3 text-[#8a7d72]">
          Buyer RTO
        </span>
        <span className="border-t border-[#e5ddd5] pt-3 text-right font-semibold text-[#24201d]">
          {result.buyerRto}
        </span>

        <span className="border-t border-[#e5ddd5] pt-3 text-[#8a7d72]">
          {t("transferRoute")}
        </span>
        <span className="border-t border-[#e5ddd5] pt-3 text-right font-semibold text-[#24201d]">
          {routeLabels[result.routeType]}
        </span>
      </div>
    </div>

    {/* Additional requirements */}
    {result.additionalRequirements.length > 0 ? (
      <div className="mt-4 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-4 py-3">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-[#a46f24]"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#7b571f]">
              {t("additionalRequirementsDetected")}
            </p>

            <ul className="mt-1.5 space-y-1 text-xs leading-5 text-[#8a652c]">
              {result.additionalRequirements.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ) : null}

    {/* Warnings */}
    {result.warnings.length > 0 ? (
      <div className="mt-4 border border-[#e5ddd5] bg-white px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
          {t("checksToComplete")}
        </p>

        <ul className="mt-2 space-y-1 text-xs leading-5 text-[#6b635d]">
          {result.warnings.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    ) : null}

    {/* Blockers */}
    {result.blockers.length > 0 ? (
      <div className="mt-4 border-l-2 border-[#c96262] bg-[#fbefef] px-4 py-3">
        <p className="text-sm font-semibold text-[#8f3d3d]">
          {t("transferCannotStartYet")}
        </p>

        <ul className="mt-2 space-y-1 text-xs leading-5 text-[#a94444]">
          {result.blockers.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </div>
    ) : null}

    {/* Bottom action */}
    <div className="mt-5 border-t border-[#e5ddd5] pt-5">
      <div className="flex items-start gap-3">
        {canContinue ? (
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-[#6f8a72]"
            aria-hidden="true"
          />
        ) : (
          <AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0 text-[#b45c5c]"
            aria-hidden="true"
          />
        )}

        <p className="flex-1 text-xs leading-5 text-[#6b635d]">
          {canContinue
            ? t("continueToTransferShieldWorkspace")
            : t("resolveBlockerBeforeStarting")}
        </p>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onContinue}
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#d9d0c7] disabled:bg-[#e8e1da] disabled:text-[#9b9188]"
      >
        {t("startTransfer")}
        <ArrowRight
          className="h-4 w-4"
          aria-hidden="true"
        />
      </button>
    </div>
  </section>
);}