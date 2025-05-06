"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "./config";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { db } from "./firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const createSupabaseProfile = async (user: User): Promise<string> => {
    try {
      const { data: existing_profile_id, error: existError } = await supabase.rpc("is_profile_existing", { input_uid: user.uid });
      console.log("Supabase is_profile_existing:", existing_profile_id, existError);
      if (existError) throw existError;
      if (typeof existing_profile_id === "string" && existing_profile_id) {
        return existing_profile_id;
      }

      const { data: profile_id, error } = await supabase.rpc("create_profile", {
        input_name: user.displayName || user.email?.split("@")[0] || "User",
        input_image_url: user.photoURL || undefined,
        input_uid: user.uid
      });
      console.log("Supabase create_profile RPC:", profile_id, error);
      
      if (error) throw error;
      if (!profile_id) throw new Error("Failed to create Supabase profile");

      return profile_id;
    } catch (error) {
      console.error("Error in createSupabaseProfile:", error);
      throw error;
    }
  };

  const createFirestoreUser = async (user: User, profileId: string) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        created_time: new Date().toISOString(),
        display_name: user.displayName || user.email?.split("@")[0] || "User",
        email: user.email,
        photo_url: user.photoURL,
        is_admin: false,
        is_beta: false,
        profile_id: profileId
      });
    } catch (error) {
      console.error("Error creating Firestore user:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
      toast.success("Giriş başarılı");
    } catch (error) {
      toast.error("Giriş yapılırken bir hata oluştu");
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const profileId = await createSupabaseProfile(userCredential.user);
      await createFirestoreUser(userCredential.user, profileId);
      router.push("/home");
      toast.success("Kayıt başarılı");
    } catch (error) {
      toast.error("Kayıt olurken bir hata oluştu");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
      toast.success("Çıkış yapıldı");
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      console.log("Google sign-in user:", userCredential.user);
      const profileId = await createSupabaseProfile(userCredential.user);
      await createFirestoreUser(userCredential.user, profileId);
      router.push("/home");
      toast.success("Google ile giriş başarılı");
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google ile giriş yapılırken bir hata oluştu");
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
