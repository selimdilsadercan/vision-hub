"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Rocket, GraduationCap, Trophy, CalendarCheck, Globe2, UserCircle, Briefcase, Laptop, GitFork, ShieldCheck, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/firebase/auth-context";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

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
    href: "/events?type=competition"
  },
  {
    title: "Etkinlikler",
    icon: CalendarCheck,
    href: "/events?type=other"
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
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const supabase = require("@/lib/supabase").supabase;
      const { data, error } = await supabase.rpc("get_profile_by_uid", { input_uid: user.uid });
      if (error) return;
      if (data && data.length > 0) {
        setUserData(data[0]);
      }
    };

    fetchUserData();
  }, [user]);

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
          {navigationItems.map((item) => {
            let isActive = pathname === item.href;
            if (item.title === "Ana Sayfa" && (pathname === "/home" || pathname.startsWith("/home/"))) {
              isActive = true;
            }
            if (item.title === "Yarışmalar" && pathname === "/events" && type === "competition") {
              isActive = true;
            }
            if (item.title === "Etkinlikler" && pathname === "/events" && (type === "other" || !type)) {
              isActive = true;
            }
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActive ? "bg-accent text-accent-foreground" : "transparent"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-auto flex flex-col gap-1">
          <Separator className="my-2" />
          {userData?.is_admin && (
            <Link href="/admin">
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === "/admin" ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                <div className="flex items-center gap-2 w-full">
                  <span>Admin Dashboard</span>
                </div>
              </span>
            </Link>
          )}
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
                {userData?.is_admin && (
                  <Badge variant="secondary" className="ml-auto flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
