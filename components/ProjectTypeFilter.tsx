"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectTypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

const projectTypes = [
  { label: "Tümü", value: null },
  { label: "Vision Hub", value: "hub" },
  { label: "Bireysel", value: "bireysel" },
  { label: "Remote Tech Work", value: "remote" },
  { label: "V-CAMP", value: "vcamp" }
];

export function ProjectTypeFilter({ selectedType, onChange }: ProjectTypeFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {projectTypes.map((type) => (
        <Button
          key={type.value ?? "all"}
          variant="outline"
          size="sm"
          className={cn("whitespace-nowrap", selectedType === type.value && "bg-primary text-primary-foreground hover:bg-primary/90")}
          onClick={() => onChange(type.value)}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}
