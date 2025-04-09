"use client";

import { cn } from "@/lib/utils";
import { FolderIcon, Users2Icon, SearchIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectSidebarProps {
  projectId: string;
}

const routes = [
  {
    label: "Folders",
    icon: FolderIcon,
    href: ""
  },
  {
    label: "Research",
    icon: SearchIcon,
    href: "/research"
  },
  {
    label: "Timeline",
    icon: ClockIcon,
    href: "/timeline"
  },
  {
    label: "Members",
    icon: Users2Icon,
    href: "/members"
  }
];

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-4 flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex-1 flex justify-center">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={`/projects/${projectId}${route.href}`}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === `/projects/${projectId}${route.href}` ? "text-primary bg-primary/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
