"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProjectCard } from "@/components/ProjectCard";

const mockProjects = [
  {
    id: "1",
    title: "Vision Hub Project",
    type: "hub",
    views: 3,
    icon: "🔶",
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: "2",
    title: "Bireysel Proje",
    type: "bireysel",
    views: 47,
    icon: "🏢",
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: "3",
    title: "Remote Tech Work",
    type: "remote",
    views: 31,
    icon: "💻",
    is_archived: false,
    created_at: new Date().toISOString()
  },
  {
    id: "4",
    title: "V-CAMP Project",
    type: "vcamp",
    views: 0,
    icon: "🏢",
    is_archived: false,
    created_at: new Date().toISOString()
  }
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page after a short delay
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projeler</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
