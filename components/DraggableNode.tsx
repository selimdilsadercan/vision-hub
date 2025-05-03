import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, GripVertical, Link as LinkIcon, Pencil } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableNodeProps {
  id: string;
  index: number;
  name: string;
  description: string | null;
  instructions: string | null;
  duration?: string | null;
  sources?: string[];
  onEdit: () => void;
  isDragging?: boolean;
  style?: React.CSSProperties;
}

export function DraggableNode({ id, index, name, description, instructions, duration, sources, onEdit, isDragging = false, style }: DraggableNodeProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: sortableDragging } = useSortable({ id });

  const mergedDragging = isDragging || sortableDragging;
  const cardStyle = {
    ...style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: 1,
    zIndex: 1,
    boxShadow: undefined
  };

  return (
    <div ref={setNodeRef} style={cardStyle} className="relative mb-8">
      <div className="flex items-center gap-4">
        <div className="w-[18%] flex items-center justify-end space-x-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-accent shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <div className="cursor-grab p-2 hover:bg-accent rounded-md shrink-0 mr-4" {...attributes} {...listeners} tabIndex={0} aria-label="Drag handle">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute left-[18%] w-4 h-4 rounded-full bg-primary ring-2 ring-primary/20 -translate-x-1/2 translate-y-[1px]" />
        <Card className="flex-1 shadow-sm hover:shadow transition-shadow ml-6 py-4 gap-2">
          <CardHeader className="px-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold">{name}</CardTitle>
              <Badge variant="outline" className="font-medium">{`Step ${index + 1}`}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 px-4">
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {instructions && (
              <div className="flex items-start gap-2 text-sm bg-muted/30 rounded-md">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <p>{instructions}</p>
              </div>
            )}
            {duration && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium">Duration:</span>
                <span>{duration}</span>
              </div>
            )}
            {sources && sources.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs mt-1">
                <span className="font-medium">Sources:</span>
                {sources.map((src, idx) => {
                  const isUrl = /^https?:\/\//.test(src);
                  return isUrl ? (
                    <a
                      key={idx}
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-muted px-2 py-0.5 rounded text-muted-foreground flex items-center gap-1 hover:underline"
                    >
                      <LinkIcon className="w-3 h-3 text-primary" />
                      {src}
                    </a>
                  ) : (
                    <span key={idx} className="bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      {src}
                    </span>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
