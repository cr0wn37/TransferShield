import { UserRound } from "lucide-react";

import type { PartyRole, Transfer, TransferTask } from "../../types/transfer";
import { getDerivedTaskStatus } from "../../utils/workflow";
import { TaskCard } from "./TaskCard";

interface PartyColumnProps {
  transfer: Transfer;
  role: Extract<PartyRole, "seller" | "buyer">;
  activeDemoRole?: "seller" | "buyer" | "rto";
  onTaskAction?: (task: TransferTask) => void;
}


const roleCopy = {
  seller: {
    label: "Seller",
    heading: "Your responsibilities",
    accentClassName: "bg-blue-600",
    iconClassName: "bg-blue-100 text-blue-700",
  },
  buyer: {
    label: "Buyer",
    heading: "Your responsibilities",
    accentClassName: "bg-violet-600",
    iconClassName: "bg-violet-100 text-violet-700",
  },
};

export function PartyColumn({
  transfer,
  role,
  activeDemoRole,
  onTaskAction,
}: PartyColumnProps) {
  const person = transfer[role];
  const copy = roleCopy[role];

  const tasks = transfer.tasks.filter(
    (task) => task.owner === role || task.owner === "shared",
  );

  const isActive = activeDemoRole === role;

  return (
    <section
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
        isActive
          ? "border-slate-200 opacity-100"
          : "border-slate-200 opacity-70"
      }`}
    >
      <div className={`h-1.5 ${copy.accentClassName}`} />

      <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${copy.iconClassName}`}
        >
          <UserRound aria-hidden="true" className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            {copy.label}: {person.name}
          </p>
          <p className="mt-0.5 text-sm text-slate-500">{copy.heading}</p>
        </div>
      </header>
      {!isActive && activeDemoRole !== "rto" ? (
        <p className="bg-slate-50 px-5 py-2 text-xs font-medium text-slate-500">
          Switch Demo Mode to act as {copy.label}
        </p>
      ) : null}

      <div className="space-y-3 p-4">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            status={getDerivedTaskStatus(transfer, task.id)}
            onAction={
              onTaskAction ? () => onTaskAction(task) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}