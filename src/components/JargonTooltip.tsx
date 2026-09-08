import { Info } from "lucide-react";

interface JargonTooltipProps {
  term: string;
  explanation: string;
}

export function JargonTooltip({
  term,
  explanation,
}: JargonTooltipProps) {
  return (
    <span className="group relative inline-flex items-center gap-1">
      <span className="font-medium">
        {term}
      </span>

      <button
        type="button"
        aria-label={`What is ${term}?`}
        className="text-slate-400 transition hover:text-slate-700"
      >
        <Info className="h-3.5 w-3.5" />
      </button>

      <span className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-64 -translate-x-1/2 rounded-xl bg-slate-950 px-3 py-2 text-xs leading-5 text-white shadow-xl group-hover:block group-focus-within:block">
        {explanation}
      </span>
    </span>
  );
}