import type { Transfer } from "../types/transfer";

export const initialTransfer: Transfer = {
  id: "TS-2026-0001",
  status: "INITIATED",
  createdAt: "2026-08-25T10:00:00+05:30",
  updatedAt: "2026-08-25T10:00:00+05:30",

  vehicle: {
    registrationNumber: "MH 01 AB 4821",
    chassisLast5: "7K921",
    insuranceValidUpto: "2027-03-18",
    puccValidUpto: "2026-12-05",
  },

  seller: {
    name: "Arjun Mehta",
    phoneMasked: "+91 98XXXX4210",
    address: "Andheri West, Mumbai, Maharashtra",
  },

  buyer: {
    name: "Priya Sharma",
    phoneMasked: "+91 99XXXX7284",
    address: "Bandra East, Mumbai, Maharashtra",
  },

  invite: {
    code: "TS-BUYER-4821",
    link: "transfershield.demo/join/TS-BUYER-4821",
    status: "not_sent",
  },

  tasks: [
    {
      id: "invite-buyer",
      title: "Invite buyer",
      description: "Send the buyer an invite code or link to join this transfer.",
      owner: "seller",
      status: "pending",
      prerequisiteTaskIds: [],
      actionLabel: "Invite buyer",
    },
    {
      id: "buyer-join",
      title: "Join transfer",
      description: "Join the shared workspace using the seller's invite.",
      owner: "buyer",
      status: "locked",
      prerequisiteTaskIds: ["invite-buyer"],
      actionLabel: "Join transfer",
    },
    {
  id: "seller-confirm-details",
  title: "Confirm seller details",
  description: "Seller confirms the required transfer details.",
  owner: "seller",
  status: "locked",
  prerequisiteTaskIds: ["buyer-join"],
  actionLabel: "Confirm details",
},
{
  id: "buyer-confirm-details",
  title: "Confirm buyer details",
  description: "Buyer confirms the required transfer details.",
  owner: "buyer",
  status: "locked",
  prerequisiteTaskIds: ["buyer-join"],
  actionLabel: "Confirm details",
},
{
  id: "buyer-payment",
  title: "Pay transfer fee",
  description: "Buyer completes the mock ownership transfer fee payment.",
  owner: "buyer",
  status: "locked",
  prerequisiteTaskIds: [
  "seller-confirm-details",
  "buyer-confirm-details",
],
  actionLabel: "Pay now",
},
    {
      id: "buyer-esign",
      title: "Buyer documents and e-sign",
      description:
        "Upload buyer documents, sign Form 30, verify OTP, and submit.",
      owner: "buyer",
      status: "locked",
      prerequisiteTaskIds: ["buyer-payment"],
      actionLabel: "Complete buyer e-sign",
    },
    {
      id: "seller-esign",
      title: "Seller documents and e-sign",
      description:
        "Upload seller documents, sign Forms 29 and 30, verify OTP, and submit.",
      owner: "seller",
      status: "locked",
      prerequisiteTaskIds: ["buyer-esign","seller-confirm-details"],
      actionLabel: "Complete seller e-sign",
    },
    {
  id: "buyer-final-review",
  title: "Review buyer submission",
  description:
    "Review your details and buyer documents before the application is sent to the RTO.",
  owner: "buyer",
  status: "locked",
  prerequisiteTaskIds: ["buyer-esign"],
  actionLabel: "Review & confirm",
},
{
  id: "seller-final-review",
  title: "Review seller submission",
  description:
    "Review your details and seller documents before the application is sent to the RTO.",
  owner: "seller",
  status: "locked",
  prerequisiteTaskIds: ["seller-esign"],
  actionLabel: "Review & confirm",
},
    {
      id: "rto-review",
      title: "RTO review",
      description: "The RTO reviews the completed ownership transfer application.",
      owner: "rto",
      status: "locked",
      prerequisiteTaskIds: [
  "buyer-final-review",
  "seller-final-review",
],
      actionLabel: "Open RTO review",
    },
  ],

  documents: [
    {
      id: "form-30",
      label: "Form 30",
      description:
        "Ownership transfer form signed by both the seller and buyer.",
      owner: "buyer",
      requiredAt: "BUYER_ESIGN_PENDING",
      alsoRequiredAt: "SELLER_ESIGN_PENDING",
      signers: ["seller", "buyer"],
      status: "missing",
    },
    {
      id: "buyer-address-proof",
      label: "Buyer address proof",
      description: "A valid address proof for the buyer.",
      owner: "buyer",
      requiredAt: "BUYER_ESIGN_PENDING",
      status: "missing",
    },
    {
      id: "buyer-dob-proof",
      label: "Buyer date-of-birth proof",
      description: "A valid proof of date of birth for the buyer.",
      owner: "buyer",
      requiredAt: "BUYER_ESIGN_PENDING",
      status: "missing",
    },
    {
      id: "buyer-photo",
      label: "Buyer passport-size photo",
      description: "A recent passport-size photo of the buyer.",
      owner: "buyer",
      requiredAt: "BUYER_ESIGN_PENDING",
      status: "missing",
    },
    {
      id: "form-29",
      label: "Form 29",
      description: "Notice of transfer form signed by the seller.",
      owner: "seller",
      requiredAt: "SELLER_ESIGN_PENDING",
      signers: ["seller"],
      status: "missing",
    },
    {
      id: "seller-address-proof",
      label: "Seller address proof",
      description: "A valid address proof for the seller.",
      owner: "seller",
      requiredAt: "SELLER_ESIGN_PENDING",
      status: "missing",
    },
    {
      id: "seller-dob-proof",
      label: "Seller date-of-birth proof",
      description: "A valid proof of date of birth for the seller.",
      owner: "seller",
      requiredAt: "SELLER_ESIGN_PENDING",
      status: "missing",
    },
    {
      id: "seller-photo",
      label: "Seller passport-size photo",
      description: "A recent passport-size photo of the seller.",
      owner: "seller",
      requiredAt: "SELLER_ESIGN_PENDING",
      status: "missing",
    },
  ],

  payment: {
    status: "not_started",
    amount: 525,
    currency: "INR",
  },

  eSign: {
    buyer: "not_started",
    seller: "not_started",
  },

  rto: {
    status: "not_ready",
  },

  timeline: [
    {
      id: "event-transfer-created",
      timestamp: "2026-08-25T10:00:00+05:30",
      title: "Transfer started",
      description:
        "Arjun Mehta started an ownership transfer for MH 01 AB 4821.",
      actor: "seller",
      status: "success",
    },
  ],
};