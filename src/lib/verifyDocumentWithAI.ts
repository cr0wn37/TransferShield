import { supabase } from "./supabaseClient";

export interface AIDocumentVerification {
  status:
    | "verified"
    | "needs_correction"
    | "unable_to_verify";

  confidence: number;

  summary: string;

  extracted: {
    documentType:
      | "form_29"
      | "form_30"
      | "rc"
      | "insurance"
      | "address_proof"
      | "identity_proof"
      | "financier_document"
      | "unknown";

    ownerName: string | null;
    buyerName: string | null;
    vehicleNumber: string | null;
    chassisLast5: string | null;
    documentDate: string | null;
    financierName: string | null;
  };

  issues: Array<{
    field:
      | "document_type"
      | "owner_name"
      | "buyer_name"
      | "vehicle_number"
      | "chassis_last5"
      | "document_date"
      | "financier_name"
      | "document_quality";

    label: string;
    expected: string | null;
    found: string | null;
    message: string;
  }>;
}

interface VerifyDocumentInput {
  file: File;
  documentLabel: string;
  expectedVehicleNumber: string;
  expectedSellerName: string;
  expectedBuyerName: string;
  expectedChassisLast5: string;
}

export async function verifyDocumentWithAI(
  input: VerifyDocumentInput,
): Promise<AIDocumentVerification> {
  const fileBase64 = await fileToBase64(input.file);

  const { data, error } =
    await supabase.functions.invoke(
      "verify-document",
      {
        body: {
          fileName: input.file.name,
          mimeType: input.file.type,
          fileBase64,

          documentLabel:
            input.documentLabel,

          expectedVehicleNumber:
            input.expectedVehicleNumber,

          expectedSellerName:
            input.expectedSellerName,

          expectedBuyerName:
            input.expectedBuyerName,

          expectedChassisLast5:
            input.expectedChassisLast5,
        },
      },
    );

  if (error) {
    throw new Error(
      error.message ||
        "AI document verification failed.",
    );
  }

  if (!data?.result) {
    throw new Error(
      "Document verification returned no result.",
    );
  }

  return data.result as AIDocumentVerification;
}

function fileToBase64(
  file: File,
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader =
        new FileReader();

      reader.onload = () => {
        const result =
          reader.result;

        if (
          typeof result !==
          "string"
        ) {
          reject(
            new Error(
              "Unable to read the document.",
            ),
          );
          return;
        }

        const commaIndex =
          result.indexOf(",");

        if (commaIndex === -1) {
          reject(
            new Error(
              "Unable to encode the document.",
            ),
          );
          return;
        }

        resolve(
          result.slice(
            commaIndex + 1,
          ),
        );
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Unable to read the document.",
          ),
        );
      };

      reader.readAsDataURL(file);
    },
  );
}