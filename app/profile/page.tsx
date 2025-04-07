"use client";

import { useState, useEffect } from "react";
import { TabButton } from "@/components/TabButton";
import { ProjectCard } from "@/components/ProjectCard";
import { VideoCard } from "@/components/VideoCard";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

const tabs = ["Genel", "Portfolyo", "Eğitim", "Etkinlik"];

const softSkills = [
  { name: "Proje Yönetimi", rating: "4/5" },
  { name: "Zaman Yönetimi", rating: "3/5" },
  { name: "Fikir Geliştirme", rating: "5/5" },
  { name: "Aktif Araştırma", rating: "5/5" },
  { name: "Kriz Yönetimi", rating: "3/5" }
];

const technicalSkills = [
  { name: "Web - Uygulama Geliştirme", rating: "4/5" },
  { name: "Proje Sunumu", rating: "3/5" },
  { name: "UI Tasarım", rating: "5/5" },
  { name: "Programlama", rating: "5/5" }
];

const experience = [{ name: "İTÜ V-CAMP - Yazılım Ekip Lideri" }, { name: "Remote Tech Work - Full Stack Developer" }];

function SkillItem({ name, rating }: { name: string; rating?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full border border-gray-300" />
      <span className="text-sm">{name}</span>
      {rating && <span className="text-sm text-muted-foreground ml-1">({rating})</span>}
    </div>
  );
}

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  field_name: string;
  user_name: string;
  user_image_url: string;
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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Genel");
  const [projects, setProjects] = useState<Project[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      if (activeTab === "Portfolyo") {
        setIsLoading(true);
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
    }

    async function fetchVideos() {
      if (activeTab === "Eğitim") {
        setIsLoading(true);
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
    }

    async function fetchEvents() {
      if (activeTab === "Etkinlik") {
        setIsLoading(true);
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
    }

    if (activeTab === "Portfolyo") {
      fetchProjects();
    } else if (activeTab === "Eğitim") {
      fetchVideos();
    } else if (activeTab === "Etkinlik") {
      fetchEvents();
    }
  }, [activeTab]);

  return (
    <div className="h-full p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">HUB</h1>
        <div className="bg-orange-100 px-3 py-1 rounded-full">
          <span className="text-orange-500 font-medium">624</span>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
              {/* Placeholder for profile image */}
              <div className="absolute inset-0 bg-gray-200" />
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold">Selim Dilşad Ercan</h2>
              <p className="text-muted-foreground">İTÜ Bilgisayar Mühendisliği 3. Sınıf</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <TabButton key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "Genel" && (
            <div className="space-y-6">
              {/* About Me */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">✨ Hakkımda</h3>
                <p className="text-sm text-muted-foreground">
                  Etkinler ve etkinliklerle sürekli olarak kendini geliştiren, özellikle mobil uygulama ve girişimcilik konularında ilgili bir İstanbul Teknik
                  Üniversitesi bilgisayar mühendisliği öğrencisiyim.
                </p>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">⭐ Soft Skills</h3>
                <div className="space-y-2">
                  {softSkills.map((skill) => (
                    <SkillItem key={skill.name} {...skill} />
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">⭐ Teknik Yetenekler</h3>
                <div className="space-y-2">
                  {technicalSkills.map((skill) => (
                    <SkillItem key={skill.name} {...skill} />
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium flex items-center gap-2">💼 Deneyim</h3>
                <div className="space-y-2">
                  {experience.map((exp) => (
                    <SkillItem key={exp.name} name={exp.name} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "Portfolyo" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Henüz hiç proje eklenmemiş</div>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} {...project} variant="profile" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "Eğitim" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : videos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Henüz hiç video eklenmemiş</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <VideoCard key={video.id} {...video} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "Etkinlik" && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              ) : events.length === 0 ? (
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
                      owner_name={event.owner_name}
                      owner_image_url={event.owner_image_url}
                      variant="profile"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
