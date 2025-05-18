"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";
import { useAuth } from "@/firebase/auth-context";

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 4) return digits;
  if (digits.length <= 7) return digits.slice(0, 4) + " " + digits.slice(4);
  if (digits.length <= 9) return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7);
  return digits.slice(0, 4) + " " + digits.slice(4, 7) + " " + digits.slice(7, 9) + " " + digits.slice(9, 11);
}

export default function ProfileEditPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    github_url: ""
  });
  const [profileId, setProfileId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_profile_by_uid", { input_uid: user.uid });
        if (error) throw error;
        if (data && data.length > 0) {
          const profile = data[0];
          setProfileId(profile.id);
          setForm({
            name: profile.name ?? "",
            email: profile.email ?? "",
            phone_number: profile.phone_number ?? "",
            github_url: profile.github_url ?? ""
          });
        }
      } catch (e) {
        toast.error("Profil verileri alınamadı");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileId) return;
    try {
      setLoading(true);
      const { error } = await supabase.rpc("update_profile", {
        profile_id: profileId,
        input_name: form.name,
        input_email: form.email,
        input_phone_number: form.phone_number,
        input_github_url: form.github_url
      });
      if (error) throw error;
      toast.success("Profil başarıyla güncellendi");
      router.push("/profile");
    } catch (e) {
      toast.error("Profil güncellenemedi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted py-8">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Profili Düzenle</h1>
        <div className="bg-white rounded-lg border shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input id="name" value={form.name} onChange={(e) => handleChange("name", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon Numarası</Label>
              <Input
                id="phone"
                value={form.phone_number}
                onChange={(e) => handleChange("phone_number", formatPhoneNumber(e.target.value))}
                maxLength={14}
                placeholder="0555 555 55 55"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                value={form.github_url}
                onChange={(e) => handleChange("github_url", e.target.value)}
                placeholder="https://github.com/kullanici"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => router.push("/profile")}>
                İptal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
