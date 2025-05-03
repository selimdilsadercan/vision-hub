"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, User, Users, Clock, ArrowUpRightFromSquare, ArrowLeft } from "lucide-react";
import { Database } from "@/lib/supabase-types";
import { getUserData } from "@/firebase/firestore";
import { useAuth } from "@/firebase/auth-context";
import { NodeCard } from "@/components/NodeCard";

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
  is_enrolled?: boolean;
  enrolled_users?: {
    id: string;
    name: string;
    image_url: string | null;
  }[];
}

interface EducationNode {
  id: string;
  education_plan_id: string;
  name: string;
  description: string;
  sources: string[];
  instructions: string;
  duration: string;
  index: number;
  is_active: boolean;
}

export default function EducationPlanPage() {
  const params = useParams<any>();
  const [plan, setPlan] = useState<EducationPlan | null>(null);
  const [nodes, setNodes] = useState<EducationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const supabase = createClientComponentClient<Database>();
  const { user } = useAuth();
  const router = useRouter();

  const fetchPlanAndNodes = useCallback(async () => {
    try {
      setIsLoading(true);
      let profile_id: string | undefined = undefined;
      if (user) {
        const firestoreUser = await getUserData(user.uid);
        profile_id = firestoreUser?.profile_id;
      }
      // Fetch plan details
      const { data: planData, error: planError } = await supabase.rpc("get_education_plan", {
        input_education_plan_id: params.id as string,
        input_profile_id: profile_id
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
  }, [params.id, supabase, user]);

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

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          {/* Header Section */}
          <div className="space-y-4 mb-4">
            <div className="flex flex-row items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center rounded-md border bg-card hover:bg-accent transition p-2 cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-3xl font-bold">{plan.name}</h1>
            </div>
            <p className="text-muted-foreground text-lg">{plan.description}</p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="nodes">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="nodes" className="px-6 py-2">
                Plan
              </TabsTrigger>
              <TabsTrigger value="students" className="px-6 py-2">
                Enrolled Users
              </TabsTrigger>
              <TabsTrigger value="mentor" className="px-6 py-2">
                Mentor
              </TabsTrigger>
            </TabsList>

            <TabsContent value="nodes" className="pt-6">
              <div className="relative ml-10">
                {/* Timeline vertical line */}
                <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-muted" style={{ zIndex: 0 }}></div>
                <div className="flex flex-col">
                  {nodes.map((node, idx) => (
                    <NodeCard
                      key={node.id}
                      id={node.id}
                      index={node.index}
                      name={node.name}
                      description={node.description}
                      instructions={node.instructions}
                      duration={node.duration}
                      sources={node.sources}
                      is_active={node.is_active}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="students" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Enrolled Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {plan.enrolled_users && plan.enrolled_users.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {plan.enrolled_users.map((user) => (
                        <div key={user.id} className="flex items-center gap-2 p-2 border rounded-md">
                          {user.image_url ? (
                            <img src={user.image_url} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-muted-foreground" />
                          )}
                          <span className="text-base text-muted-foreground">{user.name}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted-foreground">No users enrolled yet.</div>
                  )}
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
                  <p className="font-medium">Enrolled Users</p>
                  <p className="text-2xl font-bold">{plan.enrolled_users ? plan.enrolled_users.length : 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-2xl font-bold">{plan.duration ? plan.duration : "-"}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              {plan.is_enrolled ? (
                <>
                  <Button className="w-full flex items-center justify-center gap-2" variant="default" onClick={() => router.push(`/learn/${plan.id}`)}>
                    Continue Plan
                    <ArrowUpRightFromSquare className="w-4 h-4" />
                  </Button>
                  <span className="text-green-600 text-sm text-center mt-2">You are enrolled in this course.</span>
                </>
              ) : (
                <Button className="w-full" onClick={handleEnroll} disabled={enrollLoading}>
                  {enrollLoading ? "Enrolling..." : "Enroll Now"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
