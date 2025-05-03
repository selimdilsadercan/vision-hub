import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Link as LinkIcon } from "lucide-react";

interface NodeCardProps {
  id: string;
  index: number;
  name: string;
  description: string;
  instructions: string;
  duration: string;
  sources: string[];
  is_active: boolean;
  show_progress?: boolean;
  onUpdateProgress?: () => void;
  status?: "not_started" | "in_progress" | "completed";
}

export function NodeCard({
  id,
  index,
  name,
  description,
  instructions,
  duration,
  sources,
  is_active,
  show_progress = false,
  onUpdateProgress,
  status
}: NodeCardProps) {
  const isCompleted = status === "completed";
  return (
    <div className="relative mb-8 flex items-center min-h-[120px] pl-8">
      {/* Timeline dot, vertically centered */}
      <div
        className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 border-2 ${
          isCompleted ? "bg-green-500 border-green-500" : "bg-black border-black"
        }`}
      />
      <Card className={`flex-1 shadow-sm hover:shadow transition-shadow min-h-[100px] ${isCompleted ? "border-green-500 bg-green-50" : ""}`}>
        <CardHeader className="px-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500" />}
              {name}
            </CardTitle>
            <Badge variant="outline" className="font-medium">{`Step ${index + 1}`}</Badge>
          </div>
          {description && <div className={`text-muted-foreground text-base mt-1 ${isCompleted ? "line-through" : ""}`}>{description}</div>}
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          {instructions && (
            <div className={`flex items-center gap-2 bg-muted/30 rounded-md p-2 ${isCompleted ? "opacity-60" : ""}`}>
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-base text-muted-foreground">{instructions}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Duration:</span>
              <span>{duration}</span>
            </div>
          )}
          {sources && sources.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center text-sm mt-1">
              <span className="font-medium w-full sm:w-auto">Sources:</span>
              {sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-muted px-2 py-0.5 rounded text-muted-foreground flex items-center gap-1 hover:underline shrink-0"
                >
                  <LinkIcon className="w-4 h-4 text-primary" />
                  {src}
                </a>
              ))}
            </div>
          )}
          {show_progress && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onUpdateProgress}
                className={`px-4 py-1 rounded border text-sm font-medium transition-colors border-primary text-primary hover:bg-primary hover:text-white ${
                  isCompleted ? "border-green-500 text-green-700 hover:bg-green-500 hover:text-white" : ""
                }`}
              >
                {isCompleted ? "Mark as Not Started" : "Mark as Completed"}
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
