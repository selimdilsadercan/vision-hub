import { CheckCircle2, Circle, CircleDot, User, FileText } from "lucide-react";
import Image from "next/image";

interface Task {
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
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task["status"]) => void;
  onCardClick?: () => void;
}

export function TaskCard({ task, onStatusChange, onCardClick }: TaskCardProps) {
  const getNextStatus = (status: Task["status"]): Task["status"] => (status === "completed" ? "pending" : "completed");

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer" onClick={onCardClick}>
      <div className="flex items-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(task.id, getNextStatus(task.status));
          }}
          className="text-muted-foreground hover:text-primary transition-colors focus:outline-none"
          aria-label={task.status === "completed" ? "Mark as not finished" : "Mark as finished"}
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
