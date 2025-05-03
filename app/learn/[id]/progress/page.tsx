"use client";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Progress } from "@/components/ui/progress";
import { Database } from "@/lib/supabase-types";
import { getUserData } from "@/firebase/firestore";
import { useAuth } from "@/firebase/auth-context";
import { NodeCard } from "@/components/NodeCard";

interface EducationNode {
  id: string;
  name: string;
  description: string;
  duration: string;
  education_plan_id: string;
  index: number;
  instructions: string;
  is_active: boolean;
  sources: string[];
  status: "not_started" | "in_progress" | "completed";
}

export default function LearnProgressPage() {
  const params = useParams<{ id: string }>();
  const [nodes, setNodes] = useState<EducationNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient<Database>();
  const { user, loading } = useAuth();

  const fetchNodes = useCallback(async () => {
    if (!params.id) {
      setError("No education plan ID provided");
      return;
    }

    if (!user) {
      setError("User not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const firestoreUser = await getUserData(user.uid);
      if (!firestoreUser?.profile_id) {
        setError("User profile not found");
        return;
      }

      const { data: nodesData, error: nodesError } = await supabase.rpc("list_education_nodes_with_progress", {
        input_education_plan_id: params.id,
        input_profile_id: firestoreUser.profile_id
      });

      if (nodesError) {
        throw new Error(`Failed to fetch nodes: ${nodesError.message}`);
      }

      if (!nodesData) {
        throw new Error("No nodes data received");
      }

      setNodes(nodesData as EducationNode[]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load nodes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params.id, supabase, user]);

  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading
    fetchNodes();
  }, [loading, fetchNodes]);

  const completedNodes = nodes.filter((node) => node.status === "completed").length;
  const progress = nodes.length > 0 ? (completedNodes / nodes.length) * 100 : 0;

  const handleUpdateProgress = async (nodeId: string, currentStatus: string) => {
    if (!user) {
      setError("User not authenticated");
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const firestoreUser = await getUserData(user.uid);
      if (!firestoreUser?.profile_id) {
        setError("User profile not found");
        return;
      }
      const newStatus = currentStatus === "completed" ? "not_started" : "completed";
      const { error: updateError } = await supabase.rpc("update_education_node_progress", {
        input_education_node_id: nodeId,
        input_profile_id: firestoreUser.profile_id,
        input_status: newStatus
      });
      if (updateError) {
        throw new Error(updateError.message);
      }
      await fetchNodes();
      toast.success(`Node marked as ${newStatus.replace("_", " ")}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update progress";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4 p-2">
        <Progress value={progress} className="w-[200px]" />
        <span className="text-sm text-muted-foreground">
          {completedNodes}/{nodes.length} nodes completed
        </span>
      </div>
      <div className="relative">
        <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-muted hidden md:block"></div>
        {nodes.map((node, idx) => (
          <NodeCard
            key={node.id}
            id={node.id}
            index={idx}
            name={node.name}
            description={node.description}
            instructions={node.instructions}
            duration={node.duration}
            sources={node.sources}
            is_active={node.is_active}
            show_progress={true}
            status={node.status}
            onUpdateProgress={() => handleUpdateProgress(node.id, node.status)}
          />
        ))}
      </div>
    </div>
  );
}
