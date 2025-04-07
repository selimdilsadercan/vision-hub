"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Search, Plus, Building2, UserCircle } from "lucide-react";

export function MobileNavbar() {
  const pathname = usePathname();

  const routes = [
    {
      href: "/",
      icon: Home,
      label: "Ana Sayfa"
    },
    {
      href: "/search",
      icon: Search,
      label: "Keşfet"
    },
    {
      href: "/new",
      icon: Plus,
      label: "Yeni"
    },
    {
      href: "/projects",
      icon: Building2,
      label: "Projeler"
    },
    {
      href: "/profile",
      icon: UserCircle,
      label: "Profil"
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
            <route.icon className={`h-6 w-6 ${pathname === route.href ? "text-blue-700" : "text-muted-foreground"}`} />
            <span className={`text-xs ${pathname === route.href ? "text-blue-700 font-medium" : "text-muted-foreground"}`}>{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
