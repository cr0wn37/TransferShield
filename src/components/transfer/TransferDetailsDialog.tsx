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
    accentClassName: "bg-blue-100 text-blue-700",
    buttonClassName: "bg-blue-700 hover:bg-blue-800",
  },
  buyer: {
    label: "Buyer",
    accentClassName: "bg-violet-100 text-violet-700",
    buttonClassName: "bg-violet-700 hover:bg-violet-800",
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
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center sm:justify-center">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-dialog-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Confirm your details
            </p>
            <h2
              id="details-dialog-title"
              className="mt-1 text-xl font-bold text-slate-950"
            >
              {copy.label} details
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Check your information before payment and e-sign. This is mock
              data for the TransferShield prototype.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close details dialog"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-5 flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${copy.accentClassName}`}
            >
              <UserRound aria-hidden="true" className="h-5 w-5" />
            </div>
            <p className="text-sm leading-6 text-slate-700">
              Only the {role} can confirm this information.
            </p>
          </div>

          <label className="block text-sm font-semibold text-slate-700">
            Full name
            <input
              required
              value={details.name}
              onChange={(event) =>
                setDetails({ ...details, name: event.target.value })
              }
              className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Mobile number
            <input
              required
              value={details.phoneMasked}
              onChange={(event) =>
                setDetails({ ...details, phoneMasked: event.target.value })
              }
              className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-slate-700">
            Address
            <textarea
              required
              rows={3}
              value={details.address ?? ""}
              onChange={(event) =>
                setDetails({ ...details, address: event.target.value })
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </label>

          <p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
            {otherPartyConfirmed
              ? "The other party has already confirmed. Your confirmation will unlock payment."
              : "The other party must also confirm their details before payment unlocks."}
          </p>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${copy.buttonClassName}`}
            >
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Confirm my details
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}