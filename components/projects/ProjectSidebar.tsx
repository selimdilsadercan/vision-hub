"use client";

import { cn } from "@/lib/utils";
import { FolderIcon, Users2Icon, SearchIcon, ClockIcon, CalendarIcon, WalletIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ProjectSidebarProps {
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

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full w-[260px] flex-col border-r px-3 py-4">
      {/* Logo Area */}
      <div className="flex h-[60px] items-center px-2">
        <Link href="/home" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1">
            <span className="text-lg font-bold text-primary-foreground">HUB</span>
          </div>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link key={route.href} href={`/projects/${projectId}${route.href}`}>
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === `/projects/${projectId}${route.href}` ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
