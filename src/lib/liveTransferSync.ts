import { supabase } from "./supabaseClient";
import type { Transfer } from "../types/transfer";

const generateSessionCode = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
};

export const createLiveTransfer = async (
  transfer: Transfer
): Promise<string> => {
  const existing = await supabase
    .from("live_transfers")
    .select("session_code")
    .eq("transfer_id", transfer.id)
    .maybeSingle();

  if (existing.error) {
    throw existing.error;
  }

  // Reuse the existing live session for this transfer.
  if (existing.data?.session_code) {
    return existing.data.session_code;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const sessionCode = generateSessionCode();

    const { error } = await supabase
      .from("live_transfers")
      .insert({
        transfer_id: transfer.id,
        session_code: sessionCode,
        state: transfer,
        updated_at: new Date().toISOString(),
      });

    if (!error) {
      return sessionCode;
    }

    // Retry only when the session code itself collides.
    if (!error.message.toLowerCase().includes("duplicate")) {
      throw error;
    }
  }

  throw new Error("Unable to create a live session.");
};
export const getLiveTransferBySessionCode = async (
  sessionCode: string
): Promise<Transfer | null> => {
  const normalizedCode = sessionCode.trim().toUpperCase();

  const { data, error } = await supabase
    .from("live_transfers")
    .select("state")
    .eq("session_code", normalizedCode)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.state as Transfer) ?? null;
};

export const updateLiveTransfer = async (
  transfer: Transfer
): Promise<void> => {
  const { error } = await supabase
    .from("live_transfers")
    .update({
      state: transfer,
      updated_at: new Date().toISOString(),
    })
    .eq("transfer_id", transfer.id);

  if (error) {
    throw error;
  }
};

export const subscribeToLiveTransfer = (
  transferId: string,
  onUpdate: (transfer: Transfer) => void,
  onConnectionChange?: (
    status: "connected" | "error"
  ) => void
) => {
  const channel = supabase
    .channel(`live-transfer-${transferId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "live_transfers",
        filter: `transfer_id=eq.${transferId}`,
      },
      (payload) => {
        const updatedTransfer = payload.new.state as Transfer;
        onUpdate(updatedTransfer);
      }
    )
    .subscribe((status) => {
  console.log("Live transfer channel:", status);

  if (
    status === "CHANNEL_ERROR" ||
    status === "TIMED_OUT" ||
    status === "CLOSED"
  ) {
    onConnectionChange?.("error");
  }

  if (status === "SUBSCRIBED") {
    onConnectionChange?.("connected");
  }
});

  return () => {
    supabase.removeChannel(channel);
  };
};

export const subscribeToLivePresence = (
  transferId: string,
  role: "seller" | "buyer",
  onPresenceChange: (
    users: { seller: boolean; buyer: boolean }
  ) => void,
  onConnectionChange?: (
    status: "connected" | "error"
  ) => void
) => {
  const channel = supabase.channel(`presence-${transferId}`, {
    config: {
      presence: {
        key: role,
      },
    },
  });

  const publishPresence = () => {
   const state = channel.presenceState() as Record<
      string,
      Array<{
        presence_ref: string;
        role?: "seller" | "buyer";
        transferId?: string;
        connectedAt?: string;
      }>
    >;

    const sellerConnected = Object.values(state).some((entries) =>
      entries.some((entry) => entry.role === "seller")
    );

    const buyerConnected = Object.values(state).some((entries) =>
      entries.some((entry) => entry.role === "buyer")
    );

    onPresenceChange({
      seller: sellerConnected,
      buyer: buyerConnected,
    });
  };

  channel
    .on("presence", { event: "sync" }, publishPresence)
    .on("presence", { event: "join" }, publishPresence)
    .on("presence", { event: "leave" }, publishPresence)
    .subscribe(async (status) => {
  if (status === "SUBSCRIBED") {
    await channel.track({
      role,
      transferId,
      connectedAt: new Date().toISOString(),
    });

    onConnectionChange?.("connected");
    publishPresence();
    return;
  }

  if (
    status === "CHANNEL_ERROR" ||
    status === "TIMED_OUT" ||
    status === "CLOSED"
  ) {
    onConnectionChange?.("error");
  }
});

  return () => {
    void channel.untrack();
    void supabase.removeChannel(channel);
  };
};