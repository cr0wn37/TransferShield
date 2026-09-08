import { sha256 } from "@noble/hashes/sha2.js";
import type { TimelineEvent } from "../types/transfer";

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function getTimelineEventPayload(
  event: TimelineEvent,
  previousHash: string,
): string {
  return JSON.stringify({
    id: event.id,
    timestamp: event.timestamp,
    title: event.title,
    description: event.description,
    actor: event.actor,
    status: event.status ?? null,
    previousHash,
  });
}

export function calculateTimelineEventHash(
  event: TimelineEvent,
  previousHash: string,
): string {
  const payload = getTimelineEventPayload(
    event,
    previousHash,
  );

  return toHex(
    sha256(new TextEncoder().encode(payload)),
  );
}

export function getGenesisHash(): string {
  return "GENESIS";
}

export function verifyTimelineChain(
  events: TimelineEvent[],
): {
  valid: boolean;
  checkedEvents: number;
  legacyEvents: number;
  firstInvalidEventId?: string;
} {
  let previousHash = getGenesisHash();
  let legacyEvents = 0;

  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];

    if (!event.hash || !event.previousHash) {
      legacyEvents += 1;
      continue;
    }

    if (event.previousHash !== previousHash) {
      return {
        valid: false,
        checkedEvents: index,
        legacyEvents,
        firstInvalidEventId: event.id,
      };
    }

    const expectedHash = calculateTimelineEventHash(
      event,
      previousHash,
    );

    if (event.hash !== expectedHash) {
      return {
        valid: false,
        checkedEvents: index + 1,
        legacyEvents,
        firstInvalidEventId: event.id,
      };
    }

    previousHash = event.hash;
  }

  return {
    valid: legacyEvents === 0,
    checkedEvents: events.length,
    legacyEvents,
  };
}