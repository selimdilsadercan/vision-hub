"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookOpen, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/lib/supabase-types";

type EducationPlan = Database["public"]["Functions"]["list_education_plans"]["Returns"][number];


export default function EducationsPage() {
  const [educationPlans, setEducationPlans] = useState<EducationPlan[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const fetchEducationPlans = async () => {
      try {
        const { data, error } = await supabase.rpc("list_education_plans");

        if (error) {
          throw error;
        }

        if (data) {
          setEducationPlans(data);

          // Extract unique categories from descriptions as categories
          const uniqueCategories = Array.from(new Set(data.map((plan) => plan.description).filter((desc): desc is string => desc !== null)));
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Error loading education plans:", error);
        toast.error("Failed to load education plans");
      }
    };

    fetchEducationPlans();
  }, [supabase]);

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500";
  };

  const filteredEducationPlans = selectedCategory === "all" ? educationPlans : educationPlans.filter((plan) => plan.description === selectedCategory);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Education Programs</h1>
          <p className="text-muted-foreground">Explore our comprehensive education programs and start learning</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {educationPlans.length} Programs Available
        </Badge>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-background">
          <TabsTrigger value="all" onClick={() => setSelectedCategory("all")}>
            All Programs
          </TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} onClick={() => setSelectedCategory(category)}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEducationPlans.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn(getStatusColor(plan.is_active))}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {`${plan.duration}`}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Category: {plan.description || "General"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">Program Details</span>
                    </div>
                  </div>
                  <div className="pt-4 mt-auto">
                    <Link href={`/education/${plan.id}`} className="flex items-center text-sm font-medium text-primary hover:text-primary/80">
                      View Program
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
