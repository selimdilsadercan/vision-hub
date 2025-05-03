"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, BookOpen } from "lucide-react";
import { Database } from "@/lib/supabase-types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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

export default function LearnPage() {
  const params = useParams();
  const [plan, setPlan] = useState<EducationPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  const fetchPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: planData, error: planError } = await supabase.rpc("get_education_plan", {
        input_education_plan_id: params.id as string
      });

      if (planError) throw planError;
      if (planData) {
        setPlan(planData as unknown as EducationPlan);
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
      fetchPlan();
    }
  }, [params.id, fetchPlan]);

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
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">{plan.name}</h1>
              <Badge variant={plan.is_active ? "default" : "secondary"}>{plan.is_active ? "Active" : "Inactive"}</Badge>
            </div>
            <p className="text-muted-foreground text-lg">{plan.description}</p>
          </div>

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan.problem_definition && (
                <div>
                  <h3 className="font-semibold mb-2">Problem Definition</h3>
                  <p className="text-muted-foreground">{plan.problem_definition}</p>
                </div>
              )}
              {plan.purpose && (
                <div>
                  <h3 className="font-semibold mb-2">Purpose</h3>
                  <p className="text-muted-foreground">{plan.purpose}</p>
                </div>
              )}
              {plan.general_structure && (
                <div>
                  <h3 className="font-semibold mb-2">General Structure</h3>
                  <p className="text-muted-foreground">{plan.general_structure}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Audience */}
          {plan.target_audience && plan.target_audience.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                  {plan.target_audience.map((audience, index) => (
                    <li key={index} className="text-muted-foreground">
                      {audience}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Mentor Info */}
          {plan.mentor && (
            <Card>
              <CardHeader>
                <CardTitle>Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={plan.mentor.image_url || undefined} alt={plan.mentor.name} />
                    <AvatarFallback>{plan.mentor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{plan.mentor.name}</p>
                    <p className="text-sm text-muted-foreground">Mentor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Details */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duration: {plan.duration}</span>
              </div>
              {plan.level && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Level: {plan.level}</span>
                </div>
              )}
              {plan.enrolled_students !== null && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{plan.enrolled_students} enrolled students</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
