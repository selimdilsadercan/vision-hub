"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Layout, Briefcase, UserCircle, Earth, Compass } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNavbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Home"
    },
    {
      href: "/discover",
      icon: Compass,
      label: "Discover"
    },
    {
      href: "/spaces",
      icon: Earth,
      label: "Spaces"
    },
    {
      href: "/jobs",
      icon: Briefcase,
      label: "Jobs"
    },
    {
      href: "/profile",
      icon: UserCircle,
      label: "Profile"
    }
  ];

  if (pathname?.includes("/auth")) {
    return null;
  }

  return (
    <div className="fixed bottom-0 w-full p-4 bg-white border-t md:hidden">
      <div className="flex items-center justify-between">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} className="flex flex-col items-center gap-y-1">
            <route.icon className={cn("h-6 w-6", pathname === route.href ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-xs", pathname === route.href ? "text-primary font-medium" : "text-muted-foreground")}>{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
