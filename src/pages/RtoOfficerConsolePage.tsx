import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Filter,
  Landmark,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useTransferStore } from "../state/transferStore";
import { rtoDemoCases } from "../data/rtoDemoCases";
import type {
  RtoQueueCase,
  RtoQueueStatus,
} from "../types/rtoCase";

function getAgeInHours(
  submittedAt: string,
): number {
  return Math.max(
    0,
    (Date.now() -
      new Date(submittedAt).getTime()) /
      (1000 * 60 * 60),
  );
}

function formatAge(
  submittedAt: string,
) {
  const hours = getAgeInHours(
    submittedAt,
  );

  if (hours < 1) {
    return "Just now";
  }

  if (hours < 24) {
    return `${Math.floor(hours)}h`;
  }

  return `${Math.floor(hours / 24)}d`;
}

function getStatusLabel(
  status: RtoQueueStatus,
) {
  const labels: Record<
    RtoQueueStatus,
    string
  > = {
    READY_FOR_REVIEW:
      "Ready for review",
    UNDER_REVIEW:
      "Under review",
    CORRECTION_REQUIRED:
      "Correction required",
    RESUBMITTED:
      "Resubmitted",
    OVERDUE:
      "Overdue",
    APPROVED:
      "Approved",
  };

  return labels[status];
}




export function RtoOfficerConsolePage() {
  const navigate = useNavigate();

  const transfer = useTransferStore(
    (state) => state.transfer,
  );

  const [
    query,
    setQuery,
  ] = useState("");

  const [
    filter,
    setFilter,
  ] = useState<
    "all" | "active" | "overdue" | "correction"
  >("all");

  const currentCase: RtoQueueCase = {
    id: transfer.id,
    vehicleNumber:
      transfer.vehicle.registrationNumber,
    sellerName:
      transfer.seller.name,
    buyerName:
      transfer.buyer.name,
    submittedAt:
      transfer.updatedAt,
    status:
      transfer.status ===
        "ACTION_REQUIRED"
        ? "CORRECTION_REQUIRED"
        : transfer.status ===
            "RESUBMISSION"
          ? "RESUBMITTED"
          : transfer.status ===
              "RTO_APPROVED"
            ? "APPROVED"
            : transfer.status ===
                "TRANSFER_COMPLETED"
              ? "APPROVED"
              : "READY_FOR_REVIEW",
    transferStatus:
      transfer.status,
    priority: "normal",
    isDemo: false,
  };

  const cases = useMemo(
    () => [
      currentCase,
      ...rtoDemoCases.filter(
        (item) =>
          item.id !== currentCase.id,
      ),
    ],
    [
      currentCase.id,
      currentCase.vehicleNumber,
      currentCase.sellerName,
      currentCase.buyerName,
      currentCase.submittedAt,
      currentCase.status,
      currentCase.transferStatus,
    ],
  );

  const filteredCases = useMemo(() => {
    const normalizedQuery =
      query
        .trim()
        .toLowerCase();

    return cases.filter((item) => {
      const matchesQuery =
        !normalizedQuery ||
        item.id
          .toLowerCase()
          .includes(normalizedQuery) ||
        item.vehicleNumber
          .toLowerCase()
          .includes(normalizedQuery) ||
        item.sellerName
          .toLowerCase()
          .includes(normalizedQuery) ||
        item.buyerName
          .toLowerCase()
          .includes(normalizedQuery);

      if (!matchesQuery) {
        return false;
      }

      if (
        filter === "overdue"
      ) {
        return item.status === "OVERDUE";
      }

      if (
        filter === "correction"
      ) {
        return (
          item.status ===
            "CORRECTION_REQUIRED"
        );
      }

      if (
        filter === "active"
      ) {
        return [
          "READY_FOR_REVIEW",
          "UNDER_REVIEW",
          "RESUBMITTED",
          "OVERDUE",
          "CORRECTION_REQUIRED",
        ].includes(
          item.status,
        );
      }

      return true;
    });
  }, [cases, filter, query]);

  const overdueCount =
    cases.filter(
      (item) =>
        item.status ===
        "OVERDUE",
    ).length;

  const correctionCount =
    cases.filter(
      (item) =>
        item.status ===
        "CORRECTION_REQUIRED",
    ).length;

  const activeCount =
    cases.filter(
      (item) =>
        !["APPROVED"].includes(
          item.status,
        ),
    ).length;

  return (
  <main className="min-h-screen bg-[#f8f1e8] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl">
      {/* ======================================================= */}
      {/* HEADER                                                    */}
      {/* ======================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
  to={`/transfer/${transfer.id}`}
  className="inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-[#b56f52] transition hover:text-[#24201d]"
>
  <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
  Back to workspace
</Link>

        <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
          RTO officer workspace
        </div>
      </div>

      <header className="mt-5 border-y border-[#d9d0c7] bg-[#fffdf9]">
        <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Ownership transfer applications
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#24201d]">
              RTO Officer Console
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6b635d]">
              Review submitted transfer applications, prioritize aging cases,
              and send structured corrections without restarting a case.
            </p>
          </div>

          <div className="shrink-0 text-left lg:text-right">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
              Applications in view
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-[#24201d]">
              {cases.length}
            </p>
          </div>
        </div>
      </header>

      {/* ======================================================= */}
      {/* QUEUE SUMMARY                                            */}
      {/* ======================================================= */}

      <div className="mt-5 grid gap-px border border-[#d9d0c7] bg-[#d9d0c7] sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setFilter("active")}
          className={`bg-[#fffdf9] px-4 py-4 text-left transition hover:bg-[#fbf7f2] ${
            filter === "active"
              ? "border-l-2 border-[#24201d]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                Active cases
              </p>

              <p className="mt-1 text-xl font-bold text-[#24201d]">
                {activeCount}
              </p>
            </div>

            <Clock3
              aria-hidden="true"
              className="h-4 w-4 text-[#8a7d72]"
            />
          </div>

          <p className="mt-2 text-[11px] text-[#6b635d]">
            Awaiting officer action
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("overdue")}
          className={`bg-[#fffdf9] px-4 py-4 text-left transition hover:bg-[#fbf7f2] ${
            filter === "overdue"
              ? "border-l-2 border-[#d49a45]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8c6427]">
                Overdue
              </p>

              <p className="mt-1 text-xl font-bold text-[#24201d]">
                {overdueCount}
              </p>
            </div>

            <AlertTriangle
              aria-hidden="true"
              className="h-4 w-4 text-[#d49a45]"
            />
          </div>

          <p className="mt-2 text-[11px] text-[#6b635d]">
            Highest aging priority
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilter("correction")}
          className={`bg-[#fffdf9] px-4 py-4 text-left transition hover:bg-[#fbf7f2] ${
            filter === "correction"
              ? "border-l-2 border-[#d49a45]"
              : ""
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8c6427]">
                Correction required
              </p>

              <p className="mt-1 text-xl font-bold text-[#24201d]">
                {correctionCount}
              </p>
            </div>

            <Filter
              aria-hidden="true"
              className="h-4 w-4 text-[#d49a45]"
            />
          </div>

          <p className="mt-2 text-[11px] text-[#6b635d]">
            Waiting for citizen action
          </p>
        </button>
      </div>

      {/* ======================================================= */}
      {/* APPLICATION QUEUE                                        */}
      {/* ======================================================= */}

      <section className="mt-5 bg-[#fffdf9]">
        <div className="border-b border-[#d9d0c7] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                Review queue
              </p>

              <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                Application queue
              </h2>

              <p className="mt-1 text-xs leading-5 text-[#6b635d]">
                Cases are ordered for officer review and aging visibility.
              </p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7d72]"
              />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search case, vehicle or party"
                className="min-h-10 w-full border border-[#d9d0c7] bg-[#f8f3ee] pl-9 pr-3 text-xs text-[#24201d] outline-none transition placeholder:text-[#a2978d] focus:border-[#24201d]"
              />
            </div>
          </div>
        </div>

        {/* Table heading */}
        <div className="hidden grid-cols-[1.6fr_1.35fr_1fr_.75fr_1fr_92px] gap-4 border-b border-[#d9d0c7] bg-[#f8f3ee] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72] lg:grid">
          <span>Application</span>
          <span>Parties</span>
          <span>Submitted</span>
          <span>Age</span>
          <span>Status</span>
          <span />
        </div>

        <div className="divide-y divide-[#e5ddd5]">
          {filteredCases.map((item) => {
            const age = getAgeInHours(item.submittedAt);

            const isOverdue =
              item.status === "OVERDUE" || age >= 48;

            const canOpen = item.id === transfer.id;

            return (
              <div
                key={item.id}
                className="grid gap-4 px-5 py-4 transition hover:bg-[#fdfaf6] lg:grid-cols-[1.6fr_1.35fr_1fr_.75fr_1fr_92px] lg:items-center"
              >
                {/* Application */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#24201d]">
                      {item.id}
                    </p>

                    {!item.isDemo ? (
                      <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
                        Current
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-1 text-xs font-medium text-[#6b635d]">
                    {item.vehicleNumber}
                  </p>
                </div>

                {/* Parties */}
                <div>
                  <p className="text-xs font-semibold text-[#24201d]">
                    {item.sellerName}
                  </p>

                  <p className="mt-1 text-[11px] text-[#8a7d72]">
                    Buyer: {item.buyerName}
                  </p>
                </div>

                {/* Submitted */}
                <div className="text-xs text-[#6b635d]">
                  {new Date(item.submittedAt).toLocaleString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    },
                  )}
                </div>

                {/* Age */}
                <div>
                  <span
                    className={
                      isOverdue
                        ? "text-xs font-semibold text-[#8c6427]"
                        : "text-xs font-medium text-[#6b635d]"
                    }
                  >
                    {formatAge(item.submittedAt)}
                  </span>

                  {isOverdue ? (
                    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8c6427]">
                      Priority
                    </p>
                  ) : null}
                </div>

                {/* Status */}
<div>
  <span
    className={`text-xs font-semibold ${
      item.status === "APPROVED"
        ? "text-[#5d7c60]"
        : item.status === "OVERDUE" ||
            item.status === "CORRECTION_REQUIRED"
          ? "text-[#8c6427]"
          : item.status === "RESUBMITTED"
            ? "text-[#b56f52]"
            : "text-[#6b635d]"
    }`}
  >
    {getStatusLabel(item.status)}
  </span>

  {item.priority === "high" ? (
    <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#8c6427]">
      High priority
    </p>
  ) : null}
</div>

                {/* Open */}
                <div className="lg:text-right">
                  <button
                    type="button"
                    onClick={() => {
                      if (canOpen) {
                        navigate(`/rto/${item.id}`);
                      }
                    }}
                    disabled={!canOpen}
                    className="inline-flex min-h-9 items-center justify-center gap-1.5 border border-[#24201d] bg-[#24201d] px-3 py-2 text-[11px] font-semibold text-white transition hover:bg-[#332e2a] disabled:cursor-not-allowed disabled:border-[#e2dad2] disabled:bg-[#f2ece6] disabled:text-[#9b9188]"
                  >
                    Open
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                    />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredCases.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <CheckCircle2
                aria-hidden="true"
                className="mx-auto h-6 w-6 text-[#5d7c60]"
              />

              <p className="mt-3 text-sm font-semibold text-[#24201d]">
                No cases match the current filter
              </p>

              <p className="mt-1 text-xs text-[#8a7d72]">
                Try another filter or search term.
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* ======================================================= */}
      {/* FOOTER                                                    */}
      {/* ======================================================= */}

      <div className="mt-4 flex items-center gap-2 border-t border-[#d9d0c7] py-4 text-[10px] leading-5 text-[#8a7d72]">
        <Landmark
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0"
        />

        <span>
          Prototype queue data is simulated except the current
          TransferShield application.
        </span>
      </div>
    </div>
  </main>
);
}