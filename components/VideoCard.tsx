import Image from "next/image";

interface VideoCardProps {
  title: string;
  channel_title: string;
  thumbnail_url: string;
  owner_name: string;
  owner_image_url: string;
  added_at: string;
  variant?: "spaces" | "profile";
}

export function VideoCard({ title, channel_title, thumbnail_url, owner_name, owner_image_url, added_at, variant = "profile" }: VideoCardProps) {
  if (variant === "spaces") {
    return (
      <div className="bg-white rounded-lg border p-4 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            {owner_image_url && <Image width={24} height={24} src={owner_image_url} alt={owner_name} className="w-full h-full object-cover" />}
          </div>
          <span className="text-sm text-muted-foreground">{owner_name}</span>
        </div>

        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
            <Image width={96} height={54} src={thumbnail_url} alt={title} className="w-full h-full object-cover" unoptimized />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-medium text-[#1849A9] line-clamp-2">{title}</h3>
            <p className="text-sm text-[#475467]">{channel_title}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="aspect-video relative">
        <Image width={96} height={54} src={thumbnail_url} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-1">
          <h3 className="font-medium line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{channel_title}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
              {owner_image_url && <Image width={24} height={24} src={owner_image_url} alt={owner_name} className="w-full h-full object-cover" />}
            </div>
            <span className="text-muted-foreground">{owner_name}</span>
          </div>
          <span className="text-muted-foreground">{new Date(added_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
