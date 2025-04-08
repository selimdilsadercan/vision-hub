"use client";

import { useEffect, useState } from "react";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

type Workspace = {
  project_id: string;
  project_name: string;
  project_tasks: string[];
  project_extra_text: string;
  image_url: string;
  type: "project" | "workspace";
};

export default function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);

        // Use the provided profile ID
        const profileId = "d8323ace-4e10-4422-8c99-7380286ec0e5";

        // First get all workspaces
        const { data: workspacesData, error: workspacesError } = await supabase.rpc("list_user_workspaces", {
          input_profile_id: profileId
        });

        if (workspacesError) {
          console.error("Error fetching workspaces:", workspacesError);
          toast.error("Failed to fetch workspaces");
          return;
        }

        // Then get all projects to check which workspaces are projects
        const { data: projectsData, error: projectsError } = await supabase.rpc("list_projects", {
          input_profile_id: profileId
        });

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          toast.error("Failed to fetch projects");
          return;
        }

        // Create a set of project IDs for faster lookup
        const projectIds = new Set(projectsData?.map((project: any) => project.id) || []);

        // Transform workspaces data to include type
        const workspacesWithType = workspacesData.map((workspace: any) => ({
          ...workspace,
          type: projectIds.has(workspace.project_id) ? "project" : "workspace"
        }));

        setWorkspaces(workspacesWithType);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">HUB</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : workspaces.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.project_id} workspace={workspace} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No workspaces found</p>
        </div>
      )}
    </div>
  );
}
