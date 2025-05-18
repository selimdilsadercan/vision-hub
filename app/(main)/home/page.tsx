"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import { WorkspaceSidebar } from "@/components/WorkspaceSidebar";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const firestoreUser = await getUserData(user.uid);
      setUserData(firestoreUser);
    };

    fetchUserData();
  }, [user]);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-[300px] md:flex-col md:fixed md:left-[260px] md:inset-y-0 z-[70]">
        <WorkspaceSidebar />
      </div>
      <div className="md:pl-[560px] p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">HUB</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{/* Add your main content here */}</div>
      </div>
    </div>
  );
}
