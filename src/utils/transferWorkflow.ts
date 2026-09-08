export const TRANSFER_WORKFLOW = [
  {
    key: "INITIATED",
    label: "Transfer started",
    owner: "seller",
  },
  {
    key: "BUYER_INVITED",
    label: "Buyer invited",
    owner: "seller",
  },
  {
    key: "BUYER_JOINED",
    label: "Buyer joined",
    owner: "buyer",
  },
  {
    key: "BUYER_DETAILS",
    label: "Buyer confirms details",
    owner: "buyer",
  },
  {
    key: "SELLER_DETAILS",
    label: "Seller confirms details",
    owner: "seller",
  },
  {
    key: "PAYMENT",
    label: "Buyer payment",
    owner: "buyer",
  },
  {
    key: "BUYER_REQUIREMENTS",
    label: "Buyer documents & e-sign",
    owner: "buyer",
  },
  {
    key: "SELLER_REQUIREMENTS",
    label: "Seller documents & e-sign",
    owner: "seller",
  },
  {
    key: "FINAL_REVIEW",
    label: "Final review",
    owner: "shared",
  },
  {
    key: "RTO_SUBMISSION",
    label: "Submit to RTO",
    owner: "shared",
  },
  {
    key: "RTO_PROCESSING",
    label: "RTO review",
    owner: "rto",
  },
];