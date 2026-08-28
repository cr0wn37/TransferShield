import {
  ArrowRight,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  ClipboardList,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  UsersRound,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const improvements = [
  {
    icon: UsersRound,
    title: "One shared transaction",
    description:
      "Seller and buyer work on the same transfer instead of coordinating through messages and separate steps.",
  },
  {
    icon: CheckCircle2,
    title: "Clear responsibility",
    description:
      "Every task shows who needs to act, what is required, and what happens next.",
  },
  {
    icon: FileCheck2,
    title: "Catch errors earlier",
    description:
      "Documents are checked before submission, and both parties get a final review before the application is sent to the RTO.",
  },
  {
    icon: RefreshCcw,
    title: "Recover without restarting",
    description:
      "When the RTO requests a correction, the exact document and responsible party are identified so the case can continue.",
  },
  {
    icon: GitBranch,
    title: "Track the real state",
    description:
      "The transfer moves through explicit states instead of leaving citizens with an unclear 'pending' status.",
  },
  {
  icon: ClipboardList,
  title: "Auditable transfer history",
  description:
    "Every important action is recorded with who performed it, what changed, and when it happened—from verification through final ownership transfer.",
},
];

const simulations = [
  "Registered-vehicle OTP verification",
  "Aadhaar OTP e-sign",
  "Transfer fee payment",
  "Document validation",
  "VAHAN / Parivahan processing",
  "RTO review and approval",
  "RTO rejection and correction",
];

const futureIntegrations = [
  {
    current: "VAHAN / Parivahan",
    future: "Parivahan / VAHAN APIs",
    description:
      "Vehicle RC verification, transfer-status sync and application submission.",
  },
  {
    current: "DigiLocker",
    future: "DigiLocker + eSign",
    description:
      "Retrieve verified documents and enable consent-based digital signing.",
  },
  {
    current: "Payment gateways",
    future: "Government payment rails",
    description:
      "Secure transfer-fee payment with real-time transaction confirmation.",
  },
  {
    current: "RTO processing",
    future: "RTO workflow integration",
    description:
      "Send applications, receive review outcomes and route corrections to the right party.",
  },
  {
    current: "Notification services",
    future: "SMS / WhatsApp / Email",
    description:
      "Notify buyers and sellers when an action, deadline or status changes.",
  },
];

export function AboutTransferShieldPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-950 px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold text-blue-300">
                TransferShield
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
                Make sure the vehicle transfer actually gets completed.
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                TransferShield turns a fragmented ownership-transfer process
                into one guided transaction shared by the seller, buyer and
                RTO.
              </p>
            </div>

            <Link
              to="/start"
              className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100"
            >
              Start a transfer
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold text-blue-700">
              The problem
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              The sale can be complete while the government transfer is not.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600">
              Vehicle ownership transfer is a multi-party process involving
              verification, buyer details, documents, payment, e-signing and
              RTO processing. A citizen can complete several steps correctly
              and still not know who is responsible when the process gets
              stuck.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Seller and buyer have to coordinate multiple actions.",
                "Document requirements can be difficult to understand.",
                "A rejected application may not clearly identify who should fix it.",
                "A submitted application does not necessarily mean the transfer is complete.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <XCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-rose-500"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
            <p className="text-sm font-semibold text-blue-700">
              The TransferShield approach
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              One transaction. One shared state. Clear next action.
            </h2>

            <div className="mt-6 space-y-4">
              {[
                ["Seller", "Initiates and provides seller-side information"],
                ["Buyer", "Joins, confirms details, pays and completes buyer-side tasks"],
                ["Both", "Review their own submission before RTO processing"],
                ["RTO", "Reviews, approves or sends a specific correction"],
                ["TransferShield", "Keeps the transaction moving and records what happened"],
              ].map(([role, description]) => (
                <div
                  key={role}
                  className="rounded-xl border border-blue-100 bg-white p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {role}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-700">
              What changes for the citizen
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Complexity stays underneath. The next action stays simple.
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {improvements.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-blue-700">
                The part judges are seeing
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                This prototype uses simulated government dependencies.
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                The citizen journey is functional, but external government
                systems and sensitive services are intentionally mocked for
                safety and hackathon purposes.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 lg:max-w-sm">
              <p className="text-sm font-semibold text-amber-900">
                Prototype disclosure
              </p>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                No real Aadhaar, OTP, payment or government transaction is
                performed by this prototype.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {simulations.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
              >
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Smartphone className="h-5 w-5" aria-hidden="true" />
            </div>

            <p className="mt-5 text-sm font-semibold text-blue-700">
              Why users would prefer it
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Less guessing. Less coordination. Less waiting.
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Users always see the current state of the transfer.",
                "Each task tells them exactly what they need to do.",
                "The other party's progress is visible without exposing unnecessary information.",
                "Errors are caught before submission where possible.",
                "When something fails, the next action is explicit.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </div>

            <p className="mt-5 text-sm font-semibold text-blue-700">
              Trust and transparency
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              The system should always tell you what is happening.
            </h2>

            <div className="mt-5 space-y-4">
              {[
                "Verification is explicit before the transfer starts.",
                "Sensitive actions are assigned to the responsible party.",
                "Important events are recorded with timestamps and actors.",
                "RTO corrections point to the exact issue instead of reopening the entire process.",
                "The final transfer state is clearly separated from application submission.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    className="mt-0.5 h-5 w-5 shrink-0 text-violet-600"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
              <GitBranch className="h-5 w-5" aria-hidden="true" />
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-700">
                How TransferShield could scale
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Start with vehicle transfer. Scale into a broader transaction layer.
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                The long-term product would orchestrate the citizen journey
                while relying on authoritative government and service
                providers for verification, records and processing.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {futureIntegrations.map((item) => (
            <div
              key={item.current}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {item.current}
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {item.future}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Distribution
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Marketplace & Dealer SDK
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Create a TransferShield workspace automatically when a vehicle sale is initiated on a marketplace or dealer platform.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Platform expansion
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                Multi-party GovTech engine
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                Extend the same coordination, responsibility and audit infrastructure to workflows such as property mutation and tenant verification.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
          <p className="text-sm font-semibold text-blue-300">
            Why TransferShield exists
          </p>

          <h2 className="mt-2 max-w-3xl text-2xl font-bold sm:text-3xl">
            The goal is not to replace Parivahan. It is to make the citizen's
            transaction understandable, accountable and finishable.
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/start"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              Try the product
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              to="/demo"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Explore demo scenarios
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}