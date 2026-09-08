

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

  const visibleTasks = tasks.map((task) => ({
  task,
  status: getDerivedTaskStatus(transfer, task.id),
}));

const hasPendingTask = visibleTasks.some(
  ({ status }) => status === "pending" || status === "blocked",
);

const isWaitingForOtherParty =
  !hasPendingTask &&
  visibleTasks.some(({ status }) => status === "completed") &&
  transfer.status !== "TRANSFER_COMPLETED";

  return (
  <section
    className={[
      "overflow-hidden border bg-[#fffdf9] transition",
      isActive
        ? "border-[#d9d0c7]"
        : "border-[#e5ddd5] opacity-70",
    ].join(" ")}
  >
    {/* Column heading */}
    <header className="border-b border-[#e5ddd5] px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7d72]">
            {copy.label}
          </p>

          <h3 className="mt-1 text-base font-bold tracking-tight text-[#24201d]">
            {person.name}
          </h3>
        </div>

        {!isActive && activeDemoRole !== "rto" ? (
          <span className="border border-[#d9d0c7] bg-[#f8f3ee] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8a7d72]">
            Locked
          </span>
        ) : null}
      </div>

      <p className="mt-1 text-xs leading-5 text-[#7b7169]">
        {copy.heading}
      </p>
    </header>

    {/* Role lock */}
    {!isActive && activeDemoRole !== "rto" ? (
      <div className="border-b border-[#e5ddd5] bg-[#f8f3ee] px-4 py-2.5">
        <p className="text-xs font-medium text-[#6b635d]">
          Acting as{" "}
          <span className="font-semibold text-[#24201d]">
            {activeDemoRole}
          </span>
          . {copy.label} actions are locked.
        </p>
      </div>
    ) : null}

    {/* Waiting state */}
    {isWaitingForOtherParty ? (
      <div className="border-b border-[#d8e5d9] bg-[#eef5ef] px-4 py-3">
        <p className="text-xs font-semibold text-[#56715a]">
          Your tasks are complete.
        </p>

        <p className="mt-0.5 text-xs text-[#6b635d]">
          Waiting for the other party to continue.
        </p>
      </div>
    ) : null}

    {/* Tasks */}
    <div className="divide-y divide-[#e5ddd5]">
      {visibleTasks.map(({ task, status }) => (
        <div
          key={task.id}
          className="px-4 py-3"
        >
          <TaskCard
            task={task}
            status={status}
            onAction={
              onTaskAction && isActive
                ? () => onTaskAction(task)
                : undefined
            }
          />
        </div>
      ))}
    </div>
  </section>
);}