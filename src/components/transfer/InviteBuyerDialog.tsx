import { useState } from "react";
import { Copy, Link2, Send, X } from "lucide-react";

import type { TransferInvite } from "../../types/transfer";

interface InviteBuyerDialogProps {
  buyerName: string;
  invite: TransferInvite;
  onClose: () => void;
  onSendInvite: () => void;
}

export function InviteBuyerDialog({
  buyerName,
  invite,
  onClose,
  onSendInvite,
}: InviteBuyerDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = async () => {
    await navigator.clipboard?.writeText(
      `Join my TransferShield vehicle transfer: ${invite.link}`,
    );

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-end bg-slate-950/40 p-4 sm:items-center sm:justify-center"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-dialog-title"
        className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Invite buyer
            </p>
            <h2
              id="invite-dialog-title"
              className="mt-1 text-xl font-bold text-slate-950"
            >
              Share this transfer with {buyerName}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The buyer uses this mock invite to join the shared workspace.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close invite dialog"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Buyer invite code
          </p>
          <p className="mt-2 font-mono text-2xl font-bold tracking-wide text-slate-950">
            {invite.code}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mock share link
          </p>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-300 bg-white p-2">
            <Link2 aria-hidden="true" className="ml-1 h-4 w-4 text-slate-500" />
            <p className="min-w-0 flex-1 truncate text-sm text-slate-700">
              {invite.link}
            </p>
            <button
              type="button"
              onClick={handleCopyInvite}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              <Copy aria-hidden="true" className="h-4 w-4" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSendInvite}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
          >
            <Send aria-hidden="true" className="h-4 w-4" />
            Send mock invite
          </button>
        </div>
      </section>
    </div>
  );
}