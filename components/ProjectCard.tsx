"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProjectCardProps {
  project: Doc<"projects">;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();
  const incrementViews = useMutation(api.projects.incrementViews);

  const handleClick = () => {
    incrementViews({ id: project._id });
    router.push(`/project/${project._id}`);
  };

  return (
    <div onClick={handleClick} className="group flex items-center gap-x-4 p-4 cursor-pointer rounded-lg hover:bg-gray-100 transition">
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 group-hover:bg-white transition">{project.icon}</div>
      <div className="flex-1">
        <div className="flex items-center gap-x-2">
          <p className="text-sm font-medium">{project.title}</p>
          <div className="flex items-center gap-x-1 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-xs">{project.views}</span>
          </div>
        </div>
        {project.description && <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>}
      </div>
    </div>
  );
}
