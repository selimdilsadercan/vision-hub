"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Database } from "@/lib/supabase-types";

interface EducationPlan {
  id: string;
  mentor: {
    id: string;
    name: string;
    image_url: string | null;
  } | null;
}

export default function LearnMentorPage() {
  const params = useParams<any>();
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
      if (planData) setPlan(planData as unknown as EducationPlan);
    } catch (error) {
      toast.error("Failed to load plan details");
    } finally {
      setIsLoading(false);
    }
  }, [params.id, supabase]);

  useEffect(() => {
    if (params.id) fetchPlan();
  }, [params.id, fetchPlan]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  if (!plan) return <div className="text-center py-12">Plan not found</div>;

  return (
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
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Schedule Meeting
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
