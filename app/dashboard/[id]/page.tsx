"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, ListTodo, Users, Video, CheckCircle2, Circle, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { TaskDialog } from "@/components/tasks/TaskDialog";
import { AddMemberDialog } from "@/components/dashboard/AddMemberDialog";
import { Database } from "@/lib/supabase-types";

type ProjectRole = Database["public"]["Enums"]["project_role"];

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

interface Member {
  id: string;
  name: string;
  role: ProjectRole;
  image_url?: string;
  status?: "Pending" | "Active";
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
}

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogMode, setTaskDialogMode] = useState<"create" | "edit">("create");
  const [taskDialogInitialValues, setTaskDialogInitialValues] = useState<TaskDialogInitialValues>({
    title: "",
    description: ""
  });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase.rpc("list_project_tasks", { input_project_id: projectId });
      if (error) {
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
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.rpc("list_project_members", {
        input_project_id: projectId
      });

      if (error) {
        toast.error("Failed to fetch members");
        return;
      }

      setMembers(
        (data as any[]).map((member) => ({
          ...member,
          role: member.role as ProjectRole
        }))
      );
    } catch (error) {
      toast.error("Failed to fetch members");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchMembers()]);
      setLoading(false);
    };
    fetchData();
  }, [projectId]);

  const handleOpenCreateTask = () => {
    setTaskDialogMode("create");
    setTaskDialogInitialValues({ title: "", description: "", dueDate: "", assignedUserId: "" });
    setEditingTaskId(null);
    setTaskDialogOpen(true);
  };

  const handleTaskDialogSubmit = async (data: TaskDialogSubmitData): Promise<void> => {
    if (taskDialogMode === "create") {
      const { error } = await supabase.rpc("create_project_task", {
        input_project_id: projectId,
        input_text: data.title,
        input_profile_id: data.assignedUserId,
        input_date: data.dueDate || undefined,
        input_description: data.description || undefined
      });
      if (error) {
        toast.error("Failed to create task");
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

  const completedTasks = tasks.filter((task) => task.is_finished).length;
  const progressPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <div className="h-full p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <ListTodo className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Project tasks and progress</CardDescription>
              </div>
            </div>
            <Link href={`/dashboard/${projectId}/tasks`}>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />

              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      {task.is_finished ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-gray-300" />}
                      <span className="text-sm">{task.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.assigned_user?.name || "Unassigned"}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={handleOpenCreateTask}>
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription>Project members and roles</CardDescription>
              </div>
            </div>
            <Link href={`/dashboard/${projectId}/members`}>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Members</span>
                <span className="text-sm text-muted-foreground">{members.length} members</span>
              </div>

              <div className="space-y-2">
                {members.slice(0, 3).map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      {member.image_url ? (
                        <Image width={32} height={32} src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAddMemberDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Invite Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleTaskDialogSubmit}
        initialValues={taskDialogInitialValues}
        mode={taskDialogMode}
      />

      <AddMemberDialog isOpen={isAddMemberDialogOpen} onClose={() => setIsAddMemberDialogOpen(false)} projectId={projectId} onSuccess={fetchMembers} />
    </div>
  );
}
