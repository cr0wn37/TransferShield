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
    iconClassName: "bg-emerald-100 text-emerald-700",
  },
  info: {
    icon: Info,
    iconClassName: "bg-blue-100 text-blue-700",
  },
  warning: {
    icon: CircleAlert,
    iconClassName: "bg-amber-100 text-amber-700",
  },
  error: {
    icon: CircleAlert,
    iconClassName: "bg-rose-100 text-rose-700",
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
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Transfer history
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Audit timeline
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            A record of every important action in this ownership transfer.
          </p>
        </div>

        {hasMoreEvents ? (
          <button
            type="button"
            aria-controls="audit-timeline-events"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((currentValue) => !currentValue)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
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

      {events.length === 0 ? (
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          No activity has been recorded yet.
        </div>
      ) : (
        <ol id="audit-timeline-events" className="mt-6 space-y-0">
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
                {!isLastVisibleEvent ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-5 top-10 h-[calc(100%-1.5rem)] w-px bg-slate-200"
                  />
                ) : null}

                <div
                  className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style.iconClassName}`}
                >
                  <StatusIcon
                    aria-hidden="true"
                    className="h-5 w-5"
                  />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <p className="font-semibold text-slate-900">
                      {event.title}
                    </p>

                    <time
                      dateTime={event.timestamp}
                      className="shrink-0 text-xs text-slate-500"
                    >
                      {formatTimestamp(event.timestamp)}
                    </time>
                  </div>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {event.description}
                  </p>

                  <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <ActorIcon
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                    />
                    {actorLabels[event.actor]}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {!isExpanded && hasMoreEvents ? (
        <p className="mt-5 text-sm text-slate-500">
          Showing the latest {INITIAL_VISIBLE_EVENTS} events.
        </p>
      ) : null}
    </section>
  );
}