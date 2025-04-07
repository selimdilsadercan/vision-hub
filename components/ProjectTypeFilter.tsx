"use client";

import { cn } from "@/lib/utils";
import { Diamond, Laptop2, Building2, HelpCircle } from "lucide-react";

interface ProjectTypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

const projectTypes = [
  {
    label: "Tümü",
    value: null,
    icon: Building2,
    color: "text-gray-500",
    bgColor: "bg-gray-500/10"
  },
  {
    label: "Vision Hub",
    value: "hub",
    icon: Diamond,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10"
  },
  {
    label: "Bireysel",
    value: "bireysel",
    icon: Building2,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10"
  },
  {
    label: "Remote Tech Work",
    value: "remote",
    icon: Laptop2,
    color: "text-green-700",
    bgColor: "bg-green-700/10"
  },
  {
    label: "V-CAMP",
    value: "vcamp",
    icon: Building2,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10"
  }
];

export function ProjectTypeFilter({ selectedType, onChange }: ProjectTypeFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {projectTypes.map((type) => (
        <button
          key={type.value ?? "all"}
          onClick={() => onChange(type.value)}
          className={cn(
            "flex items-center gap-x-2 px-3 py-2 rounded-full transition-colors",
            selectedType === type.value ? cn("text-white", type.bgColor.replace("/10", "")) : cn("hover:text-white hover:bg-zinc-700", type.bgColor)
          )}
        >
          <type.icon className="h-4 w-4" />
          <span className="whitespace-nowrap text-sm">{type.label}</span>
        </button>
      ))}
    </div>
  );
}
