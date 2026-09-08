import { useState } from "react";
import { CheckCircle2, UserRound, X } from "lucide-react";

import type { Party, PartyRole } from "../../types/transfer";

type PartyDetails = Pick<Party, "name" | "phoneMasked" | "address">;

interface TransferDetailsDialogProps {
  role: Extract<PartyRole, "seller" | "buyer">;
  party: Party;
  otherPartyConfirmed: boolean;
  onClose: () => void;
  onConfirm: (details: PartyDetails) => void;
}

const roleCopy = {
  seller: {
    label: "Seller",
  },
  buyer: {
    label: "Buyer",
  },
};

export function TransferDetailsDialog({
  role,
  party,
  otherPartyConfirmed,
  onClose,
  onConfirm,
}: TransferDetailsDialogProps) {
  const copy = roleCopy[role];

  const [details, setDetails] = useState<PartyDetails>({
    name: party.name,
    phoneMasked: party.phoneMasked,
    address: party.address,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onConfirm(details);
  };

  return (
  <div className="fixed inset-0 z-50 flex items-end bg-[#24201d]/45 p-3 sm:items-center sm:justify-center sm:p-6">
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="details-dialog-title"
      className="w-full max-w-lg border border-[#d9d0c7] bg-[#fffdf9] shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Confirm your details
            </p>

            <h2
              id="details-dialog-title"
              className="mt-1 text-lg font-bold tracking-tight text-[#24201d]"
            >
              {copy.label} details
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#6b635d]">
              Check your information before payment and e-sign.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close details dialog"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] text-[#8a7d72] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Form */}
        <div className="px-5 py-5 sm:px-6">
          {/* Permission / role note */}
          <div className="border-l-2 border-[#e99b79] bg-[#f8f3ee] px-3 py-3">
            <div className="flex items-start gap-3">
              <UserRound
                aria-hidden="true"
                className="mt-0.5 h-4 w-4 shrink-0 text-[#b56f52]"
              />

              <p className="text-xs leading-5 text-[#6b635d]">
                Only the{" "}
                <span className="font-semibold text-[#24201d]">
                  {role}
                </span>{" "}
                can confirm this information.
              </p>
            </div>
          </div>

          {/* Full name */}
          <label className="mt-5 block text-xs font-semibold text-[#24201d]">
            Full name

            <input
              required
              value={details.name}
              onChange={(event) =>
                setDetails({ ...details, name: event.target.value })
              }
              className="mt-1.5 min-h-11 w-full border border-[#d9d0c7] bg-white px-3 text-sm text-[#24201d] outline-none transition placeholder:text-[#a79b91] focus:border-[#24201d]"
            />
          </label>

          {/* Mobile */}
          <label className="mt-4 block text-xs font-semibold text-[#24201d]">
            Mobile number

            <input
              required
              value={details.phoneMasked}
              onChange={(event) =>
                setDetails({ ...details, phoneMasked: event.target.value })
              }
              className="mt-1.5 min-h-11 w-full border border-[#d9d0c7] bg-white px-3 text-sm text-[#24201d] outline-none transition placeholder:text-[#a79b91] focus:border-[#24201d]"
            />
          </label>

          {/* Address */}
          <label className="mt-4 block text-xs font-semibold text-[#24201d]">
            Address

            <textarea
              required
              rows={3}
              value={details.address ?? ""}
              onChange={(event) =>
                setDetails({ ...details, address: event.target.value })
              }
              className="mt-1.5 w-full resize-none border border-[#d9d0c7] bg-white p-3 text-sm text-[#24201d] outline-none transition placeholder:text-[#a79b91] focus:border-[#24201d]"
            />
          </label>

          {/* Confirmation state */}
          <div
            className={[
              "mt-5 border px-3 py-3",
              otherPartyConfirmed
                ? "border-[#cdddcf] bg-[#f4f8f4]"
                : "border-[#dfd3ca] bg-[#f8f3ee]",
            ].join(" ")}
          >
            <div className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                className={[
                  "mt-0.5 h-4 w-4 shrink-0",
                  otherPartyConfirmed
                    ? "text-[#5d7c60]"
                    : "text-[#9a8b7f]",
                ].join(" ")}
              />

              <p className="text-xs leading-5 text-[#6b635d]">
                {otherPartyConfirmed
                  ? "The other party has already confirmed. Your confirmation will unlock payment."
                  : "The other party must also confirm their details before payment unlocks."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#e5ddd5] bg-[#f8f3ee] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 border border-[#d9d0c7] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold text-[#6b635d] transition hover:bg-white hover:text-[#24201d]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`inline-flex min-h-11 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]`}
          >
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            Confirm my details
          </button>
        </div>
      </form>
    </section>
  </div>
);}