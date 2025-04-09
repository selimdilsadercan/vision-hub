"use client";

import { ProjectNavbar } from "@/components/projects/ProjectNavbar";
import { ProjectSidebar } from "@/components/projects/ProjectSidebar";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";

const MOCK_USER_ID = "d8323ace-4e10-4422-8c99-7380286ec0e5";

interface Project {
  id: string;
  name: string;
  description: string;
  is_private: boolean;
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data: projectData, error } = await supabase.rpc("get_project", {
          input_project_id: projectId,
          input_profile_id: MOCK_USER_ID
        });

        if (error) {
          console.error("Error fetching project:", error);
          toast.error("Failed to fetch project details");
          return;
        }

        if (projectData && typeof projectData === "object" && "id" in projectData) {
          setProject({
            id: projectData.id as string,
            name: projectData.name as string,
            description: projectData.description as string,
            is_private: projectData.is_private as boolean
          });
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-50">
        <ProjectSidebar projectId={projectId} />
      </div>
      <main className="md:pl-72">
        <ProjectHeader title={project.name} isPrivate={project.is_private} projectId={projectId} />
        {children}
      </main>
      <ProjectNavbar projectId={projectId} />
    </div>
  );
}
