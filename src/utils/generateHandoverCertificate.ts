import jsPDF from "jspdf";

interface HandoverCertificateData {
  vehicleNumber: string;
  sellerName: string;
  buyerName: string;
  odometerKm: number;
  handoverLocation: string;
  statutoryRefId: string;
  completedAt: string;
  expiresAt: string;
}

type RGB = [number, number, number];

export const generateHandoverCertificate = (
  data: HandoverCertificateData,
) => {
  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // =========================================================
  // TRANSFERSHIELD DESIGN SYSTEM
  // =========================================================

  const cream: RGB = [248, 241, 232];
  const paper: RGB = [255, 253, 249];
  const charcoal: RGB = [36, 32, 29];
  const warmGray: RGB = [107, 99, 93];
  const muted: RGB = [138, 125, 114];
  const border: RGB = [217, 208, 199];
  const peach: RGB = [181, 111, 82];
  const green: RGB = [93, 124, 96];
  const greenSoft: RGB = [244, 248, 244];
  const amberSoft: RGB = [251, 243, 227];
  const amber: RGB = [140, 100, 39];

  const margin = 18;
  const contentWidth = pageWidth - margin * 2;

  // =========================================================
  // PAGE
  // =========================================================

  doc.setFillColor(...cream);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  doc.setFillColor(...paper);
  doc.rect(
    margin - 3,
    10,
    contentWidth + 6,
    pageHeight - 20,
    "F",
  );

  // =========================================================
  // HEADER
  // =========================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...peach);
  doc.text("TRANSFERSHIELD", margin, 24);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...muted);
  doc.text(
    "DIGITAL TRANSACTION RECORD",
    margin,
    30,
  );

  doc.setDrawColor(...border);
  doc.line(margin, 35, pageWidth - margin, 35);

  // =========================================================
  // TITLE
  // =========================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(21);
  doc.setTextColor(...charcoal);
  doc.text(
    "Digital Handover Record",
    margin,
    50,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...warmGray);

  const intro =
    "A timestamped record confirming the physical handover and possession of the vehicle.";

  doc.text(
    intro,
    margin,
    57,
  );

  // =========================================================
  // RECORD META
  // =========================================================

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(...muted);

  doc.text("RECORD ID", margin, 70);
  doc.text("ISSUED", margin + 63, 70);
  doc.text("VALID UNTIL", margin + 119, 70);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...charcoal);

  doc.text(data.statutoryRefId, margin, 76);
  doc.text(data.completedAt, margin + 63, 76);
  doc.text(data.expiresAt, margin + 119, 76);

  doc.setDrawColor(...border);
  doc.line(margin, 82, pageWidth - margin, 82);

  // =========================================================
  // STATUS
  // =========================================================

  doc.setFillColor(...greenSoft);
  doc.rect(margin, 91, contentWidth, 23, "F");

  doc.setFillColor(...green);
  doc.rect(margin, 91, 3, 23, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...green);

  doc.text(
    "HANDOVER RECORDED",
    margin + 10,
    99,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...charcoal);

  const statusSentence =
    `Physical possession of ${data.vehicleNumber} was acknowledged by both parties.`;

  doc.text(
    statusSentence,
    margin + 10,
    106,
  );

  // =========================================================
  // RECORD
  // =========================================================

  sectionTitle(doc, "The transaction record", margin, 130);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...charcoal);

  const transactionSentence =
    `On ${data.completedAt}, ${data.sellerName}, acting as the seller, handed physical possession of vehicle ` +
    `${data.vehicleNumber} to ${data.buyerName}, acting as the buyer, at ${data.handoverLocation}.`;

  const transactionLines = doc.splitTextToSize(
    transactionSentence,
    contentWidth,
  );

  doc.text(
    transactionLines,
    margin,
    140,
  );

  // =========================================================
  // RECORDED FACTS
  // =========================================================

  const factsTop = 159;

  drawFact(
    doc,
    margin,
    factsTop,
    "VEHICLE",
    data.vehicleNumber,
  );

  drawFact(
    doc,
    margin + 63,
    factsTop,
    "ODOMETER",
    `${data.odometerKm.toLocaleString("en-IN")} km`,
  );

  drawFact(
    doc,
    margin + 119,
    factsTop,
    "LOCATION",
    data.handoverLocation,
  );

  doc.setDrawColor(...border);
  doc.line(margin, 178, pageWidth - margin, 178);

  // Parties
  drawFact(
    doc,
    margin,
    190,
    "SELLER",
    data.sellerName,
  );

  drawFact(
    doc,
    margin + 95,
    190,
    "BUYER",
    data.buyerName,
  );

  // =========================================================
  // ACKNOWLEDGEMENT
  // =========================================================

  sectionTitle(
    doc,
    "Party acknowledgement",
    margin,
    213,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.2);
  doc.setTextColor(...warmGray);

  const acknowledgement =
    `${data.sellerName} confirmed the recorded handover details. ` +
    `${data.buyerName} confirmed receipt of the vehicle and physical possession. ` +
    "Both parties confirmed the same handover event.";

  const acknowledgementLines = doc.splitTextToSize(
    acknowledgement,
    contentWidth,
  );

  doc.text(
    acknowledgementLines,
    margin,
    223,
  );

  // =========================================================
  // VALIDITY
  // =========================================================

  doc.setFillColor(...amberSoft);
  doc.rect(margin, 239, contentWidth, 19, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...amber);

  doc.text(
    "RECORD VALIDITY",
    margin + 7,
    247,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...warmGray);

  doc.text(
    "Valid for 30 days from issuance or until the RC transfer is completed, whichever occurs first.",
    margin + 7,
    253,
  );

  // =========================================================
  // LEGAL / PRODUCT DISCLAIMER
  // =========================================================

  sectionTitle(
    doc,
    "Important",
    margin,
    271,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...warmGray);

  const disclaimer =
    "This TransferShield record documents a physical handover acknowledged by the buyer and seller. " +
    "It does not itself change government ownership records and is not an official RC or government ownership certificate.";

  const disclaimerLines = doc.splitTextToSize(
    disclaimer,
    contentWidth,
  );

  doc.text(
    disclaimerLines,
    margin,
    280,
  );

  // =========================================================
  // FOOTER
  // =========================================================

  doc.setDrawColor(...border);
  doc.line(
    margin,
    pageHeight - 19,
    pageWidth - margin,
    pageHeight - 19,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...muted);

  doc.text(
    `TransferShield  ·  ${data.statutoryRefId}`,
    margin,
    pageHeight - 11,
  );

  doc.text(
    data.vehicleNumber,
    pageWidth - margin,
    pageHeight - 11,
    { align: "right" },
  );

  // =========================================================
  // SAVE
  // =========================================================

  const safeVehicleNumber = data.vehicleNumber
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "");

  doc.save(
    `TransferShield-Digital-Handover-${safeVehicleNumber}-${data.statutoryRefId}.pdf`,
  );
};

// =============================================================
// HELPERS
// =============================================================

function sectionTitle(
  doc: jsPDF,
  title: string,
  x: number,
  y: number,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(181, 111, 82);

  doc.text(
    title.toUpperCase(),
    x,
    y,
  );

  doc.setDrawColor(229, 221, 213);

  doc.line(
    x + 42,
    y - 1.5,
    192,
    y - 1.5,
  );
}

function drawFact(
  doc: jsPDF,
  x: number,
  y: number,
  label: string,
  value: string,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(138, 125, 114);

  doc.text(
    label,
    x,
    y,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(36, 32, 29);

  const lines = doc.splitTextToSize(
    value,
    52,
  );

  doc.text(
    lines,
    x,
    y + 7,
  );
}