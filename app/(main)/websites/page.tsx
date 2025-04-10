"use client";

import { useEffect, useState } from "react";
import { WebsiteCard } from "@/components/dashboard/WebsiteCard";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

type WebsiteDetails = {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  faviconUrl: string;
};

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isUrlSubmitted, setIsUrlSubmitted] = useState(false);
  const [websiteDetails, setWebsiteDetails] = useState<WebsiteDetails | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc("list_user_websites", {
        input_project_id: ""
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

  const fetchWebsiteDetails = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch("/api/fetch-website-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: websiteUrl })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch website details");
      }

      const data = await response.json();
      setWebsiteDetails({
        url: websiteUrl,
        title: data.title || "No Title",
        description: data.description || "No Description",
        imageUrl: data.image || "",
        faviconUrl: data.favicon || ""
      });
      setIsUrlSubmitted(true);
    } catch (error) {
      console.error("Error fetching website details:", error);
      toast.error("Failed to fetch website details");
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddWebsite = async () => {
    if (!websiteDetails) return;

    try {
      const { error } = await supabase.rpc("add_project_website", {
        input_project_id: "",
        input_url: websiteDetails.url,
        input_title: websiteDetails.title,
        input_description: websiteDetails.description,
        input_image_url: websiteDetails.imageUrl,
        input_favicon_url: websiteDetails.faviconUrl,
        input_added_by: "d8323ace-4e10-4422-8c99-7380286ec0e5"
      });

      if (error) {
        console.error("Error adding website:", error);
        toast.error("Failed to add website");
        return;
      }

      toast.success("Website added successfully");
      setIsAddDialogOpen(false);
      setWebsiteUrl("");
      setWebsiteDetails(null);
      setIsUrlSubmitted(false);
      fetchWebsites();
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleClose = () => {
    setIsAddDialogOpen(false);
    setWebsiteUrl("");
    setWebsiteDetails(null);
    setIsUrlSubmitted(false);
  };

  return (
    <div className="h-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Websites</h2>
        <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Website
        </Button>
      </div>

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

      <Dialog open={isAddDialogOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isUrlSubmitted ? "Edit Website Details" : "Add Website"}</DialogTitle>
            <DialogDescription>
              {isUrlSubmitted ? "Review and edit the website details before adding" : "Enter the website URL to fetch its details"}
            </DialogDescription>
          </DialogHeader>

          {!isUrlSubmitted ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input id="url" placeholder="https://example.com" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
              </div>
              <Button onClick={fetchWebsiteDetails} className="w-full" disabled={isFetching}>
                {isFetching ? "Fetching..." : "Fetch Details"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Card */}
              <div className="p-4 bg-gray-50 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 relative">
                    {websiteDetails?.faviconUrl && (
                      <img src={websiteDetails.faviconUrl} alt={websiteDetails?.title || "Website"} className="w-full h-full object-contain" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 line-clamp-1">{websiteDetails?.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{websiteDetails?.description}</p>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={websiteDetails?.title}
                    onChange={(e) => setWebsiteDetails((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={websiteDetails?.description}
                    onChange={(e) => setWebsiteDetails((prev) => (prev ? { ...prev, description: e.target.value } : null))}
                  />
                </div>
                <Button onClick={handleAddWebsite} className="w-full">
                  Add Website
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
