"use client";

import { useState, useEffect, Suspense } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { EventCard } from "@/components/EventCard";
import { VideoCard } from "@/components/VideoCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  field_name: string;
  user_name: string;
  user_image_url: string;
}

interface Event {
  id: string;
  name: string;
  image_url: string;
  location: string;
  organizator: string;
  start_date: string;
  end_date: string;
  description: string;
  visible_date_range: string;
  time_group: string;
  owner_name: string;
  owner_image_url: string;
  is_approved: boolean;
}

interface Video {
  id: string;
  video_id: string;
  title: string;
  channel_title: string;
  thumbnail_url: string;
  added_at: string;
  owner_name: string;
  owner_image_url: string;
  is_approved: boolean;
}

type Tab = "projects" | "events" | "education";

export default function SpacesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase.rpc("list_user_projects");
        if (error) throw error;
        setProjects(data);
      } catch (error) {
        toast.error("Projeler yüklenirken bir hata oluştu");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchEvents() {
      try {
        const { data, error } = await supabase.rpc("list_user_events");
        if (error) throw error;
        setEvents(data);
      } catch (error) {
        toast.error("Etkinlikler yüklenirken bir hata oluştu");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchVideos() {
      try {
        const { data, error } = await supabase.rpc("list_user_videos");
        if (error) throw error;
        setVideos(data);
      } catch (error) {
        toast.error("Videolar yüklenirken bir hata oluştu");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    setIsLoading(true);
    if (activeTab === "projects") {
      fetchProjects();
    } else if (activeTab === "events") {
      fetchEvents();
    } else if (activeTab === "education") {
      fetchVideos();
    }
  }, [activeTab]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="h-full p-4 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">HUB</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("projects")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeTab === "projects" ? "bg-blue-600 text-white" : "text-gray-500"}`}
              >
                🔔 Çalışmalar
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeTab === "events" ? "bg-blue-600 text-white" : "text-gray-500"}`}
              >
                🎯 Etkinlik
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${activeTab === "education" ? "bg-blue-600 text-white" : "text-gray-500"}`}
              >
                📚 Eğitim İçerikleri
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : activeTab === "projects" ? (
            projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Henüz hiç proje eklenmemiş</div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} {...project} variant="spaces" />
                ))}
              </div>
            )
          ) : activeTab === "events" ? (
            events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Henüz hiç etkinlik eklenmemiş</div>
            ) : (
              <div className="grid gap-4">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    name={event.name}
                    organizator={event.organizator}
                    location={event.location}
                    start_date={event.start_date}
                    end_date={event.end_date}
                    description={event.description}
                    id={event.id}
                    visible_date_range={event.visible_date_range}
                    image_url={event.image_url}
                    variant="spaces"
                  />
                ))}
              </div>
            )
          ) : activeTab === "education" ? (
            videos.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Henüz hiç video eklenmemiş</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    title={video.title}
                    channel_title={video.channel_title}
                    thumbnail_url={video.thumbnail_url}
                    owner_name={video.owner_name}
                    owner_image_url={video.owner_image_url}
                    added_at={video.added_at}
                    variant="spaces"
                  />
                ))}
              </div>
            )
          ) : null}
        </div>
      </div>
    </Suspense>
  );
}
