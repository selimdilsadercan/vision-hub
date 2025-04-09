"use client";

import { useAuth } from "@/firebase/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function RootPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  // Show nothing while checking auth status
  return null;
}

export default RootPage;
