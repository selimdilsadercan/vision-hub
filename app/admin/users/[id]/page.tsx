"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield } from "lucide-react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Pencil, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    github_url: "",
    is_admin: false
  });
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      if (!id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_profile_by_id", { profile_id: id });
        if (error) throw error;
        if (data && data.length > 0) {
          setUser(data[0]);
          setEditForm({
            name: data[0].name ?? "",
            email: data[0].email ?? "",
            phone_number: data[0].phone_number ?? "",
            github_url: data[0].github_url ?? "",
            is_admin: data[0].is_admin ?? false
          });
        } else {
          setUser(null);
        }
      } catch (e) {
        toast.error("Kullanıcı bilgileri alınamadı");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  function formatPhoneNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length === 0) return "";
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return digits.slice(0, 4) + " " + digits.slice(4);
    if (digits.length <= 9) return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7);
    return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7, 9) + " " + digits.slice(9, 11);
  }

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const { error } = await supabase.rpc("update_profile", {
        profile_id: user.id,
        input_name: editForm.name,
        input_email: editForm.email,
        input_phone_number: editForm.phone_number,
        input_github_url: editForm.github_url,
        input_is_admin: editForm.is_admin
      });
      if (error) throw error;
      toast.success("Profile updated successfully");
      setIsDialogOpen(false);
      // Refresh user info
      const { data } = await supabase.rpc("get_profile_by_id", { profile_id: user.id });
      if (data && data.length > 0) setUser(data[0]);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-12 text-muted-foreground">Kullanıcı bulunamadı</div>;
  }

  return (
    <div className="min-h-screen bg-muted py-8">
      <div className="max-w-3xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")} className="rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-2xl font-bold flex items-center gap-2">
              {user.name}
              {user.is_admin && <Shield className="h-5 w-5 text-primary" />}
            </span>
          </div>
          <Button variant="outline" className="rounded-lg" onClick={() => setIsDialogOpen(true)}>
            <Pencil className="w-4 h-4 mr-2" />
            Edit User
          </Button>
        </div>
        {/* User Card */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="flex flex-col items-center gap-4 pb-0">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.image_url} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2 mt-2">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              {user.is_admin && <Shield className="h-5 w-5 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            <div className="text-sm">
              <span className="font-medium">Telefon:</span> {user.phone_number || "-"}
            </div>
            <div className="text-sm">
              <span className="font-medium">GitHub:</span>{" "}
              {user.github_url ? (
                <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {user.github_url}
                </a>
              ) : (
                "-"
              )}
            </div>
            <div className="text-sm">
              <span className="font-medium">Oluşturulma Tarihi:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
            </div>
            <div className="text-sm">
              <span className="font-medium">UID:</span> {user.uid}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Edit Dialog */}
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
