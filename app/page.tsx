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

        const { data, error } = await supabase.rpc("list_user_workspaces", {
          input_profile_id: profileId
        });

        if (error) {
          console.error("Error fetching workspaces:", error);
          toast.error("Failed to fetch workspaces");
        } else {
          setWorkspaces(data as Workspace[]);
        }
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
