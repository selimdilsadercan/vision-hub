"use client";

import { cn } from "@/lib/utils";
import { BookOpen, ListChecks, User, Calendar, Award, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface EducationSidebarProps {
  educationId: string;
}

const routes = [
  {
    label: "Overview",
    icon: BookOpen,
    href: ""
  },
  {
    label: "Progress",
    icon: ListChecks,
    href: "/progress"
  },
  {
    label: "Mentor",
    icon: User,
    href: "/mentor"
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/schedule"
  },
  {
    label: "Certificate",
    icon: Award,
    href: "/certificate"
  }
];

export function EducationSidebar({ educationId }: EducationSidebarProps) {
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

      <div className="flex flex-1 flex-col">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link key={route.href} href={`/learn/${educationId}${route.href}`}>
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === `/learn/${educationId}${route.href}` ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Settings Button */}
        <div className="mt-auto pt-4 border-t">
          <Link href={`/learn/${educationId}/settings`}>
            <span
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === `/learn/${educationId}/settings` ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
