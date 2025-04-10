"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Event {
  id: string;
  name: string;
  image_url: string;
  location: string;
  organizator: string;
  start_date: string;
  end_date: string;
  description: string;
  visible_date_range: string;
  time_group: string;
  owner_name: string;
  owner_image_url: string;
  is_approved: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const firestoreUser = await getUserData(user.uid);

        if (!firestoreUser) {
          toast.error("User data not found");
          return;
        }

        const { data, error } = await supabase.rpc("list_user_events", {
          input_profile_id: firestoreUser.profile_id
        });

        if (error) {
          throw error;
        }

        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const getTimeGroupColor = (timeGroup: string) => {
    switch (timeGroup.toLowerCase()) {
      case "upcoming":
        return "bg-blue-500/10 text-blue-500";
      case "ongoing":
        return "bg-green-500/10 text-green-500";
      case "past":
        return "bg-gray-500/10 text-gray-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover and join upcoming events</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {events.length} Events Available
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={getTimeGroupColor(event.time_group)}>
                  {event.time_group}
                </Badge>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={event.owner_image_url} alt={event.owner_name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{event.owner_name}</span>
                </div>
              </div>
              <CardTitle className="mt-4">{event.name}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(event.start_date).toLocaleTimeString()} - {new Date(event.end_date).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{event.organizator}</span>
                </div>
              </div>
              {event.time_group.toLowerCase() === "upcoming" && (
                <button
                  className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  onClick={() => console.log("Join event:", event.id)}
                >
                  Join Event
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
