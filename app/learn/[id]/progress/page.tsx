"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Link2 } from "lucide-react";
import { Database } from "@/lib/supabase-types";
import { getUserData } from "@/firebase/firestore";
import { useAuth } from "@/firebase/auth-context";

interface EducationNode {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number | null;
  education_plan_id: string;
  index: number;
  instructions: string | null;
  is_active: boolean;
  micro_skills: string[] | null;
  skills: string[] | null;
  source: string | null;
  completed: boolean;
}

export default function LearnProgressPage() {
  const params = useParams<any>();
  const [nodes, setNodes] = useState<EducationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();
  const { user } = useAuth();

  const fetchUserCompletedNodeIds = useCallback(
    async (profileId: string, planId: string) => {
      const { data, error } = await supabase.rpc("get_user_education_plan_progress", {
        input_education_plan_id: planId,
        input_profile_id: profileId
      });
      if (error) {
        toast.error("Failed to fetch user progress");
        return [];
      }
      return data as string[];
    },
    [supabase]
  );

  const fetchNodes = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: nodesData, error: nodesError } = await supabase.rpc("list_education_nodes", {
        input_education_plan_id: params.id as string
      });
      if (nodesError) throw nodesError;
      let completedNodeIds: string[] = [];
      if (user) {
        const firestoreUser = await getUserData(user.uid);
        if (firestoreUser?.profile_id) {
          completedNodeIds = await fetchUserCompletedNodeIds(firestoreUser.profile_id, params.id as string);
        }
      }
      if (nodesData) {
        setNodes(
          nodesData.map((node: any) => ({
            ...node,
            completed: completedNodeIds.includes(node.id)
          })) as EducationNode[]
        );
      }
    } catch (error) {
      toast.error("Failed to load nodes");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, supabase, user, fetchUserCompletedNodeIds]);

  useEffect(() => {
    if (params.id) fetchNodes();
  }, [params.id, fetchNodes]);

  const completedNodes = nodes.filter((node) => node.completed).length;
  const progress = nodes.length > 0 ? (completedNodes / nodes.length) * 100 : 0;

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-2">
        <Progress value={progress} className="w-[200px]" />
        <span className="text-sm text-muted-foreground">
          {completedNodes}/{nodes.length} nodes completed
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted hidden md:block"></div>
        {nodes.map((node) => (
          <div key={node.id} className="relative pl-0 md:pl-10 mb-6">
            <div className="absolute left-4 top-4 w-3 h-3 rounded-full bg-primary hidden md:block"></div>
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {node.completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-muted-foreground" />}
                    {node.name}
                  </CardTitle>
                  {node.skills && node.skills.length > 0 && (
                    <Badge variant="secondary" className="w-fit">
                      {node.skills[0]}
                    </Badge>
                  )}
                </div>
                {node.source && (
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Link2 className="w-4 h-4" />
                    {node.source}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                {node.description && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Description</h4>
                    <p className="text-muted-foreground text-sm">{node.description}</p>
                  </div>
                )}
                {node.micro_skills && node.micro_skills.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Micro Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {node.micro_skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {node.instructions && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Instructions</h4>
                    <p className="text-muted-foreground text-sm">{node.instructions}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
