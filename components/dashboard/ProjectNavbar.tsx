"use client";

import { cn } from "@/lib/utils";
import { FolderIcon, Users2Icon, SearchIcon, ClockIcon, CalendarIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectNavbarProps {
  projectId: string;
}

const routes = [
  {
    label: "Overview",
    icon: FolderIcon,
    href: ""
  },
  {
    label: "Timeline",
    icon: ClockIcon,
    href: "/timeline"
  },
  {
    label: "Meetings",
    icon: CalendarIcon,
    href: "/meetings"
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
  },
  {
    label: "Finance",
    icon: WalletIcon,
    href: "/finance"
  }
];

export function ProjectNavbar({ projectId }: ProjectNavbarProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 w-full p-4 border-t bg-background md:hidden">
      <div className="flex items-center justify-between">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={`/dashboard/${projectId}${route.href}`}
            className={cn(
              "flex flex-col items-center gap-y-1",
              pathname === `/dashboard/${projectId}${route.href}` ? "text-accent-foreground" : "text-muted-foreground"
            )}
          >
            <route.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
