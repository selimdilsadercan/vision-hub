"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MeetingCard } from "@/components/admin/MeetingCard";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Meeting {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  project_id: string;
  project_name: string;
  participants: {
    id: string;
    name: string;
    image_url?: string;
  }[];
}

export default function AdminMeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_all_meetings");

      if (error) {
        console.error("Error fetching meetings:", error);
        toast.error("Failed to fetch meetings");
        return;
      }

      // Transform the data to match our Meeting interface
      const transformedData: Meeting[] = (data || []).map((meeting: any) => ({
        id: meeting.id,
        name: meeting.name,
        start_time: meeting.start_time,
        end_time: meeting.end_time,
        project_id: meeting.project_id,
        project_name: meeting.project_name,
        participants: Array.isArray(meeting.participants) ? meeting.participants : []
      }));

      setMeetings(transformedData);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const handleDeleteMeeting = async () => {
    if (!meetingToDelete) return;

    try {
      const { error } = await supabase.rpc("delete_project_meeting", {
        input_meeting_id: meetingToDelete.id
      });

      if (error) {
        console.error("Error deleting meeting:", error);
        toast.error("Failed to delete meeting");
        return;
      }

      toast.success("Meeting deleted successfully");
      fetchMeetings();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setMeetingToDelete(null);
    }
  };

  const filterMeetings = (meetings: Meeting[], type: "upcoming" | "past") => {
    const now = new Date();
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.start_time);
      return type === "upcoming" ? meetingDate > now : meetingDate <= now;
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const upcomingMeetings = filterMeetings(meetings, "upcoming");
  const pastMeetings = filterMeetings(meetings, "past");

  return (
    <div className="h-full p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Meetings</h2>
          <p className="text-muted-foreground">View and manage meetings across all projects</p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({pastMeetings.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming meetings scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} onDelete={setMeetingToDelete} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No past meetings</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} onDelete={setMeetingToDelete} showJoinButton={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!meetingToDelete} onOpenChange={() => setMeetingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the meeting "{meetingToDelete?.name}" from project "{meetingToDelete?.project_name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMeeting} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
