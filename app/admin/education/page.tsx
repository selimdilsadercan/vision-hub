"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "react-hot-toast";
import { Database } from "@/lib/supabase-types";
import Link from "next/link";

type EducationPlan = Database["public"]["Functions"]["list_education_plans"]["Returns"][number];

export default function AdminEducationPage() {
  const [educationPlans, setEducationPlans] = useState<EducationPlan[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: ""
  });

  const supabase = createClientComponentClient<Database>();

  const fetchEducationPlans = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc("list_education_plans");
      if (error) {
        console.error("Error loading education plans:", error);
        toast.error("Failed to load education plans");
        return;
      }
      if (data) {
        setEducationPlans(data);
      }
    } catch (error) {
      console.error("Error loading education plans:", error);
      toast.error("Failed to load education plans");
    }
  }, [supabase]);

  useEffect(() => {
    fetchEducationPlans();
  }, [fetchEducationPlans]);

  const handleCreatePlan = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.rpc("create_education_plan", {
        input_name: formData.name,
        input_description: formData.description,
        input_duration: formData.duration
      });

      if (error) {
        throw error;
      }

      toast.success("Education plan created successfully");
      setIsDialogOpen(false);
      setFormData({ name: "", description: "", duration: "" });
      fetchEducationPlans();
    } catch (error) {
      console.error("Error creating education plan:", error);
      toast.error("Failed to create education plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Education Plans</h1>
          <p className="text-muted-foreground">Manage your education plans and their content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Education Plan</DialogTitle>
              <DialogDescription>Create a new education plan. You can add nodes and content after creating the plan.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Enter plan name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter plan description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (weeks)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="Enter duration in weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePlan} disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Plan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {educationPlans.map((plan) => (
          <Link key={plan.id} href={`/admin/education/${plan.id}`}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <Badge variant={plan.is_active ? "default" : "secondary"}>{plan.is_active ? "Active" : "Draft"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2" />
                  {plan.duration}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
