import Image from "next/image";

interface EventCardProps {
  name: string;
  organizator: string;
  location: string;
  start_date: string;
  end_date: string;
  description?: string;
  owner_name: string;
  owner_image_url: string;
  variant?: "spaces" | "profile";
}

export function EventCard({
  name,
  organizator,
  location,
  start_date,
  end_date,
  description,
  owner_name,
  owner_image_url,
  variant = "profile"
}: EventCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    });
  };

  if (variant === "spaces") {
    return (
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
            {owner_image_url && <Image width={32} height={32} src={owner_image_url} alt={owner_name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <h3 className="font-medium text-blue-600">{organizator}</h3>
            <p className="text-sm text-muted-foreground">{owner_name}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">{name}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{formatDate(start_date)}</span>
            {start_date !== end_date && (
              <>
                <span>to</span>
                <span>{formatDate(end_date)}</span>
              </>
            )}
          </div>
          <div className="text-sm">{location}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-2">
      <div className="space-y-1">
        <h3 className="font-medium text-blue-600">{name}</h3>
        <p className="text-sm text-muted-foreground">{organizator}</p>
      </div>

      <div className="text-sm text-muted-foreground">
        {formatDate(start_date)} to {formatDate(end_date)}
      </div>

      <div className="text-sm">{location}</div>

      {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}
    </div>
  );
}
