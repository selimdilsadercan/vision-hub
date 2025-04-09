"use client";

import { cn } from "@/lib/utils";

interface TabButtonProps {
  active?: boolean;
  label: string;
  onClick: () => void;
}

export function TabButton({ active, label, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
        active ? "text-blue-600 border-b-2 border-blue-600" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
