"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, FolderIcon } from "lucide-react";
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
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
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
      const { error } = await supabase.rpc("create_project", {
        input_project_name: newProjectName.trim(),
        input_profile_id: userData.profile_id
      });

      if (error) {
        throw error;
      }

      toast.success("Project created successfully");
      setIsCreateDialogOpen(false);
      setNewProjectName("");
      // Refetch projects
      const { data, error: fetchError } = await supabase.rpc("list_projects", {
        input_profile_id: userData.profile_id
      });

      if (fetchError) {
        throw fetchError;
      }

      setProjects(data);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project");
    }
  };

  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Project
        </Button>
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
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderIcon className="h-5 w-5" />
                    {project.name}
                  </CardTitle>
                  <CardDescription>{project.is_admin ? "Admin" : "Member"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-32 rounded-md bg-muted flex items-center justify-center">
                    {project.image_url ? (
                      <Image width={128} height={128} src={project.image_url} alt={project.name} className="h-full w-full object-cover rounded-md" />
                    ) : (
                      <FolderIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>Enter a name for your new project</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Project name" value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
