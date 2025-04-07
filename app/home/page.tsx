"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectTypeFilter } from "@/components/ProjectTypeFilter";
import { Loader2 } from "lucide-react";
import { getProjects, Project } from "@/lib/db";
import { toast } from "react-hot-toast";

export default function ProjectsPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects(selectedType ?? undefined);
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedType]);

  if (loading) {
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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
