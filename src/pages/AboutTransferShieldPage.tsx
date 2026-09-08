import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  FileWarning,
  Landmark,
  LockKeyhole,
  RefreshCcw,
  ScanSearch,
  ShieldCheck,
  TimerReset,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    title: "Verify vehicle",
    description:
      "Confirm the registration number, RTO, chassis details and registered-mobile access before the transfer begins.",
    icon: ScanSearch,
  },
  {
    number: "02",
    title: "Check vehicle compliance",
    description:
      "Check for issues such as pending e-Challans and active hypothecation before the parties invest time in the transfer.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Transfer readiness",
    description:
      "Validate the basic conditions for the transfer and surface anything that needs attention before the shared workflow starts.",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Shared workspace",
    description:
      "Seller and buyer work from one shared case instead of coordinating the transfer across messages, documents and disconnected steps.",
    icon: UsersRound,
  },
  {
    number: "05",
    title: "Clear action ownership",
    description:
      "The workspace continuously tells the right person what to do next, why it matters and what is blocking progress.",
    icon: TimerReset,
  },
  {
    number: "06",
    title: "Documents + AI verification",
    description:
      "Required documents are collected and checked before submission so common issues can be caught earlier.",
    icon: FileCheck2,
  },
  {
    number: "07",
    title: "e-Sign + final review",
    description:
      "Each party completes their own document and e-sign package, followed by a final review before the application moves to the RTO.",
    icon: LockKeyhole,
  },
  {
    number: "08",
    title: "RTO correction loop",
    description:
      "When the RTO finds a problem, the specific document is returned to the responsible party instead of forcing the entire application to restart.",
    icon: RefreshCcw,
  },
  {
    number: "09",
    title: "RTO officer review",
    description:
      "The officer gets a dedicated case-processing view to review documents, request corrections and approve the application.",
    icon: Landmark,
  },
  {
    number: "10",
    title: "Completion + records",
    description:
      "Once approved, the transfer closes with a completion record, audit history and the supporting handover workflow.",
    icon: CheckCircle2,
  },
];

const supportingFeatures = [
  {
    title: "Digital Handover",
    description:
      "After payment, buyer and seller can create a time-bound digital record of the physical vehicle handover.",
    icon: HandshakeIcon,
    accent: "green",
  },
  {
    title: "SLA Clock",
    description:
      "Shows the statutory transfer deadline and makes it clear who currently owns the next action.",
    icon: Clock3,
    accent: "peach",
  },
  {
    title: "Tamper-evident timeline",
    description:
      "A hash-chained audit trail makes changes to the transfer history detectable.",
    icon: ShieldCheck,
    accent: "green",
  },
  {
    title: "Physical RTO docket",
    description:
      "Prepares the supporting physical submission packet when an in-person RTO step is required.",
    icon: FileWarning,
    accent: "amber",
  },
  {
    title: "Live Sync",
    description:
      "Buyer, seller and the shared case stay synchronized as work is completed.",
    icon: UsersRound,
    accent: "peach",
  },
];

function HandshakeIcon({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m8 12 2.5 2.5a2.1 2.1 0 0 0 3 0L16 12" />
      <path d="m3.5 8.5 3-3a2 2 0 0 1 2.8 0L12 8.2l2.7-2.7a2 2 0 0 1 2.8 0l3 3" />
      <path d="m3 9 3.5 6.5a2 2 0 0 0 2.7.8l1.6-.9" />
      <path d="m21 9-3.5 6.5a2 2 0 0 1-2.7.8l-1.6-.9" />
      <path d="M8.5 8.5 6.8 10.2a2 2 0 0 0 2.8 2.8l1-1" />
      <path d="M15.5 8.5 17.2 10.2a2 2 0 0 1-2.8 2.8l-1-1" />
    </svg>
  );
}

export function HowItWorksPage() {
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

          <div className="flex items-center gap-4 text-xs font-semibold text-[#6b635d]">
            <Link
              to="/demo"
              className="transition hover:text-[#24201d]"
            >
              Demo scenarios
            </Link>

            <Link
              to="/"
              className="transition hover:text-[#24201d]"
            >
              Start transfer
            </Link>
          </div>
        </div>

        {/* ===================================================== */}
        {/* HERO                                                   */}
        {/* ===================================================== */}

        <section className="border-b border-[#d9d0c7] bg-[#fffdf9]">
          <div className="grid gap-10 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[1.35fr_0.65fr] lg:px-10 lg:py-14">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#b56f52]">
                How TransferShield works
              </p>

              <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-[#24201d] sm:text-5xl">
                One transfer. One shared case. Everyone knows what happens
                next.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-7 text-[#6b635d] sm:text-lg">
                TransferShield turns a fragmented vehicle ownership transfer
                into a coordinated workflow connecting the vehicle check,
                buyer, seller, documents, payment, RTO review and final
                handover.
              </p>
            </div>

            <div className="border-l border-[#e5ddd5] pl-6 lg:self-end">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
                The core idea
              </p>

              <p className="mt-2 text-xl font-bold tracking-tight text-[#24201d]">
                Don't just digitize the forms.
              </p>

              <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                Coordinate the entire transaction from start to finish —
                including the failures, corrections and handoffs that usually
                cause delays.
              </p>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* TIMELINE INTRO                                          */}
        {/* ===================================================== */}

        <section className="px-1 py-10 sm:py-12">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b56f52]">
              The transfer journey
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#24201d] sm:text-3xl">
              From verification to completed handover
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#6b635d]">
              The workflow is designed around the actual movement of a case:
              identify the vehicle, establish readiness, coordinate both
              parties, survive corrections, complete RTO review and close the
              transaction cleanly.
            </p>
          </div>
        </section>

        {/* ===================================================== */}
        {/* ALTERNATING TIMELINE                                   */}
        {/* ===================================================== */}

        <section className="relative pb-14">
          {/* center line */}
          <div
  className="absolute bottom-12 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-[#d1c7bd] lg:block"
  aria-hidden="true"
/>

          <div className="space-y-12 lg:space-y-16">
  {steps.map((step, index) => {
    const isRight = index % 2 === 0;
    const Icon = step.icon;

    return (
      <article
        key={step.number}
        className="relative grid items-center gap-6 lg:grid-cols-[1fr_80px_1fr]"
      >
        {/* LEFT SIDE */}
        <div className="lg:pr-16">
          {!isRight ? (
            <div className="border border-[#d9d0c7] bg-[#fffdf9] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#b56f52]">
                  <Icon
                    aria-hidden="true"
                    className="h-4.5 w-4.5"
                  />
                </div>

                <span className="text-[10px] font-semibold tracking-[0.13em] text-[#b1a69c]">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#24201d]">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                {step.description}
              </p>
            </div>
          ) : null}
        </div>

        {/* CENTER */}
        <div className="flex justify-start lg:justify-center">
          <div className="relative z-10 flex h-11 w-11 items-center justify-center border border-[#cbbeb2] bg-[#f8f1e8] text-[10px] font-bold tracking-[0.08em] text-[#24201d]">
            {step.number}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:pl-16">
          {isRight ? (
            <div className="border border-[#d9d0c7] bg-[#fffdf9] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-10 w-10 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#b56f52]">
                  <Icon
                    aria-hidden="true"
                    className="h-4.5 w-4.5"
                  />
                </div>

                <span className="text-[10px] font-semibold tracking-[0.13em] text-[#b1a69c]">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-5 text-xl font-bold tracking-tight text-[#24201d]">
                {step.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                {step.description}
              </p>
            </div>
          ) : null}
        </div>
      </article>
    );
  })}
</div>
        </section>

        {/* ===================================================== */}
        {/* THE CORRECTION LOOP                                     */}
        {/* ===================================================== */}

        <section className="border-y border-[#d9d0c7] bg-[#fffdf9]">
          <div className="grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-b border-[#d9d0c7] px-5 py-7 sm:px-8 lg:border-b-0 lg:border-r lg:py-9">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                What happens when something goes wrong?
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#24201d]">
                Corrections become a loop, not a restart.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6b635d]">
                RTO can return a specific document to the responsible party.
                TransferShield preserves the completed case and reopens only
                the work that actually needs correction.
              </p>
            </div>

            <div className="grid sm:grid-cols-4">
              <div className="border-b border-[#e5ddd5] px-5 py-6 sm:border-b-0 sm:border-r">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#8a7d72]">
                  01
                </span>
                <p className="mt-2 text-sm font-bold text-[#24201d]">
                  RTO finds an issue
                </p>
              </div>

              <div className="border-b border-[#e5ddd5] px-5 py-6 sm:border-b-0 sm:border-r">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#8a7d72]">
                  02
                </span>
                <p className="mt-2 text-sm font-bold text-[#24201d]">
                  Correct party notified
                </p>
              </div>

              <div className="border-b border-[#e5ddd5] px-5 py-6 sm:border-b-0 sm:border-r">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#8a7d72]">
                  03
                </span>
                <p className="mt-2 text-sm font-bold text-[#24201d]">
                  Only that document reopens
                </p>
              </div>

              <div className="px-5 py-6">
                <span className="text-[10px] font-bold tracking-[0.12em] text-[#8a7d72]">
                  04
                </span>
                <p className="mt-2 text-sm font-bold text-[#5d7c60]">
                  Correct and resubmit
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* SUPPORTING FEATURES                                    */}
        {/* ===================================================== */}

        <section className="py-14 sm:py-16">
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b56f52]">
              Features that extend the workflow
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#24201d] sm:text-3xl">
              Built for the parts of the transfer that happen around the form.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#6b635d]">
              These features make the case easier to manage before, during and
              after government review.
            </p>
          </div>

          <div className="mt-8 grid gap-px border border-[#d9d0c7] bg-[#d9d0c7] sm:grid-cols-2 lg:grid-cols-5">
            {supportingFeatures.map((feature) => {
              const FeatureIcon = feature.icon;

              const iconClass =
                feature.accent === "green"
                  ? "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]"
                  : feature.accent === "amber"
                    ? "border-[#e3cfaa] bg-[#fbf3e3] text-[#8c6427]"
                    : "border-[#e5c5b6] bg-[#fcf3ed] text-[#b56f52]";

              return (
                <article
                  key={feature.title}
                  className="bg-[#fffdf9] p-5 sm:p-6"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center border ${iconClass}`}
                  >
                    <FeatureIcon
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </div>

                  <h3 className="mt-5 text-base font-bold tracking-tight text-[#24201d]">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-[#6b635d]">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* ===================================================== */}
        {/* WHY BETTER                                             */}
        {/* ===================================================== */}

        <section className="border-y border-[#d9d0c7] bg-[#fffdf9]">
          <div className="grid gap-0 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="border-b border-[#d9d0c7] px-5 py-8 sm:px-8 lg:border-b-0 lg:border-r lg:py-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                Why TransferShield
              </p>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#24201d]">
                The problem is coordination.
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6b635d]">
                A vehicle transfer can involve two people, multiple documents,
                payments, deadlines, signatures, government review and
                corrections. The risk is not just filling out a form — it is
                losing track of what happens next.
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              <div className="border-b border-[#e5ddd5] px-5 py-6 sm:border-b-0 sm:border-r sm:px-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
                  Instead of
                </p>

                <p className="mt-2 text-lg font-bold text-[#24201d]">
                  Scattered steps
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                  Messages, forms, payments and status updates living in
                  different places.
                </p>
              </div>

              <div className="px-5 py-6 sm:px-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#5d7c60]">
                  TransferShield
                </p>

                <p className="mt-2 text-lg font-bold text-[#24201d]">
                  One case, one next action
                </p>

                <p className="mt-2 text-sm leading-6 text-[#6b635d]">
                  Every participant works against the same transfer record,
                  with clear ownership and recovery when something goes wrong.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* FINAL CTA                                              */}
        {/* ===================================================== */}

        <section className="py-14 sm:py-16">
          <div className="border border-[#d9d0c7] bg-[#fffdf9] px-5 py-8 text-center sm:px-8 sm:py-10">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b56f52]">
              See it in action
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#24201d] sm:text-3xl">
              One transfer. One shared record.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#6b635d]">
              Start a transfer or open a demo scenario to see how the workflow
              behaves from verification through completion and digital
              handover.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
              <Link
                to="/"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
              >
                Start Transfer
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </Link>

              <Link
                to="/demo"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#d9d0c7] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#24201d] transition hover:border-[#24201d]"
              >
                Explore Demo Scenarios
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                />
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#d9d0c7] py-5 text-center text-[10px] leading-5 text-[#8a7d72]">
          TransferShield is a prototype demonstrating a coordinated vehicle
          ownership-transfer workflow. Government services, payment and
          compliance data are simulated in the prototype.
        </footer>
      </div>
    </main>
  );
}