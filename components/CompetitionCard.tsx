import { Trophy } from "lucide-react";

interface CompetitionCardProps {
  id: string;
  name: string;
  organizator: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  image_url: string | null;
  apply_date: string | null;
  link: string | null;
}

export function CompetitionCard({ id, name, organizator, location, start_date, end_date, description, image_url, apply_date, link }: CompetitionCardProps) {
  const formatDate = (date: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long"
    });
  };

  return (
    <div className="bg-white rounded-lg border hover:border-blue-600 transition-colors">
      <div className="flex gap-4 p-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden">
          {image_url ? (
            <img src={image_url} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Trophy className="w-8 h-8 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="font-medium text-blue-600 truncate">{name}</h3>
          <p className="text-sm text-muted-foreground">{organizator}</p>

          {(start_date || end_date) && (
            <div className="text-sm text-muted-foreground">
              {start_date && <span>{formatDate(start_date)}</span>}
              {end_date && <span> - {formatDate(end_date)}</span>}
            </div>
          )}

          {location && <div className="text-sm">{location}</div>}

          {description && <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>}

          {apply_date && <div className="text-sm text-muted-foreground">Son Başvuru: {formatDate(apply_date)}</div>}
        </div>
      </div>
    </div>
  );
}
