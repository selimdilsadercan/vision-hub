"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Clock, Pencil, UserPlus } from "lucide-react";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { DraggableNode } from "@/components/DraggableNode";
import { MentorSelectorDialog } from "@/components/admin/MentorSelectorDialog";

interface EducationPlan {
  id: string;
  name: string;
  description: string | null;
  duration_weeks: number | null;
  is_active: boolean;
  mentor_id: string | null;
  mentor_name: string | null;
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
}

export default function EducationPlanDetail() {
  const params = useParams();
  const [plan, setPlan] = useState<EducationPlan | null>(null);
  const [nodes, setNodes] = useState<EducationNode[]>([]);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMentorDialogOpen, setIsMentorDialogOpen] = useState(false);
  const [planForm, setPlanForm] = useState({
    name: "",
    description: "",
    duration: ""
  });
  const [nodeForm, setNodeForm] = useState({
    name: "",
    description: "",
    instructions: "",
    index: 0
  });
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<EducationNode | null>(null);
  const [editNodeForm, setEditNodeForm] = useState({
    name: "",
    description: "",
    instructions: "",
    source: ""
  });

  const supabase = createClientComponentClient<Database>();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5
      }
    })
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
        const fetchedPlan = planData as unknown as EducationPlan;
        setPlan(fetchedPlan);
        setPlanForm({
          name: fetchedPlan.name,
          description: fetchedPlan.description || "",
          duration: fetchedPlan.duration_weeks?.toString() || ""
        });
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

  const handleUpdatePlan = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc("update_education_plan", {
        input_education_plan_id: params.id as string,
        input_name: planForm.name,
        input_description: planForm.description,
        input_duration_weeks: planForm.duration ? parseInt(planForm.duration) : undefined
      });

      if (error) throw error;

      toast.success("Plan updated successfully");
      setIsEditingPlan(false);
      fetchPlanAndNodes();
    } catch (error) {
      console.error("Error updating plan:", error);
      toast.error("Failed to update plan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNode = async () => {
    try {
      setIsLoading(true);
      const newIndex = selectedNodeIndex !== null ? nodes[selectedNodeIndex].index + 0.5 : nodes.length;

      const { error } = await supabase.rpc("create_education_node", {
        input_education_plan_id: params.id as string,
        input_name: nodeForm.name,
        input_description: nodeForm.description || undefined,
        input_index: newIndex,
        input_is_active: true
      });

      if (error) throw error;

      toast.success("Node created successfully");
      setIsAddingNode(false);
      setSelectedNodeIndex(null);
      setNodeForm({ name: "", description: "", instructions: "", index: 0 });
      fetchPlanAndNodes();
    } catch (error) {
      console.error("Error creating node:", error);
      toast.error("Failed to create node");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = nodes.findIndex((node) => node.id === active.id);
    const newIndex = nodes.findIndex((node) => node.id === over.id);

    const newNodes = arrayMove(nodes, oldIndex, newIndex);
    setNodes(newNodes);

    try {
      // Update node indexes in the database
      for (const [index, node] of newNodes.entries()) {
        const { error } = await supabase.rpc("update_education_node_index", {
          input_education_node_id: node.id,
          input_new_index: index
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Error reordering nodes:", error);
      toast.error("Failed to reorder nodes");
      // Revert the changes
      setNodes(nodes);
    }
  };

  const handleEditNode = (node: EducationNode) => {
    setSelectedNode(node);
    setEditNodeForm({
      name: node.name,
      description: node.description || "",
      instructions: node.instructions || "",
      source: node.source || ""
    });
    setIsEditingNode(true);
  };

  const handleUpdateNode = async () => {
    if (!selectedNode) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.rpc("update_education_node", {
        input_education_node_id: selectedNode.id,
        input_name: editNodeForm.name,
        input_description: editNodeForm.description || undefined
      });

      if (error) throw error;

      toast.success("Node updated successfully");
      setIsEditingNode(false);
      setSelectedNode(null);
      fetchPlanAndNodes();
    } catch (error) {
      console.error("Error updating node:", error);
      toast.error("Failed to update node");
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">{plan.name}</h1>
              <p className="text-muted-foreground text-lg">{plan.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Badge variant={plan.is_active ? "default" : "secondary"} className="text-sm">
                {plan.is_active ? "Active" : "Inactive"}
              </Badge>

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                <span>{plan.duration_weeks} weeks</span>
              </div>

              {plan.mentor_name ? (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-md">
                  <span className="text-sm font-medium">Mentor:</span>
                  <span className="font-medium">{plan.mentor_name}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMentorDialogOpen(true)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsMentorDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Mentor
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditingPlan(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Plan
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Learning Nodes</h2>
          <Button
            onClick={() => {
              setSelectedNodeIndex(null);
              setIsAddingNode(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Node
          </Button>
        </div>

        <div className="relative">
          <div className="absolute left-[18%] top-4 bottom-12 w-px bg-border -translate-x-1/2" />
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={nodes.map((node) => node.id)} strategy={verticalListSortingStrategy}>
              <div>
                {nodes.length > 0 ? (
                  nodes.map((node, index) => (
                    <DraggableNode
                      key={node.id}
                      id={node.id}
                      index={index}
                      name={node.name}
                      description={node.description}
                      instructions={node.instructions}
                      source={node.source}
                      onEdit={() => handleEditNode(node)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No learning nodes yet. Add your first node to get started.</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      <Dialog open={isEditingPlan} onOpenChange={setIsEditingPlan}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Education Plan</DialogTitle>
            <DialogDescription>Update the basic information of your education plan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={planForm.description} onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (weeks)</Label>
              <Input id="duration" type="number" min="1" value={planForm.duration} onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingPlan(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePlan} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingNode} onOpenChange={setIsAddingNode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Education Node</DialogTitle>
            <DialogDescription>
              {selectedNodeIndex !== null
                ? `Adding a node between steps ${selectedNodeIndex + 1} and ${selectedNodeIndex + 2}`
                : "Adding a node at the end of the timeline"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nodeName">Name</Label>
              <Input id="nodeName" value={nodeForm.name} onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodeDescription">Description</Label>
              <Textarea id="nodeDescription" value={nodeForm.description} onChange={(e) => setNodeForm({ ...nodeForm, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodeInstructions">Instructions</Label>
              <Textarea id="nodeInstructions" value={nodeForm.instructions} onChange={(e) => setNodeForm({ ...nodeForm, instructions: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingNode(false);
                setSelectedNodeIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateNode} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Node"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditingNode} onOpenChange={setIsEditingNode}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
            <DialogDescription>Update the details of this education node.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editNodeName">Name</Label>
              <Input id="editNodeName" value={editNodeForm.name} onChange={(e) => setEditNodeForm({ ...editNodeForm, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNodeDescription">Description</Label>
              <Textarea
                id="editNodeDescription"
                value={editNodeForm.description}
                onChange={(e) => setEditNodeForm({ ...editNodeForm, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNodeInstructions">Instructions</Label>
              <Textarea
                id="editNodeInstructions"
                value={editNodeForm.instructions}
                onChange={(e) => setEditNodeForm({ ...editNodeForm, instructions: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNodeSource">Resource URL</Label>
              <Input
                id="editNodeSource"
                type="url"
                placeholder="https://"
                value={editNodeForm.source}
                onChange={(e) => setEditNodeForm({ ...editNodeForm, source: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditingNode(false);
                setSelectedNode(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateNode} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MentorSelectorDialog
        isOpen={isMentorDialogOpen}
        onClose={() => setIsMentorDialogOpen(false)}
        educationPlanId={params.id as string}
        onSuccess={fetchPlanAndNodes}
      />
    </div>
  );
}
