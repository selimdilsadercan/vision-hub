"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectTypeFilter } from "@/components/ProjectTypeFilter";
import { Loader2 } from "lucide-react";

export default function ProjectsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const projects = useQuery(api.projects.getProjects, { type: selectedType ?? undefined });

  if (projects === undefined) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full p-4 space-y-4">
      <h1 className="text-2xl font-bold">Projeler</h1>
      <ProjectTypeFilter selectedType={selectedType} onChange={setSelectedType} />
      {projects.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center space-y-2">
          <p className="text-muted-foreground text-sm">Henüz proje bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
