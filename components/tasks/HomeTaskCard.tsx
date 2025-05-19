import { FileText, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface HomeTaskCardProps {
  task: {
    id: string;
    title: string;
    project_id: string;
    project_name: string;
    project_image_url?: string;
    dueDate: string;
    description?: string;
    status: "completed" | "pending";
  };
  onStatusChange?: (taskId: string, newStatus: "completed" | "pending") => void;
}

export function HomeTaskCard({ task, onStatusChange }: HomeTaskCardProps) {
  const getNextStatus = (status: "completed" | "pending") => (status === "completed" ? "pending" : "completed");

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onStatusChange) onStatusChange(task.id, getNextStatus(task.status));
          }}
          className="focus:outline-none"
          aria-label={task.status === "completed" ? "Mark as not finished" : "Mark as finished"}
        >
          {task.status === "completed" ? <CheckCircle2 className="h-8 w-8 text-green-500" /> : <Circle className="h-8 w-8 text-muted-foreground" />}
        </button>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-base">{task.title}</h3>
            {task.description && task.description.trim() !== "" && <FileText className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href={`/dashboard/${task.project_id}/tasks`} className="flex items-center gap-2 text-primary hover:underline font-medium">
              {task.project_image_url ? (
                <Image src={task.project_image_url} alt={task.project_name} width={20} height={20} className="rounded-full object-cover h-5 w-5" />
              ) : (
                <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {task.project_name?.charAt(0) || "?"}
                </span>
              )}
              {task.project_name}
            </Link>
            <span>•</span>
            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
