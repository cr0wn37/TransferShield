import { ArrowLeft, ClipboardList } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { AuditTimeline } from "../components/transfer/AuditTimeline";
import { useTransferStore } from "../state/transferStore";

export function TransferTimelinePage() {
  const { transferId } = useParams<{ transferId: string }>();
  const navigate = useNavigate();

  const transfer = useTransferStore((state) => state.transfer);

  if (!transferId) {
    navigate("/");
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8f1e8]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="border-b border-[#d9d0c7] pb-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Link
                to={`/transfer/${transferId}`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#8a7d72] transition hover:text-[#24201d]"
              >
                <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                Back to workspace
              </Link>

              <div className="mt-4 flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#fffdf9] text-[#b56f52]">
                  <ClipboardList
                    aria-hidden="true"
                    className="h-4 w-4"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                    Transfer record
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#24201d]">
                    Timeline
                  </h1>

                  <p className="mt-1 text-sm text-[#6b635d]">
                    A complete record of actions across the transfer.
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle summary */}
            <div className="border border-[#d9d0c7] bg-[#fffdf9] px-4 py-3 lg:min-w-[250px]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-bold tracking-wide text-[#24201d]">
                {transfer.vehicle.registrationNumber}
              </p>

              <p className="mt-1 text-[11px] text-[#8a7d72]">
                Transfer ID · {transferId}
              </p>
            </div>
          </div>

          {/* Local navigation */}
          <nav className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e5ddd5] pt-4">
            <Link
              to={`/transfer/${transferId}`}
              className="text-xs font-semibold text-[#8a7d72] transition hover:text-[#24201d]"
            >
              Workspace
            </Link>

            <span
              aria-current="page"
              className="text-xs font-semibold text-[#24201d]"
            >
              Timeline
            </span>

            <Link
              to={`/transfer/${transferId}`}
              className="text-xs font-semibold text-[#8a7d72] transition hover:text-[#24201d]"
            >
              Handover
            </Link>

            <Link
              to="/rto"
              className="text-xs font-semibold text-[#8a7d72] transition hover:text-[#24201d]"
            >
              RTO
            </Link>
          </nav>
        </header>

        {/* Timeline */}
        <div className="mt-6">
          <AuditTimeline events={transfer.timeline} />
        </div>
      </div>
    </main>
  );
}