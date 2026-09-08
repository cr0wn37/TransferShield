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
    className="fixed inset-0 z-50 flex items-end bg-[#24201d]/45 p-3 sm:items-center sm:justify-center sm:p-6"
  >
    <section
      role="dialog"
      aria-modal="true"
      aria-labelledby="invite-dialog-title"
      className="w-full max-w-lg border border-[#d9d0c7] bg-[#fffdf9] shadow-2xl"
    >
      {/* Header */}
      <div className="border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Invite buyer
            </p>

            <h2
              id="invite-dialog-title"
              className="mt-1 text-lg font-bold tracking-tight text-[#24201d]"
            >
              Share this transfer with {buyerName}
            </h2>

            <p className="mt-2 text-xs leading-5 text-[#6b635d]">
              The buyer uses this invite to join the shared workspace.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close invite dialog"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] text-[#8a7d72] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 sm:px-6">
        {/* Invite code */}
        <div className="border border-[#d9d0c7] bg-[#f8f3ee] px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
                Buyer invite code
              </p>

              <p className="mt-2 font-mono text-2xl font-bold tracking-[0.08em] text-[#24201d]">
                {invite.code}
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#fffdf9] text-[#b56f52]">
              <Send aria-hidden="true" className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Share link */}
        <div className="mt-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#8a7d72]">
            Share link
          </p>

          <div className="mt-2 flex items-center gap-2 border border-[#d9d0c7] bg-white p-2">
            <Link2
              aria-hidden="true"
              className="ml-1 h-4 w-4 shrink-0 text-[#8a7d72]"
            />

            <p className="min-w-0 flex-1 truncate text-xs text-[#6b635d]">
              {invite.link}
            </p>

            <button
              type="button"
              onClick={handleCopyInvite}
              className="inline-flex min-h-9 shrink-0 items-center gap-1.5 border border-[#d9d0c7] bg-[#f8f3ee] px-3 text-xs font-semibold text-[#24201d] transition hover:border-[#24201d] hover:bg-[#fffdf9]"
            >
              <Copy aria-hidden="true" className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Prototype note */}
        <div className="mt-5 border-l-2 border-[#e99b79] bg-[#f8f3ee] px-3 py-3">
          <p className="text-xs leading-5 text-[#6b635d]">
            Share the code or link with the buyer to join this transfer.
          </p>
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
          type="button"
          onClick={onSendInvite}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#24201d] bg-[#24201d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332e2a]"
        >
          <Send aria-hidden="true" className="h-4 w-4" />
          Send mock invite
        </button>
      </div>
    </section>
  </div>
);}