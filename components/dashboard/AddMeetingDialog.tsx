"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMeetingDialogProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MOCK_USER_ID = "d8323ace-4e10-4422-8c99-7380286ec0e5";

export function AddMeetingDialog({ projectId, isOpen, onClose, onSuccess }: AddMeetingDialogProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<{ id: string; name: string }[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchProjectMembers();
  }, [projectId]);

  const fetchProjectMembers = async () => {
    try {
      const { data, error } = await supabase.rpc("list_project_members", {
        input_project_id: projectId
      });

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }

      setMembers(data);
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleSubmit = async () => {
    if (!name || !date || !startTime || !endTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const startDateTime = new Date(date);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      startDateTime.setHours(startHour, startMinute);

      const endDateTime = new Date(date);
      const [endHour, endMinute] = endTime.split(":").map(Number);
      endDateTime.setHours(endHour, endMinute);

      const { error } = await supabase.rpc("create_project_meeting", {
        input_name: name,
        input_project_id: projectId,
        input_start_time: startDateTime.toISOString(),
        input_end_time: endDateTime.toISOString(),
        input_participant_ids: [...selectedMembers, MOCK_USER_ID],
        input_created_by: MOCK_USER_ID
      });

      if (error) {
        console.error("Error creating meeting:", error);
        toast.error("Failed to create meeting");
        return;
      }

      toast.success("Meeting scheduled successfully");
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setDate(undefined);
    setStartTime("");
    setEndTime("");
    setSelectedMembers([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription>Create a new meeting for your project. Fill in the details below.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Meeting Name</Label>
            <Input id="name" placeholder="Enter meeting name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Participants</Label>
            <Select value={selectedMembers[0]} onValueChange={(value) => setSelectedMembers([value])}>
              <SelectTrigger>
                <SelectValue placeholder="Select a participant" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Scheduling..." : "Schedule Meeting"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
