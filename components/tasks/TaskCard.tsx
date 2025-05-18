import { CheckCircle2, Circle, User, FileText } from "lucide-react";
import Image from "next/image";

interface Task {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
  assignee: {
    id: string;
    name: string;
    image_url?: string;
  } | null;
  dueDate: string;
  description?: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <button
          onClick={() => onStatusChange(task.id, task.status === "completed" ? "pending" : "completed")}
          className="text-muted-foreground hover:text-primary transition-colors"
        >
          {task.status === "completed" ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{task.title}</h3>
            {task.description && task.description.trim() !== "" && <FileText className="h-4 w-4 text-muted-foreground" />}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {task.assignee ? (
              <div className="flex items-center gap-2">
                {task.assignee.image_url ? (
                  <Image width={20} height={20} src={task.assignee.image_url} alt={task.assignee.name} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-3 w-3 text-primary" />
                  </div>
                )}
                <span>{task.assignee.name}</span>
              </div>
            ) : (
              <span>Unassigned</span>
            )}
            <span>•</span>
            <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
