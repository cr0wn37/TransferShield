import { useState } from "react";
import {
  CheckCircle2,
  FileText,
  Printer,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import type { Transfer } from "../types/transfer";

interface PhysicalRtoDocketProps {
  transfer: Transfer;
}

interface DocketItem {
  order: number;
  label: string;
  handling: string;
  responsibleParty: "Seller" | "Buyer" | "Both";
}

function getDocketItems(
  transfer: Transfer,
): DocketItem[] {
  const items: DocketItem[] = [
    {
      order: 1,
      label: "Vehicle Registration Certificate (RC)",
      handling: "Original",
      responsibleParty: "Seller",
    },
    {
      order: 2,
      label: "Form 29",
      handling: "2 signed copies",
      responsibleParty: "Seller",
    },
    {
      order: 3,
      label: "Form 30",
      handling: "Signed copy/copies as applicable",
      responsibleParty: "Both",
    },
    {
      order: 4,
      label: "Valid PUC Certificate",
      handling: "Copy",
      responsibleParty: "Buyer",
    },
    {
      order: 5,
      label: "Valid Insurance Certificate",
      handling: "Copy",
      responsibleParty: "Buyer",
    },
    {
      order: 6,
      label: "Buyer Address Proof",
      handling: "Copy",
      responsibleParty: "Buyer",
    },
    {
      order: 7,
      label: "Buyer Date-of-Birth Proof",
      handling: "Copy, if applicable",
      responsibleParty: "Buyer",
    },
    {
      order: 8,
      label: "Seller PAN / Form 60",
      handling: "Copy, if applicable",
      responsibleParty: "Seller",
    },
    {
      order: 9,
      label: "Buyer PAN / Form 60",
      handling: "Copy, if applicable",
      responsibleParty: "Buyer",
    },
    {
      order: 10,
      label: "Passport-size Photograph",
      handling: "Physical photograph, if applicable",
      responsibleParty: "Buyer",
    },
    {
      order: 11,
      label: "Tax Clearance Certificate",
      handling: "Only where applicable",
      responsibleParty: "Seller",
    },
  ];

  const hasFinancierDocument = transfer.documents.some(
    (document) =>
      document.label.toLowerCase().includes("financier") ||
      document.label.toLowerCase().includes("clearance") ||
      document.label.toLowerCase().includes("noc"),
  );

  if (hasFinancierDocument) {
    items.push({
      order: 12,
      label: "Financier clearance / NOC",
      handling: "Original or copy as required",
      responsibleParty: "Seller",
    });
  }

  return items;
}

export function PhysicalRtoDocket({
  transfer,
}: PhysicalRtoDocketProps) {
  const [isOpen, setIsOpen] = useState(false);

  const isAvailable =
    transfer.status === "RTO_APPROVED" ||
    transfer.status === "TRANSFER_COMPLETED";

  if (!isAvailable) {
    return null;
  }

  const docketItems = getDocketItems(transfer);

  const qrUrl = `${window.location.origin}/rto/${transfer.id}`;

  const handlePrint = () => {
    const docket = document.querySelector(
      ".printable-rto-docket",
    );

    if (!docket) {
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=1000,height=800",
    );

    if (!printWindow) {
      window.alert("Please allow pop-ups to print the docket.");
      return;
    }

    const styles = Array.from(
      document.querySelectorAll('link[rel="stylesheet"], style'),
    )
      .map((node) => node.outerHTML)
      .join("\n");

    printWindow.document.open();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Physical RTO Docket - ${transfer.id}</title>
          ${styles}

          <style>
            @page {
              size: A4;
              margin: 12mm;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
            }

            body {
              min-width: 0;
            }

            .printable-rto-docket {
              width: 100%;
              margin: 0;
              padding: 0;
              border: 0;
              border-radius: 0;
              box-shadow: none;
              background: white;
            }
          </style>
        </head>

        <body>
          ${docket.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
  <>
    {/* Compact workspace card */}
    <section className="physical-rto-docket-card mt-5 border border-[#d9d0c7] bg-[#fffdf9]">
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#b56f52]">
            <FileText
              aria-hidden="true"
              className="h-4 w-4"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Physical submission
            </p>

            <h2 className="mt-1 text-sm font-bold tracking-tight text-[#24201d]">
              Physical RTO docket
            </h2>

            <p className="mt-1 text-xs leading-5 text-[#6b635d]">
              Prepare the physical packet using the approved transfer record.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6b635d]">
                {docketItems.length} items
              </span>

              <span className="border border-[#cdddcf] bg-[#f4f8f4] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#5d7c60]">
                RTO approved
              </span>

              <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#6b635d]">
                {transfer.vehicle.registrationNumber}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
        >
          <FileText
            aria-hidden="true"
            className="h-4 w-4"
          />
          View docket
        </button>
      </div>
    </section>

    {/* Full docket modal */}
    {isOpen ? (
      <div
        className="rto-docket-modal fixed inset-0 z-50 overflow-y-auto bg-[#24201d]/55 p-3 sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-label="Physical RTO Docket"
      >
        <div className="rto-docket-modal-content mx-auto max-w-5xl">
          {/* Modal toolbar */}
          <div className="mb-3 flex flex-col gap-3 border border-[#3a342f] bg-[#24201d] px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div>
              <p className="text-sm font-semibold">
                Physical RTO Docket
              </p>

              <p className="mt-0.5 text-[11px] text-[#cfc5bc]">
                {transfer.id} · {transfer.vehicle.registrationNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex min-h-10 items-center gap-2 border border-white bg-white px-3 py-2 text-xs font-semibold text-[#24201d] transition hover:bg-[#f1ece6]"
              >
                <Printer
                  aria-hidden="true"
                  className="h-4 w-4"
                />
                Print / Save as PDF
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close docket"
                className="inline-flex h-10 w-10 items-center justify-center border border-white/20 text-[#d9d0c7] transition hover:bg-white/10 hover:text-white"
              >
                <X
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </button>
            </div>
          </div>

          {/* Printable area */}
          <div className="printable-rto-docket border border-[#d9d0c7] bg-[#fffdf9] p-5 shadow-2xl sm:p-8">
            {/* Docket header */}
            <header className="border-b border-[#d9d0c7] pb-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b56f52]">
                    TransferShield
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-[#24201d]">
                    Physical RTO Docket
                  </h1>

                  <p className="mt-2 max-w-xl text-xs leading-5 text-[#6b635d]">
                    Physical document preparation checklist for an RTO-approved
                    vehicle ownership transfer.
                  </p>
                </div>

                <div className="shrink-0 text-center">
                  <div className="border border-[#d9d0c7] bg-white p-2">
                    <QRCodeSVG
                      value={qrUrl}
                      size={96}
                      level="M"
                      includeMargin
                    />
                  </div>

                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
                    Scan to open case
                  </p>
                </div>
              </div>

              {/* Case summary */}
              <div className="mt-5 grid grid-cols-1 border border-[#d9d0c7] sm:grid-cols-3">
                <div className="border-b border-[#e5ddd5] px-3 py-3 sm:border-b-0 sm:border-r">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Application ID
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#24201d]">
                    {transfer.id}
                  </p>
                </div>

                <div className="border-b border-[#e5ddd5] px-3 py-3 sm:border-b-0 sm:border-r">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                    Vehicle
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#24201d]">
                    {transfer.vehicle.registrationNumber}
                  </p>
                </div>

                <div className="bg-[#f4f8f4] px-3 py-3">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5d7c60]">
                    RTO status
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#5d7c60]">
                    Approved
                  </p>
                </div>
              </div>
            </header>

            {/* Physical checklist */}
            <section className="mt-6">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
                    Packet preparation
                  </p>

                  <h2 className="mt-1 text-lg font-bold tracking-tight text-[#24201d]">
                    Physical document checklist
                  </h2>

                  <p className="mt-1 text-xs text-[#8a7d72]">
                    Prepare the physical packet using the recommended order.
                  </p>
                </div>

                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
                  {docketItems.length} items
                </span>
              </div>

              <div className="mt-4 overflow-hidden border border-[#d9d0c7]">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#d9d0c7] bg-[#f8f3ee]">
                      <th className="w-10 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a7d72]">
                        #
                      </th>

                      <th className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a7d72]">
                        Document
                      </th>

                      <th className="hidden w-48 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a7d72] sm:table-cell">
                        Physical handling
                      </th>

                      <th className="w-24 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[#8a7d72]">
                        Responsible
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {docketItems.map((item) => (
                      <tr
                        key={`${item.order}-${item.label}`}
                        className="border-b border-[#e5ddd5] last:border-b-0"
                      >
                        <td className="px-3 py-3 text-sm font-bold text-[#b56f52]">
                          {item.order}
                        </td>

                        <td className="px-3 py-3 text-xs font-semibold text-[#24201d] sm:text-sm">
                          {item.label}

                          <p className="mt-1 text-[10px] font-normal leading-4 text-[#8a7d72] sm:hidden">
                            {item.handling}
                          </p>
                        </td>

                        <td className="hidden px-3 py-3 text-xs text-[#6b635d] sm:table-cell">
                          {item.handling}
                        </td>

                        <td className="px-3 py-3 text-[10px] font-semibold text-[#6b635d]">
                          {item.responsibleParty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Supporting sections */}
            <section className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="border border-[#d9d0c7] bg-[#fffdf9] p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    aria-hidden="true"
                    className="h-4 w-4 text-[#5d7c60]"
                  />

                  <h2 className="text-sm font-bold text-[#24201d]">
                    Recommended packet order
                  </h2>
                </div>

                <ol className="mt-3 space-y-2">
                  {docketItems.slice(0, 6).map((item) => (
                    <li
                      key={item.order}
                      className="flex items-start gap-2"
                    >
                      <span className="text-xs font-bold text-[#8a7d72]">
                        {item.order}.
                      </span>

                      <span className="text-xs leading-5 text-[#6b635d]">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="border border-[#d9d0c7] bg-[#fffdf9] p-4">
                <h2 className="text-sm font-bold text-[#24201d]">
                  Physical submission checklist
                </h2>

                <div className="mt-3 space-y-2 text-xs leading-5 text-[#6b635d]">
                  <p>☐ Confirm all required signatures are present.</p>
                  <p>☐ Carry required originals.</p>
                  <p>☐ Carry required photocopies.</p>
                  <p>☐ Keep this docket as the packet cover sheet.</p>
                </div>
              </div>
            </section>

            {/* Local requirement notice */}
            <section className="mt-6 border-l-2 border-[#d49a45] bg-[#fbf3e3] px-3 py-3">
              <h2 className="text-xs font-semibold text-[#8c6427]">
                Local RTO requirement notice
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-[#6b635d]">
                Physical document requirements can vary by RTO and transaction
                type. This docket is a preparation aid and should be checked
                against the applicable local RTO instructions before submission.
              </p>
            </section>

            {/* Footer */}
            <footer className="mt-6 border-t border-[#d9d0c7] pt-4">
              <div className="flex flex-col gap-1 text-[9px] text-[#8a7d72] sm:flex-row sm:items-center sm:justify-between">
                <span>
                  TransferShield · Application {transfer.id}
                </span>

                <span>
                  Vehicle {transfer.vehicle.registrationNumber}
                </span>
              </div>
            </footer>
          </div>
        </div>
      </div>
    ) : null}
  </>
);}