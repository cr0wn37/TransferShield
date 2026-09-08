import type { RejectionReasonCode } from "../types/transfer";

export const rejectionReasons: Array<{
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
    defaultMessage:
      "Please correct the requested information and resubmit.",
  },
];