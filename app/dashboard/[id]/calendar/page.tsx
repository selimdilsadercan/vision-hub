"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Calendar as CalendarIcon, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { Calendar as BigCalendar, dateFnsLocalizer, Views, type Event as RBCEvent } from "react-big-calendar";
import { format } from "date-fns/format";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales
});

interface Deadline {
  id: string;
  name: string;
  description: string;
  deadline_at: string;
  is_finished: boolean;
}

interface CalendarEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: Deadline;
}

export default function CalendarPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [form, setForm] = useState({ name: "", description: "", deadline_at: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deadlineToDelete, setDeadlineToDelete] = useState<Deadline | null>(null);
  const [loading, setLoading] = useState(true);
  const [slotDate, setSlotDate] = useState<Date | null>(null);

  const fetchDeadlines = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("list_project_deadlines", { input_project_id: projectId });
    if (error) {
      toast.error("Failed to fetch deadlines");
      console.error(error);
      setLoading(false);
      return;
    }
    console.log(data);
    setDeadlines(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDeadlines();
    // eslint-disable-next-line
  }, [projectId]);

  // Map deadlines to calendar events
  const events: CalendarEvent[] = useMemo(
    () =>
      deadlines.map((d) => ({
        id: d.id,
        title: d.name,
        start: new Date(d.deadline_at),
        end: new Date(d.deadline_at),
        allDay: true,
        resource: d
      })),
    [deadlines]
  );

  const openCreateDialog = (date?: Date) => {
    setDialogMode("create");
    setForm({ name: "", description: "", deadline_at: date ? date.toISOString().slice(0, 10) : "" });
    setDialogOpen(true);
    setSelectedEvent(null);
    setSlotDate(date || null);
  };

  const openEditDialog = (event: CalendarEvent) => {
    setDialogMode("edit");
    setForm({
      name: event.resource.name,
      description: event.resource.description,
      deadline_at: event.resource.deadline_at.slice(0, 10)
    });
    setSelectedEvent(event);
    setDialogOpen(true);
    setSlotDate(null);
  };

  const handleDialogSubmit = async () => {
    if (!form.name || !form.deadline_at) {
      toast.error("Name and date are required");
      return;
    }
    if (dialogMode === "create") {
      const { error } = await supabase.rpc("create_deadline", {
        input_name: form.name,
        input_deadline_at: form.deadline_at,
        input_project_id: projectId,
        input_description: form.description
      });
      if (error) {
        toast.error("Failed to create deadline");
        console.error(error);
        return;
      }
      toast.success("Deadline created");
    } else if (dialogMode === "edit" && selectedEvent) {
      const { error } = await supabase.rpc("update_deadline", {
        input_deadline_id: selectedEvent.id,
        input_name: form.name,
        input_deadline_at: form.deadline_at,
        input_description: form.description
      });
      if (error) {
        console.error(error);
        toast.error("Failed to update deadline");
        return;
      }
      toast.success("Deadline updated");
    }
    setDialogOpen(false);
    fetchDeadlines();
  };

  const openDeleteDialog = (deadline: Deadline) => {
    setDeadlineToDelete(deadline);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deadlineToDelete) return;
    const { error } = await supabase.rpc("delete_deadline", { input_deadline_id: deadlineToDelete.id });
    if (error) {
      toast.error("Failed to delete deadline");
      return;
    }
    toast.success("Deadline deleted");
    setDeleteDialogOpen(false);
    setDeadlineToDelete(null);
    fetchDeadlines();
  };

  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" /> Calendar
        </h1>
        <Button variant="outline" size="sm" onClick={() => openCreateDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Add Deadline
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow border p-2 min-h-[600px]">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={Views.MONTH}
          onSelectSlot={(slot: { start: Date }) => {
            if (slot && "start" in slot && slot.start instanceof Date) {
              openCreateDialog(slot.start);
            }
          }}
          onSelectEvent={(event: CalendarEvent) => openEditDialog(event)}
          selectable
          popup
          eventPropGetter={(event) => ({
            className: "!bg-primary/10 !border-primary !text-primary rounded-md cursor-pointer hover:!bg-primary/20"
          })}
        />
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Deadlines</h2>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : deadlines.length === 0 ? (
          <div className="text-muted-foreground">No deadlines found.</div>
        ) : (
          <div className="space-y-2">
            {deadlines.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent">
                <div>
                  <div className="font-medium">{d.name}</div>
                  <div className="text-xs text-muted-foreground">{d.deadline_at.slice(0, 10)}</div>
                  {d.description && <div className="text-xs mt-1">{d.description}</div>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      openEditDialog({
                        id: d.id,
                        title: d.name,
                        start: new Date(d.deadline_at),
                        end: new Date(d.deadline_at),
                        allDay: true,
                        resource: d
                      })
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(d)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Add Deadline" : "Edit Deadline"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input type="date" value={form.deadline_at} onChange={(e) => setForm((f) => ({ ...f, deadline_at: e.target.value }))} />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <DialogFooter>
            <Button onClick={handleDialogSubmit}>{dialogMode === "create" ? "Add" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Deadline</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to delete this deadline?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
