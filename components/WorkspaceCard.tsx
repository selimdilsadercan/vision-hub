"use client";

import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Rocket, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface WorkspaceCardProps {
  workspace: {
    project_id: string;
    project_name: string;
    image_url?: string;
    workspace_type?: string;
  };
  isActive?: boolean;
}

export function WorkspaceCard({ workspace, isActive }: WorkspaceCardProps) {
  const href = `/home/${workspace.project_id}`;
  const isEducation = workspace.workspace_type === "education";
  const isProject = workspace.workspace_type === "project";
  const isPersonal = workspace.workspace_type === "personal";

  return (
    <Link href={href}>
      <div
        className={cn(
          "group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
          isActive ? "bg-gray-100 text-primary" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        )}
      >
        <div className="flex-shrink-0 w-6 h-6 relative flex items-center justify-center overflow-hidden">
          {isEducation ? (
            <GraduationCap className="h-5 w-5" />
          ) : isProject ? (
            workspace.image_url ? (
              <Image src={workspace.image_url} alt={workspace.project_name} fill className="object-contain rounded-full" sizes="24px" />
            ) : (
              <Rocket className="h-5 w-5" />
            )
          ) : isPersonal ? (
            <User className="h-5 w-5" />
          ) : (
            <Rocket className="h-5 w-5" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{workspace.project_name}</h3>
        </div>
        <Badge variant="secondary" className={cn("text-[10px] px-1.5 py-0 h-4", isActive ? "bg-gray-200 text-primary" : "bg-muted")}>
          {isEducation ? "Edu" : isProject ? "Project" : isPersonal ? "Personal" : ""}
        </Badge>
      </div>
    </Link>
  );
}
