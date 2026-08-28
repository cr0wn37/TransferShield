import {
  CheckCircle2,
  FileCheck2,
  Landmark,
  Printer,
  ShieldCheck,
} from "lucide-react";

import type { Transfer } from "../../types/transfer";

interface CompletionRecordProps {
  transfer: Transfer;
}

function formatTimestamp(timestamp?: string) {
  if (!timestamp) {
    return "Completion time not available";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function CompletionRecord({ transfer }: CompletionRecordProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <div className="bg-emerald-700 px-5 py-6 text-white sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-emerald-100">
                Government transfer status
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                Transfer completed
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-50">
                Ownership transfer has been recorded as complete.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 print:hidden"
          >
            <Printer aria-hidden="true" className="h-4 w-4" />
            Print / save as PDF
          </button>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Application ID
          </p>
          <p className="mt-2 text-lg font-bold text-slate-950">{transfer.id}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Completion timestamp
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-950">
            {formatTimestamp(transfer.completedAt)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Vehicle registration
          </p>
          <p className="mt-2 text-lg font-bold text-slate-950">
            {transfer.vehicle.registrationNumber}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            RTO decision
          </p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <Landmark aria-hidden="true" className="h-4 w-4" />
            Approved by RTO
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <FileCheck2
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-700"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Seller</p>
              <p className="mt-1 text-sm text-slate-600">
                {transfer.seller.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 h-5 w-5 shrink-0 text-violet-700"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Buyer</p>
              <p className="mt-1 text-sm text-slate-600">
                {transfer.buyer.name}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-900">
          Keep this transfer ID and the audit timeline as your record of the
          completed ownership transfer.
        </p>
      </div>
    </section>
  );
}