"use client";

import { cn } from "@/lib/utils";
import { FolderIcon, Users2Icon, SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectNavbarProps {
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
    label: "Members",
    icon: Users2Icon,
    href: "/members"
  }
];

export function ProjectNavbar({ projectId }: ProjectNavbarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-secondary md:hidden">
      <div className="flex items-center justify-between">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/projects/${projectId}${route.href}`}
            className={cn("flex flex-col items-center gap-y-1", pathname === `/projects/${projectId}${route.href}` ? "text-primary" : "text-muted-foreground")}
          >
            <route.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
