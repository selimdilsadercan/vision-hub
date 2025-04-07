"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProjectCard } from "@/components/ProjectCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

type Project = {
  id: string;
  name: string;
  image_url: string | null;
  is_admin: boolean;
  type?: string;
  views?: number;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Use the provided profile ID directly
        const profileId = "d8323ace-4e10-4422-8c99-7380286ec0e5";

        // Fetch projects using the list_projects function
        const { data, error } = await supabase.rpc("list_projects", {
          input_profile_id: profileId
        });

        if (error) {
          console.error("Error fetching projects:", error);
          toast.error("Failed to fetch projects");
        } else {
          // Transform the data to match the Project type expected by ProjectCard
          const transformedProjects = (data as Project[]).map((project) => ({
            ...project,
            title: project.name, // ProjectCard expects 'title' but Supabase returns 'name'
            type: "hub", // Default type if not available
            views: 0 // Default views if not available
          }));

          setProjects(transformedProjects);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projeler</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      )}
    </div>
  );
}
