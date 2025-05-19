"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";
import { HomeTaskCard } from "@/components/tasks/HomeTaskCard";

type Task = {
  id: string;
  title: string;
  project_id: string;
  project_name: string;
  project_image_url?: string;
  dueDate: string;
  description?: string;
  status: "completed" | "pending";
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
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
    const fetchTasks = async () => {
      if (!userData) return;
      try {
        setLoading(true);
        const { data: tasksData, error: tasksError } = await supabase.rpc("list_all_tasks", {
          input_profile_id: userData.profile_id
        });
        console.log(tasksData);

        if (tasksError) {
          console.error("Error fetching tasks:", tasksError);
          toast.error("Failed to fetch tasks");
          return;
        }

        const formattedTasks: Task[] = (tasksData || []).map((task: any) => ({
          id: task.id,
          title: task.text,
          project_id: task.project?.id || "",
          project_name: task.project?.name || "",
          project_image_url: task.project?.image_url || "",
          dueDate: task.date || "",
          description: task.description || "",
          status: task.is_finished ? "completed" : "pending"
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userData]);

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

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-[300px] md:flex-col md:fixed md:left-[0px] md:inset-y-0 z-[70]">
        <WorkspaceSidebar />
      </div>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">HUB</h2>
        </div>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">All Tasks</h3>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 bordr-b-2 border-gray-900"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No tasks found.</div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <HomeTaskCard key={task.id} task={task} onStatusChange={handleStatusChange} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
