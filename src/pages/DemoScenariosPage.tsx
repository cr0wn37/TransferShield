import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileWarning,
  PlayCircle,
  RotateCcw,
  ShieldAlert,
  Handshake,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ContinueTransferDialog } from "../components/transfer/ContinueTransferDialog";

import {
  demoScenarios,
  type DemoScenario,
} from "../data/demoScenarios";
import { useTransferStore } from "../state/transferStore";

const scenarioIcons: Record<
  DemoScenario["id"],
  typeof PlayCircle
> = {
  "happy-path": PlayCircle,
  "vehicle-compliance-blocker": ShieldAlert,
  "seller-esign-pending": Clock3,
  "rto-correction": CircleAlert,
  "buyer-document-missing": FileWarning,
  "completed-transfer": CheckCircle2,
  "digital-handover": Handshake,
};

const scenarioAccent: Record<
  DemoScenario["id"],
  string
> = {
  "happy-path": "text-[#b56f52]",
  "vehicle-compliance-blocker": "text-[#8c6427]",
  "seller-esign-pending": "text-[#b56f52]",
  "rto-correction": "text-[#8c6427]",
  "buyer-document-missing": "text-[#8c6427]",
  "completed-transfer": "text-[#5d7c60]",
  "digital-handover": "text-[#5d7c60]",
};

const scenarioNumber: Record<
  DemoScenario["id"],
  string
> = {
  "happy-path": "01",
  "vehicle-compliance-blocker": "02",
  "seller-esign-pending": "03",
  "rto-correction": "04",
  "buyer-document-missing": "05",
  "completed-transfer": "06",
  "digital-handover": "07",
};

export function DemoScenariosPage() {
  const navigate = useNavigate();

  const loadScenario = useTransferStore(
    (state) => state.loadScenario,
  );

  const resetTransfer = useTransferStore(
    (state) => state.resetTransfer,
  );

  const [
    isContinueDialogOpen,
    setIsContinueDialogOpen,
  ] = useState(false);

  const handleScenarioSelect = (
  scenarioId: DemoScenario["id"],
) => {
  if (
    scenarioId === "vehicle-compliance-blocker"
  ) {
    navigate("/", {
      state: {
        demoComplianceScenario: "both",
      },
    });

    return;
  }

  loadScenario(scenarioId);
  navigate("/transfer/demo");
};

  const handleStartFresh = () => {
    resetTransfer();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-[#f8f1e8] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ===================================================== */}
        {/* TOP NAV                                                */}
        {/* ===================================================== */}

        <div className="flex flex-col gap-3 border-b border-[#d9d0c7] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/"
            className="inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-[#b56f52] transition hover:text-[#24201d]"
          >
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 rotate-180"
            />
            Back to home
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
            TransferShield prototype
          </p>
        </div>

        {/* ===================================================== */}
        {/* PAGE HEADER                                             */}
        {/* ===================================================== */}

        <header className="border-b border-[#d9d0c7] bg-[#fffdf9]">
          <div className="grid gap-8 px-5 py-7 sm:px-7 lg:grid-cols-[1.5fr_1fr] lg:items-end lg:px-8 lg:py-8">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b56f52]">
                Demo workspace
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#24201d] sm:text-4xl">
                Demo scenarios
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6b635d]">
                Jump directly into realistic transfer states to see how
                TransferShield coordinates people, documents, deadlines,
                government review, and handover.
              </p>
            </div>

            <div className="lg:border-l lg:border-[#e5ddd5] lg:pl-7">
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
                Seven demo states
              </p>

              <p className="mt-1 text-lg font-bold text-[#24201d]">
                From preparation to handover
              </p>

              <p className="mt-2 text-xs leading-5 text-[#6b635d]">
                Each scenario opens a pre-configured transfer so the workflow
                can be demonstrated without rebuilding the case.
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex flex-wrap gap-px border-t border-[#d9d0c7] bg-[#d9d0c7]">
            <button
              type="button"
              onClick={handleStartFresh}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-[#24201d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#332e2a] sm:flex-none"
            >
              <RotateCcw
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
              Start a fresh transfer
            </button>

            <button
              type="button"
              onClick={() =>
                setIsContinueDialogOpen(true)
              }
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-[#fffdf9] px-4 py-2.5 text-xs font-semibold text-[#24201d] transition hover:bg-[#fbf7f2] sm:flex-none"
            >
              Open current transfer
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            </button>

            <Link
              to="/about"
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-[#fffdf9] px-4 py-2.5 text-xs font-semibold text-[#24201d] transition hover:bg-[#fbf7f2] sm:flex-none"
            >
              How TransferShield works
              <ArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />
            </Link>
          </div>
        </header>

        {/* ===================================================== */}
        {/* SCENARIOS                                               */}
        {/* ===================================================== */}

        <section className="mt-8">
          <div className="flex flex-col gap-2 border-b border-[#d9d0c7] pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                Pre-configured cases
              </p>

              <h2 className="mt-1 text-xl font-bold tracking-tight text-[#24201d]">
                Choose a scenario
              </h2>
            </div>

            <p className="text-xs text-[#8a7d72]">
              Select a case to open the shared workspace.
            </p>
          </div>

          <div className="mt-5 grid gap-px border border-[#d9d0c7] bg-[#d9d0c7] md:grid-cols-2 xl:grid-cols-3">
            {demoScenarios.map((scenario) => {
              const Icon = scenarioIcons[scenario.id];
              const accent = scenarioAccent[scenario.id];
              const number = scenarioNumber[scenario.id];

              const isStandout =
                scenario.id === "digital-handover";

              return (
                <article
                  key={scenario.id}
                  className={`group flex min-h-[285px] flex-col bg-[#fffdf9] p-5 transition hover:bg-[#fdf9f4] sm:p-6 ${
                    isStandout
                      ? "xl:col-span-1"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-9 w-9 items-center justify-center border ${
                        scenario.id === "completed-transfer" ||
                        scenario.id === "digital-handover"
                          ? "border-[#cdddcf] bg-[#f4f8f4]"
                          : scenario.id ===
                                "vehicle-compliance-blocker" ||
                              scenario.id ===
                                "rto-correction" ||
                              scenario.id ===
                                "buyer-document-missing"
                            ? "border-[#e3cfaa] bg-[#fbf3e3]"
                            : "border-[#d9d0c7] bg-[#f8f3ee]"
                      }`}
                    >
                      <Icon
                        aria-hidden="true"
                        className={`h-4 w-4 ${accent}`}
                      />
                    </div>

                    <span className="text-[10px] font-semibold tracking-[0.12em] text-[#b1a69c]">
                      {number}
                    </span>
                  </div>

                  <div className="mt-6 flex-1">
                    <div className="flex items-start gap-3">
                      <h3 className="text-lg font-bold tracking-tight text-[#24201d]">
                        {scenario.title}
                      </h3>

                      {isStandout ? (
                        <span className="mt-0.5 border border-[#cdddcf] bg-[#f4f8f4] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#5d7c60]">
                          Standout
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm leading-6 text-[#6b635d]">
                      {scenario.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#e5ddd5] pt-4">
                    <button
                      type="button"
                      onClick={() =>
                        handleScenarioSelect(
                          scenario.id,
                        )
                      }
                      className="inline-flex min-h-10 w-full items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
                    >
                      Open scenario
                      <ArrowRight
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===================================================== */}
        {/* DEMO FLOW                                               */}
        {/* ===================================================== */}

        <section className="mt-8 border-y border-[#d9d0c7] bg-[#fffdf9]">
          <div className="grid gap-0 lg:grid-cols-[1fr_2fr]">
            <div className="border-b border-[#d9d0c7] px-5 py-5 sm:px-6 lg:border-b-0 lg:border-r">
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#b56f52]">
                Demo coverage
              </p>

              <h2 className="mt-1 text-base font-bold text-[#24201d]">
                The full transfer journey
              </h2>

              <p className="mt-2 text-xs leading-5 text-[#6b635d]">
                The scenarios are designed to show both normal progress and
                the points where real-world transfers tend to stall.
              </p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-[#e5ddd5] sm:grid-cols-4 sm:divide-y-0">
              <div className="px-4 py-4">
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#8a7d72]">
                  Prepare
                </p>
                <p className="mt-1 text-xs font-semibold text-[#24201d]">
                  Readiness
                </p>
              </div>

              <div className="px-4 py-4">
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#8a7d72]">
                  Coordinate
                </p>
                <p className="mt-1 text-xs font-semibold text-[#24201d]">
                  Buyer + seller
                </p>
              </div>

              <div className="px-4 py-4">
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#8a7d72]">
                  Recover
                </p>
                <p className="mt-1 text-xs font-semibold text-[#24201d]">
                  Corrections
                </p>
              </div>

              <div className="px-4 py-4">
                <p className="text-[9px] uppercase tracking-[0.1em] text-[#8a7d72]">
                  Finish
                </p>
                <p className="mt-1 text-xs font-semibold text-[#5d7c60]">
                  Completion + handover
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* FOOTER NOTE                                             */}
        {/* ===================================================== */}

        <div className="flex items-center gap-2 py-5 text-[10px] leading-5 text-[#8a7d72]">
          <PlayCircle
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0"
          />

          <span>
            Demo scenarios use simulated transfer records and mock
            government/payment interactions.
          </span>
        </div>
      </div>

      {/* ======================================================= */}
      {/* CONTINUE TRANSFER DIALOG                                  */}
      {/* ======================================================= */}

      {isContinueDialogOpen ? (
        <ContinueTransferDialog
          onClose={() =>
            setIsContinueDialogOpen(false)
          }
          onVerified={() => {
            setIsContinueDialogOpen(false);
            navigate("/transfer/current");
          }}
        />
      ) : null}
    </main>
  );
}