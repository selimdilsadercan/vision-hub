import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export interface Profile {
  id: string;
  name: string;
  email: string;
  image_url?: string;
}

interface ProfileSelectorProps {
  value: Profile | null;
  onChange: (profile: Profile | null) => void;
}

function ProfileSelector({ value, onChange }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("profile").select("id, name, email, image_url");
      if (!error && data) {
        setProfiles(
          data.map((p) => ({
            id: p.id,
            name: p.name ?? "",
            email: p.email ?? "",
            image_url: p.image_url ?? undefined
          }))
        );
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const filtered = search.trim()
    ? profiles.filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()) || "" || p.email?.toLowerCase().includes(search.toLowerCase()) || "")
    : profiles;

  return (
    <div className="space-y-2">
      <Input placeholder="İsim veya e-posta ile ara..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2" />
      <div className="max-h-56 overflow-y-auto space-y-1">
        {loading ? (
          <div className="text-center py-4">Yükleniyor...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">Kullanıcı bulunamadı</div>
        ) : (
          filtered.map((profile) => (
            <Button
              key={profile.id}
              variant={value?.id === profile.id ? "default" : "outline"}
              className="w-full flex items-center gap-3 justify-start"
              onClick={() => onChange(profile)}
              type="button"
            >
              {profile.image_url ? (
                <Image unoptimized src={profile.image_url} alt={profile.name} width={28} height={28} className="rounded-full" />
              ) : (
                <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                  {profile.name?.[0]?.toUpperCase() || "?"}
                </span>
              )}
              <span className="font-medium">{profile.name}</span>
              <span className="text-xs text-muted-foreground">{profile.email}</span>
            </Button>
          ))
        )}
      </div>
      {value && (
        <div className="text-sm text-muted-foreground mt-2">
          Seçili: {value.name} ({value.email})
        </div>
      )}
    </div>
  );
}

export { ProfileSelector };
