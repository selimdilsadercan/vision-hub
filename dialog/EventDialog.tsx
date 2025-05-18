"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";
import Image from "next/image";

export function EventDialog({
  mode = "create",
  open: controlledOpen,
  onOpenChange,
  initialData,
  eventId,
  triggerText = "Add Event",
  eventType,
  onSuccess
}: {
  mode?: "create" | "edit";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: {
    name: string;
    organizator: string;
    location: string;
    image_url: string;
    start_date: string;
    end_date: string;
    description?: string;
    visible_date_range: string;
    link?: string;
  };
  eventId?: string;
  triggerText?: string;
  eventType?: "other" | "bootcamp" | "ideathon" | "hackathon" | "meetup" | "workshop";
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const isControlled = typeof controlledOpen === "boolean" && typeof onOpenChange === "function";
  const [open, setOpen] = useState(controlledOpen ?? false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(initialData?.image_url || "");
  const defaultStartDate = new Date();
  defaultStartDate.setHours(12, 0, 0, 0);
  const defaultEndDate = new Date();
  defaultEndDate.setHours(18, 0, 0, 0);
  const [startDate, setStartDate] = useState<Date>(initialData?.start_date ? new Date(initialData.start_date) : defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(initialData?.end_date ? new Date(initialData.end_date) : defaultEndDate);
  const [showEndDate, setShowEndDate] = useState(!!initialData?.end_date);
  const [showStartDateModal, setShowStartDateModal] = useState(false);
  const [showEndDateModal, setShowEndDateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    organizator: initialData?.organizator || "",
    location: initialData?.location || "",
    link: initialData?.link || ""
  });
  const [startTime, setStartTime] = useState<string>(format(initialData?.start_date ? new Date(initialData.start_date) : defaultStartDate, "HH:mm"));
  const [endTime, setEndTime] = useState<string>(format(initialData?.end_date ? new Date(initialData.end_date) : defaultEndDate, "HH:mm"));

  useEffect(() => {
    if (isControlled) setOpen(controlledOpen!);
  }, [controlledOpen, isControlled]);

  useEffect(() => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const newDate = new Date(startDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setStartDate(newDate);
    // eslint-disable-next-line
  }, [startTime]);

  useEffect(() => {
    const [hours, minutes] = endTime.split(":").map(Number);
    const newDate = new Date(endDate);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    setEndDate(newDate);
    // eslint-disable-next-line
  }, [endTime]);

  const handleDialogOpenChange = (v: boolean) => {
    if (isControlled) {
      onOpenChange?.(v);
    } else {
      setOpen(v);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!imageUrl || !formData.name || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const firestoreUser = await getUserData(user.uid);
      if (!firestoreUser) {
        toast.error("User data not found");
        return;
      }

      if (mode === "edit" && eventId) {
        const { error } = await supabase.rpc("update_event", {
          event_id: eventId,
          name: formData.name,
          organizator: formData.organizator,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          location: formData.location,
          image_url: imageUrl,
          visible_date_range: format(startDate, "d MMMM EEE HH:mm"),
          description: "",
          link: formData.link
        });
        if (error) throw error;
        toast.success("Event updated successfully");
        if (onSuccess) onSuccess();
      } else {
        const { error } = await supabase.rpc("create_event", {
          name: formData.name,
          organizator: formData.organizator,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          location: formData.location,
          image_url: imageUrl,
          visible_date_range: format(startDate, "d MMMM EEE HH:mm"),
          description: "",
          event_type: eventType as "other" | "bootcamp" | "ideathon" | "hackathon" | "meetup" | "workshop",
          link: formData.link
        });
        if (error) throw error;
        toast.success("Event created successfully");
        if (onSuccess) onSuccess();
      }
      setOpen(false);
      router.refresh();
      if (onOpenChange) onOpenChange(false);
    } catch (error) {
      console.error("Error saving event:", error);
      toast.error("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isControlled ? controlledOpen : open} onOpenChange={handleDialogOpenChange}>
      {mode === "create" && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2">
            <Plus className="h-8 w-8" />
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex gap-4">
              <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden bg-muted">
                {imageUrl ? (
                  <Image unoptimized src={imageUrl} alt="Event" fill className="object-cover pointer-events-none select-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2ZM3 17l6-6a2 2 0 0 1 2.83 0l7.17 7M8 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="font-bold text-base line-clamp-1">{formData.name || "Başlık"}</div>
                <div className="text-[#2655A3] font-semibold text-sm line-clamp-1">{formData.organizator || "Organizatör"}</div>
                <div className="text-xs text-muted-foreground">
                  {startDate && endDate ? `${format(startDate, "d MMMM EEE HH:mm")} - ${format(endDate, "HH:mm")}` : "Etkinlik Zamanı"}
                </div>
                <div className="text-xs text-muted-foreground">{formData.location || "Konum"}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input placeholder="Enter image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="url" autoComplete="off" />
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Enter event title" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <Label>Organizer</Label>
              <Input
                placeholder="Enter organizer name"
                value={formData.organizator}
                onChange={(e) => setFormData((prev) => ({ ...prev, organizator: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Enter event location"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    className="border rounded-lg px-2 py-1 w-full"
                    value={format(startDate, "yyyy-MM-dd")}
                    onChange={(e) => {
                      const [year, month, day] = e.target.value.split("-").map(Number);
                      const newDate = new Date(startDate);
                      newDate.setFullYear(year, month - 1, day);
                      setStartDate(newDate);
                    }}
                    aria-label="Start date"
                  />
                  <input
                    type="time"
                    className="border rounded-lg px-2 py-1 w-[100px]"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    aria-label="Start time"
                  />
                </div>
                {showEndDate && (
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      className="border rounded-lg px-2 py-1 w-full"
                      value={format(endDate, "yyyy-MM-dd")}
                      min={format(startDate, "yyyy-MM-dd")}
                      onChange={(e) => {
                        const [year, month, day] = e.target.value.split("-").map(Number);
                        const newDate = new Date(endDate);
                        newDate.setFullYear(year, month - 1, day);
                        setEndDate(newDate);
                      }}
                      aria-label="End date"
                    />
                    <input
                      type="time"
                      className="border rounded-lg px-2 py-1 w-[100px]"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      aria-label="End time"
                    />
                  </div>
                )}
                <button type="button" onClick={() => setShowEndDate((prev) => !prev)} className="text-xs text-muted-foreground mt-1 cursor-pointer">
                  {showEndDate ? "Bitiş zamanını kaldır" : "Bitiş zamanı ekle"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Link</Label>
              <Input placeholder="Enter event link" value={formData.link} onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))} />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (mode === "edit" ? "Saving..." : "Creating...") : mode === "edit" ? "Save Changes" : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
