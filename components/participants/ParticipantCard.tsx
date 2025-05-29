import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

interface ParticipantCardProps {
  id: string;
  name: string;
  email: string;
  image_url?: string;
  onDelete: (id: string) => void;
}

function ParticipantCard({ id, name, email, image_url, onDelete }: ParticipantCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between border rounded-lg px-4 py-2 bg-white">
      <div className="flex items-center gap-3">
        {image_url ? (
          <Image unoptimized src={image_url} alt={name} width={32} height={32} className="rounded-full" />
        ) : (
          <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-base font-bold">{name?.[0]?.toUpperCase() || "?"}</span>
        )}
        <div className="flex flex-col">
          <span className="font-medium text-base text-black">{name}</span>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10 flex items-center gap-2 px-3 py-1" type="button">
            <Trash2 className="w-4 h-4 stroke-[1.5]" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Katılımcıyı Sil</DialogTitle>
          </DialogHeader>
          <div className="py-4">Bu katılımcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Vazgeç
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(id);
                setOpen(false);
              }}
            >
              Sil
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export { ParticipantCard };
