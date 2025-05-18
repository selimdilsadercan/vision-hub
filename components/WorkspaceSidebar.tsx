"use client";

import { useEffect, useState } from "react";
import { WorkspaceCard } from "@/components/WorkspaceCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function WorkspaceSidebar() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { user } = useAuth();
  const pathname = usePathname();
  const currentWorkspaceId = pathname.startsWith("/home/") && pathname.split("/").length === 3 ? pathname.split("/")[2] : undefined;
  const isAllActive = pathname === "/home" || pathname === "/home/";

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const firestoreUser = await getUserData(user.uid);
      setUserData(firestoreUser);
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      if (!userData) return;
      try {
        setLoading(true);
        const profileId = userData.profile_id;

        console.log("profileId", profileId);
        const { data: workspacesData, error: workspacesError } = await supabase.rpc("list_user_workspaces", {
          input_profile_id: profileId
        });

        if (workspacesError) {
          console.error("Error fetching workspaces:", workspacesError);
          toast.error("Failed to fetch workspaces");
          return;
        }

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
    <div className="w-[260px] bg-gray-50 flex flex-col">
      <div className="px-6 py-4">
        <h2 className="text-lg font-bold">Workspaces</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="space-y-1">
          <Link href="/home">
            <div
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium text-sm",
                isAllActive ? "bg-gray-100 text-primary" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-5 w-5" />
              <span className="truncate">All Workspaces</span>
            </div>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-1 mt-1">
            {workspaces.length > 0 ? (
              workspaces.map((workspace) => (
                <WorkspaceCard key={workspace.project_id} workspace={workspace} isActive={workspace.project_id === currentWorkspaceId} />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No workspaces found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
