import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileWarning,
  PlayCircle,
  RotateCcw,
} from "lucide-react";
import { Link , useNavigate } from "react-router-dom";
import { useState } from "react";
import { ContinueTransferDialog } from "../components/transfer/ContinueTransferDialog";

import { demoScenarios, type DemoScenario } from "../data/demoScenarios";
import { useTransferStore } from "../state/transferStore";

const scenarioIcons: Record<DemoScenario["id"], typeof PlayCircle> = {
  "happy-path": PlayCircle,
  "buyer-document-missing": CircleAlert,
  "seller-esign-pending": Clock3,
  "invalid-document": FileWarning,
  "rto-correction": CircleAlert,
  "completed-transfer": CheckCircle2,
};

const scenarioColors: Record<DemoScenario["id"], string> = {
  "happy-path": "bg-blue-100 text-blue-700",
  "buyer-document-missing": "bg-amber-100 text-amber-700",
  "seller-esign-pending": "bg-violet-100 text-violet-700",
  "invalid-document": "bg-rose-100 text-rose-700",
  "rto-correction": "bg-amber-100 text-amber-700",
  "completed-transfer": "bg-emerald-100 text-emerald-700",
};

export function DemoScenariosPage() {
  const navigate = useNavigate();
  const loadScenario = useTransferStore((state) => state.loadScenario);
  const resetTransfer = useTransferStore((state) => state.resetTransfer);

  const handleScenarioSelect = (scenarioId: DemoScenario["id"]) => {
    loadScenario(scenarioId);
    navigate("/transfer/demo");
  };

  const [isContinueDialogOpen, setIsContinueDialogOpen] = useState(false);
  

  const handleStartFresh = () => {
    resetTransfer();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl bg-slate-950 px-6 py-8 text-white sm:px-8">
          <p className="text-sm font-semibold text-blue-300">TransferShield</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Demo scenarios
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Jump straight to a realistic ownership-transfer situation and
            demonstrate how TransferShield makes responsibilities and next
            steps clear.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleStartFresh}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              Start a fresh transfer
            </button>

           <button
            type="button"
            onClick={() => setIsContinueDialogOpen(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Open current transfer
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
          <Link
            to="/about"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            How TransferShield works
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          </div>
        </header>

        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-medium text-slate-500">
              Demo-ready states
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">
              Choose a scenario
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {demoScenarios.map((scenario) => {
              const Icon = scenarioIcons[scenario.id];

              return (
                <article
                  key={scenario.id}
                  className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${scenarioColors[scenario.id]}`}
                  >
                    <Icon aria-hidden="true" className="h-5 w-5" />
                  </div>

                  <div className="mt-5 flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {scenario.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {scenario.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleScenarioSelect(scenario.id)}
                    className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                  >
                    Open scenario
                    <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      {isContinueDialogOpen ? (
  <ContinueTransferDialog
    onClose={() => setIsContinueDialogOpen(false)}
    onVerified={() => {
      setIsContinueDialogOpen(false);
      navigate("/transfer/current");
    }}
  />
) : null}
    </main>
  );
}