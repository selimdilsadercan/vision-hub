"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Clock, Pencil, UserPlus, User, ArrowLeft, Trash2 } from "lucide-react";
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { arrayMove, verticalListSortingStrategy, useSortable, SortableContext, SortableContextProps } from "@dnd-kit/sortable";
import { DraggableNode } from "@/components/DraggableNode";
import { MentorSelectorDialog } from "@/components/admin/MentorSelectorDialog";

interface EducationPlan {
  id: string;
  name: string;
  description: string | null;
  duration: string | null;
  is_active: boolean;
  mentor?: {
    id: string;
    name: string;
    image_url: string;
  } | null;
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

function AddNodeButton({ onClick, ariaLabel }: { onClick: () => void; ariaLabel: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
}

export default function EducationPlanDetail() {
  const params = useParams();
  const router = useRouter();
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
    sources: [] as string[],
    duration: "",
    index: 0,
    sourceInput: ""
  });
  const [isEditingNode, setIsEditingNode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<EducationNode | null>(null);
  const [editNodeForm, setEditNodeForm] = useState({
    name: "",
    description: "",
    instructions: "",
    sources: [] as string[],
    duration: "",
    is_active: true,
    sourceInput: ""
  });
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

      console.log("Fetched plan from Supabase:", planData);

      if (planError) throw planError;
      if (planData) {
        const fetchedPlan = planData as unknown as EducationPlan;
        setPlan(fetchedPlan);
        setPlanForm({
          name: fetchedPlan.name,
          description: fetchedPlan.description || "",
          duration: fetchedPlan.duration || ""
        });
      }

      // Fetch nodes
      const { data: nodesData, error: nodesError } = await supabase.rpc("list_education_nodes", {
        input_education_plan_id: params.id as string
      });

      if (nodesError) throw nodesError;
      if (nodesData) {
        setNodes(nodesData as EducationNode[]);
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

  // Debug: log plan state after updates
  useEffect(() => {
    console.log("Plan state:", plan);
  }, [plan]);

  const handleUpdatePlan = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc("update_education_plan", {
        input_education_plan_id: params.id as string,
        input_name: planForm.name,
        input_description: planForm.description,
        input_duration: planForm.duration || undefined
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
      let newIndex: number;
      if (nodes.length === 0) {
        newIndex = 0;
      } else if (selectedNodeIndex === -1) {
        newIndex = nodes[0].index - 1;
      } else if (selectedNodeIndex !== null && selectedNodeIndex < nodes.length - 1) {
        newIndex = (nodes[selectedNodeIndex].index + nodes[selectedNodeIndex + 1].index) / 2;
      } else {
        newIndex = nodes[nodes.length - 1].index + 1;
      }
      console.log("New index:", newIndex);
      const { error } = await supabase.rpc("create_education_node", {
        input_education_plan_id: params.id as string,
        input_name: nodeForm.name,
        input_description: nodeForm.description || undefined,
        input_instructions: nodeForm.instructions || undefined,
        input_sources: nodeForm.sources,
        input_duration: nodeForm.duration || undefined,
        input_index: newIndex,
        input_is_active: true
      });
      if (error) throw error;
      toast.success("Node created successfully");
      setIsAddingNode(false);
      setSelectedNodeIndex(null);
      setNodeForm({ name: "", description: "", instructions: "", sources: [], duration: "", index: 0, sourceInput: "" });
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
      sources: node.sources || [],
      duration: node.duration || "",
      is_active: node.is_active,
      sourceInput: ""
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
        input_description: editNodeForm.description,
        input_instructions: editNodeForm.instructions,
        input_sources: editNodeForm.sources,
        input_duration: editNodeForm.duration,
        input_is_active: editNodeForm.is_active
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

  const handleDeleteNode = async () => {
    if (!selectedNode) return;

    try {
      setIsLoading(true);
      const { error } = await supabase.rpc("delete_education_node", {
        input_id: selectedNode.id
      });

      if (error) throw error;

      toast.success("Node deleted successfully");
      setIsEditingNode(false);
      setIsDeleteDialogOpen(false);
      setSelectedNode(null);
      fetchPlanAndNodes();
    } catch (error) {
      console.error("Error deleting node:", error);
      toast.error("Failed to delete node");
    } finally {
      setIsLoading(false);
    }
  };

  // Find the active node for overlay
  const activeNode = nodes.find((n) => n.id === activeNodeId) || null;

  if (!plan) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Back Button and Title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center rounded-md border bg-card hover:bg-accent transition p-2 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold tracking-tight flex-1">{plan.name}</h1>
        <Button variant="outline" size="sm" onClick={() => setIsEditingPlan(true)}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit Plan
        </Button>
      </div>

      {/* Main Card for Plan Details */}
      <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 flex-1">
            <p className="text-muted-foreground text-lg">{plan.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <Badge variant={plan.is_active ? "default" : "secondary"} className="text-sm">
                {plan.is_active ? "Active" : "Inactive"}
              </Badge>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                <span>{plan.duration}</span>
              </div>
              {plan.mentor?.id && plan.mentor?.name ? (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-md">
                  {plan.mentor?.image_url ? (
                    <img src={plan.mentor.image_url} alt={plan.mentor.name} className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-3 w-3 text-muted-foreground" />
                    </div>
                  )}
                  <span className="text-sm font-medium">Mentor:</span>
                  <span className="font-medium">{plan.mentor?.name}</span>
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
        </div>
      </div>

      {/* Learning Nodes Section */}
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
          <div className="relative flex flex-col gap-0">
            {/* Add button before first node */}
            <div className="flex justify-center mb-4 -mt-4 ml-48">
              <AddNodeButton
                onClick={() => {
                  setSelectedNodeIndex(-1);
                  setIsAddingNode(true);
                }}
                ariaLabel="Add node at start"
              />
            </div>
            {nodes.length > 0 ? (
              nodes.map((node, index) => (
                <div key={node.id} className="relative">
                  <DraggableNode
                    id={node.id}
                    index={index}
                    name={node.name}
                    description={node.description}
                    instructions={node.instructions}
                    duration={node.duration}
                    sources={node.sources}
                    onEdit={() => handleEditNode(node)}
                    isDragging={activeNodeId === node.id}
                  />
                  {/* Add button between nodes */}
                  {index < nodes.length - 1 && (
                    <div className="flex justify-center mb-4 -mt-4 ml-48">
                      <AddNodeButton
                        onClick={() => {
                          setSelectedNodeIndex(index);
                          setIsAddingNode(true);
                        }}
                        ariaLabel={`Add node after step ${index + 1}`}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No learning nodes yet. Add your first node to get started.</p>
              </div>
            )}
            {/* Add button after last node */}
            {nodes.length > 0 && (
              <div className="flex justify-center mb-4 -mt-4 ml-48">
                <AddNodeButton
                  onClick={() => {
                    setSelectedNodeIndex(nodes.length - 1);
                    setIsAddingNode(true);
                  }}
                  ariaLabel="Add node at end"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isEditingPlan} onOpenChange={setIsEditingPlan}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                type="text"
                placeholder="e.g. 3 weeks, 2 months, 1 semester"
                value={planForm.duration}
                onChange={(e) => setPlanForm({ ...planForm, duration: e.target.value })}
              />
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
            <div className="space-y-2">
              <Label htmlFor="nodeDuration">Duration</Label>
              <Input id="nodeDuration" value={nodeForm.duration} onChange={(e) => setNodeForm({ ...nodeForm, duration: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nodeSources">Sources</Label>
              <div className="flex gap-2">
                <Input
                  id="nodeSources"
                  value={nodeForm.sourceInput}
                  onChange={(e) => setNodeForm({ ...nodeForm, sourceInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && nodeForm.sourceInput.trim()) {
                      setNodeForm({
                        ...nodeForm,
                        sources: [...nodeForm.sources, nodeForm.sourceInput.trim()],
                        sourceInput: ""
                      });
                    }
                  }}
                  placeholder="Add a source and press Enter or click Add"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (nodeForm.sourceInput.trim()) {
                      setNodeForm({
                        ...nodeForm,
                        sources: [...nodeForm.sources, nodeForm.sourceInput.trim()],
                        sourceInput: ""
                      });
                    }
                  }}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {nodeForm.sources.map((src, idx) => (
                  <div key={idx} className="flex items-center bg-muted px-2 py-1 rounded">
                    <span className="mr-2 max-w-[200px] truncate">{src}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5"
                      onClick={() => setNodeForm({ ...nodeForm, sources: nodeForm.sources.filter((_, i) => i !== idx) })}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
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
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
              <Label htmlFor="editNodeDuration">Duration</Label>
              <Input id="editNodeDuration" value={editNodeForm.duration} onChange={(e) => setEditNodeForm({ ...editNodeForm, duration: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editNodeSources">Sources</Label>
              <div className="flex gap-2">
                <Input
                  id="editNodeSources"
                  value={editNodeForm.sourceInput}
                  onChange={(e) => setEditNodeForm({ ...editNodeForm, sourceInput: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && editNodeForm.sourceInput.trim()) {
                      setEditNodeForm({
                        ...editNodeForm,
                        sources: [...editNodeForm.sources, editNodeForm.sourceInput.trim()],
                        sourceInput: ""
                      });
                    }
                  }}
                  placeholder="Add a source and press Enter or click Add"
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (editNodeForm.sourceInput.trim()) {
                      setEditNodeForm({
                        ...editNodeForm,
                        sources: [...editNodeForm.sources, editNodeForm.sourceInput.trim()],
                        sourceInput: ""
                      });
                    }
                  }}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editNodeForm.sources.map((src, idx) => (
                  <div key={idx} className="flex items-center bg-muted px-2 py-1 rounded">
                    <span className="mr-2 max-w-[200px] truncate">{src}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5"
                      onClick={() => setEditNodeForm({ ...editNodeForm, sources: editNodeForm.sources.filter((_, i) => i !== idx) })}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="mr-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Node
            </Button>
            <div className="flex gap-2">
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
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Node</DialogTitle>
            <DialogDescription>Are you sure you want to delete this node? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteNode} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Node"}
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
