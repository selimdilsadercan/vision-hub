"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";

interface WorkspaceCardProps {
  workspace: {
    project_id: string;
    project_name: string;
    project_tasks: string[];
    project_extra_text: string;
    image_url: string;
  };
}

export function WorkspaceCard({ workspace }: WorkspaceCardProps) {
  const shouldShowExtraText = workspace.project_extra_text !== "-1";

  const href = `/dashboard/${workspace.project_id}`;

  return (
    <Link href={href}>
      <div className="bg-white rounded-3xl p-4 border shadow-sm hover:shadow-md transition-all h-[72px]">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-5 h-5 relative">
            {workspace.image_url ? (
              <Image src={workspace.image_url} alt={workspace.project_name} fill className="object-contain" />
            ) : (
              <Building2 className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate">{workspace.project_name}</h3>
            {shouldShowExtraText && <p className="text-xs text-muted-foreground mt-0.5">{workspace.project_extra_text}</p>}
          </div>
        </div>
      </div>
    </Link>
  );
}
