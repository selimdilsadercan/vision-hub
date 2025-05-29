"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDialog } from "@/components/tasks/TaskDialog";

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
  workspace_type?: string;
};

type Task = {
  id: string;
  title: string;
  status: "completed" | "pending";
  assignee: {
    id: string;
    name: string;
    image_url?: string;
  } | null;
  dueDate: string;
  description?: string;
};

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { user } = useAuth();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogInitialValues, setTaskDialogInitialValues] = useState({ title: "", description: "", dueDate: "" });

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
            is_education_plan: "is_education_plan" in workspace ? !!workspace.is_education_plan : false,
            workspace_type: workspace.workspace_type
          });

          // Fetch tasks for this workspace
          const { data: tasksData, error: tasksError } = await supabase.rpc("list_project_tasks", {
            input_project_id: params.id as string,
            input_profile_id: profileId
          });

          if (tasksError) {
            console.error("Error fetching tasks:", tasksError);
            toast.error("Failed to fetch tasks");
            return;
          }

          const formattedTasks: Task[] = (tasksData || []).map((task: any) => ({
            id: task.id,
            title: task.text,
            status: task.is_finished ? "completed" : "pending",
            assignee: task.assigned_user
              ? {
                  id: task.assigned_user.id,
                  name: task.assigned_user.name,
                  image_url: task.assigned_user.image_url
                }
              : null,
            dueDate: task.date || "",
            description: task.description || ""
          }));

          setTasks(formattedTasks);
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

  const handleStatusChange = async (taskId: string, newStatus: "completed" | "pending") => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const is_finished = newStatus === "completed";
    const { error } = await supabase.rpc("update_project_task", {
      input_task_id: taskId,
      input_is_finished: is_finished
    });
    if (error) {
      toast.error("Failed to update status");
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleOpenCreateTask = () => {
    setTaskDialogInitialValues({ title: "", description: "", dueDate: "" });
    setTaskDialogOpen(true);
  };

  const handleTaskDialogSuccess = async () => {
    setTaskDialogOpen(false);
    // Refresh tasks
    if (userData && params.id) {
      setLoading(true);
      const profileId = userData.profile_id;
      const { data: tasksData, error: tasksError } = await supabase.rpc("list_project_tasks", {
        input_project_id: params.id as string,
        input_profile_id: profileId
      });
      if (!tasksError) {
        const formattedTasks: Task[] = (tasksData || []).map((task: any) => ({
          id: task.id,
          title: task.text,
          status: task.is_finished ? "completed" : "pending",
          assignee: task.assigned_user
            ? {
                id: task.assigned_user.id,
                name: task.assigned_user.name,
                image_url: task.assigned_user.image_url
              }
            : null,
          dueDate: task.date || "",
          description: task.description || ""
        }));
        setTasks(formattedTasks);
      }
      setLoading(false);
    }
  };

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
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold ml-1">{workspace.project_name}</h2>
        </div>
        {workspace.workspace_type !== "personal" && (
          <Button
            variant="outline"
            size="default"
            onClick={() => router.push(`/dashboard/${workspace.project_id}/tasks`)}
            className="hover:bg-primary/10 mr-1"
            aria-label="Go to dashboard"
          >
            <Shield className="h-5 w-5" />
            Admin Dashboard
          </Button>
        )}
        {workspace.workspace_type === "personal" && (
          <Button variant="outline" size="sm" onClick={handleOpenCreateTask} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Tasks</h3>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No tasks found.</div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSuccess={handleTaskDialogSuccess}
        initialValues={taskDialogInitialValues}
        mode="create"
        projectId={workspace.project_id}
      />
    </div>
  );
}
