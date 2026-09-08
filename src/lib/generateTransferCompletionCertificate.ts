import jsPDF from "jspdf";

interface TransferCompletionCertificateData {
  applicationId: string;
  recordNumber: string;
  vehicleNumber: string;
  chassisLast5: string;
  sellerName: string;
  buyerName: string;
  rtoName?: string;
  transferType?: string;
  completedAt: string;
}

type RGB = [number, number, number];

export const generateTransferCompletionCertificate = (
  data: TransferCompletionCertificateData,
) => {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // ---------------------------------------------------------
  // TRANSFERSHIELD PALETTE
  // ---------------------------------------------------------

  const paper: RGB = [255, 253, 249];
  const cream: RGB = [248, 241, 232];
  const charcoal: RGB = [36, 32, 29];
  const warmGray: RGB = [107, 99, 93];
  const muted: RGB = [138, 125, 114];
  const border: RGB = [217, 208, 199];
  const peach: RGB = [181, 111, 82];
  const green: RGB = [93, 124, 96];

  // ---------------------------------------------------------
  // PAGE
  // ---------------------------------------------------------

  doc.setFillColor(...cream);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(...paper);
  doc.rect(
    margin - 5,
    10,
    contentWidth + 10,
    pageHeight - 20,
    "F",
  );

  // ---------------------------------------------------------
  // BRAND
  // ---------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...peach);

  doc.text(
    "TRANSFERSHIELD",
    pageWidth / 2,
    25,
    { align: "center" },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...muted);

  doc.text(
    "DIGITAL VEHICLE OWNERSHIP TRANSFER",
    pageWidth / 2,
    31,
    { align: "center" },
  );

  doc.setDrawColor(...border);
  doc.line(
    margin,
    37,
    pageWidth - margin,
    37,
  );

  // ---------------------------------------------------------
  // DOCUMENT TITLE
  // ---------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.setTextColor(...charcoal);

  doc.text(
    "Certificate of Transfer Completion",
    pageWidth / 2,
    53,
    { align: "center" },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.8);
  doc.setTextColor(...warmGray);

  doc.text(
    "Ownership-transfer workflow completion record",
    pageWidth / 2,
    60,
    { align: "center" },
  );

  // ---------------------------------------------------------
  // RECORD NUMBER / DATE
  // ---------------------------------------------------------

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(...muted);

  doc.text(
    "TRANSFER RECORD NO.",
    margin,
    73,
  );

  doc.text(
    "DATE OF ISSUE",
    pageWidth - margin - 55,
    73,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...charcoal);

  doc.text(
    data.recordNumber,
    margin,
    80,
  );

  doc.text(
    data.completedAt,
    pageWidth - margin,
    80,
    { align: "right" },
  );

  doc.setDrawColor(...border);
  doc.line(
    margin,
    86,
    pageWidth - margin,
    86,
  );

  // ---------------------------------------------------------
  // FORMAL CERTIFICATION STATEMENT
  // ---------------------------------------------------------

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.4);
  doc.setTextColor(...charcoal);

  const statement =
    "This document records the completion of the ownership-transfer workflow for the vehicle identified below, " +
    "following review and approval recorded for the submitted transfer application.";

  const statementLines = doc.splitTextToSize(
    statement,
    contentWidth,
  );

  doc.text(
    statementLines,
    margin,
    99,
  );

  // ---------------------------------------------------------
  // VEHICLE / TRANSFER DETAILS
  // ---------------------------------------------------------

  let y = 119;

  drawLineField(
    doc,
    "Registration No.",
    data.vehicleNumber,
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Application No.",
    data.applicationId,
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Previous registered owner",
    data.sellerName,
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "New registered owner",
    data.buyerName,
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Chassis No.",
    `XXXXX${data.chassisLast5}`,
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Registering authority",
    data.rtoName ?? "Maharashtra Motor Vehicle Department",
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Transfer type",
    data.transferType ?? "Sale / ownership transfer",
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Transfer status",
    "COMPLETED",
    margin,
    y,
    contentWidth,
    green,
    muted,
    border,
  );

  y += 11;

  drawLineField(
    doc,
    "Completion date",
    data.completedAt,
    margin,
    y,
    contentWidth,
    charcoal,
    muted,
    border,
  );

  // ---------------------------------------------------------
  // COMPLETION STATEMENT
  // ---------------------------------------------------------

  y += 20;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...warmGray);

  const completionStatement =
    `The transfer record for ${data.vehicleNumber} has been marked complete in TransferShield. ` +
    `The recorded RTO approval and transaction history form part of the associated digital case record.`;

  const completionLines = doc.splitTextToSize(
    completionStatement,
    contentWidth,
  );

  doc.text(
    completionLines,
    margin,
    y,
  );

  y += completionLines.length * 4.2 + 14;

  // ---------------------------------------------------------
  // COMPLETED MARK
  // ---------------------------------------------------------

  doc.setDrawColor(...green);

  doc.line(
    margin,
    y,
    pageWidth - margin,
    y,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...green);

  doc.text(
    "TRANSFER COMPLETED",
    pageWidth / 2,
    y + 11,
    { align: "center" },
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...muted);

  doc.text(
    "Digitally generated record - no physical signature required",
    pageWidth / 2,
    y + 18,
    { align: "center" },
  );

  // ---------------------------------------------------------
  // IMPORTANT
  // ---------------------------------------------------------

  const disclaimerY = 266;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...charcoal);

  doc.text(
    "IMPORTANT",
    margin,
    disclaimerY,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.7);
  doc.setTextColor(...warmGray);

  const disclaimer =
    "This document is a TransferShield transaction record confirming completion of the ownership-transfer workflow. " +
    "It is not a government-issued Registration Certificate (RC), does not replace Form 23 or the RC, and does not itself create or modify a government record.";

  const disclaimerLines = doc.splitTextToSize(
    disclaimer,
    contentWidth,
  );

  doc.text(
    disclaimerLines,
    margin,
    disclaimerY + 9,
  );

  // ---------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------

  doc.setDrawColor(...border);
  doc.line(
    margin,
    pageHeight - 20,
    pageWidth - margin,
    pageHeight - 20,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.2);
  doc.setTextColor(...muted);

  doc.text(
    `TransferShield  |  ${data.recordNumber}`,
    margin,
    pageHeight - 12,
  );

  doc.text(
    data.vehicleNumber,
    pageWidth - margin,
    pageHeight - 12,
    { align: "right" },
  );

  // ---------------------------------------------------------
  // SAVE
  // ---------------------------------------------------------

  const safeVehicleNumber = data.vehicleNumber
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  doc.save(
    `TransferShield-Transfer-Completion-${safeVehicleNumber}-${data.recordNumber}.pdf`,
  );
};

// =============================================================
// HELPER
// =============================================================

function drawLineField(
  doc: jsPDF,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  valueColor: RGB,
  labelColor: RGB,
  lineColor: RGB,
) {
  const labelWidth = 57;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...labelColor);

  doc.text(
    label,
    x,
    y,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...valueColor);

  const valueLines = doc.splitTextToSize(
    value,
    width - labelWidth,
  );

  doc.text(
    valueLines,
    x + labelWidth,
    y,
  );

  const lineY =
    y + Math.max(3.5, valueLines.length * 4);

  doc.setDrawColor(...lineColor);

  doc.line(
    x,
    lineY,
    x + width,
    lineY,
  );
}