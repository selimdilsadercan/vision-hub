import { supabase } from "./supabase";

export interface Project {
  id: string;
  title: string;
  description?: string;
  icon: string;
  type: string;
  views: number;
  is_archived: boolean;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  created_at: string;
}

export async function getProjects(type?: string) {
  let query = supabase.from("projects").select("*").eq("is_archived", false).order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Project[];
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "views">) {
  const { data, error } = await supabase
    .from("projects")
    .insert([{ ...project, views: 0 }])
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function incrementViews(projectId: string) {
  const { data: project, error: fetchError } = await supabase.from("projects").select("views").eq("id", projectId).single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from("projects")
    .update({ views: (project.views || 0) + 1 })
    .eq("id", projectId)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function getCurrentUser() {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("users").select("*").eq("id", user.id).single();

  if (error) throw error;
  return data as User;
}

export async function createUser(userData: Omit<User, "id" | "created_at">) {
  const { data, error } = await supabase.from("users").insert([userData]).select().single();

  if (error) throw error;
  return data as User;
}
