"use client";

import { useState, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Database } from "@/lib/supabase-types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface User {
  id: string;
  name: string;
  image_url?: string;
}

interface MentorSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  educationPlanId: string;
  onSuccess: () => void;
}

export function MentorSelectorDialog({ isOpen, onClose, educationPlanId, onSuccess }: MentorSelectorDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  const fetchUsers = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
    }
  }, [searchQuery, users]);

  const handleSelectMentor = async (userId: string) => {
    try {
      const { error } = await supabase.rpc("update_education_plan", {
        input_education_plan_id: educationPlanId,
        input_mentor_id: userId
      });

      if (error) {
        console.error("Error updating mentor:", error);
        toast.error("Failed to update mentor");
        return;
      }

      toast.success("Mentor updated successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Mentor</DialogTitle>
          <DialogDescription>Search and select a mentor for this education plan.</DialogDescription>
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
                <div key={user.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
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
                  <Button variant="outline" size="sm" onClick={() => handleSelectMentor(user.id)}>
                    Select
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">No users found</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
