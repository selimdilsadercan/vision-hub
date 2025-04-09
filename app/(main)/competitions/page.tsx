"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { CompetitionCard } from "@/components/CompetitionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface Competition {
  id: string;
  name: string;
  organizator: string;
  start_date: string;
  end_date: string;
  location: string;
  image_url: string;
  visible_date_range: string;
  description: string;
  apply_date: string;
  link: string;
}

export default function CompetitionsPage() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const { data, error } = await supabase.rpc("list_competitions");
        if (error) throw error;
        setCompetitions(data);
      } catch (error) {
        toast.error("Yarışmalar yüklenirken bir hata oluştu");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCompetitions();
  }, []);

  const filteredCompetitions = competitions.filter(
    (competition) =>
      competition.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      competition.organizator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (competition.location && competition.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container py-6 space-y-6 px-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Yarışmaları Keşfet</h1>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Bir Yarışma Arayın" className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filteredCompetitions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "Aradığınız kriterlere uygun yarışma bulunamadı" : "Henüz hiç yarışma eklenmemiş"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompetitions.map((competition) => (
            <CompetitionCard key={competition.id} {...competition} />
          ))}
        </div>
      )}
    </div>
  );
}
