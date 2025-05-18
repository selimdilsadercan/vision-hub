import Image from "next/image";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface EventCardProps {
  id: string;
  name: string;
  organizator: string;
  location: string;
  start_date: string;
  end_date: string;
  description?: string;
  visible_date_range: string;
  image_url: string;
  variant?: "spaces" | "profile";
}

export function EventCard({ id, name, organizator, location, start_date, end_date, visible_date_range, image_url, variant = "profile" }: EventCardProps) {
  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM HH:mm", { locale: tr });
  };
  const formatRelative = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true, locale: tr });
  };

  if (variant === "spaces") {
    return (
      <Link href={`/events/${id}`} className="block hover:shadow-md transition-shadow rounded-lg">
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">{name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {formatDate(start_date)} (<span>{formatRelative(start_date)}</span>)
              </span>
              {start_date !== end_date && (
                <>
                  <span>to</span>
                  <span>
                    {formatDate(end_date)} (<span>{formatRelative(end_date)}</span>)
                  </span>
                </>
              )}
            </div>
            <div className="text-sm">{location}</div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/events/${id}`} className="block hover:shadow-md transition-shadow rounded-lg">
      <div className="bg-white rounded-lg border p-3">
        <div className="flex gap-3">
          <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden">
            <Image src={image_url} alt={name} fill className="object-cover" unoptimized />
          </div>

          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-base line-clamp-1">{name}</h3>
            <p className="text-sm font-semibold text-[#2655A3] line-clamp-1">{organizator}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {formatDate(start_date)} (<span>{formatRelative(start_date)}</span>)
            </p>
            <p className="text-sm text-muted-foreground line-clamp-1">{location}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
