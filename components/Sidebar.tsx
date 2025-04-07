"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Search, Layout, Briefcase, UserCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Home",
      icon: Home,
      href: "/",
      color: "text-sky-500",
      bgColor: "bg-sky-500/10"
    },
    {
      label: "Discover",
      icon: Search,
      href: "/discover",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      label: "Spaces",
      icon: Layout,
      href: "/spaces",
      color: "text-pink-700",
      bgColor: "bg-pink-700/10"
    },
    {
      label: "Jobs",
      icon: Briefcase,
      href: "/jobs",
      color: "text-green-700",
      bgColor: "bg-green-700/10"
    },
    {
      label: "Profile",
      icon: UserCircle,
      href: "/profile",
      color: "text-orange-700",
      bgColor: "bg-orange-700/10"
    }
  ];

  if (pathname?.includes("/auth")) {
    return null;
  }

  return (
    <div className="space-y-4 py-4 flex flex-col h-full">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="text-3xl mr-4">🔶</div>
          <h1 className="text-2xl font-bold">HUB</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href ? "text-primary bg-primary/10" : "text-zinc-500"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
