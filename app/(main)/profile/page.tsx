"use client";

import { useState, useEffect } from "react";
import { TabButton } from "@/components/TabButton";
import { ProjectCard } from "@/components/ProjectCard";
import { VideoCard } from "@/components/VideoCard";
import { EventCard } from "@/components/EventCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { LogOut, Pencil } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import Link from "next/link";

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
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const firestoreUser = await getUserData(user.uid);
      setUserData(firestoreUser);
    };

    fetchUserData();
  }, [user]);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
              {userData?.photo_url ? (
                <Image src={userData.photo_url} alt={userData.display_name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-500">{userData?.display_name?.[0] || userData?.email?.[0] || "U"}</span>
                </div>
              )}
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold">{userData?.display_name || "Kullanıcı"}</h2>
              <p className="text-muted-foreground">
                {userData?.department} {userData?.grade}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link href="/profile/edit">
                  <Button variant="outline" size="sm" className="ml-1" aria-label="Profili Düzenle">
                    <Pencil className="w-4 h-4 mr-2" />
                    Profili Düzenle
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">✨ Hakkımda</h3>
            <p className="text-sm text-muted-foreground">
              Etkinler ve etkinliklerle sürekli olarak kendini geliştiren, özellikle mobil uygulama ve girişimcilik konularında ilgili bir{" "}
              {userData?.department} öğrencisiyim.
            </p>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">📧 İletişim Bilgileri</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" />
                <span className="text-sm">Email: {userData?.email}</span>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center gap-2">🔑 Hesap Bilgileri</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" />
                <span className="text-sm">Oluşturulma Tarihi: {new Date(userData?.created_time || "").toLocaleDateString("tr-TR")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" />
                <span className="text-sm">Beta Kullanıcısı: {userData?.is_beta ? "Evet" : "Hayır"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" />
                <span className="text-sm">Admin: {userData?.is_admin ? "Evet" : "Hayır"}</span>
              </div>
            </div>
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
                <SkillItem key={exp.name} {...exp} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
