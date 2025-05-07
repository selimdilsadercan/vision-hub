import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Trash2 } from "lucide-react";
import Image from "next/image";

interface Participant {
  id: string;
  name: string;
  image_url?: string;
}

interface Meeting {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  project_id: string;
  project_name: string;
  participants: Participant[];
}

interface MeetingCardProps {
  meeting: Meeting;
  onDelete: (meeting: Meeting) => void;
  showJoinButton?: boolean;
}

export function MeetingCard({ meeting, onDelete, showJoinButton = true }: MeetingCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle>{meeting.name}</CardTitle>
          <CardDescription>
            {new Date(meeting.start_time).toLocaleDateString()} at {new Date(meeting.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </CardDescription>
          <CardDescription className="text-xs text-muted-foreground">Project: {meeting.project_name}</CardDescription>
        </div>
        <Button variant="destructive" size="icon" onClick={() => onDelete(meeting)} className="h-8 w-8">
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
                    <Image src={participant.image_url} alt={participant.name} width={32} height={32} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-medium">{participant.name[0]}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {showJoinButton && (
            <Button className="w-full">
              <Video className="mr-2 h-4 w-4" /> Join Meeting
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
