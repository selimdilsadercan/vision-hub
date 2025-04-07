"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  id: string;
  name: string;
  organization_name: string;
  organization_image_url: string;
  description: string;
  is_applied: boolean;
  onApply: (jobId: string) => void;
}

export function JobCard({ id, name, organization_name, organization_image_url, description, is_applied, onApply }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <div className="relative w-5 h-5 flex-shrink-0">
              <Image src={organization_image_url} alt={organization_name} fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{name}</h3>
              <p className="text-sm text-blue-600">{organization_name}</p>
            </div>
          </div>
          <Button
            variant={is_applied ? "outline" : "default"}
            size="sm"
            onClick={() => onApply(id)}
            className={is_applied ? "text-blue-600 border-blue-600" : "bg-blue-600 hover:bg-blue-700"}
          >
            {is_applied ? "Başvurdun" : "Başvur"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
