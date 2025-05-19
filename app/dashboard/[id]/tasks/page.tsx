"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { TaskCard } from "@/components/tasks/TaskCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import { TaskDialog } from "@/components/tasks/TaskDialog";

interface Task {
  id: string;
  title: string;
  description: string;
  is_finished: boolean;
  date: string;
  assigned_user_id?: string;
  assigned_user?: {
    id: string;
    name: string;
    image_url?: string;
  };
}

interface TaskDialogSubmitData {
  title: string;
  description: string;
  dueDate: string;
  assignedUserId?: string;
}

interface TaskDialogInitialValues {
  title: string;
  description: string;
  dueDate?: string;
  assignedUserId?: string;
  id?: string;
}

export default function TasksPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogMode, setTaskDialogMode] = useState<"create" | "edit">("create");
  const [taskDialogInitialValues, setTaskDialogInitialValues] = useState<TaskDialogInitialValues>({
    title: "",
    description: ""
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskDialogInitialAssignedUser, setTaskDialogInitialAssignedUser] = useState<{ id: string; name: string; image_url?: string } | undefined>(undefined);

  useEffect(() => {
    const fetchProfileId = async () => {
      if (!user) return;
      const userData = await getUserData(user.uid);
      if (userData?.profile_id) setProfileId(userData.profile_id);
    };
    fetchProfileId();
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.rpc("list_project_tasks", { input_project_id: projectId });
    if (error) {
      setError("Failed to fetch tasks");
      setLoading(false);
      toast.error("Failed to fetch tasks");
      return;
    }

    const formattedTasks: Task[] = (data as any[]).map((task) => ({
      id: task.id,
      title: task.text,
      description: task.description || "",
      is_finished: task.is_finished,
      date: task.date,
      assigned_user_id: task.assigned_user_id,
      assigned_user: task.assigned_user
        ? {
            id: task.assigned_user.id,
            name: task.assigned_user.name,
            image_url: task.assigned_user.image_url
          }
        : undefined
    }));
    setTasks(formattedTasks);
    setLoading(false);
  };

  useEffect(() => {
    if (projectId) fetchTasks();
  }, [projectId]);

  const handleOpenCreateTask = () => {
    setTaskDialogMode("create");
    setTaskDialogInitialValues({ title: "", description: "", dueDate: "", assignedUserId: "" });
    setTaskDialogInitialAssignedUser(undefined);
    setEditingTaskId(null);
    setTaskDialogOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskDialogMode("edit");
    setTaskDialogInitialValues({
      title: task.title,
      description: task.description,
      dueDate: task.date,
      assignedUserId: task.assigned_user_id
    });
    setEditingTaskId(task.id);
    setTaskDialogOpen(true);
    setTaskDialogInitialAssignedUser(
      task.assigned_user
        ? {
            id: task.assigned_user.id,
            name: task.assigned_user.name,
            image_url: task.assigned_user.image_url
          }
        : undefined
    );
  };

  const handleTaskDialogSubmit = async (data: TaskDialogSubmitData): Promise<void> => {
    console.log(data);
    if (taskDialogMode === "create") {
      if (!profileId) return;
      const { error } = await supabase.rpc("create_project_task", {
        input_project_id: projectId,
        input_text: data.title,
        input_profile_id: data.assignedUserId || profileId,
        input_date: data.dueDate || undefined,
        input_description: data.description || undefined
      });
      if (error) {
        toast.error("Failed to create task");
        console.error("Supabase create error:", error);
        throw new Error("Failed to create task");
      }
      toast.success("Task created successfully");
    } else if (taskDialogMode === "edit") {
      if (!editingTaskId) return;
      const { error } = await supabase.rpc("update_project_task", {
        input_task_id: editingTaskId,
        input_text: data.title,
        input_date: data.dueDate || undefined,
        input_profile_id: data.assignedUserId || undefined,
        input_description: data.description || undefined
      });
      if (error) {
        toast.error("Failed to update task");
        console.error("Supabase update error:", error);
        throw new Error("Failed to update task");
      }
      toast.success("Task updated successfully");
    }
    setTaskDialogOpen(false);
    await fetchTasks();
  };

  const handleStatusChange = async (taskId: string, newStatus: "completed" | "pending" | "in-progress") => {
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
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, is_finished } : t)));
  };

  const handleDeleteTask = async () => {
    if (!editingTaskId) return;
    const { error } = await supabase.rpc("delete_project_task", { input_task_id: editingTaskId });
    if (error) {
      toast.error("Failed to delete task");
      return;
    }
    toast.success("Task deleted successfully");
    setTaskDialogOpen(false);
    await fetchTasks();
  };

  const paginatedTasks = tasks;

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleOpenCreateTask} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}
      {error && <div className="text-center py-8 text-destructive">{error}</div>}

      {!loading && !error && tasks.length === 0 && <div className="text-center py-8 text-muted-foreground">No tasks found.</div>}

      {!loading && !error && (
        <div className="space-y-2">
          {paginatedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                id: task.id,
                title: task.title,
                status: task.is_finished ? "completed" : "pending",
                assignee: task.assigned_user || null,
                dueDate: task.date || "",
                description: task.description || ""
              }}
              onStatusChange={handleStatusChange}
              onCardClick={() => handleOpenEditTask(task)}
            />
          ))}
        </div>
      )}

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleTaskDialogSubmit}
        initialValues={{
          ...taskDialogInitialValues,
          id: editingTaskId || undefined
        }}
        initialAssignedUser={taskDialogInitialAssignedUser}
        mode={taskDialogMode}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
