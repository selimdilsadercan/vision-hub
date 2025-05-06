"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, CalendarCheck, Trophy, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-500"
  },
  {
    title: "Active Programs",
    value: "24",
    change: "+5%",
    trend: "up",
    icon: GraduationCap,
    color: "text-green-500"
  },
  {
    title: "Upcoming Events",
    value: "8",
    change: "-2%",
    trend: "down",
    icon: CalendarCheck,
    color: "text-purple-500"
  },
  {
    title: "Active Competitions",
    value: "6",
    change: "+3%",
    trend: "up",
    icon: Trophy,
    color: "text-yellow-500"
  }
];

const quickActions = [
  {
    title: "Add New User",
    description: "Create a new user account",
    href: "/admin/users/new",
    icon: Users
  },
  {
    title: "Create Program",
    description: "Set up a new education program",
    href: "/admin/education/new",
    icon: GraduationCap
  },
  {
    title: "Schedule Event",
    description: "Plan a new event",
    href: "/admin/events/new",
    icon: CalendarCheck
  },
  {
    title: "Launch Competition",
    description: "Start a new competition",
    href: "/admin/competitions/new",
    icon: Trophy
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Action
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className={`flex items-center text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <action.icon className="h-4 w-4" />
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
