"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users2, FolderIcon, CheckCircle2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useAuth } from "@/firebase/auth-context";
import { getUserData, type FirestoreUser } from "@/firebase/firestore";

interface ProjectDetail {
  id: string;
  name: string;
  created_at: string;
  members_count: number;
  tasks_count: number;
  meetings_count: number;
  role: string;
  description?: string;
  tech_stack?: string[];
  progress?: number;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
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

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!userData) return;

      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_project", {
          input_project_id: projectId
        });

        if (error) {
          throw error;
        }

        if (data) {
          // Mock data for tech stack and progress if not available from API
          const projectData = data as unknown as ProjectDetail;
          projectData.tech_stack = projectData.tech_stack || ["React", "TypeScript", "TailwindCSS", "Supabase"];
          projectData.progress = projectData.progress || 65;
          projectData.description = projectData.description || "A collaborative project for managing tasks and team communication.";
          setProject(projectData);
        }
      } catch (error) {
        console.error("Error fetching project details:", error);
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, userData]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Not Found</CardTitle>
            <CardDescription>The project you're looking for doesn't exist or you don't have access to it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects">
              <Button>Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">Created on {new Date(project.created_at).toLocaleDateString()}</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {project.role}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderIcon className="h-5 w-5" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
            <div>
              <h3 className="font-medium mb-1">Members</h3>
              <div className="flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                <span>{project.members_count} team members</span>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">Progress</h3>
              <div className="flex items-center gap-2">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-sm">{project.progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Tech Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack?.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Back Button */}
      <div className="flex justify-start">
        <Link href="/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    </div>
  );
}
