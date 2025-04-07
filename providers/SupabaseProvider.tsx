"use client";

import { createContext, useContext } from "react";
import { supabase } from "@/lib/supabase";

interface SupabaseContextType {
  supabase: typeof supabase;
}

const SupabaseContext = createContext<SupabaseContextType>({
  supabase
});

export const useSupabase = () => useContext(SupabaseContext);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>;
}
