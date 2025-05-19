"use client";

import { cn } from "@/lib/utils";
import { FolderIcon, Users2Icon, SearchIcon, ClockIcon, CalendarIcon, WalletIcon, Settings, Handshake, FileText, ListTodo } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

interface ProjectSidebarProps {
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  image_url?: string;
}

const routes = [
  {
    label: "Overview",
    icon: FolderIcon,
    href: ""
  },
  {
    label: "Tasks",
    icon: ListTodo,
    href: "/tasks"
  },
  {
    label: "Calendar",
    icon: CalendarIcon,
    href: "/calendar"
  },
  {
    label: "Members",
    icon: Users2Icon,
    href: "/members"
  },
  {
    label: "Meetings",
    icon: Handshake,
    href: "/meetings"
  },
  {
    label: "Research",
    icon: SearchIcon,
    href: "/research"
  }
];

export function ProjectSidebar({ projectId }: ProjectSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("list_projects");
        if (error) throw error;
        setProjects(data);
      } catch (e) {
        toast.error("Failed to load projects");
        setProjects([
          { id: "1", name: "Acme Inc", image_url: "" },
          { id: "2", name: "Acme Corp.", image_url: "" },
          { id: "3", name: "Evil Corp.", image_url: "" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const currentProject = projects.find((p) => p.id === projectId);

  const handleSelect = (id: string) => {
    setPopoverOpen(false);
    if (id !== projectId) {
      router.push(`/dashboard/${id}`);
    }
  };

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

      {/* Project Switcher */}
      <div className="mb-4 px-2">
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
          <PopoverTrigger asChild>
            <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 bg-accent hover:bg-accent/80 transition text-left">
              {currentProject?.image_url ? (
                <Image src={currentProject.image_url} alt={currentProject.name} width={28} height={28} className="rounded-full" />
              ) : (
                <FolderIcon className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="flex-1 truncate font-medium">{currentProject?.name || "Select Project"}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0">
            <div className="py-2">
              {loading ? (
                <div className="text-center py-2 text-muted-foreground text-sm">Loading...</div>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-accent/50 transition text-left ${
                      project.id === projectId ? "bg-accent" : ""
                    }`}
                    onClick={() => handleSelect(project.id)}
                  >
                    {project.image_url ? (
                      <Image src={project.image_url} alt={project.name} width={24} height={24} className="rounded-full" />
                    ) : (
                      <FolderIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="truncate">{project.name}</span>
                  </button>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-1 flex-col">
        {/* Main Navigation */}
        <div className="flex flex-col gap-1">
          {routes.map((route) => (
            <Link key={route.href} href={`/dashboard/${projectId}${route.href}`}>
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === `/dashboard/${projectId}${route.href}` ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Settings Button */}
        <div className="mt-auto pt-4 border-t">
          <Link href={`/dashboard/${projectId}/settings`}>
            <span
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === `/dashboard/${projectId}/settings` ? "bg-accent text-accent-foreground" : "transparent"
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
