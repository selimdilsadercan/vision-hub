"use client";

import { Rocket, GraduationCap, Trophy, Lightbulb, Globe } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: "projects",
    title: "Projeler",
    description: "Katılabileceğin Etkinlikleri Keşfet",
    icon: <Rocket className="w-6 h-6" />,
    href: "/projects"
  },
  {
    id: "education",
    title: "Eğitim Programları",
    description: "Katılabileceğin Etkinlikleri Keşfet",
    icon: <GraduationCap className="w-6 h-6" />,
    href: "/education"
  },
  {
    id: "competitions",
    title: "Yarışmalar",
    description: "Katılabileceğin Etkinlikleri Keşfet",
    icon: <Trophy className="w-6 h-6" />,
    href: "/competitions"
  },
  {
    id: "activities",
    title: "Etkinlikler",
    description: "Katılabileceğin Etkinlikleri Keşfet",
    icon: <Lightbulb className="w-6 h-6" />,
    href: "/activities"
  },
  {
    id: "websites",
    title: "Websiteler",
    description: "Katılabileceğin Etkinlikleri Keşfet",
    icon: <Globe className="w-6 h-6" />,
    href: "/websites"
  }
];

export default function DiscoverPage() {
  return (
    <div className="h-full p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">HUB</h1>
        <div className="bg-orange-100 px-3 py-1 rounded-full">
          <span className="text-orange-500 font-medium">624</span>
        </div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <Link key={section.id} href={section.href}>
            <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
