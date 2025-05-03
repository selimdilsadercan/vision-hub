import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";

interface LeaderboardUserCardProps {
  name: string;
  imageUrl?: string | null;
  progress: number;
  rank: number;
}

function LeaderboardUserCard({ name, imageUrl, progress, rank }: LeaderboardUserCardProps) {
  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg bg-card w-full">
      <span className="font-bold text-lg w-8 text-center">{rank}</span>
      <Avatar>
        {imageUrl ? (
          <AvatarImage src={imageUrl} alt={name} />
        ) : (
          <AvatarFallback>
            <User className="w-6 h-6 text-muted-foreground" />
          </AvatarFallback>
        )}
      </Avatar>
      <span className="flex-1 text-base text-muted-foreground font-medium truncate">{name}</span>
      <div className="flex flex-col items-end min-w-[80px]">
        <span className="text-sm font-semibold mb-1">{progress}%</span>
        <Progress value={progress} className="w-20 h-2" />
      </div>
    </div>
  );
}

export { LeaderboardUserCard };
