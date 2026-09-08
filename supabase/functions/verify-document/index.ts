

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

const GROQ_MODEL = "qwen/qwen3.8-27b";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const documentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentType: {
      type: "string",
      enum: [
        "form_29",
        "form_30",
        "rc",
        "insurance",
        "address_proof",
        "identity_proof",
        "financier_document",
        "unknown",
      ],
    },

    ownerName: {
      type: ["string", "null"],
    },

    buyerName: {
      type: ["string", "null"],
    },

    vehicleNumber: {
      type: ["string", "null"],
    },

    chassisLast5: {
      type: ["string", "null"],
    },

    documentDate: {
      type: ["string", "null"],
    },

    financierName: {
      type: ["string", "null"],
    },

    confidence: {
      type: "number",
    },

    qualityIssue: {
      type: ["string", "null"],
    },
  },

  required: [
    "documentType",
    "ownerName",
    "buyerName",
    "vehicleNumber",
    "chassisLast5",
    "documentDate",
    "financierName",
    "confidence",
    "qualityIssue",
  ],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    if (!GROQ_API_KEY) {
      throw new Error(
        "GROQ_API_KEY is not configured.",
      );
    }

    const body = await req.json();

    const {
      documentLabel,
      expectedVehicleNumber,
      expectedSellerName,
      expectedBuyerName,
      expectedChassisLast5,
      images,
    } = body;

    if (
      !documentLabel ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return jsonResponse(
        {
          error:
            "documentLabel and at least one document image are required.",
        },
        400,
      );
    }

    const groqImages = images
      .slice(0, 3)
      .map((image: {
        mimeType: string;
        base64: string;
      }) => ({
        type: "image_url",
        image_url: {
          url:
            `data:${image.mimeType};base64,` +
            image.base64,
        },
      }));

    const prompt = `
You are TransferShield's document extraction engine.

The user uploaded a document that is expected to be:
${documentLabel}

Read the supplied document images carefully.

Extract ONLY information that is actually visible.

Never invent missing values.
Use null when a value cannot be read.

Pay special attention to:
- registration number
- owner/seller name
- buyer name
- chassis digits
- document type
- document date
- financier name

This is document extraction, not legal advice.
Do not decide whether a transaction is legally valid.

Expected transaction context:

Vehicle:
${expectedVehicleNumber}

Seller:
${expectedSellerName}

Buyer:
${expectedBuyerName}

Chassis last 5:
${expectedChassisLast5}

The expected values above are context only.
Your task is still to report what is ACTUALLY visible
in the document.

For confidence:
- 0.95+ = very clear
- 0.80-0.94 = clear with minor uncertainty
- 0.60-0.79 = partially readable
- below 0.60 = difficult to verify

Set qualityIssue when the document is blurry,
cropped, missing important content, or otherwise
not reliably readable.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${GROQ_API_KEY}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          model: GROQ_MODEL,

          temperature: 0,

          reasoning_effort: "none",

          max_completion_tokens: 700,

          messages: [
            {
              role: "system",
              content: prompt,
            },

            {
              role: "user",
              content: [
                {
                  type: "text",
                  text:
                    "Extract the document fields exactly as instructed.",
                },

                ...groqImages,
              ],
            },
          ],

          response_format: {
            type: "json_schema",

            json_schema: {
              name: "document_extraction",

              strict: true,

              schema: documentSchema,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Groq response error:",
        errorText,
      );

      throw new Error(
        "Groq document verification failed.",
      );
    }

    const groqData =
      await response.json();

    const rawContent =
      groqData?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error(
        "Groq returned an empty result.",
      );
    }

    const extracted =
      JSON.parse(rawContent);

    const issues: Array<{
      field: string;
      label: string;
      expected: string | null;
      found: string | null;
      message: string;
    }> = [];

    if (extracted.qualityIssue) {
      issues.push({
        field: "document_quality",
        label: "Document quality",
        expected: null,
        found: null,
        message:
          extracted.qualityIssue,
      });
    }

    if (
      extracted.vehicleNumber &&
      normalizeVehicle(
        extracted.vehicleNumber,
      ) !== normalizeVehicle(
        expectedVehicleNumber,
      )
    ) {
      issues.push({
        field: "vehicle_number",
        label: "Vehicle number",
        expected:
          expectedVehicleNumber,
        found:
          extracted.vehicleNumber,
        message:
          "The vehicle number detected in the document does not match the vehicle being transferred.",
      });
    }

    if (
      extracted.ownerName &&
      normalizeText(
        extracted.ownerName,
      ) !== normalizeText(
        expectedSellerName,
      )
    ) {
      issues.push({
        field: "owner_name",
        label: "Owner name",
        expected:
          expectedSellerName,
        found:
          extracted.ownerName,
        message:
          "The owner name detected in the document does not match the seller.",
      });
    }

    if (
      extracted.buyerName &&
      normalizeText(
        extracted.buyerName,
      ) !== normalizeText(
        expectedBuyerName,
      )
    ) {
      issues.push({
        field: "buyer_name",
        label: "Buyer name",
        expected:
          expectedBuyerName,
        found:
          extracted.buyerName,
        message:
          "The buyer name detected in the document does not match the buyer.",
      });
    }

    if (
      extracted.chassisLast5 &&
      normalizeText(
        extracted.chassisLast5,
      ) !== normalizeText(
        expectedChassisLast5,
      )
    ) {
      issues.push({
        field: "chassis_last5",
        label: "Chassis last 5",
        expected:
          expectedChassisLast5,
        found:
          extracted.chassisLast5,
        message:
          "The chassis digits detected in the document do not match the transfer record.",
      });
    }

    const confidence =
      typeof extracted.confidence ===
      "number"
        ? extracted.confidence
        : 0;

    let status:
      | "verified"
      | "needs_correction"
      | "unable_to_verify";

    if (confidence < 0.6) {
      status =
        "unable_to_verify";
    } else if (issues.length > 0) {
      status =
        "needs_correction";
    } else {
      status =
        "verified";
    }

    let summary =
      "Document verified successfully.";

    if (
      status === "needs_correction"
    ) {
      summary =
        `${issues.length} issue${
          issues.length === 1
            ? ""
            : "s"
        } detected.`;
    }

    if (
      status === "unable_to_verify"
    ) {
      summary =
        "The document could not be verified with sufficient confidence.";
    }

    return jsonResponse({
      result: {
        status,
        confidence,

        summary,

        extracted: {
          documentType:
            extracted.documentType ??
            "unknown",

          ownerName:
            extracted.ownerName ??
            null,

          buyerName:
            extracted.buyerName ??
            null,

          vehicleNumber:
            extracted.vehicleNumber ??
            null,

          chassisLast5:
            extracted.chassisLast5 ??
            null,

          documentDate:
            extracted.documentDate ??
            null,

          financierName:
            extracted.financierName ??
            null,
        },

        issues,
      },
    });
  } catch (error) {
    console.error(error);

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown document verification error.",
      },
      500,
    );
  }
});

function normalizeText(
  value: string | null | undefined,
) {
  return (
    value
      ?.trim()
      .toUpperCase()
      .replace(/\s+/g, " ") ?? ""
  );
}

function normalizeVehicle(
  value: string | null | undefined,
) {
  return (
    value
      ?.trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "") ?? ""
  );
}

function jsonResponse(
  body: unknown,
  status = 200,
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type":
          "application/json",
      },
    },
  );
}