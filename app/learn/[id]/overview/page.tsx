"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";
import { Database } from "@/lib/supabase-types";

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
  enrolled_students?: number | null;
  level?: string | null;
  updated_at?: string;
}

export default function LearnOverviewPage() {
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
      <div className="flex flex-wrap gap-6">
        <div>
          <div className="text-xs text-muted-foreground">Enrolled Students</div>
          <div className="text-xl font-bold">{plan.enrolled_students ?? 0}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Duration</div>
          <div className="text-xl font-bold">{plan.duration ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Level</div>
          <div className="text-xl font-bold">{plan.level ?? "-"}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Last Updated</div>
          <div className="text-muted-foreground">{plan.updated_at ? new Date(plan.updated_at).toLocaleDateString() : "-"}</div>
        </div>
      </div>
    </div>
  );
}
