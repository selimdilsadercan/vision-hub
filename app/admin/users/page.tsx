"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search, LayoutGrid, Table as TableIcon, Pencil, Shield, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  image_url: string;
  uid: string;
  is_admin: boolean;
  phone_number: string;
  github_url: string;
  email: string;
  created_at: string;
}

interface EditUserForm {
  name: string;
  email: string;
  phone_number: string;
  github_url: string;
  is_admin: boolean;
}

interface CreateUserForm {
  name: string;
  email: string;
  phone_number: string;
  github_url: string;
  is_admin: boolean;
}

function formatPhoneNumber(value: string) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, "").slice(0, 11);
  // Format: 0555 555 55 55
  if (digits.length === 0) return "";
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return digits.slice(0, 4) + " " + digits.slice(4);
  if (digits.length <= 9) return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7);
  return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7, 9) + " " + digits.slice(9, 11);
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<EditUserForm>({
    name: "",
    email: "",
    phone_number: "",
    github_url: "",
    is_admin: false
  });
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    name: "",
    email: "",
    phone_number: "",
    github_url: "",
    is_admin: false
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const pageSize = 12;
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_profiles", {
        page_size: pageSize,
        page_number: currentPage,
        search_term: searchTerm || undefined
      });

      if (error) throw error;

      if (data && data.length > 0) {
        setUsers(data);
        setTotalCount(data[0].total_count);
      } else {
        setUsers([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUsers();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name ?? "",
      email: user.email ?? "",
      phone_number: user.phone_number ?? "",
      github_url: user.github_url ?? "",
      is_admin: user.is_admin ?? false
    });
    setIsDialogOpen(true);
  };

  const handleUpdateProfile = async () => {
    if (!selectedUser) return;

    try {
      const { error } = await supabase.rpc("update_profile", {
        profile_id: selectedUser.id,
        input_name: editForm.name,
        input_email: editForm.email,
        input_phone_number: editForm.phone_number,
        input_github_url: editForm.github_url,
        input_is_admin: editForm.is_admin
      });

      if (error) throw error;

      toast.success("Profile updated successfully");
      setIsDialogOpen(false);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCreateProfile = async () => {
    if (!createForm.name.trim() || !createForm.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    try {
      const { data, error } = await supabase.rpc("create_profile", {
        input_name: createForm.name.trim(),
        input_email: createForm.email.trim(),
        input_phone_number: createForm.phone_number || undefined,
        input_github_url: createForm.github_url || undefined,
        input_is_admin: createForm.is_admin
      });

      if (error) throw error;

      toast.success("Profile created successfully");
      setIsCreateDialogOpen(false);
      setCreateForm({
        name: "",
        email: "",
        phone_number: "",
        github_url: "",
        is_admin: false
      });
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error creating profile:", error);
      toast.error("Failed to create profile");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "card" ? "default" : "outline"} size="icon" onClick={() => setViewMode("card")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "table" ? "default" : "outline"} size="icon" onClick={() => setViewMode("table")}>
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
            <Button type="submit" variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="create-name">Name *</Label>
                  <Input 
                    id="create-name" 
                    value={createForm.name} 
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))} 
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-email">Email *</Label>
                  <Input 
                    id="create-email" 
                    type="email" 
                    value={createForm.email} 
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))} 
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-phone">Phone Number</Label>
                  <Input
                    id="create-phone"
                    value={createForm.phone_number}
                    onChange={(e) =>
                      setCreateForm((prev) => ({
                        ...prev,
                        phone_number: formatPhoneNumber(e.target.value)
                      }))
                    }
                    maxLength={14}
                    placeholder="0555 555 55 55"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-github">GitHub URL</Label>
                  <Input 
                    id="create-github" 
                    value={createForm.github_url} 
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, github_url: e.target.value }))} 
                    placeholder="https://github.com/username"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="create-admin" 
                    checked={createForm.is_admin} 
                    onCheckedChange={(checked) => setCreateForm((prev) => ({ ...prev, is_admin: checked }))} 
                  />
                  <Label htmlFor="create-admin">Admin Access</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProfile}>Create Profile</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {viewMode === "table" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>GitHub</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <button className="flex items-center gap-2 hover:underline text-left" onClick={() => router.push(`/admin/users/${user.id}`)}>
                          {user.name}
                          {user.is_admin && <Shield className="h-4 w-4 text-primary" />}
                        </button>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone_number}</TableCell>
                      <TableCell>
                        <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {user.github_url}
                        </a>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(user);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="cursor-pointer group" onClick={() => router.push(`/admin/users/${user.id}`)}>
                  <Card className="group-hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.image_url} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          {user.is_admin && <Shield className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(user);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="font-medium">Phone:</span> {user.phone_number}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">GitHub:</span>{" "}
                          <a
                            href={user.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {user.github_url}
                          </a>
                        </p>
                        <p className="text-sm text-muted-foreground">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {users.length === 0 && <div className="col-span-full text-center py-8 text-muted-foreground">No users found</div>}
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {users.length} of {totalCount} users
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={editForm.name} onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={editForm.email} onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={editForm.phone_number}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    phone_number: formatPhoneNumber(e.target.value)
                  }))
                }
                maxLength={14}
                placeholder="0555 555 55 55"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input id="github" value={editForm.github_url} onChange={(e) => setEditForm((prev) => ({ ...prev, github_url: e.target.value }))} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="admin" checked={editForm.is_admin} onCheckedChange={(checked) => setEditForm((prev) => ({ ...prev, is_admin: checked }))} />
              <Label htmlFor="admin">Admin Access</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
