"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { type SkillsByCategory } from "@/lib/skills";

export default function SkillTreePage() {
  const [skills, setSkills] = useState<SkillsByCategory>({});
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSkills, setExpandedSkills] = useState<string[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("/api/skills");
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Error loading skills:", error);
      }
    };

    fetchSkills();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  };

  const toggleSkill = (skill: string) => {
    setExpandedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Skill Tree</h1>
        <Badge variant="outline" className="text-sm">
          {Object.keys(skills).length} Categories
        </Badge>
      </div>

      <div className="grid gap-6">
        {Object.entries(skills).map(([category, categorySkills]) => (
          <Card key={category} className="overflow-hidden">
            <CardHeader className="cursor-pointer hover:bg-accent/50" onClick={() => toggleCategory(category)}>
              <CardTitle className="flex items-center gap-2">
                {expandedCategories.includes(category) ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                {category}
                <Badge variant="secondary" className="ml-2">
                  {Object.keys(categorySkills).length} Skills
                </Badge>
              </CardTitle>
            </CardHeader>

            {expandedCategories.includes(category) && (
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Object.entries(categorySkills).map(([skill, microSkills]) => (
                    <div key={skill} className="pl-4">
                      <div className="flex items-center gap-2 cursor-pointer hover:text-primary" onClick={() => toggleSkill(skill)}>
                        {expandedSkills.includes(skill) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        <span className="font-medium">{skill}</span>
                        <Badge variant="outline" className="ml-2">
                          {microSkills.length} Steps
                        </Badge>
                      </div>

                      {expandedSkills.includes(skill) && (
                        <div className="mt-2 space-y-2 pl-6">
                          {microSkills.map((microSkill, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                              {microSkill}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
