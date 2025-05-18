import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { Search, User } from "lucide-react";
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

interface User {
  id: string;
  name: string;
  image_url?: string;
}

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { title: string; description: string; dueDate: string; assignedUserId?: string }) => void;
  initialValues?: {
    title: string;
    description: string;
    dueDate?: string;
    assignedUserId?: string;
  };
  initialAssignedUser?: {
    id: string;
    name: string;
    image_url?: string;
  };
  mode: "create" | "edit";
  onDelete?: () => void;
}

export function TaskDialog({ open, onOpenChange, onSubmit, initialValues, initialAssignedUser, mode, onDelete }: TaskDialogProps) {
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
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    if (open) {
      setTitle(initialValues?.title || "");
      setDescription(initialValues?.description || "");
      setDueDate(initialValues?.dueDate || "");
      setAssignedUserId(initialValues?.assignedUserId);
      setSelectedUser(initialAssignedUser);
    }
  }, [open, initialValues, initialAssignedUser]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description: description || "",
      dueDate: dueDate || "",
      assignedUserId
    });
  };

  const handleDelete = async () => {
    if (!initialValues || !onDelete) return;
    setDeleting(true);
    try {
      const taskId = (initialValues as any).id;
      if (!taskId) throw new Error("Task id is missing");
      const { error } = await supabase.rpc("delete_project_task", { input_task_id: taskId });
      if (error) {
        toast.error("Failed to delete task");
        setDeleting(false);
        return;
      }
      toast.success("Task deleted successfully");
      setDeleting(false);
      setShowDeleteConfirm(false);
      onOpenChange(false);
      onDelete();
    } catch (err) {
      toast.error("Failed to delete task");
      setDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-full max-w-3xl sm:max-w-[800px] mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{mode === "edit" ? "Edit Task" : "Create Task"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter task title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <TiptapEditor content={description} onChange={setDescription} placeholder="Enter task description..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
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
              {mode === "edit" && initialValues && (
                <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showUserSelector} onOpenChange={setShowUserSelector}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition cursor-pointer"
                    onClick={() => {
                      setAssignedUserId(user.id);
                      setSelectedUser(user);
                      setShowUserSelector(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {user.image_url ? (
                        <Image src={user.image_url} alt={user.name} width={32} height={32} className="rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                          {user.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No users found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
