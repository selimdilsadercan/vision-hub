import Link from "next/link";
import { User } from "lucide-react";

interface EducationPlanCardProps {
  id: string;
  name: string;
  mentorName?: string;
  imageUrl?: string | null;
}

function EducationPlanCard({ id, name, mentorName, imageUrl }: EducationPlanCardProps) {
  return (
    <Link href={`/education/${id}`}>
      <div className="bg-white rounded-3xl p-4 border shadow-sm hover:shadow-md transition-all h-[72px] flex items-center gap-3">
        <div className="flex-shrink-0 w-5 h-5 relative">
          {imageUrl ? <img src={imageUrl} alt={name} className="object-contain w-5 h-5 rounded-full" /> : <User className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Mentor: {mentorName || "Not specified"}</p>
        </div>
      </div>
    </Link>
  );
}

export { EducationPlanCard };
