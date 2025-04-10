"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus, Video, Trash2 } from "lucide-react";
import { AddMeetingDialog } from "@/components/dashboard/AddMeetingDialog";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Meeting {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  participants: {
    id: string;
    name: string;
    image_url?: string;
  }[];
}

interface ProjectMeetingResponse {
  id: string;
  name: string;
  project_id: string;
  start_time: string;
  end_time: string;
  participants: {
    id: string;
    name: string;
    image_url?: string;
  }[];
}

export default function MeetingsPage() {
  const params = useParams();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<Meeting | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, [params.id]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_project_meetings", {
        input_project_id: params.id as string
      });

      if (error) {
        console.error("Error fetching meetings:", error);
        toast.error("Failed to fetch meetings");
        return;
      }

      // Transform the data to match our Meeting interface
      const transformedData: Meeting[] = (data as ProjectMeetingResponse[]).map((meeting) => ({
        id: meeting.id,
        name: meeting.name,
        start_time: meeting.start_time,
        end_time: meeting.end_time,
        participants: Array.isArray(meeting.participants) ? meeting.participants : []
      }));

      setMeetings(transformedData);
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold tracking-tight">Meetings</h2>
          <p className="text-muted-foreground">Schedule and manage your project meetings</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
        </Button>
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
                <Card key={meeting.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>{meeting.name}</CardTitle>
                      <CardDescription>
                        {new Date(meeting.start_time).toLocaleDateString()} at{" "}
                        {new Date(meeting.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </CardDescription>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => setMeetingToDelete(meeting)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Duration</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(meeting.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {new Date(meeting.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Participants ({meeting.participants.length})</div>
                        <div className="flex -space-x-2">
                          {meeting.participants.map((participant) => (
                            <div key={participant.id} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-gray-100">
                              {participant.image_url ? (
                                <img src={participant.image_url} alt={participant.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs font-medium">{participant.name[0]}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">
                        <Video className="mr-2 h-4 w-4" /> Join Meeting
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                <Card key={meeting.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>{meeting.name}</CardTitle>
                      <CardDescription>
                        {new Date(meeting.start_time).toLocaleDateString()} at{" "}
                        {new Date(meeting.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </CardDescription>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => setMeetingToDelete(meeting)} className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-medium">Duration</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(meeting.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                          {new Date(meeting.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-2">Participants ({meeting.participants.length})</div>
                        <div className="flex -space-x-2">
                          {meeting.participants.map((participant) => (
                            <div key={participant.id} className="h-8 w-8 rounded-full border-2 border-background overflow-hidden bg-gray-100">
                              {participant.image_url ? (
                                <img src={participant.image_url} alt={participant.name} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-xs font-medium">{participant.name[0]}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AddMeetingDialog projectId={params.id as string} isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onSuccess={fetchMeetings} />

      <AlertDialog open={!!meetingToDelete} onOpenChange={() => setMeetingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete the meeting "{meetingToDelete?.name}". This action cannot be undone.</AlertDialogDescription>
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
