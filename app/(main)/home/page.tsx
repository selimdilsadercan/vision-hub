"use client";

import { useEffect, useState } from "react";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import { EducationPlanCard } from "@/components/EducationPlanCard";

type Workspace = {
  project_id: string;
  project_name: string;
  project_tasks: string[];
  project_extra_text: string;
  image_url: string;
  is_education_plan: boolean;
  education_plan_id?: string;
  education_plan_name?: string;
  education_plan_mentor_name?: string;
  education_plan_mentor_image_url?: string | null;
};

export default function Home() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const firestoreUser = await getUserData(user.uid);
      setUserData(firestoreUser);
      console.log("[DEBUG] userData set:", firestoreUser);
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!userData) return;
      console.log("[DEBUG] Fetching workspaces/educations for profile_id:", userData.profile_id);
      try {
        setLoading(true);

        // Use Firestore profile_id instead of Firebase uid
        const profileId = userData.profile_id;

        // First get all workspaces
        const { data: workspacesData, error: workspacesError } = await supabase.rpc("list_user_workspaces", {
          input_profile_id: profileId
        });
        console.log("[DEBUG] list_user_workspaces data:", workspacesData);

        if (workspacesError) {
          console.error("Error fetching workspaces:", workspacesError);
          toast.error("Failed to fetch workspaces");
          return;
        }

        // Then get all projects to check which workspaces are projects
        const { error: projectsError } = await supabase.rpc("list_projects", {
          input_profile_id: profileId
        });

        if (projectsError) {
          console.error("Error fetching projects:", projectsError);
          toast.error("Failed to fetch projects");
          return;
        }

        setWorkspaces(
          workspacesData.map((w: any) => ({
            ...w,
            is_education_plan: !!w.is_education_plan
          }))
        );
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [userData]);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">HUB</h2>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {workspaces.length > 0 ? (
            workspaces.map((workspace) => <WorkspaceCard key={workspace.project_id} workspace={workspace} />)
          ) : (
            <div className="text-center py-10 col-span-full">
              <p className="text-muted-foreground">No workspaces or education plans found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
