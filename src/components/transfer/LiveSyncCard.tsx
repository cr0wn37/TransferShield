import React, { useState } from "react";
import {
  Link2,
  Radio,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";

import {
  
  getLiveTransferBySessionCode,
} from "../../lib/liveTransferSync";

import type { Transfer } from "../../types/transfer";
import { useTransferStore } from "../../state/transferStore";
import { supabase } from "../../lib/supabaseClient";

interface LiveSyncCardProps {
  transfer: Transfer;
}

export const LiveSyncCard: React.FC<LiveSyncCardProps> = ({
  transfer,
}) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      <section className="border border-[#d9d0c7] bg-[#fffdf9]">
  <div className="flex items-center justify-between gap-4 px-4 py-3">
    
    <div className="flex min-w-0 items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#d9d0c7] bg-[#f8f3ee] text-[#24201d]">
        <Radio size={15} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold text-[#24201d]">
            Live Sync
          </h3>

          <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#8a7d72]">
            Optional
          </span>
        </div>

        <p className="mt-0.5 hidden text-[11px] text-[#8a7d72] sm:block">
          Connect another device to this transfer.
        </p>
      </div>
    </div>

    <button
      type="button"
      onClick={() => setIsOpen(true)}
      className="inline-flex shrink-0 items-center gap-2 border border-[#24201d] bg-[#24201d] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#332e2a]"
    >
      <Link2 size={14} />
      Enable
    </button>

  </div>
</section>

      <LiveSyncDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  transfer={transfer}
/>
    </>
  );
};

interface LiveSyncDialogProps {
  isOpen: boolean;
  onClose: () => void;
  transfer: Transfer;
}

const LiveSyncDialog: React.FC<LiveSyncDialogProps> = ({
  isOpen,
  onClose,
  transfer,
}) => {
  const [mode, setMode] = useState<"create" | "join">("create");

  const [sessionCode, setSessionCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const [error, setError] = useState("");

  const startLiveSync = useTransferStore(
  (state) => state.startLiveSync
);

const joinLiveSync = useTransferStore(
  (state) => state.joinLiveSync
);

const liveSync = useTransferStore(
  (state) => state.liveSync
);



const testSupabase = async () => {
  const { data, error } = await supabase
    .from("live_transfers")
    .select("transfer_id")
    .limit(1);

  console.log("SUPABASE DATA:", data);
  console.log(
  "SUPABASE ERROR:",
  JSON.stringify(error, null, 2)
);
};

  const handleCreateSession = async () => {

    await testSupabase();
  try {
    setIsCreating(true);
    setError("");

    const code = await startLiveSync("seller");

    setSessionCode(code);
  } catch (error) {
    console.error(error);

    setError(
      error instanceof Error
        ? error.message
        : "Unable to create a live session."
    );
  } finally {
    setIsCreating(false);
  }
};

  const handleJoinSession = async () => {
  try {
    setIsJoining(true);
    setError("");

    console.log("JOIN CODE:", joinCode);

    const liveTransfer =
      await getLiveTransferBySessionCode(joinCode);

    console.log("LIVE TRANSFER:", liveTransfer);

    if (!liveTransfer) {
      setError(`No live session found for code: ${joinCode}`);
      return;
    }

    await joinLiveSync(joinCode, "buyer");

    setError("");
  } catch (error) {
    console.error(
      "JOIN ERROR:",
      JSON.stringify(error, null, 2)
    );

    setError(
      error instanceof Error
        ? error.message
        : JSON.stringify(error)
    );
  } finally {
    setIsJoining(false);
  }
};

  if (!isOpen) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
    <div className="flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* Header — stays fixed */}
      <div className="shrink-0 border-b border-slate-200 px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-500">
              <Radio size={16} />

              <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                Live Sync
              </span>
            </div>

            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950">
              Connect another device
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Keep the same transfer synchronized across devices.
            </p>
          </div>

          {error && (
            <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">

        {/* Transfer context */}
        <div className="mx-6 mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Current transfer
          </div>

          <div className="mt-1 flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-slate-900">
              {transfer.vehicle.registrationNumber}
            </span>

            <span className="text-xs font-medium text-slate-500">
              {transfer.id}
            </span>
          </div>
        </div>

        {/* Mode selector */}
        <div className="px-6 pt-5">
          <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setMode("create")}
              className={[
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                mode === "create"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              Create session
            </button>

            <button
              type="button"
              onClick={() => setMode("join")}
              className={[
                "rounded-lg px-3 py-2 text-sm font-semibold transition",
                mode === "join"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              Join session
            </button>
          </div>
        </div>

        {liveSync.status === "connected" && (
  <div className="mx-6 mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
    <p className="text-sm font-semibold text-emerald-900">
      Live session connected
    </p>
    <p className="mt-1 text-xs text-emerald-700">
      This device is now synchronized with the transfer.
    </p>
  </div>
)}

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {mode === "create" ? (
            <CreateSessionPanel
  sessionCode={sessionCode}
  isCreating={isCreating}
  onCreate={handleCreateSession}
/>
          ) : (
            <JoinSessionPanel
  roomCode={joinCode}
  setRoomCode={setJoinCode}
  isJoining={isJoining}
  onJoin={handleJoinSession}
/>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

interface CreateSessionPanelProps {
  sessionCode: string;
  isCreating: boolean;
  onCreate: () => void;
}

const CreateSessionPanel: React.FC<CreateSessionPanelProps> = ({
  sessionCode,
  isCreating,
  onCreate,
}) => {

  const liveSync = useTransferStore(
  (state) => state.liveSync
);
  return (
  <div className="space-y-5">
    {/* Intro */}
    <div>
      <h3 className="text-base font-bold text-slate-950">
        Start a live session
      </h3>

      <p className="mt-1 text-sm leading-5 text-slate-500">
        Create a session and share it with the other party.
        Changes will sync automatically once they join.
      </p>
    </div>

    {/* Session code */}
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        Session code
      </div>

      <div className="mt-2 text-2xl font-bold tracking-[0.2em] text-slate-950">
        {sessionCode || "------"}
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Share this code with the buyer
      </p>
    </div>

    {/* QR / Join instructions */}
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
          <div className="grid grid-cols-5 gap-1">
            {Array.from({ length: 25 }).map((_, index) => (
              <div
                key={index}
                className={[
                  "h-1.5 w-1.5",
                  [
                    0,
                    1,
                    3,
                    5,
                    7,
                    9,
                    12,
                    14,
                    16,
                    18,
                    20,
                    22,
                    24,
                  ].includes(index)
                    ? "bg-slate-900"
                    : "bg-white",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            Scan to join
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            The second device can scan this code or enter the
            session code manually.
          </p>
        </div>
      </div>

      {/* Create session */}
      <button
        type="button"
        onClick={onCreate}
        disabled={isCreating || !!sessionCode}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <Link2 size={16} />

        {isCreating
          ? "Creating live session..."
          : sessionCode
            ? "Session created"
            : "Create live session"}
      </button>
    </div>

    {/* Connection status */}
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span
        className={[
          "h-2.5 w-2.5 shrink-0 rounded-full",
          liveSync.status === "connected"
            ? "bg-emerald-500"
            : liveSync.status === "error"
              ? "bg-red-500"
              : "bg-amber-400",
        ].join(" ")}
      />

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">
          {liveSync.status === "connected"
            ? "Live session connected"
            : liveSync.status === "error"
              ? "Live connection error"
              : "Waiting for second device"}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {liveSync.status === "connected"
            ? "Changes are syncing between devices."
            : liveSync.status === "error"
              ? liveSync.error
              : sessionCode
                ? "Session is ready to connect."
                : "Create a session to begin."}
        </p>
      </div>
    </div>
      </div>
  );
};

interface JoinSessionPanelProps {
  roomCode: string;
  setRoomCode: (value: string) => void;
  isJoining: boolean;
  onJoin: () => void;
}

const JoinSessionPanel: React.FC<JoinSessionPanelProps> = ({
  roomCode,
  setRoomCode,
  isJoining,
  onJoin,
}) => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-slate-950">
          Join a live session
        </h3>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          Enter the session code shared by the other party.
        </p>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700">
          Session code
        </label>

        <input
          type="text"
          value={roomCode}
          onChange={(event) =>
            setRoomCode(event.target.value.toUpperCase())
          }
          maxLength={6}
          placeholder="TS4821"
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-center text-lg font-bold tracking-[0.18em] text-slate-950 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
        />
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
        <div className="flex gap-3">
          <Smartphone
            size={17}
            className="mt-0.5 shrink-0 text-blue-600"
          />

          <div>
            <p className="text-sm font-semibold text-blue-950">
              What will sync?
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-900/75">
              Workflow status, documents, payments, approvals and
              timeline updates.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onJoin}
        disabled={roomCode.length < 6 || isJoining}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
      >
        <ShieldCheck size={16} />
        {isJoining ? "Joining session..." : "Join live session"}
      </button>
    </div>
  );
};