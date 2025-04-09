"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Search, Rocket, GraduationCap, Trophy, Lightbulb, Globe, UserCircle, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

const discoverItems = [
  {
    title: "Projeler",
    icon: Rocket,
    href: "/projects",
    description: "Katılabileceğin Etkinlikleri Keşfet"
  },
  {
    title: "Eğitim Programları",
    icon: GraduationCap,
    href: "/education",
    description: "Katılabileceğin Etkinlikleri Keşfet"
  },
  {
    title: "Yarışmalar",
    icon: Trophy,
    href: "/competitions",
    description: "Katılabileceğin Etkinlikleri Keşfet"
  },
  {
    title: "Etkinlikler",
    icon: Lightbulb,
    href: "/activities",
    description: "Katılabileceğin Etkinlikleri Keşfet"
  },
  {
    title: "Websiteler",
    icon: Globe,
    href: "/websites",
    description: "Katılabileceğin Etkinlikleri Keşfet"
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const [isDiscoverOpen, setIsDiscoverOpen] = useState(true);

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
          {/* Home */}
          <Link href="/home">
            <span
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/home" ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </span>
          </Link>

          {/* Discover Group */}
          <Collapsible open={isDiscoverOpen} onOpenChange={setIsDiscoverOpen}>
            <CollapsibleTrigger className="w-full">
              <div className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                <div className="flex items-center">
                  <Search className="mr-2 h-4 w-4" />
                  Discover
                </div>
                {isDiscoverOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="ml-4 flex flex-col gap-1">
                {discoverItems.map((item) => (
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
            </CollapsibleContent>
          </Collapsible>

          {/* Spaces */}
          <Link href="/spaces">
            <span
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/spaces" ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <Globe className="mr-2 h-4 w-4" />
              Spaces
            </span>
          </Link>

          {/* Jobs */}
          <Link href="/jobs">
            <span
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/jobs" ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Jobs
            </span>
          </Link>
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
