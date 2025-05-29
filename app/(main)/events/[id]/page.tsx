"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { ArrowLeft, Pencil, Trash2, ArrowUpRightFromSquare, Plus } from "lucide-react";
import { EventDialog } from "@/dialog/EventDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ParticipantCard } from "@/components/participants/ParticipantCard";
import { ProfileSelector, Profile } from "@/components/ProfileSelector";

interface Participant {
  id: string;
  name: string;
  email: string;
  image_url?: string;
}

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
  participants: Participant[];
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantPage, setParticipantPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const PARTICIPANTS_PER_PAGE = 10;

  const fetchEvent = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("get_event", { input_event_id: id });
    if (error) {
      toast.error("Error loading event");
      setLoading(false);
      return;
    }
    if (data?.[0]) {
      const { id, name, image_url, location, organizator, start_date, end_date, description, visible_date_range, link } = data[0];
      setEvent({ id, name, image_url, location, organizator, start_date, end_date, description, visible_date_range, link, participants: [] });
      const rawParticipants = data[0].participants ?? [];
      setParticipants(
        rawParticipants.map((p: any) => ({
          id: p.id,
          name: p.profile_name || "-",
          email: p.profile_email || "-",
          image_url: p.profile_image_url ?? undefined
        }))
      );
    } else {
      setEvent(null);
      setParticipants([]);
    }
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

  const handleAddParticipant = async () => {
    if (!selectedProfile) {
      toast.error("Bir kullanıcı seçin");
      return;
    }
    setAddLoading(true);
    try {
      const { error } = await supabase.rpc("create_event_participant", { input_event_id: id, input_profile_id: selectedProfile.id });
      if (error) throw error;
      toast.success("Katılımcı eklendi");
      setAddOpen(false);
      setSelectedProfile(null);
      fetchEvent();
    } catch (error) {
      toast.error("Katılımcı eklenemedi");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteParticipant = async (participantId: string) => {
    try {
      const { error } = await supabase.rpc("delete_event_participant", { input_id: participantId });
      if (error) throw error;
      toast.success("Katılımcı silindi");
      fetchEvent();
    } catch (error) {
      toast.error("Katılımcı silinemedi");
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
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 text-black font-medium px-4 py-2 rounded-lg transition-colors hover:text-primary focus:outline-none"
            type="button"
          >
            <Pencil className="w-5 h-5 stroke-[1.5]" />
            <span>Düzenle</span>
          </button>
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center gap-2 border border-destructive text-destructive font-medium px-6 py-2 rounded-lg transition-colors hover:bg-destructive/10 focus:outline-none"
                type="button"
              >
                <Trash2 className="w-5 h-5 stroke-[1.5]" />
                <span>Sil</span>
              </button>
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
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Katılımcılar</h2>
          <Button onClick={() => setAddOpen(true)} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Katılımcı Ekle
          </Button>
        </div>
        <div className="space-y-2">
          {participants.length === 0 && <div className="text-muted-foreground">Katılımcı yok</div>}
          {participants.slice((participantPage - 1) * PARTICIPANTS_PER_PAGE, participantPage * PARTICIPANTS_PER_PAGE).map((p) => (
            <ParticipantCard key={p.id} id={p.id} name={p.name} email={p.email} image_url={p.image_url} onDelete={handleDeleteParticipant} />
          ))}
        </div>
        {/* Pagination */}
        {participants.length > PARTICIPANTS_PER_PAGE && (
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" disabled={participantPage === 1} onClick={() => setParticipantPage((p) => p - 1)}>
              Önceki
            </Button>
            <Button
              variant="outline"
              disabled={participantPage === Math.ceil(participants.length / PARTICIPANTS_PER_PAGE)}
              onClick={() => setParticipantPage((p) => p + 1)}
            >
              Sonraki
            </Button>
          </div>
        )}
        {/* Add Participant Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Katılımcı Ekle</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddParticipant();
              }}
              className="space-y-4"
            >
              <ProfileSelector value={selectedProfile} onChange={setSelectedProfile} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setAddOpen(false)}>
                  Vazgeç
                </Button>
                <Button type="submit" disabled={addLoading || !selectedProfile}>
                  {addLoading ? "Ekleniyor..." : "Ekle"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
