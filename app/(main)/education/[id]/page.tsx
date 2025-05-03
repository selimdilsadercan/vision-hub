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

interface EducationPlan {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  is_active: boolean;
  mentor_name: string | null;
  mentor_role: string | null;
  mentor_bio: string | null;
  mentor_contact: string | null;
  problem_definition: string | null;
  purpose: string | null;
  general_structure: string | null;
  target_audience: string[] | null;
  example_usage: string | null;
  development_roadmap: string[] | null;
  long_term_vision: string[] | null;
  enrolled_students: number | null;
  level: string | null;
  certificate: boolean | null;
  updated_at: string;
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

export default function EducationPlanPage() {
  const params = useParams();
  const [plan, setPlan] = useState<EducationPlan | null>(null);
  const [nodes, setNodes] = useState<EducationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

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
      if (nodesData) {
        setNodes(nodesData.map((node) => ({ ...node, completed: false })) as unknown as EducationNode[]);
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
      toast.error("Failed to load plan details");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, supabase]);

  useEffect(() => {
    if (params.id) {
      fetchPlanAndNodes();
    }
  }, [params.id, fetchPlanAndNodes]);

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
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">Mentor: {plan.mentor_name}</span>
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
                    <p className="text-muted-foreground">
                      This project aims to address the challenges faced by entrepreneurs in managing finances and project workflows effectively.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Purpose</h3>
                    <p className="text-muted-foreground">
                      To provide comprehensive training in financial management and project execution strategies for startup founders and business owners.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Target Audience</h3>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Startup Founders</li>
                      <li>Small Business Owners</li>
                      <li>Project Managers</li>
                      <li>Business Students</li>
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
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Dr. Ahmet Yılmaz</h3>
                      <p className="text-muted-foreground">Financial Management Expert</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      15+ years of experience in financial management and business strategy. Former CFO at major corporations and startup advisor.
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Contact
                    </Button>
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
                  <p className="text-2xl font-bold">247</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-2xl font-bold">12 Weeks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Level</p>
                  <p className="text-2xl font-bold">Intermediate</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-muted-foreground">March 15, 2024</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Enroll Now</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
