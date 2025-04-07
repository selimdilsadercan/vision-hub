"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Diamond, Laptop2, Building2, HelpCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const routes = [
    {
      label: "Vision Hub",
      icon: Diamond,
      href: "/hub",
      color: "text-violet-500",
      bgColor: "bg-violet-500/10"
    },
    {
      label: "Bireysel",
      icon: Building2,
      href: "/bireysel",
      color: "text-pink-700",
      bgColor: "bg-pink-700/10"
    },
    {
      label: "Remote Tech Work",
      icon: Laptop2,
      href: "/remote",
      color: "text-green-700",
      bgColor: "bg-green-700/10"
    },
    {
      label: "V-CAMP",
      icon: Building2,
      href: "/vcamp",
      color: "text-orange-700",
      bgColor: "bg-orange-700/10"
    },
    {
      label: "Ne Yapalım?",
      icon: HelpCircle,
      href: "/help",
      color: "text-blue-700",
      bgColor: "bg-blue-700/10"
    }
  ];

  if (pathname?.includes("/auth")) {
    return null;
  }

  return (
    <div className="hidden space-y-4 py-4 md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col bg-gray-50">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <div className="relative h-8 w-8 mr-4">
            <Image fill alt="Logo" src="/logo.png" />
          </div>
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
