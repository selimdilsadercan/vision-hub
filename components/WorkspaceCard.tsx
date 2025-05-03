"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WorkspaceCardProps {
  workspace: {
    project_id: string;
    project_name: string;
    project_tasks: string[];
    project_extra_text: string;
    image_url: string;
    is_education_plan: boolean;
  };
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const shouldShowExtraText = workspace.project_extra_text !== "-1";
  const href = workspace.is_education_plan ? `/learn/${workspace.project_id}` : `/dashboard/${workspace.project_id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl border p-4 transition-all h-[80px] flex items-center gap-3 relative hover:bg-muted/40 hover:border-primary group cursor-pointer">
        <div className="flex-shrink-0 w-7 h-7 relative flex items-center justify-center overflow-hidden">
          {workspace.is_education_plan ? (
            <GraduationCap className="h-6 w-6 text-primary" />
          ) : workspace.image_url ? (
            <Image src={workspace.image_url} alt={workspace.project_name} fill className="object-contain rounded-full" sizes="28px" />
          ) : (
            <Rocket className="h-6 w-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-medium text-base truncate">{workspace.project_name}</h3>
          {shouldShowExtraText && <p className="text-xs text-muted-foreground mt-0.5">{workspace.project_extra_text}</p>}
          <Badge variant="outline" className="text-xs px-2 py-0.5 mt-2 w-fit">
            {workspace.is_education_plan ? "Education" : "Project"}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
