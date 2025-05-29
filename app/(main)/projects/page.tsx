"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, FolderIcon, Pencil } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";
import Image from "next/image";

interface Project {
  id: string;
  name: string;
  image_url: string;
  is_admin: boolean;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [userData, setUserData] = useState<FirestoreUser | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { user } = useAuth();
  const [supabaseIsAdmin, setSupabaseIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      const firestoreUser = await getUserData(user.uid);
      setUserData(firestoreUser);
      // Fetch Supabase profile is_admin
      const { data, error } = await supabase.from("profile").select("is_admin").eq("uid", user.uid).single();
      if (data) setSupabaseIsAdmin(!!data.is_admin);
    };

    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userData) return;

      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("list_projects");

        if (error) {
          throw error;
        }

        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [userData]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    if (!userData) {
      toast.error("User data not available");
      return;
    }

    try {
      if (editingProject) {
        // Update existing project
        const { error } = await supabase.rpc("update_project", {
          input_project_id: editingProject.id,
          input_project_name: newProjectName.trim(),
          input_description: newProjectDescription.trim()
        });

        if (error) {
          throw error;
        }

        toast.success("Project updated successfully");
      } else {
        // Create new project
        const { error } = await supabase.rpc("create_project", {
          input_project_name: newProjectName.trim(),
          input_description: newProjectDescription.trim(),
          input_profile_id: userData.profile_id
        });

        if (error) {
          throw error;
        }

        toast.success("Project created successfully");
      }

      setIsCreateDialogOpen(false);
      setNewProjectName("");
      setNewProjectDescription("");
      setEditingProject(null);

      // Refetch projects
      const { data, error: fetchError } = await supabase.rpc("list_projects");

      if (fetchError) {
        throw fetchError;
      }

      setProjects(data);
    } catch (error) {
      console.error("Error creating/updating project:", error);
      toast.error(editingProject ? "Failed to update project" : "Failed to create project");
    }
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project page
    e.stopPropagation(); // Prevent event bubbling
    setEditingProject(project);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description || "");
    setIsCreateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingProject(null);
    setNewProjectName("");
    setNewProjectDescription("");
  };

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const isAdmin = userData?.is_admin || supabaseIsAdmin;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        {isAdmin && (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer relative group overflow-hidden">
                <div className="h-32 w-full bg-muted flex items-center justify-center">
                  <FolderIcon className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {project.image_url ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-muted">
                        <Image width={32} height={32} src={project.image_url} alt={`${project.name} logo`} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center">
                        <FolderIcon className="h-5 w-5" />
                      </div>
                    )}
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    {project.description ? <span className="line-clamp-2">{project.description}</span> : <span>{project.is_admin ? "Admin" : "Member"}</span>}
                  </CardDescription>
                </CardHeader>
                {isAdmin && project.is_admin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleEditProject(project, e)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
            <DialogDescription>{editingProject ? "Update your project details" : "Enter a name for your new project"}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input id="project-name" placeholder="Project name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Project Description
              </label>
              <Input
                id="project-description"
                placeholder="Brief description of your project"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>{editingProject ? "Update Project" : "Create Project"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
