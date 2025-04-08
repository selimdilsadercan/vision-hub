"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { WebsiteCard } from "@/components/projects/WebsiteCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";

type Website = {
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
};

export default function ResearchPage() {
  const params = useParams();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("list_user_websites", {
          input_project_id: params.id as string
        });

        if (error) {
          console.error("Error fetching websites:", error);
          toast.error("Failed to fetch websites");
        } else {
          setWebsites(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
  }, [params.id]);

  return (
    <div className="h-full p-4 space-y-4">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : websites.length > 0 ? (
        <div className="space-y-3">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No websites found</p>
        </div>
      )}
    </div>
  );
}
