"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { type Education } from "@/lib/educations";
import { cn } from "@/lib/utils";

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        const response = await fetch("/api/educations");
        const data = (await response.json()) as Education[];
        setEducations(data);

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((edu) => edu.category)));
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading educations:", error);
      }
    };

    fetchEducations();
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-green-500/10 text-green-500";
      case "Intermediate":
        return "bg-blue-500/10 text-blue-500";
      case "Advanced":
        return "bg-purple-500/10 text-purple-500";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const filteredEducations = selectedCategory === "all" ? educations : educations.filter((edu) => edu.category === selectedCategory);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Education Programs</h1>
          <p className="text-muted-foreground">Explore our comprehensive education programs and start learning</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {educations.length} Programs Available
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
            {filteredEducations.map((education, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={cn(getLevelColor(education.level))}>
                      {education.level}
                    </Badge>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      {education.duration}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{education.title}</CardTitle>
                  <CardDescription>{education.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Topics Covered
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {education.topics.map((topic, i) => (
                        <Badge key={i} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 mt-auto">
                    <button
                      className="flex items-center text-sm font-medium text-primary hover:text-primary/80"
                      onClick={() => console.log("Enroll:", education.title)}
                    >
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
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
