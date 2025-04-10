"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { UserPlus, Info, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { AddMemberDialog } from "@/components/dashboard/AddMemberDialog";
import { Database } from "@/lib/supabase-types";
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

type ProjectRole = Database["public"]["Enums"]["project_role"];

type Member = {
  id: string;
  name: string;
  role: ProjectRole;
  image_url?: string;
  status?: "Pending" | "Active";
};

export default function MembersPage() {
  const params = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [params.id]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_project_members", {
        input_project_id: params.id as string
      });

      if (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to fetch members");
      } else {
        setMembers(
          data.map((member: any) => ({
            ...member,
            role: member.role as ProjectRole
          }))
        );
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToDelete) return;

    try {
      const { error } = await supabase.rpc("remove_project_member", {
        input_project_id: params.id as string,
        input_profile_id: memberToDelete.id
      });

      if (error) {
        console.error("Error removing member:", error);
        toast.error("Failed to remove member");
        return;
      }

      toast.success("Member removed successfully");
      fetchMembers();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setMemberToDelete(null);
    }
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Members</h2>
        <Button variant="default" size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : members.length > 0 ? (
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
              <div className="flex items-center gap-3">
                {member.image_url ? (
                  <Image src={member.image_url} alt={member.name} width={40} height={40} className="rounded-full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{member.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{member.role}</span>
                    {member.status === "Pending" && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Pending</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer" onClick={() => setMemberToDelete(member)}>
                  <Trash2 className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No members found</p>
        </div>
      )}

      <AddMemberDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} projectId={params.id as string} onSuccess={fetchMembers} />

      <AlertDialog open={!!memberToDelete} onOpenChange={() => setMemberToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will remove {memberToDelete?.name} from the project. This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveMember}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
