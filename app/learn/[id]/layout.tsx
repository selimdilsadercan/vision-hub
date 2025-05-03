"use client";

import { ReactNode } from "react";
import { EducationSidebar } from "@/components/learn/EducationSidebar";
import { useParams } from "next/navigation";

interface EducationLayoutProps {
  children: ReactNode;
}

export default function EducationLayout({ children }: EducationLayoutProps) {
  const params = useParams();
  const educationId = params.id as string;

  return (
    <div className="flex h-full">
      <EducationSidebar educationId={educationId} />
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
