"use client";

import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/firebase/auth-context";
import { getUserData } from "@/firebase/firestore";

interface WebsiteData {
  id: string;
  url: string;
  title: string;
  favicon_url: string;
  image_url: string;
  description: string;
  added_user_id: string;
  added_user_name: string;
  added_user_image_url: string;
  project_ids: string[];
}

function WebsiteDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [websiteData, setWebsiteData] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Fetch user's profile ID from Firestore
  useEffect(() => {
    async function fetchProfileId() {
      if (user?.uid) {
        const userData = await getUserData(user.uid);
        if (userData?.profile_id) {
          setProfileId(userData.profile_id);
        }
      }
    }

    fetchProfileId();
  }, [user]);

  // Fetch website data once we have the profile ID
  useEffect(() => {
    async function fetchWebsiteData() {
      if (!profileId) return;

      try {
        const { data, error } = await supabase.rpc("get_user_website", {
          input_website_id: params.id as string
        });

        if (error) {
          throw error;
        }

        if (data && typeof data === "object") {
          setWebsiteData(data as unknown as WebsiteData);
        }
      } catch (error) {
        toast.error("Failed to load website details");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id && profileId) {
      fetchWebsiteData();
    }
  }, [params.id, profileId]);

  if (loading) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-10 w-32 bg-muted rounded mb-6" />
          <div className="space-y-4">
            <div className="h-[400px] bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!websiteData) {
    return (
      <div className="container max-w-7xl mx-auto p-6">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          Website
        </Button>
        <div className="text-center py-10">
          <p className="text-muted-foreground">Website not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Website
      </Button>

      <Card className="overflow-hidden border bg-card">
        <CardContent className="p-0">
          <div className="relative aspect-video w-full bg-muted">
            <Image src={websiteData.image_url} alt={websiteData.title} className="object-cover" fill priority unoptimized />
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-muted">
                <Image src={websiteData.favicon_url} alt="Website icon" className="object-cover" fill priority />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground">{websiteData.title}</h1>
                <p className="mt-2 text-muted-foreground">{websiteData.description}</p>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full" size="lg" onClick={() => window.open(websiteData.url, "_blank")}>
                Siteye Git
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default WebsiteDetailPage;
