"use client";

import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { User, Calendar, Clock, Pencil, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

interface StoryDetailDialogProps {
  storyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoryUpdate?: () => void;
}

interface StoryDetail {
  id: string;
  name: string;
  description: string;
  status: "Todo" | "InProgress" | "Done";
  start_date: string;
  end_date: string;
  created_at: string;
  story_users: {
    id: string | null;
    name: string | null;
    image_url: string | null;
  }[];
}

export function StoryDetailDialog({ storyId, open, onOpenChange, onStoryUpdate }: StoryDetailDialogProps) {
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedStartDate, setEditedStartDate] = useState("");
  const [editedEndDate, setEditedEndDate] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const fetchStoryDetails = useCallback(async () => {
    if (!storyId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_story", {
        input_story_id: storyId
      });

      if (error) {
        console.error("Error fetching story details:", error);
        toast.error("Failed to fetch story details");
        return;
      }

      // Use the first item from the array
      const storyData = Array.isArray(data) ? data[0] : data;
      setStory(storyData);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [storyId]);

  useEffect(() => {
    if (storyId && open) {
      fetchStoryDetails();
    } else {
      // Reset state when dialog closes
      setStory(null);
      setIsEditing(false);
      setEditedTitle("");
      setEditedStartDate("");
      setEditedEndDate("");
      setEditedDescription("");
    }
  }, [storyId, open, fetchStoryDetails]);

  useEffect(() => {
    if (story) {
      setEditedTitle(story.name);
      setEditedStartDate(story.start_date);
      setEditedEndDate(story.end_date);
      setEditedDescription(story.description || "");
    }
  }, [story]);

  const handleSave = async () => {
    if (!story) return;

    try {
      const { error } = await supabase.rpc("update_story", {
        input_story_id: story.id,
        input_story_name: editedTitle,
        input_start_date: editedStartDate,
        input_end_date: editedEndDate,
        input_description: editedDescription
      });

      if (error) {
        console.error("Error updating story:", error);
        toast.error("Failed to update story");
        return;
      }

      setStory({
        ...story,
        name: editedTitle,
        start_date: editedStartDate,
        end_date: editedEndDate,
        description: editedDescription
      });
      setIsEditing(false);
      toast.success("Story updated successfully");
      onStoryUpdate?.();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDelete = async () => {
    if (!story) return;

    try {
      const { error } = await supabase.rpc("delete_story", {
        input_story_id: story.id
      });

      if (error) {
        console.error("Error deleting story:", error);
        toast.error("Failed to delete story");
        return;
      }

      toast.success("Story deleted successfully");
      onStoryUpdate?.();
      onOpenChange(false);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              {isEditing ? (
                <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="text-xl font-bold" placeholder="Story name" />
              ) : (
                <DialogTitle className="text-xl font-bold">{loading ? "Loading..." : story?.name || "Story Not Found"}</DialogTitle>
              )}
              <div className="flex items-center gap-2">
                {!loading && story && (
                  <>
                    <Button variant="ghost" onClick={() => setIsEditing(!isEditing)}>
                      <Pencil className="h-4 w-4" />
                      {isEditing ? "Editing" : "Edit"}
                    </Button>
                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </>
                )}
                <DialogClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
          </DialogHeader>

          {loading ? (
            <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ) : story ? (
            <div className="space-y-6 py-4">
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Created: {format(new Date(story.created_at), "MMM d, yyyy")}</span>
                </div>
                {story.description &&
                  (!isEditing ? (
                    <div className="prose max-w-none text-muted-foreground text-sm col-span-2" dangerouslySetInnerHTML={{ __html: story.description }} />
                  ) : null)}
                {isEditing && (
                  <div className="my-2">
                    <TiptapEditor content={editedDescription} onChange={setEditedDescription} placeholder="Enter story description..." />
                  </div>
                )}
                {isEditing ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="whitespace-nowrap">Start:</span>
                      <Input type="date" value={editedStartDate} onChange={(e) => setEditedStartDate(e.target.value)} className="h-8" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="whitespace-nowrap">End:</span>
                      <Input type="date" value={editedEndDate} onChange={(e) => setEditedEndDate(e.target.value)} className="h-8" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Start: {story.start_date ? format(new Date(story.start_date), "MMM d, yyyy") : "Not set"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>End: {story.end_date ? format(new Date(story.end_date), "MMM d, yyyy") : "Not set"}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Assigned Users</h4>
                {story.story_users && story.story_users.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {story.story_users.map((user, idx) => (
                      <div key={user.id ?? idx} className="flex items-center gap-2 p-2 rounded-md bg-secondary/30">
                        {user.image_url ? (
                          <Image width={24} height={24} src={user.image_url} alt={user.name ?? "User"} className="h-6 w-6 rounded-full object-cover" />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="h-3 w-3 text-primary" />
                          </div>
                        )}
                        <span className="text-sm">{user.name ?? "Unknown"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No users assigned to this story.</p>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No story details available.</div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this story?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the story and all its associated data.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
