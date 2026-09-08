import { useMemo } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import type { TimelineEvent } from "../types/transfer";
import { verifyTimelineChain } from "../lib/timelineHash";

interface TimelineIntegrityBadgeProps {
  events: TimelineEvent[];
}

export function TimelineIntegrityBadge({
  events,
}: TimelineIntegrityBadgeProps) {
  const verification = useMemo(
    () => verifyTimelineChain(events),
    [events],
  );

  if (verification.valid) {
    return (
      <div className="inline-flex items-center gap-2 border border-[#cdddcf] bg-[#f4f8f4] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#5d7c60]">
        <CheckCircle2
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
        Timeline integrity verified
      </div>
    );
  }

  if (verification.legacyEvents > 0) {
    return (
      <div className="inline-flex items-center gap-2 border border-[#e3cfaa] bg-[#fbf3e3] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8c6427]">
        <ShieldAlert
          aria-hidden="true"
          className="h-3.5 w-3.5"
        />
        Timeline verification unavailable for older events
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 border border-[#d9b5b5] bg-[#fbefef] px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9a4f4f]">
      <ShieldAlert
        aria-hidden="true"
        className="h-3.5 w-3.5"
      />
      Timeline integrity check failed
    </div>
  );
}