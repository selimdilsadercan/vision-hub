"use client";

import { ArrowLeft, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { Switch } from "@/components/ui/switch";

interface ProjectHeaderProps {
  title: string;
}

export function ProjectHeader({ title }: ProjectHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b bg-white">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/")} className="hover:bg-gray-100 p-2 rounded-full transition">
          <ArrowLeft className="h-5 w-5 text-muted-foreground" />
        </button>
        <h1 className="font-medium">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <Switch />
      </div>
    </div>
  );
}
