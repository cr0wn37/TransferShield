import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PDF_PAGES = 3;
const RENDER_SCALE = 1.5;

export interface PreparedDocumentImage {
  mimeType: "image/jpeg";
  base64: string;
}

export async function prepareDocumentForAI(
  file: File,
): Promise<PreparedDocumentImage[]> {
  if (file.type.startsWith("image/")) {
    return [
      {
        mimeType: "image/jpeg",
        base64: await imageFileToJpegBase64(file),
      },
    ];
  }

  if (file.type === "application/pdf") {
    return renderPdfToImages(file);
  }

  throw new Error(
    "Unsupported document type. Please upload a PDF, JPG, PNG or WEBP file.",
  );
}

async function imageFileToJpegBase64(
  file: File,
): Promise<string> {
  const bitmap = await createImageBitmap(file);

  const canvas = document.createElement("canvas");

  const maxDimension = 1800;

  const scale =
    Math.max(bitmap.width, bitmap.height) > maxDimension
      ? maxDimension /
        Math.max(bitmap.width, bitmap.height)
      : 1;

  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();
    throw new Error("Unable to prepare document image.");
  }

  context.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  bitmap.close();

  const dataUrl = canvas.toDataURL(
    "image/jpeg",
    0.78,
  );

  return dataUrl.split(",")[1];
}

async function renderPdfToImages(
  file: File,
): Promise<PreparedDocumentImage[]> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  const pageCount = Math.min(
    pdf.numPages,
    MAX_PDF_PAGES,
  );

  const images: PreparedDocumentImage[] = [];

  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: RENDER_SCALE,
    });

    const canvas = document.createElement("canvas");

    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "Unable to render PDF page for AI verification.",
      );
    }

    await page.render({
  canvas,
  canvasContext: context,
  viewport,
}).promise;

    const dataUrl = canvas.toDataURL(
      "image/jpeg",
      0.78,
    );

    images.push({
      mimeType: "image/jpeg",
      base64: dataUrl.split(",")[1],
    });

    page.cleanup();
  }

  return images;
}