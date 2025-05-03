import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, GripVertical, Link as LinkIcon, Pencil } from "lucide-react";

interface DraggableNodeProps {
  id: string;
  index: number;
  name: string;
  description: string | null;
  instructions: string | null;
  source: string | null;
  onEdit: () => void;
}

export function DraggableNode({ id, index, name, description, instructions, source, onEdit }: DraggableNodeProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="relative mb-8 touch-none">
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
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-2 hover:bg-accent rounded-md shrink-0 mr-4">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="absolute left-[18%] w-4 h-4 rounded-full bg-primary ring-2 ring-primary/20 -translate-x-1/2 translate-y-[1px]" />
        <Card className="flex-1 shadow-sm hover:shadow transition-shadow ml-6">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold">{name}</CardTitle>
              <Badge variant="outline" className="font-medium">{`Step ${index + 1}`}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {instructions && (
              <div className="flex items-start gap-2 text-sm bg-muted/30 p-2 rounded-md">
                <CheckCircle className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <p>{instructions}</p>
              </div>
            )}
            {source && (
              <div className="flex items-center gap-2 text-sm">
                <LinkIcon className="w-4 h-4 text-primary" />
                <a href={source} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Learning Resource
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
