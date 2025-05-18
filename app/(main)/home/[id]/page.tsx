"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Workspace = {
  project_id: string;
  project_name: string;
  project_extra_text: string;
  image_url: string;
  is_education_plan: boolean;
  education_plan_id?: string;
  education_plan_name?: string;
  education_plan_mentor_name?: string;
  education_plan_mentor_image_url?: string | null;
};

type Task = {
  id: string;
  created_at: string;
  text: string;
  is_finished: boolean;
  date: string;
  assigned_user: any;
  task_group: string;
};

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const firestoreUser = await getUserData(user.uid);
      setUserData(firestoreUser);
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchWorkspaceAndTasks = async () => {
      if (!userData || !params.id) return;
      try {
        setLoading(true);
        const profileId = userData.profile_id;

        const { data: workspacesData, error: workspacesError } = await supabase.rpc("list_user_workspaces", {
          input_profile_id: profileId
        });

        if (workspacesError) {
          console.error("Error fetching workspaces:", workspacesError);
          toast.error("Failed to fetch workspace details");
          return;
        }

        const workspace = workspacesData.find((w: any) => w.project_id === params.id);
        if (workspace) {
          setWorkspace({
            ...workspace,
            is_education_plan: !!workspace.is_education_plan
          });

          // Fetch tasks for this workspace
          const { data: tasksData, error: tasksError } = await supabase.rpc("list_project_tasks", {
            input_project_id: params.id as string
          });

          if (tasksError) {
            console.error("Error fetching tasks:", tasksError);
            toast.error("Failed to fetch tasks");
            return;
          }

          setTasks(tasksData || []);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaceAndTasks();
  }, [userData, params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="p-4">
        <div className="text-center py-10">
          <p className="text-muted-foreground">Workspace not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold ml-1">{workspace.project_name}</h2>
        </div>
        <Button
          variant="outline"
          size="default"
          onClick={() => router.push(`/dashboard/${workspace.project_id}`)}
          className="hover:bg-primary/10 mr-1"
          aria-label="Go to dashboard"
        >
          <Shield className="h-5 w-5" />
          Admin Dashboard
        </Button>
      </div>
    </div>
  );
}
