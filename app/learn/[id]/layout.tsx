import { ReactNode } from "react";
import { EducationSidebar } from "@/components/learn/EducationSidebar";

export default function EducationLayout({ children, params }: { children: ReactNode; params: { id: string } }) {
  return (
    <div className="flex h-full">
      <EducationSidebar educationId={params.id} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
