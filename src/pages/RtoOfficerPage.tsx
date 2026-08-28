import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  FileText,
  Landmark,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useTransferStore } from "../state/transferStore";
import type { RejectionReasonCode } from "../types/transfer";

const rejectionReasons: Array<{
  code: RejectionReasonCode;
  label: string;
  defaultMessage: string;
}> = [
  {
    code: "DOCUMENT_UNCLEAR",
    label: "Document is unclear",
    defaultMessage:
      "The uploaded document is unclear. Please upload a clearer copy.",
  },
  {
    code: "DOCUMENT_MISMATCH",
    label: "Document details do not match",
    defaultMessage:
      "The details in this document do not match the transfer application.",
  },
  {
    code: "FORM_INCOMPLETE",
    label: "Required form is incomplete",
    defaultMessage:
      "Please complete all required signatures and fields before resubmitting.",
  },
  {
    code: "ADDRESS_MISMATCH",
    label: "Address details do not match",
    defaultMessage:
      "The address proof does not match the address entered in the application.",
  },
  {
    code: "VEHICLE_DETAILS_MISMATCH",
    label: "Vehicle details do not match",
    defaultMessage:
      "The vehicle details do not match the submitted transfer information.",
  },
  {
    code: "OTHER",
    label: "Other issue",
    defaultMessage: "Please correct the requested information and resubmit.",
  },
];

export function RtoOfficerPage() {
  const transfer = useTransferStore((state) => state.transfer);
  const approveTransfer = useTransferStore((state) => state.approveTransfer);
  const completeTransfer = useTransferStore(
    (state) => state.completeTransfer,
  );
  const requestReupload = useTransferStore((state) => state.requestReupload);

  const [selectedDocumentId, setSelectedDocumentId] = useState(
    transfer.documents[0]?.id ?? "",
  );
  const [reasonCode, setReasonCode] =
    useState<RejectionReasonCode>("DOCUMENT_UNCLEAR");
  const [message, setMessage] = useState(
    rejectionReasons[0].defaultMessage,
  );

  const selectedDocument = transfer.documents.find(
    (document) => document.id === selectedDocumentId,
  );

  const canReview = transfer.status === "RTO_PROCESSING";
  const isApproved = transfer.status === "RTO_APPROVED";
  const isCompleted = transfer.status === "TRANSFER_COMPLETED";

  const handleReasonChange = (nextReasonCode: RejectionReasonCode) => {
    const reason = rejectionReasons.find(
      (item) => item.code === nextReasonCode,
    );

    setReasonCode(nextReasonCode);
    setMessage(reason?.defaultMessage ?? "");
  };

  const handleRequestReupload = () => {
    if (!selectedDocument) {
      return;
    }

    requestReupload(
      selectedDocument.id,
      reasonCode,
      message,
      selectedDocument.owner,
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/transfer/current"
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to shared workspace
        </Link>

        <header className="mt-4 flex flex-col gap-4 rounded-2xl bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Landmark aria-hidden="true" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">
                TransferShield demo · RTO officer view
              </p>
              <h1 className="mt-1 text-2xl font-bold">
                Review ownership transfer
              </h1>
              <p className="mt-2 text-sm text-slate-300">
                Application ID: {transfer.id}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-white/10 px-4 py-3 text-sm">
            <p className="text-slate-300">Vehicle</p>
            <p className="mt-1 font-semibold">
              {transfer.vehicle.registrationNumber}
            </p>
          </div>
        </header>

        {isCompleted ? (
          <section className="mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <CheckCircle2
              aria-hidden="true"
              className="h-6 w-6 shrink-0 text-emerald-700"
            />
            <div>
              <h2 className="font-semibold text-emerald-950">
                Transfer already completed
              </h2>
              <p className="mt-1 text-sm text-emerald-800">
                This ownership transfer has been recorded as complete.
              </p>
            </div>
          </section>
        ) : null}

        {isApproved ? (
          <section className="mt-6 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="h-6 w-6 shrink-0 text-emerald-700"
              />
              <div>
                <h2 className="font-semibold text-emerald-950">
                  Application approved
                </h2>
                <p className="mt-1 text-sm text-emerald-800">
                  Finalize the government ownership transfer record.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={completeTransfer}
              className="min-h-11 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Complete transfer
            </button>
          </section>
        ) : null}

        {!canReview && !isApproved && !isCompleted ? (
          <section className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <CircleAlert
              aria-hidden="true"
              className="h-6 w-6 shrink-0 text-amber-700"
            />
            <div>
              <h2 className="font-semibold text-amber-950">
                Application is not ready for review
              </h2>
              <p className="mt-1 text-sm text-amber-800">
                The seller and buyer must complete their requirements and submit
                the application to the RTO first.
              </p>
            </div>
          </section>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center gap-2">
              <FileText aria-hidden="true" className="h-5 w-5 text-blue-700" />
              <h2 className="text-lg font-semibold text-slate-900">
                Submitted documents
              </h2>
            </div>

            <div className="mt-5 space-y-5">
              {(["buyer", "seller"] as const).map((role) => {
                const roleDocuments = transfer.documents.filter(
                  (document) => document.owner === role,
                );

                const validCount = roleDocuments.filter(
                  (document) => document.status === "valid",
                ).length;

                return (
                  <div
                    key={role}
                    className="overflow-hidden rounded-xl border border-slate-200"
                  >
                    <div className="flex items-center justify-between bg-slate-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold capitalize text-slate-900">
                          {role}-submitted documents
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {validCount}/{roleDocuments.length} documents valid
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          validCount === roleDocuments.length
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {validCount === roleDocuments.length
                          ? "Ready"
                          : "Needs review"}
                      </span>
                    </div>

                    {roleDocuments.map((document) => (
                      <div
                        key={document.id}
                        className="flex flex-col gap-2 border-t border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {document.label}
                          </p>

                          <p className="mt-1 text-sm text-slate-600">
                            {document.fileName ?? "No file submitted"}
                          </p>
                        </div>

                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                            document.status === "valid"
                              ? "bg-emerald-100 text-emerald-700"
                              : document.status === "missing"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {document.status.replaceAll("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Transfer details
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-slate-500">Seller</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {transfer.seller.name}
                </dd>
                <p className="mt-1 text-slate-600">{transfer.seller.phoneMasked}</p>
                <p className="mt-1 leading-5 text-slate-600">
                  {transfer.seller.address ?? "Address not provided"}
                </p>
              </div>
              <div>
                <dt className="text-slate-500">Buyer</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {transfer.buyer.name}
                </dd>
                <p className="mt-1 text-slate-600">{transfer.buyer.phoneMasked}</p>
                <p className="mt-1 leading-5 text-slate-600">
                  {transfer.buyer.address ?? "Address not provided"}
                </p>
              </div>
              <div>
                <dt className="text-slate-500">Chassis number</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  XXXXX{transfer.vehicle.chassisLast5}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Insurance valid up to</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {transfer.vehicle.insuranceValidUpto}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">PUCC valid up to</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {transfer.vehicle.puccValidUpto}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        {canReview ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <h2 className="text-lg font-semibold text-emerald-950">
                Approve application
              </h2>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Confirm that the submitted information and documents are ready
                for ownership transfer completion.
              </p>
              <button
                type="button"
                onClick={approveTransfer}
                className="mt-5 min-h-11 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Approve transfer
              </button>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h2 className="text-lg font-semibold text-amber-950">
                Request correction
              </h2>
              <p className="mt-2 text-sm leading-6 text-amber-800">
                Ask the responsible party to upload a corrected document without
                restarting the application.
              </p>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                Document requiring correction
                <select
                  value={selectedDocumentId}
                  onChange={(event) => setSelectedDocumentId(event.target.value)}
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                >
                  {transfer.documents.map((document) => (
                    <option key={document.id} value={document.id}>
                      {document.label} — {document.owner}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                Reason
                <select
                  value={reasonCode}
                  onChange={(event) =>
                    handleReasonChange(
                      event.target.value as RejectionReasonCode,
                    )
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                >
                  {rejectionReasons.map((reason) => (
                    <option key={reason.code} value={reason.code}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-4 block text-sm font-semibold text-slate-800">
                Clear instruction for the citizen
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 outline-none ring-blue-600 focus:ring-2"
                />
              </label>

              <button
                type="button"
                onClick={handleRequestReupload}
                className="mt-5 min-h-11 rounded-xl bg-amber-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Request re-upload
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}