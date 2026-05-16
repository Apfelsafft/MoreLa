import React from "react";

type StatusType = "active" | "planning" | "completed" | "on-hold";
type PriorityType = "high" | "medium" | "low";

interface StatusBadgeProps {
  status: StatusType;
}

interface PriorityBadgeProps {
  priority: PriorityType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<StatusType, { label: string; className: string }> = {
    active: {
      label: "Aktiv",
      className: "bg-green-100 text-green-800 border border-green-200",
    },
    planning: {
      label: "Planung",
      className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    },
    completed: {
      label: "Abgeschlossen",
      className: "bg-gray-100 text-gray-700 border border-gray-200",
    },
    "on-hold": {
      label: "On Hold",
      className: "bg-red-100 text-red-800 border border-red-200",
    },
  };

  const { label, className } = config[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config: Record<PriorityType, { label: string; className: string }> = {
    high: {
      label: "Hoch",
      className: "bg-red-50 text-red-700 border border-red-200",
    },
    medium: {
      label: "Mittel",
      className: "bg-orange-50 text-orange-700 border border-orange-200",
    },
    low: {
      label: "Niedrig",
      className: "bg-blue-50 text-blue-700 border border-blue-200",
    },
  };

  const { label, className } = config[priority];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
