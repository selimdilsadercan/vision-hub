"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Diamond, Building2, Laptop2, HelpCircle } from "lucide-react";
import { Project } from "@/lib/db";

interface ProjectCardProps {
  project: Project;
}

const projectIcons = {
  hub: { icon: Diamond, color: "text-violet-500", bgColor: "bg-violet-500/10" },
  bireysel: { icon: Building2, color: "text-pink-700", bgColor: "bg-pink-700/10" },
  remote: { icon: Laptop2, color: "text-green-700", bgColor: "bg-green-700/10" },
  vcamp: { icon: Building2, color: "text-orange-700", bgColor: "bg-orange-700/10" }
};

export function ProjectCard({ project }: ProjectCardProps) {
  const { icon: Icon, color, bgColor } = projectIcons[project.type as keyof typeof projectIcons] || projectIcons.hub;

  return (
    <Link href={`/project/${project.id}`}>
      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all border">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("p-2 rounded-md", bgColor)}>
            <Icon className={cn("w-5 h-5", color)} />
          </div>
          <div>
            <h3 className="font-medium text-sm">{project.title}</h3>
            <p className="text-xs text-muted-foreground">{project.type}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Görüntülenme</div>
          <div className="text-sm font-medium">{project.views}</div>
        </div>
      </div>
    </Link>
  );
}
