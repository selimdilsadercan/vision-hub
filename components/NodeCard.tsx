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
}

export function NodeCard({ id, index, name, description, instructions, duration, sources, is_active }: NodeCardProps) {
  return (
    <div className="relative mb-8 flex items-center min-h-[120px] pl-8">
      {/* Timeline dot, vertically centered */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black border-2 border-black z-10" />
      <Card className="flex-1 shadow-sm hover:shadow transition-shadow min-h-[100px]">
        <CardHeader className="px-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg font-semibold">{name}</CardTitle>
            <Badge variant="outline" className="font-medium">{`Step ${index + 1}`}</Badge>
          </div>
          {description && <div className="text-muted-foreground text-base mt-1">{description}</div>}
        </CardHeader>
        <CardContent className="space-y-3 px-4">
          {instructions && (
            <div className="flex items-center gap-2 bg-muted/30 rounded-md p-2">
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
        </CardContent>
      </Card>
    </div>
  );
}
