import Image from "next/image";

interface ProjectCardProps {
  name: string;
  description: string;
  field_name: string;
  user_name: string;
  user_image_url: string;
  created_at: string;
  variant?: "spaces" | "profile";
}

export function ProjectCard({ name, description, field_name, user_name, user_image_url, created_at, variant = "profile" }: ProjectCardProps) {
  if (variant === "spaces") {
    return (
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
            {user_image_url && <Image width={32} height={32} src={user_image_url} alt={user_name} className="w-full h-full object-cover" />}
          </div>
          <div>
            <h3 className="font-medium text-blue-600">{name}</h3>
            <p className="text-sm text-muted-foreground">{user_name}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm text-blue-600 bg-blue-50 w-fit px-3 py-1 rounded-full">{field_name}</div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100">
            {user_image_url && <Image width={24} height={24} src={user_image_url} alt={user_name} className="w-full h-full object-cover" />}
          </div>
          <span className="text-muted-foreground">{user_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-full text-xs">{field_name}</span>
          <span className="text-muted-foreground">{new Date(created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}
