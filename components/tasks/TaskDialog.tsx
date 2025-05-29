import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { Search, User, BookOpen, Plus } from "lucide-react";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { StorySelectorDialog } from "./StorySelectorDialog";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";

interface User {
  id: string;
  name: string;
  image_url?: string;
}

interface Story {
  id: string;
  created_at: string;
  title: string;
  items: string[];
  item_images: string[];
  story_users: any;
  start_date: string;
  end_date: string;
  status: "Todo" | "InProgress" | "Done";
  index: number;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  initialValues?: {
    title: string;
    description: string;
    dueDate?: string;
    assignedUserId?: string;
    storyId?: string;
    id?: string;
  };
  initialAssignedUser?: {
    id: string;
    name: string;
    image_url?: string;
  };
  mode: "create" | "edit";
  onDelete?: () => void;
  projectId: string;
}

interface TaskDialogSubmitData {
  title: string;
  description: string;
  dueDate: string;
  assignedUserId?: string;
  storyId?: string;
}

export function TaskDialog({ open, onOpenChange, onSuccess, initialValues, initialAssignedUser, mode, onDelete, projectId }: TaskDialogProps) {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [dueDate, setDueDate] = useState(initialValues?.dueDate || "");
  const [assignedUserId, setAssignedUserId] = useState<string | undefined>(initialValues?.assignedUserId);
  const [selectedUser, setSelectedUser] = useState<typeof initialAssignedUser | undefined>(initialAssignedUser);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryId, setSelectedStoryId] = useState<string | undefined>(initialValues?.storyId);
  const [showStoryDialog, setShowStoryDialog] = useState(false);
  const [showStorySelector, setShowStorySelector] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const [editingTaskId, setEditingTaskId] = useState<string | null>(initialValues?.id || null);
  const { user } = useAuth();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initialValues?.title || "");
      setDescription(initialValues?.description || "");
      setDueDate(initialValues?.dueDate || "");
      setAssignedUserId(initialValues?.assignedUserId);
      setSelectedUser(initialAssignedUser);
      setSelectedStoryId(initialValues?.storyId);
    }
  }, [open, initialValues, initialAssignedUser]);

  useEffect(() => {
    const fetchProfileId = async () => {
      if (!user) return;
      const userData = await getUserData(user.uid);
      if (userData?.profile_id) setProfileId(userData.profile_id);
    };
    fetchProfileId();
  }, [user]);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase.rpc("list_project_stories", {
        input_project_id: projectId
      });
      if (error) {
        console.error("Error fetching stories:", error);
        toast.error("Failed to fetch stories");
        return;
      }
      if (data) {
        const storiesData = data as unknown as Story[];
        console.log(storiesData);
        setStories(storiesData);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    if (open) {
      fetchStories();
    }
  }, [open, projectId]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc("list_all_users");
      if (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users");
        return;
      }
      if (data) {
        const usersData = data as unknown as User[];
        setUsers(usersData);
        setFilteredUsers(usersData);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showUserSelector) {
      fetchUsers();
    }
  }, [showUserSelector]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
    }
  }, [searchQuery, users]);

  useEffect(() => {
    if (open && mode === "edit" && initialValues?.id) {
      setEditingTaskId(initialValues.id);
    }
  }, [open, mode, initialValues]);

  const handleSubmit = async (data: TaskDialogSubmitData): Promise<void> => {
    if (!data.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (mode === "create") {
        if (!profileId) {
          toast.error("User profile not found");
          setSaving(false);
          return;
        }
        const { error } = await (supabase.rpc as any)("create_project_task", {
          input_project_id: projectId,
          input_text: data.title,
          input_profile_id: data.assignedUserId || profileId,
          input_date: data.dueDate || undefined,
          input_description: data.description || undefined,
          input_story_id: data.storyId || undefined
        });
        if (error) {
          toast.error("Failed to create task");
          setSaving(false);
          return;
        }
        toast.success("Task created successfully");
        onOpenChange(false);
        onSuccess();
      } else if (mode === "edit") {
        if (!editingTaskId) {
          toast.error("No task selected for editing");
          setSaving(false);
          return;
        }
        const { error } = await (supabase.rpc as any)("update_project_task", {
          input_task_id: editingTaskId,
          input_text: data.title,
          input_date: data.dueDate || undefined,
          input_profile_id: data.assignedUserId || undefined,
          input_description: data.description || undefined,
          input_story_id: data.storyId || undefined
        });
        if (error) {
          toast.error("Failed to update task");
          setSaving(false);
          return;
        }
        toast.success("Task updated successfully");
        onOpenChange(false);
        onSuccess();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({
      title,
      description,
      dueDate,
      assignedUserId,
      storyId: selectedStoryId === "no-story" ? undefined : selectedStoryId
    });
  };

  const handleDelete = async () => {
    if (!editingTaskId) return;
    const { error } = await supabase.rpc("delete_project_task", { input_task_id: editingTaskId });
    if (error) {
      toast.error("Failed to delete task");
      return;
    }
    toast.success("Task deleted successfully");
    onOpenChange(false);
    onSuccess();
  };

  const handleStoryCreated = () => {
    fetchStories();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-3xl sm:max-w-[800px] mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <DialogTitle className="text-xl font-bold">{mode === "edit" ? "Edit Task" : "Create Task"}</DialogTitle>
            <div className="flex items-center gap-2">
              {mode === "edit" && initialValues && (
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} className="text-destructive hover:text-destructive">
                      <svg className="lucide lucide-trash h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 6h18M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                      </svg>
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to delete this task?</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-white hover:bg-destructive/80">
                        {deleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <svg className="lucide lucide-x h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Button>
              </DialogClose>
            </div>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <TiptapEditor content={description} onChange={setDescription} placeholder="Enter task description..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Story</Label>
                <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setShowStorySelector(true)}>
                  {selectedStoryId ? (
                    <div className="flex items-center gap-2 w-full min-w-0">
                      <BookOpen className="h-4 w-4 shrink-0" />
                      <span className="truncate max-w-[200px]" title={stories.find((s) => s.id === selectedStoryId)?.title || "Select story"}>
                        {stories.find((s) => s.id === selectedStoryId)?.title || "Select story"}
                      </span>
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs rounded-full shrink-0 ${
                          stories.find((s) => s.id === selectedStoryId)?.status === "Done"
                            ? "bg-green-100 text-green-800"
                            : stories.find((s) => s.id === selectedStoryId)?.status === "InProgress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {stories.find((s) => s.id === selectedStoryId)?.status}
                      </span>
                    </div>
                  ) : (
                    "Select story"
                  )}
                </Button>
              </div>
              <div className="space-y-2">
                <Label>Assigned User</Label>
                <Button type="button" variant="outline" className="w-full justify-start" onClick={() => setShowUserSelector(true)}>
                  {selectedUser ? (
                    <div className="flex items-center gap-2">
                      {selectedUser.image_url ? (
                        <Image src={selectedUser.image_url} alt={selectedUser.name} width={20} height={20} className="rounded-full" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <span>{selectedUser.name}</span>
                    </div>
                  ) : (
                    "Select user"
                  )}
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showUserSelector} onOpenChange={setShowUserSelector}>
        <DialogContent className="w-full max-w-md">
          <DialogHeader>
            <DialogTitle>Select User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">Loading...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No users found</div>
              ) : (
                filteredUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setSelectedUser(user);
                      setAssignedUserId(user.id);
                      setShowUserSelector(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {user.image_url ? (
                        <Image src={user.image_url} alt={user.name} width={20} height={20} className="rounded-full" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-primary" />
                        </div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  </Button>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <StorySelectorDialog
        open={showStorySelector}
        onOpenChange={setShowStorySelector}
        stories={stories}
        selectedStoryId={selectedStoryId}
        onSelect={(storyId) => setSelectedStoryId(storyId)}
      />
    </>
  );
}
