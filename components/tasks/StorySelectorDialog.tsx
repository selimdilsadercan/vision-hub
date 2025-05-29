import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";

interface Story {
  id: string;
  title: string;
  status: "Todo" | "InProgress" | "Done";
}

interface StorySelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stories: Story[];
  selectedStoryId?: string;
  onSelect: (storyId?: string) => void;
}

export function StorySelectorDialog({ open, onOpenChange, stories, selectedStoryId, onSelect }: StorySelectorDialogProps) {
  const [search, setSearch] = useState("");

  const filteredStories = useMemo(() => {
    if (!search.trim()) return stories;
    return stories.filter((story) => story.title.toLowerCase().includes(search.toLowerCase()));
  }, [search, stories]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Select Story</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search stories..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            <Button
              variant={selectedStoryId === undefined ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => {
                onSelect(undefined);
                onOpenChange(false);
              }}
            >
              <span>No story</span>
            </Button>
            {filteredStories.length === 0 && <div className="text-center py-4 text-muted-foreground">No stories found</div>}
            {filteredStories.map((story) => (
              <Button
                key={story.id}
                variant={selectedStoryId === story.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onSelect(story.id);
                  onOpenChange(false);
                }}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{story.title}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      story.status === "Done"
                        ? "bg-green-100 text-green-800"
                        : story.status === "InProgress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {story.status}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
