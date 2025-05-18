"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ArrowLeft, Pencil, Trash2, ArrowUpRightFromSquare } from "lucide-react";
import { EventDialog } from "@/dialog/EventDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventDetail {
  id: string;
  name: string;
  image_url: string;
  location: string;
  organizator: string;
  start_date: string;
  end_date: string;
  description: string;
  visible_date_range: string;
  link?: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_event", { event_id: id });
    if (error) {
      toast.error("Error loading event");
      setLoading(false);
      return;
    }
    setEvent(data?.[0] ?? null);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!event) return;
    try {
      const { error } = await supabase.rpc("delete_event", { event_id: event.id });
      if (error) throw error;
      toast.success("Event deleted successfully");
      router.push("/events");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (!event) {
    return <div className="flex justify-center items-center h-64 text-muted-foreground">Event not found</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-muted-foreground hover:text-black transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Geri</span>
        </button>
        <div className="flex gap-2">
          <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 text-muted-foreground hover:text-black transition-colors">
            <Pencil className="w-5 h-5" />
            <span>Düzenle</span>
          </button>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10" type="button">
                <Trash2 className="w-5 h-5" />
                <span>Sil</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Etkinliği Sil</DialogTitle>
              </DialogHeader>
              <div className="py-4">Bu etkinliği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Vazgeç
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Sil
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-[180px] h-[180px] rounded-xl overflow-hidden bg-muted flex-shrink-0">
          {event.image_url && <Image unoptimized src={event.image_url} alt={event.name} width={180} height={180} className="object-cover w-full h-full" />}
        </div>
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold line-clamp-2">{event.name}</h1>
          <div className="text-[#2655A3] font-semibold text-lg line-clamp-2">{event.organizator}</div>
          <div className="text-muted-foreground text-base">{event.visible_date_range}</div>
          <div className="text-muted-foreground text-base">{event.location}</div>
          {event.description && <div className="mt-4 text-gray-700 whitespace-pre-line text-base">{event.description}</div>}
          {event.link && (
            <a
              href={event.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-black text-white font-semibold rounded-lg shadow hover:bg-gray-900 transition-colors text-base"
            >
              <ArrowUpRightFromSquare className="w-5 h-5" />
              Etkinlik Linkini Aç
            </a>
          )}
        </div>
      </div>
      <EventDialog
        mode="edit"
        open={editOpen}
        onOpenChange={(open: boolean) => {
          setEditOpen(open);
          if (!open) fetchEvent();
        }}
        eventId={event.id}
        initialData={event}
      />
    </div>
  );
}
