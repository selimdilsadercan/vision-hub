"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "./Loading";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const storeUser = useMutation(api.users.store);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || isCreatingUser) return;

    const createUser = async () => {
      try {
        setIsCreatingUser(true);
        await storeUser({
          name: user.fullName ?? "",
          email: user.primaryEmailAddress?.emailAddress ?? "",
          image: user.imageUrl,
          clerkId: user.id
        });
      } catch (error) {
        console.error("Failed to create user:", error);
        toast.error("Failed to create user profile");
      } finally {
        setIsCreatingUser(false);
      }
    };

    createUser();
  }, [isLoaded, user, storeUser, isCreatingUser]);

  if (!isLoaded || isCreatingUser) {
    return <Loading />;
  }

  return <>{children}</>;
}
