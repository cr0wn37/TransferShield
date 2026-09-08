import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Info,
  Landmark,
  UserRound,
} from "lucide-react";

import type { TimelineEvent } from "../../types/transfer";
import { TimelineIntegrityBadge } from "../TimelineIntegrityBadge";

interface AuditTimelineProps {
  events: TimelineEvent[];
}

const INITIAL_VISIBLE_EVENTS = 3;

const actorLabels: Record<TimelineEvent["actor"], string> = {
  seller: "Seller",
  buyer: "Buyer",
  rto: "RTO officer",
  shared: "Seller and buyer",
  system: "TransferShield",
};

const eventStyles = {
  success: {
    icon: CheckCircle2,
    iconClassName: "border-[#cdddcf] bg-[#f4f8f4] text-[#5d7c60]",
  },
  info: {
    icon: Info,
    iconClassName: "border-[#d9d0c7] bg-[#f8f3ee] text-[#8a7d72]",
  },
  warning: {
    icon: CircleAlert,
    iconClassName: "border-[#e3cfaa] bg-[#fbf3e3] text-[#8c6427]",
  },
  error: {
    icon: CircleAlert,
    iconClassName: "border-[#d9b5b5] bg-[#fbefef] text-[#9a4f4f]",
  },
};

function getActorIcon(actor: TimelineEvent["actor"]) {
  return actor === "rto" ? Landmark : UserRound;
}

function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function AuditTimeline({ events }: AuditTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const newestFirstEvents = [...events].reverse();
  const hasMoreEvents = newestFirstEvents.length > INITIAL_VISIBLE_EVENTS;

  const visibleEvents =
    isExpanded || !hasMoreEvents
      ? newestFirstEvents
      : newestFirstEvents.slice(0, INITIAL_VISIBLE_EVENTS);

  return (
    <section
      aria-label="Audit timeline"
      className="border border-[#d9d0c7] bg-[#fffdf9]"
    >
      {/* Header */}
      <div className="border-b border-[#e5ddd5] px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b56f52]">
              Transfer history
            </p>

            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-bold tracking-tight text-[#24201d]">
                Audit timeline
              </h2>

              <TimelineIntegrityBadge events={events} />
            </div>

            <p className="mt-1.5 text-xs leading-5 text-[#6b635d]">
              A record of every important action in this ownership transfer.
            </p>
          </div>

          {hasMoreEvents ? (
            <button
              type="button"
              aria-controls="audit-timeline-events"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((currentValue) => !currentValue)}
              className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-[#d9d0c7] bg-[#fffdf9] px-3 py-2 text-xs font-semibold text-[#6b635d] transition hover:bg-[#f8f3ee] hover:text-[#24201d]"
            >
              {isExpanded
                ? "Hide full history"
                : `View full history (${events.length} events)`}

              {isExpanded ? (
                <ChevronUp aria-hidden="true" className="h-4 w-4" />
              ) : (
                <ChevronDown aria-hidden="true" className="h-4 w-4" />
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* Empty state */}
      {events.length === 0 ? (
        <div className="px-5 py-5 sm:px-6">
          <div className="border border-[#e1d8d1] bg-[#f8f3ee] px-4 py-3">
            <p className="text-sm font-semibold text-[#24201d]">
              No activity recorded
            </p>

            <p className="mt-1 text-xs leading-5 text-[#8a7d72]">
              Important actions will appear here as the transfer progresses.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Event list */}
          <ol id="audit-timeline-events" className="px-5 py-5 sm:px-6">
            {visibleEvents.map((event, index) => {
              const style = eventStyles[event.status ?? "info"];
              const StatusIcon = style.icon;
              const ActorIcon = getActorIcon(event.actor);

              const isLastVisibleEvent =
                index === visibleEvents.length - 1;

              return (
                <li
                  key={event.id}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {/* Timeline connector */}
                  {!isLastVisibleEvent ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[15px] top-8 h-[calc(100%-0.5rem)] w-px bg-[#e1d8d1]"
                    />
                  ) : null}

                  {/* Event marker */}
                  <div
                    className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center border ${style.iconClassName}`}
                  >
                    <StatusIcon
                      aria-hidden="true"
                      className="h-4 w-4"
                    />
                  </div>

                  {/* Event content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#24201d]">
                          {event.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[#6b635d] sm:text-sm">
                          {event.description}
                        </p>
                      </div>

                      <time
                        dateTime={event.timestamp}
                        className="shrink-0 text-[10px] font-medium text-[#8a7d72] sm:pt-0.5 sm:text-right"
                      >
                        {formatTimestamp(event.timestamp)}
                      </time>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <ActorIcon
                        aria-hidden="true"
                        className="h-3.5 w-3.5 text-[#8a7d72]"
                      />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#8a7d72]">
                        {actorLabels[event.actor]}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {!isExpanded && hasMoreEvents ? (
            <div className="border-t border-[#e5ddd5] bg-[#f8f3ee] px-5 py-3 sm:px-6">
              <p className="text-[11px] text-[#8a7d72]">
                Showing the latest {INITIAL_VISIBLE_EVENTS} events.
              </p>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}