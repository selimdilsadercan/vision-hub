"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Rocket, GraduationCap, Trophy, CalendarCheck, Globe2, UserCircle, Briefcase, Laptop, GitFork } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const navigationItems = [
  {
    title: "Ana Sayfa",
    icon: Home,
    href: "/home"
  },
  {
    title: "Proje Galerisi",
    icon: Rocket,
    href: "/projects"
  },
  {
    title: "Eğitim Programları",
    icon: GraduationCap,
    href: "/education"
  },
  {
    title: "Yarışmalar",
    icon: Trophy,
    href: "/competitions"
  },
  {
    title: "Etkinlikler",
    icon: CalendarCheck,
    href: "/events"
  },
  {
    title: "Websiteler",
    icon: Laptop,
    href: "/websites"
  },
  {
    title: "Spaces",
    icon: Globe2,
    href: "/spaces"
  },
  {
    title: "Jobs",
    icon: Briefcase,
    href: "/jobs"
  },
  {
    title: "Skill Tree",
    icon: GitFork,
    href: "/skills"
  }
];

export function Sidebar() {
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
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto flex flex-col gap-1">
          <Separator className="my-2" />
          <Link href="/profile">
            <span
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/profile" ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <UserCircle className="mr-2 h-4 w-4" />
              Profile
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
