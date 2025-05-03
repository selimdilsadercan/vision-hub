"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle, Link2, Mail, MessageSquare, User, Users, Clock, Calendar, Award } from "lucide-react";
import { Database } from "@/lib/supabase-types";
import { getUserData } from "@/firebase/firestore";
import { useAuth } from "@/firebase/auth-context";

interface EducationPlan {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  is_active: boolean;
  mentor: {
    id: string;
    name: string;
    image_url: string | null;
  } | null;
  problem_definition?: string | null;
  purpose?: string | null;
  general_structure?: string | null;
  target_audience?: string[] | null;
  example_usage?: string | null;
  development_roadmap?: string[] | null;
  long_term_vision?: string[] | null;
  enrolled_students?: number | null;
  level?: string | null;
  certificate?: boolean | null;
  updated_at?: string;
}

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

export default function LearnPlanPage() {
  const params = useParams<any>();
  const [plan, setPlan] = useState<EducationPlan | null>(null);
  const [nodes, setNodes] = useState<EducationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const { user } = useAuth();

  // Fetch user's completed node ids for this plan
  const fetchUserCompletedNodeIds = useCallback(
    async (profileId: string, planId: string) => {
      // Use the correct RPC for user node progress
      const { data, error } = await supabase.rpc("get_user_education_plan_progress", {
        input_education_plan_id: planId,
        input_profile_id: profileId
      });
      if (error) {
        toast.error("Failed to fetch user progress");
        return [];
      }
      // Assume data is an array of node ids
      return data as string[];
    },
    [supabase]
  );

  const fetchPlanAndNodes = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch plan details
      const { data: planData, error: planError } = await supabase.rpc("get_education_plan", {
        input_education_plan_id: params.id as string
      });

      if (planError) throw planError;
      if (planData) {
        setPlan(planData as unknown as EducationPlan);
      }

      // Fetch nodes
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
      console.error("Error fetching plan details:", error);
      toast.error("Failed to load plan details");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, supabase, user, fetchUserCompletedNodeIds]);

  useEffect(() => {
    if (params.id) {
      fetchPlanAndNodes();
    }
  }, [params.id, fetchPlanAndNodes]);

  const handleEnroll = async () => {
    setEnrollLoading(true);
    try {
      if (!user) {
        toast.error("User not found");
        setEnrollLoading(false);
        return;
      }
      const firestoreUser = await getUserData(user.uid);
      if (!firestoreUser?.profile_id) {
        toast.error("User profile not found");
        setEnrollLoading(false);
        return;
      }
      if (!plan) {
        toast.error("Plan not loaded");
        setEnrollLoading(false);
        return;
      }
      const { error } = await supabase.rpc("enroll_in_education_plan", {
        input_education_plan_id: plan.id,
        input_profile_id: firestoreUser.profile_id
      });
      if (error) {
        toast.error("Enrollment failed");
      } else {
        toast.success("Enrolled successfully!");
      }
    } catch (err) {
      toast.error("Enrollment failed");
    } finally {
      setEnrollLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Education plan not found</h1>
          <p className="text-muted-foreground mt-2">The education plan you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const completedNodes = nodes.filter((node) => node.completed).length;
  const progress = nodes.length > 0 ? (completedNodes / nodes.length) * 100 : 0;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width on large screens */}
        <div className="lg:col-span-2 space-y-10">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold">{plan.name}</h1>
              <div className="flex items-center gap-2">
                {plan.mentor?.image_url ? (
                  <img src={plan.mentor.image_url} alt="Mentor" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-muted-foreground">Mentor: {plan.mentor?.name || "Not specified"}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg">{plan.description}</p>
            <div className="flex items-center gap-4 p-2">
              <Progress value={progress} className="w-[200px]" />
              <span className="text-sm text-muted-foreground">
                {completedNodes}/{nodes.length} nodes completed
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Main Content */}
          <Tabs defaultValue="nodes" className="space-y-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="nodes" className="px-6 py-2">
                Learning Nodes
              </TabsTrigger>
              <TabsTrigger value="project" className="px-6 py-2">
                Project Details
              </TabsTrigger>
              <TabsTrigger value="mentor" className="px-6 py-2">
                Mentor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nodes" className="space-y-6 pt-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted hidden md:block"></div>

                {nodes.map((node) => (
                  <div key={node.id} className="relative pl-0 md:pl-10 mb-6">
                    {/* Timeline dot */}
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
            </TabsContent>

            <TabsContent value="project" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Problem Definition</h3>
                    <p className="text-muted-foreground">{plan.problem_definition || "No problem definition provided."}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Purpose</h3>
                    <p className="text-muted-foreground">{plan.purpose || "No purpose provided."}</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Target Audience</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {plan.target_audience?.length ? plan.target_audience.map((aud, i) => <li key={i}>{aud}</li>) : <li>No audience specified.</li>}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentor" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mentor Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {plan.mentor?.image_url ? (
                        <img src={plan.mentor.image_url} alt="Mentor" className="w-16 h-16 object-cover rounded-full" />
                      ) : (
                        <User className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{plan.mentor?.name || "Not specified"}</h3>
                    </div>
                  </div>
                  <div className="space-y-2">{/* No mentor bio in new structure; add if available in plan.mentor */}</div>
                  <div className="flex items-center gap-4">
                    {/* No mentor contact in new structure; add if available in plan.mentor */}
                    <Button variant="outline" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - 1/3 width on large screens */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Enrolled Students</p>
                  <p className="text-2xl font-bold">{plan.enrolled_students ?? 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-2xl font-bold">{plan.duration ?? "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Level</p>
                  <p className="text-2xl font-bold">{plan.level ?? "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">{plan.updated_at ? new Date(plan.updated_at).toLocaleDateString() : "-"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleEnroll} disabled={enrollLoading}>
                {enrollLoading ? "Enrolling..." : "Enroll Now"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
