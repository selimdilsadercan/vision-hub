"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, GraduationCap, CalendarCheck, Trophy, UserCircle, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const adminNavigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { title: "Users", icon: Users, href: "/admin/users" },
  { title: "Education", icon: GraduationCap, href: "/admin/education" },
  { title: "Events", icon: CalendarCheck, href: "/admin/events" },
  { title: "Competitions", icon: Trophy, href: "/admin/competitions" }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="relative flex h-full w-[260px] flex-col border-r px-3 py-4">
      {/* Logo Area */}
      <div className="flex h-[60px] items-center px-2">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1">
            <span className="text-lg font-bold text-primary-foreground">HUB</span>
          </div>
          <span className="ml-2 text-base font-semibold">Admin</span>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          {adminNavigationItems.map((item) => (
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
              <div className="flex items-center gap-2 w-full">
                <span>Profile</span>
                <Badge variant="secondary" className="ml-auto flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Admin
                </Badge>
              </div>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
