"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import { EventCard } from "@/components/EventCard";
import { EventDialog } from "@/dialog/EventDialog";
import { tr } from "date-fns/locale";
import { isToday, isThisWeek, isThisMonth, isAfter, isBefore, startOfToday, endOfWeek, endOfMonth } from "date-fns";

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
}

function groupEvents(events: Event[]) {
  const today: Event[] = [];
  const thisWeek: Event[] = [];
  const thisMonth: Event[] = [];
  const later: Event[] = [];
  const past: Event[] = [];
  const now = new Date();

  events.forEach((event) => {
    const date = new Date(event.start_date);
    if (isBefore(date, startOfToday())) {
      past.push(event);
    } else if (isToday(date)) {
      today.push(event);
    } else if (isThisWeek(date, { weekStartsOn: 1, locale: tr })) {
      thisWeek.push(event);
    } else if (isThisMonth(date)) {
      thisMonth.push(event);
    } else {
      later.push(event);
    }
  });

  return { today, thisWeek, thisMonth, later, past };
}

function GroupSection({ title, events }: { title: string; events: Event[] }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold mt-8 mb-2">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            id={event.id}
            name={event.name}
            organizator={event.organizator}
            location={event.location}
            start_date={event.start_date}
            end_date={event.end_date}
            description={event.description}
            image_url={event.image_url}
            visible_date_range={event.visible_date_range}
          />
        ))}
      </div>
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const [type, setType] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setType(params.get("type"));
    }
  }, [typeof window !== "undefined" && window.location.search]);
  const isCompetition = type === "competition";
  const pageTitle = isCompetition ? "Yarışmalar" : "Etkinlikler";
  const pageDesc = isCompetition ? "Yarışmaları keşfet ve katıl" : "Etkinlikleri keşfet ve katıl";
  const buttonText = isCompetition ? "Yarışma Ekle" : "Etkinlik Ekle";
  const [createOpen, setCreateOpen] = useState(false);

  const refreshEvents = async () => {
    setLoading(true);
    try {
      let eventTypes: ("other" | "bootcamp" | "ideathon" | "hackathon" | "meetup" | "workshop")[];
      if (type === "competition") {
        eventTypes = ["ideathon", "hackathon"];
      } else {
        eventTypes = ["other", "bootcamp", "meetup", "workshop"];
      }
      const { data, error } = await supabase.rpc("list_events", { event_types: eventTypes });
      if (error) throw error;
      setEvents(data ?? []);
    } catch (error) {
      toast.error("Failed to refresh events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // Get user profile using RPC function
        const { data: profileData, error: profileError } = await supabase.rpc("get_profile_by_uid", { input_uid: user.uid });

        if (profileError) {
          throw profileError;
        }

        if (!profileData || profileData.length === 0) {
          toast.error("User data not found");
          return;
        }

        setIsAdmin(profileData[0].is_admin ?? false);

        let eventTypes: ("other" | "bootcamp" | "ideathon" | "hackathon" | "meetup" | "workshop")[];
        if (type === "competition") {
          eventTypes = ["ideathon", "hackathon"];
        } else {
          eventTypes = ["other", "bootcamp", "meetup", "workshop"];
        }

        const { data, error } = await supabase.rpc("list_events", { event_types: eventTypes });

        if (error) {
          throw error;
        }

        setEvents(data ?? []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user, type]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg border p-3 animate-pulse">
              <div className="flex gap-3">
                <div className="w-[100px] h-[100px] rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground">{pageDesc}</p>
        </div>
        {isAdmin && (
          <EventDialog
            mode="create"
            open={createOpen}
            onOpenChange={setCreateOpen}
            triggerText={buttonText}
            eventType={isCompetition ? "hackathon" : "other"}
            onSuccess={refreshEvents}
          />
        )}
      </div>

      {(() => {
        const groups = groupEvents(events);
        return (
          <>
            {groups.today.length > 0 && <GroupSection title="Bugün" events={groups.today} />}
            {groups.thisWeek.length > 0 && <GroupSection title="Bu Hafta" events={groups.thisWeek} />}
            {groups.thisMonth.length > 0 && <GroupSection title="Bu Ay" events={groups.thisMonth} />}
            {groups.later.length > 0 && <GroupSection title="Daha Sonra" events={groups.later} />}
            {groups.past.length > 0 && <GroupSection title="Geçmiş Etkinlikler" events={groups.past} />}
          </>
        );
      })()}
    </div>
  );
}
