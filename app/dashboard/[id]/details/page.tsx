"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Circle } from "lucide-react";

export default function ProjectDetailsPage() {
  const features = [
    {
      category: "Core Pages",
      items: ["Home Page", "Profile Page", "Discovery Page", "Archive Page", "Lists Page", "Groups Page", "Settings Page"]
    },
    {
      category: "Key Features",
      items: [
        "Tinder-style Card Interface",
        "Friend Groups Management",
        "Archive System (Movies, Trips, Venues, Activities)",
        "List Creation and Management",
        "Game Initiation Screen in Lists",
        "Recommendation System",
        "Social Interactions"
      ]
    },
    {
      category: "Admin Features",
      items: [
        "Activity Management Dashboard",
        "Content Moderation Tools",
        "List Recommendation Management",
        "User Management",
        "Analytics Dashboard",
        "Content Approval System"
      ]
    },
    {
      category: "List Features",
      items: ["Custom List Creation", "Collaborative Lists", "List Templates", "List Sharing", "List Categories", "List Privacy Settings", "List Statistics"]
    }
  ];

  const techStack = {
    frontend: ["Next.js 14", "TypeScript", "TailwindCSS", "Shadcn UI", "Lucide Icons", "React Query", "Zustand"],
    backend: ["Node.js", "Prisma ORM", "PostgreSQL", "Redis Cache", "RESTful API", "WebSocket"],
    infrastructure: ["Vercel Deployment", "AWS S3 Storage", "Cloudflare CDN", "GitHub Actions", "Docker Containers"],
    tools: ["VS Code", "Figma", "Postman", "Git", "npm", "ESLint", "Prettier"]
  };

  const projectPlan = [
    {
      phase: "Project Development",
      tasks: [
        { name: "Concept Development", status: "completed" },
        { name: "Core Feature Definition", status: "completed" },
        { name: "Main Page Structure", status: "completed" },
        { name: "Competitor Analysis", status: "in_progress" },
        { name: "Branding & Naming", status: "in_progress" },
        { name: "Pitch Deck Creation", status: "pending" },
        { name: "Legal Agreements (GDPR, Cookies)", status: "pending" }
      ]
    },
    {
      phase: "Marketing",
      tasks: [
        { name: "Landing Page Development", status: "in_progress" },
        { name: "Company Registration", status: "pending" },
        { name: "Incubator Applications", status: "pending" },
        { name: "Social Media Setup", status: "completed" },
        { name: "Sponsorship Outreach", status: "pending" },
        { name: "Content Strategy", status: "in_progress" }
      ]
    },
    {
      phase: "Technical Development",
      tasks: [
        { name: "Design System & Color Palette", status: "completed" },
        { name: "Tech Stack Selection", status: "completed" },
        { name: "Framework Setup", status: "completed" },
        { name: "UI Component Library", status: "in_progress" },
        { name: "AI Illustration System", status: "pending" },
        { name: "Authentication System", status: "in_progress" },
        { name: "Backend Development", status: "pending" },
        { name: "Database Schema", status: "in_progress" },
        { name: "Utility Functions", status: "in_progress" },
        { name: "Deployment Setup", status: "pending" },
        { name: "Domain & Hosting", status: "pending" }
      ]
    },
    {
      phase: "Quality Assurance",
      tasks: [
        { name: "Unit Testing Setup", status: "pending" },
        { name: "Integration Testing", status: "pending" },
        { name: "Performance Testing", status: "pending" },
        { name: "Security Audit", status: "pending" },
        { name: "User Acceptance Testing", status: "pending" }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Project Details</h1>

      <Tabs defaultValue="features" className="space-y-6">
        <TabsList>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
          <TabsTrigger value="plan">Project Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-6">
          {features.map((category) => (
            <Card key={category.category}>
              <CardHeader>  
                <CardTitle>{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {category.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <Circle className="h-2 w-2 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="tech" className="grid gap-6 md:grid-cols-2">
          {Object.entries(techStack).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          {projectPlan.map((phase) => (
            <Card key={phase.phase}>
              <CardHeader>
                <CardTitle>{phase.phase}</CardTitle>
                <CardDescription>
                  {phase.tasks.filter((task) => task.status === "completed").length} of {phase.tasks.length} tasks completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {phase.tasks.map((task) => (
                    <div key={task.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : task.status === "in_progress" ? (
                          <Circle className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                        <span>{task.name}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          task.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : task.status === "in_progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {task.status === "completed" ? "Completed" : task.status === "in_progress" ? "In Progress" : "Pending"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
