"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { toast } from "react-hot-toast";
import { TaskCard } from "@/components/tasks/TaskCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { StoryDialog } from "@/components/tasks/StoryDialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { StoryDetailDialog } from "@/dialog/StoryDetailDialog";

interface Task {
  id: string;
  title: string;
  description: string;
  is_finished: boolean;
  date: string;
  assigned_user_id: string | null;
  assigned_user: {
    id: string | null;
    name: string | null;
    image_url: string | undefined;
  } | null;
  story_id?: string | null;
  story_name?: string | null;
  story_status?: "Todo" | "InProgress" | "Done" | null;
}

interface StoryTaskGroup {
  story_id: string | null;
  story_name: string | null;
  story_status: "Todo" | "InProgress" | "Done" | null;
  tasks:
    | {
        id: string | null;
        text: string | null;
        description: string | null;
        is_finished: boolean;
        date: string | null;
        assigned_user_id: string | null;
        assigned_user: {
          id: string | null;
          name: string | null;
          image_url: string | null;
        } | null;
      }[]
    | null;
}

interface TasksResponse {
  story_tasks: StoryTaskGroup[];
  unassigned_tasks: {
    id: string | null;
    text: string | null;
    description: string | null;
    is_finished: boolean;
    date: string | null;
    assigned_user_id: string | null;
    assigned_user: {
      id: string | null;
      name: string | null;
      image_url: string | null;
    } | null;
  }[];
}

interface TaskDialogInitialValues {
  title: string;
  description: string;
  dueDate?: string;
  assignedUserId?: string;
  id?: string;
  storyId?: string | null;
}

export default function TasksPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { user } = useAuth();

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
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [storyTasksResponse, setStoryTasksResponse] = useState<StoryTaskGroup[]>([]);
  const [mappedUnassignedTasks, setMappedUnassignedTasks] = useState<Task[]>([]);
  const [editingStory, setEditingStory] = useState<{ id: string | null; title: string | null; status: "Todo" | "InProgress" | "Done" | null } | null>(null);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [showDeleteStoryConfirm, setShowDeleteStoryConfirm] = useState(false);
  const [storyDetailDialogOpen, setStoryDetailDialogOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

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
    const { data, error } = await supabase.rpc("list_project_tasks_with_stories", {
      input_project_id: projectId,
      input_profile_id: profileId || undefined
    });
    if (error) {
      setError("Failed to fetch tasks");
      setLoading(false);
      toast.error("Failed to fetch tasks");
      return;
    }
    const response = data[0] as unknown as TasksResponse;
    setStoryTasksResponse(response.story_tasks);
    const mappedUnassigned = response.unassigned_tasks.map((task) => ({
      id: task.id ?? "",
      title: task.text ?? "",
      description: task.description ?? "",
      is_finished: task.is_finished,
      date: task.date ?? "",
      assigned_user_id: task.assigned_user_id,
      assigned_user: task.assigned_user
        ? {
            id: task.assigned_user.id || "",
            name: task.assigned_user.name || "",
            image_url: task.assigned_user.image_url === null ? undefined : task.assigned_user.image_url
          }
        : null,
      story_id: null,
      story_name: null,
      story_status: null
    }));
    setMappedUnassignedTasks(mappedUnassigned);
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
    let storyId: string | undefined = undefined;
    if (typeof task.story_id === "string" && task.story_id && task.story_id !== "null" && task.story_id !== null) {
      storyId = task.story_id;
    }
    const initialValues: TaskDialogInitialValues = {
      title: task.title,
      description: task.description,
      dueDate: task.date,
      assignedUserId: task.assigned_user_id || undefined,
      id: task.id
    };
    if (typeof storyId === "string" && storyId) {
      initialValues.storyId = storyId;
    }
    setTaskDialogInitialValues(initialValues);
    setEditingTaskId(task.id);
    setTaskDialogOpen(true);
    setTaskDialogInitialAssignedUser(
      task.assigned_user
        ? {
            id: task.assigned_user.id || "",
            name: task.assigned_user.name || "",
            image_url: task.assigned_user.image_url || ""
          }
        : undefined
    );
  };

  const handleStatusChange = async (taskId: string, newStatus: "completed" | "pending" | "in-progress") => {
    const task = storyTasksResponse.flatMap((group) => group.tasks || []).find((t) => t.id === taskId);
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
    await fetchTasks();
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

  const handleDeleteStory = async () => {
    if (!storyToDelete) return;
    const { error } = await supabase.rpc("delete_story", { input_story_id: storyToDelete });
    if (error) {
      toast.error("Failed to delete story");
      return;
    }
    toast.success("Story deleted successfully");
    setShowDeleteStoryConfirm(false);
    setStoryToDelete(null);
    await fetchTasks();
  };

  // Group tasks by story
  const tasksByStory = storyTasksResponse.reduce((acc, group) => {
    if (group.story_id) {
      if (!acc[group.story_id]) {
        acc[group.story_id] = {
          story_id: group.story_id,
          story_name: group.story_name || "Unnamed Story",
          story_status: group.story_status || "Todo",
          tasks: []
        };
      }
      acc[group.story_id].tasks = (group.tasks || []).map((task) => ({
        id: task.id ?? "",
        title: task.text ?? "",
        description: task.description ?? "",
        is_finished: task.is_finished,
        date: task.date ?? "",
        assigned_user_id: task.assigned_user_id,
        assigned_user: task.assigned_user
          ? {
              id: task.assigned_user.id || "",
              name: task.assigned_user.name || "",
              image_url: task.assigned_user.image_url === null ? undefined : task.assigned_user.image_url
            }
          : null,
        story_id: group.story_id ?? null,
        story_name: group.story_name ?? null,
        story_status: group.story_status ?? null
      }));
    } else {
      if (!acc.unassigned) {
        acc.unassigned = {
          story_id: null,
          story_name: "Unassigned Tasks",
          story_status: null,
          tasks: []
        };
      }
      acc.unassigned.tasks = mappedUnassignedTasks;
    }
    return acc;
  }, {} as Record<string, { story_id: string | null; story_name: string; story_status: "Todo" | "InProgress" | "Done" | null; tasks: Task[] }>);

  const storyGroups = Object.values(tasksByStory);

  const handleStoryCreated = () => {
    fetchTasks();
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Tasks</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowStoryDialog(true)} className="gap-1">
            <BookOpen className="h-4 w-4" />
            Add Story
          </Button>
          <Button variant="outline" size="sm" onClick={handleOpenCreateTask} className="gap-1">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {loading && <div className="text-center py-8 text-muted-foreground">Loading...</div>}
      {error && <div className="text-center py-8 text-destructive">{error}</div>}

      {!loading && !error && storyTasksResponse.length === 0 && <div className="text-center py-8 text-muted-foreground">No tasks found.</div>}

      {!loading && !error && (
        <div className="space-y-6">
          {storyTasksResponse.map((group, groupIdx) => (
            <div key={`${group.story_id ?? "unassigned"}-${groupIdx}`} className="space-y-2">
              <div className="flex items-center gap-2 mb-2 group relative">
                <h2
                  className="text-xl font-semibold cursor-pointer hover:underline hover:text-primary transition"
                  onClick={() => {
                    if (group.story_id) {
                      setSelectedStoryId(group.story_id);
                      setStoryDetailDialogOpen(true);
                    }
                  }}
                >
                  {group.story_name ?? ""}
                </h2>
                {group.story_status && (
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      group.story_status === "Done"
                        ? "bg-green-100 text-green-800"
                        : group.story_status === "InProgress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {group.story_status}
                  </span>
                )}
                {group.story_id && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="hover:bg-primary/10 ml-2"
                    title="Add Task to Story"
                    onClick={() => {
                      setTaskDialogMode("create");
                      setTaskDialogInitialValues({ title: "", description: "", dueDate: "", assignedUserId: "", storyId: group.story_id });
                      setTaskDialogInitialAssignedUser(undefined);
                      setEditingTaskId(null);
                      setTaskDialogOpen(true);
                    }}
                  >
                    <svg className="lucide lucide-plus h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 5v14m7-7H5" />
                    </svg>
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {group.tasks && group.tasks.length > 0 ? (
                  group.tasks.map((task, taskIdx) => (
                    <TaskCard
                      key={`${task.id ?? "task"}-${taskIdx}`}
                      task={{
                        id: task.id ?? "",
                        title: (task as any).title ?? task.text ?? "",
                        status: task.is_finished ? "completed" : "pending",
                        assignee: task.assigned_user
                          ? {
                              id: task.assigned_user.id || "",
                              name: task.assigned_user.name || "",
                              image_url: task.assigned_user.image_url === null ? undefined : task.assigned_user.image_url
                            }
                          : null,
                        dueDate: task.date || "",
                        description: task.description || ""
                      }}
                      onStatusChange={handleStatusChange}
                      onCardClick={() =>
                        handleOpenEditTask({
                          id: task.id ?? "",
                          title: (task as any).title ?? task.text ?? "",
                          description: task.description ?? "",
                          is_finished: task.is_finished,
                          date: task.date ?? "",
                          assigned_user_id: task.assigned_user_id,
                          assigned_user: task.assigned_user
                            ? {
                                id: task.assigned_user.id || "",
                                name: task.assigned_user.name || "",
                                image_url: task.assigned_user.image_url === null ? undefined : task.assigned_user.image_url
                              }
                            : null,
                          story_id: group.story_id ?? null,
                          story_name: group.story_name ?? null,
                          story_status: group.story_status ?? null
                        })
                      }
                    />
                  ))
                ) : (
                  <div className="text-muted-foreground">No tasks in this story.</div>
                )}
              </div>
            </div>
          ))}
          {mappedUnassignedTasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-semibold">Unassigned Tasks</h2>
              </div>
              <div className="space-y-2">
                {mappedUnassignedTasks.map((task, idx) => (
                  <TaskCard
                    key={`${task.id ?? "unassigned-task"}-${idx}`}
                    task={{
                      id: task.id,
                      title: task.title,
                      status: task.is_finished ? "completed" : "pending",
                      assignee: task.assigned_user
                        ? {
                            id: task.assigned_user.id || "",
                            name: task.assigned_user.name || "",
                            image_url: task.assigned_user.image_url === null ? undefined : task.assigned_user.image_url
                          }
                        : null,
                      dueDate: task.date || "",
                      description: task.description || ""
                    }}
                    onStatusChange={handleStatusChange}
                    onCardClick={() => handleOpenEditTask(task)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSuccess={fetchTasks}
        initialValues={{
          ...taskDialogInitialValues,
          id: editingTaskId || undefined,
          storyId: taskDialogInitialValues.storyId ?? undefined
        }}
        initialAssignedUser={taskDialogInitialAssignedUser}
        mode={taskDialogMode}
        onDelete={handleDeleteTask}
        projectId={projectId}
      />

      <StoryDialog open={showStoryDialog} onOpenChange={setShowStoryDialog} projectId={projectId} onStoryCreated={handleStoryCreated} />

      <StoryDetailDialog
        storyId={selectedStoryId}
        open={storyDetailDialogOpen}
        onOpenChange={(open) => {
          setStoryDetailDialogOpen(open);
          if (!open) setSelectedStoryId(null);
        }}
        onStoryUpdate={fetchTasks}
      />

      <AlertDialog open={showDeleteStoryConfirm} onOpenChange={setShowDeleteStoryConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this story?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteStoryConfirm(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStory} className="bg-destructive text-white hover:bg-destructive/80">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
