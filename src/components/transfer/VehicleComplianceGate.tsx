import { useState , useEffect} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Info,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import MockFinancierClearanceModal from "./MockFinancierClearanceModal";

import type { FinancierClearanceResult } from "../../lib/mockFinancierClearance";

import {
  checkVehicleCompliance,
  type ComplianceScenario,
} from "../../lib/vehicleCompliance";

import MockPaymentModal from "./MockPaymentModal";
import type { MockPaymentResult } from "../../lib/mockPayment";

import type {
  ComplianceIssue,
  VehicleCompliance,
} from "../../types/vehicleCompliance";
import { useLanguage } from "../../context/LanguageContext";

interface VehicleComplianceGateProps {
  registrationNumber: string;
  onCleared: (compliance: VehicleCompliance) => void;
  initialScenario?: ComplianceScenario;
  autoRun?: boolean;
}

const scenarios: {
  id: ComplianceScenario;

  label: string;
  description: string;
}[] = [
  {
    id: "clear",
    label: "All clear",
    description: "No pending challans or hypothecation",
  },
  {
    id: "challan",
    label: "Pending challan",
    description: "1 outstanding e-Challan",
  },
  {
    id: "hypothecation",
    label: "Active hypothecation",
    description: "Financier record is active",
  },
  {
    id: "both",
    label: "Multiple issues",
    description: "Challan + active hypothecation",
  },
  {
    id: "resolved",
    label: "Previously resolved",
    description: "Vehicle has no outstanding blockers",
  },
];

export default function VehicleComplianceGate({
  registrationNumber,
  onCleared,
  initialScenario = "both",
  autoRun = false,
}: VehicleComplianceGateProps) {
  const [scenario, setScenario] =
    useState<ComplianceScenario>(initialScenario);

  const [compliance, setCompliance] =
    useState<VehicleCompliance | null>(null);

  const [isChecking, setIsChecking] = useState(false);

  const [paymentIssue, setPaymentIssue] =
  useState<ComplianceIssue | null>(null);

  const { t } = useLanguage();

const [paymentResult, setPaymentResult] =
  useState<MockPaymentResult | null>(null);

  const [financierIssue, setFinancierIssue] =
  useState<ComplianceIssue | null>(null);

const [financierResult, setFinancierResult] =
  useState<FinancierClearanceResult | null>(null);

  const [resolvedIssues, setResolvedIssues] = useState<
    string[]
  >([]);

  const [expandedIssue, setExpandedIssue] = useState<
    string | null
  >(null);

  const [checkStep, setCheckStep] = useState(0);



  const runCheck = async () => {
  setIsChecking(true);
  setCheckStep(1);

  useEffect(() => {
  if (!autoRun) {
    return;
  }

  void runCheck();
}, [autoRun]);

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, 600),
    );

    setCheckStep(2);

    await new Promise((resolve) =>
      setTimeout(resolve, 650),
    );

    setCheckStep(3);

    await new Promise((resolve) =>
      setTimeout(resolve, 650),
    );

    const result = await checkVehicleCompliance(
      registrationNumber,
      scenario,
    );

    setCheckStep(4);

    const remainingIssues = result.issues.filter(
      (issue) => !resolvedIssues.includes(issue.id),
    );

    const updatedResult: VehicleCompliance = {
      ...result,
      status:
        remainingIssues.length === 0
          ? "clear"
          : "blocked",
      issues: remainingIssues,
    };

    setCompliance(updatedResult);

    if (updatedResult.status === "clear") {
      onCleared(updatedResult);
    }
  } finally {
    setIsChecking(false);
  }
};

  const resolveIssue = (issue: ComplianceIssue) => {
  setResolvedIssues((current) => {
    if (current.includes(issue.id)) {
      return current;
    }

    return [...current, issue.id];
  });
};

  const blockersRemaining = compliance?.issues.length ?? 0;

 return (
  <section className="w-full">
    {/* Header */}
    <div className="border-b border-[#e5ddd5] pb-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
            Vehicle compliance
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#24201d]">
            {t("vehicleComplianceCheck")}
          </h2>

          <p className="mt-1 text-sm leading-6 text-[#6b635d]">
            {t("vehicleComplianceDescription")}
          </p>
        </div>

        <div className="group relative shrink-0">
          <button
            type="button"
            aria-label="About compliance data"
            className="flex h-8 w-8 items-center justify-center border border-[#d9d0c7] text-[#7b7169] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
          >
            <Info className="h-4 w-4" />
          </button>

          <div className="pointer-events-none absolute right-0 top-full z-30 mt-2 hidden w-64 border border-[#d9d0c7] bg-[#fffdf9] p-4 text-left shadow-xl group-hover:block">
            <p className="text-xs font-semibold text-[#24201d]">
              Prototype data source
            </p>

            <p className="mt-1.5 text-xs leading-5 text-[#6b635d]">
              This prototype uses simulated VAHAN / e-Challan
              responses to demonstrate the compliance workflow.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Vehicle reference */}
    <div className="mt-5 flex items-center justify-between border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
          Vehicle record
        </p>

        <p className="mt-1 text-sm font-bold tracking-wide text-[#24201d]">
          {registrationNumber}
        </p>
      </div>

      <span className="border border-[#e5ddd5] bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8a7d72]">
        Prototype
      </span>
    </div>

    {/* Scenario selector */}
    {!compliance ? (
      <div className="mt-5">
        <p className="text-sm font-semibold text-[#24201d]">
          Select compliance scenario
        </p>

        <p className="mt-1 text-xs leading-5 text-[#7b7169]">
          Choose a demo vehicle record to simulate the compliance response.
        </p>

        <div className="mt-3 grid gap-2">
          {scenarios.map((item) => {
            const isSelected = scenario === item.id;

            const isClearScenario =
              item.id === "clear" ||
              item.id === "resolved";

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setScenario(item.id);
                  setCompliance(null);
                  setResolvedIssues([]);
                  setExpandedIssue(null);
                }}
                className={[
                  "flex w-full items-center justify-between gap-3 border px-4 py-3 text-left transition-colors",
                  isSelected
                    ? "border-[#e99b79] bg-[#fcf0e9]"
                    : "border-[#d9d0c7] bg-white hover:border-[#bdb2a8]",
                ].join(" ")}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#24201d]">
                    {item.label}
                  </p>

                  <p className="mt-0.5 text-xs leading-5 text-[#7b7169]">
                    {item.description}
                  </p>
                </div>

                <span
                  className={[
                    "shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wide",
                    isClearScenario
                      ? "bg-[#edf7ef] text-[#4d8060]"
                      : "bg-[#fff4df] text-[#aa7430]",
                  ].join(" ")}
                >
                  {isClearScenario
                    ? "Clear"
                    : "Action required"}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={runCheck}
          disabled={isChecking}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-[#e99b79] bg-[#e99b79] px-4 py-2.5 text-sm font-semibold text-[#24201d] transition hover:bg-[#e3906c] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" />
              {t("checkCompliance")}
            </>
          )}
        </button>
      </div>
    ) : null}

    {/* Result */}
    {compliance ? (
      <div className="mt-6">
        {/* Clear */}
        {compliance.status === "clear" ? (
          <div className="border border-emerald-200 bg-[#f4faf5] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-200 bg-white text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-800">
                  {t("vehicleComplianceCleared")}
                </p>

                <p className="mt-1 text-sm leading-6 text-emerald-700">
                  {t("noOutstandingComplianceBlockers")}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-emerald-200 pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-emerald-700">
                Vehicle ready
              </p>

              <p className="mt-1 text-sm text-emerald-800">
                You can now continue with the TransferShield workspace.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Blocker summary */}
            <div className="flex items-start justify-between gap-3 border border-amber-200 bg-[#fff8ea] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#fff0cf] text-[#ae762d]">
                  <AlertTriangle className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#3a3028]">
                    {t("actionRequiredBeforeTransfer")}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-[#75685d]">
                    {blockersRemaining} blocker
                    {blockersRemaining === 1 ? "" : "s"} remaining.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={runCheck}
                disabled={isChecking}
                className="inline-flex shrink-0 items-center gap-1.5 border border-[#d9d0c7] bg-white px-3 py-2 text-xs font-semibold text-[#4f4944] transition hover:bg-[#f8f3ee] disabled:opacity-50"
              >
                <RefreshCw
                  className={[
                    "h-3.5 w-3.5",
                    isChecking ? "animate-spin" : "",
                  ].join(" ")}
                />

                {t("recheck")}
              </button>
            </div>

            {/* Issues */}
            <div className="mt-3 space-y-2">
              {compliance.issues.map((issue) => {
                const isExpanded =
                  expandedIssue === issue.id;

                const isResolved =
                  resolvedIssues.includes(issue.id);

                return (
                  <div
                    key={issue.id}
                    className="overflow-hidden border border-[#d9d0c7] bg-white"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedIssue(
                          isExpanded ? null : issue.id,
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[#faf6f1]"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={[
                            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center",
                            isResolved
                              ? "bg-[#edf7ef] text-[#4d8060]"
                              : "bg-[#fff4df] text-[#ae762d]",
                          ].join(" ")}
                        >
                          {isResolved ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <AlertTriangle className="h-4 w-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-[#24201d]">
                              {issue.title}
                            </p>

                            <span
                              className={[
                                "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                                isResolved
                                  ? "bg-[#edf7ef] text-[#4d8060]"
                                  : "bg-[#fff4df] text-[#aa7430]",
                              ].join(" ")}
                            >
                              {isResolved
                                ? t("resolutionSubmitted")
                                : t("actionRequired")}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-[#7b7169]">
                            {issue.summary}
                          </p>
                        </div>
                      </div>

                      <ChevronDown
                        className={[
                          "h-4 w-4 shrink-0 text-[#8a7d72] transition",
                          isExpanded ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    {isExpanded ? (
                      <div className="border-t border-[#e5ddd5] bg-[#faf6f1] p-4">
                        {issue.type ===
                          "pending_challan" &&
                          issue.challan ? (
                          <>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="border border-[#e5ddd5] bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d72]">
                                  {t("challan")}
                                </p>

                                <p className="mt-1 text-xs font-bold text-[#24201d]">
                                  {issue.challan.id}
                                </p>
                              </div>

                              <div className="border border-[#e5ddd5] bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d72]">
                                  {t("amount")}
                                </p>

                                <p className="mt-1 text-xs font-bold text-[#24201d]">
                                  ₹
                                  {issue.challan.amount.toLocaleString(
                                    "en-IN",
                                  )}
                                </p>
                              </div>

                              <div className="border border-[#e5ddd5] bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d72]">
                                  {t("responsibility")}
                                </p>

                                <p className="mt-1 text-xs font-bold text-[#24201d]">
                                  {t("seller")}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-semibold text-[#24201d]">
                                How to resolve
                              </p>

                              <ol className="mt-2 space-y-2">
                                {[
                                  t("challanResolution1"),
                                  t("challanResolution2"),
                                  t("challanResolution3"),
                                  t("challanResolution4"),
                                ].map((step, index) => (
                                  <li
                                    key={step}
                                    className="flex gap-2 text-xs leading-5 text-[#6b635d]"
                                  >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-white text-[10px] font-bold text-[#6b635d] ring-1 ring-[#d9d0c7]">
                                      {index + 1}
                                    </span>

                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <a
                                href="https://echallan.parivahan.gov.in/"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 border border-[#d9d0c7] bg-white px-3 py-2 text-xs font-semibold text-[#4f4944] hover:bg-[#f8f3ee]"
                              >
                                {t("openEChallan")}
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>

                              <button
                                type="button"
                                onClick={() =>
                                  setPaymentIssue(issue)
                                }
                                disabled={isResolved}
                                className="inline-flex items-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a] disabled:border-emerald-700 disabled:bg-emerald-700"
                              >
                                {isResolved ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {t("paymentSubmitted")}
                                  </>
                                ) : (
                                  "Resolve payment"
                                )}
                              </button>
                            </div>
                          </>
                        ) : null}

                        {issue.type ===
                          "active_hypothecation" &&
                          issue.hypothecation ? (
                          <>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="border border-[#e5ddd5] bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d72]">
                                  {t("financier")}
                                </p>

                                <p className="mt-1 truncate text-xs font-bold text-[#24201d]">
                                  {
                                    issue.hypothecation
                                      .financierName
                                  }
                                </p>
                              </div>

                              <div className="border border-[#e5ddd5] bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d72]">
                                  {t("loanReference")}
                                </p>

                                <p className="mt-1 truncate text-xs font-bold text-[#24201d]">
                                  {
                                    issue.hypothecation
                                      .loanReference
                                  }
                                </p>
                              </div>

                              <div className="border border-[#e5ddd5] bg-white p-3">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#8a7d72]">
                                  {t("responsibility")}
                                </p>

                                <p className="mt-1 text-xs font-bold text-[#24201d]">
                                  {t("seller")}
                                </p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <p className="text-sm font-semibold text-[#24201d]">
                                How to resolve
                              </p>

                              <ol className="mt-2 space-y-2">
                                {[
                                  t("financierResolution1"),
                                  t("financierResolution2"),
                                  t("financierResolution3"),
                                  t("financierResolution4"),
                                ].map((step, index) => (
                                  <li
                                    key={step}
                                    className="flex gap-2 text-xs leading-5 text-[#6b635d]"
                                  >
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-white text-[10px] font-bold text-[#6b635d] ring-1 ring-[#d9d0c7]">
                                      {index + 1}
                                    </span>

                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            <div className="mt-4">
                              <button
                                type="button"
                                onClick={() =>
                                  setFinancierIssue(issue)
                                }
                                disabled={isResolved}
                                className="inline-flex items-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a] disabled:border-emerald-700 disabled:bg-emerald-700"
                              >
                                {isResolved ? (
                                  <>
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    {t("clearanceSubmitted")}
                                  </>
                                ) : (
                                  "Resolve hypothecation"
                                )}
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {/* Modals */}
            <MockPaymentModal
              isOpen={paymentIssue !== null}
              amount={paymentIssue?.challan?.amount ?? 0}
              challanId={paymentIssue?.challan?.id ?? ""}
              registrationNumber={registrationNumber}
              onSuccess={(result) => {
                setPaymentResult(result);

                if (paymentIssue) {
                  resolveIssue(paymentIssue);
                }
              }}
              onClose={() => {
                setPaymentIssue(null);
              }}
            />

            <MockFinancierClearanceModal
              isOpen={financierIssue !== null}
              financierName={
                financierIssue?.hypothecation
                  ?.financierName ?? ""
              }
              loanReference={
                financierIssue?.hypothecation
                  ?.loanReference ?? ""
              }
              registrationNumber={registrationNumber}
              onSuccess={(result) => {
                setFinancierResult(result);

                if (financierIssue) {
                  resolveIssue(financierIssue);
                }
              }}
              onClose={() => {
                setFinancierIssue(null);
              }}
            />

            {/* Locked state */}
            <div className="mt-4 flex items-center justify-between gap-3 border border-[#e5ddd5] bg-[#f8f3ee] px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-[#4f4944]">
                  Transfer locked
                </p>

                <p className="mt-0.5 text-[11px] leading-5 text-[#8a7d72]">
                  Resolve all compliance blockers before continuing.
                </p>
              </div>

              <span className="shrink-0 bg-[#fff0cf] px-2.5 py-1 text-[10px] font-bold text-[#aa7430]">
                {blockersRemaining} {t("remaining")}
              </span>
            </div>
          </>
        )}
      </div>
    ) : null}
  </section>
);}