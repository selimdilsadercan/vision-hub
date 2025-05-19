"use client";

import { useEffect, useState, useMemo } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as BigCalendar, dateFnsLocalizer, Views, type Event as RBCEvent } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales
});

interface CalendarItem {
  id: string;
  type: string;
  name: string;
  date: string;
  description: string;
  is_finished: boolean;
  project_id: string | null;
  project_name: string | null;
  project_image_url: string | null;
  workspace_id: string | null;
  workspace_name: string | null;
  created_by: string;
  created_by_name: string;
  created_by_image_url: string;
}

interface CalendarEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: CalendarItem;
}

export default function CalendarPage() {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCalendarItems = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userData = await getUserData(user.uid);
      if (!userData?.profile_id) {
        toast.error("User profile not found");
        return;
      }

      const { data, error } = await supabase.rpc("get_user_calendar", {
        input_profile_id: userData.profile_id
      });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch calendar items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarItems();
  }, [user]);

  // Map items to calendar events
  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        title: item.name,
        start: new Date(item.date),
        end: new Date(item.date),
        allDay: true,
        resource: item
      })),
    [items]
  );

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" /> Calendar
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow border p-2 min-h-[600px]">
        <BigCalendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          popup
          eventPropGetter={(event) => ({
            className: `!bg-primary/10 !border-primary !text-primary rounded-md ${
              event.resource.type === "deadline" ? "!border-destructive !text-destructive" : ""
            }`
          })}
        />
      </div>
    </div>
  );
}
