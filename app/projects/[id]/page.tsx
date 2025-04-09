"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, DollarSign, ListTodo, Users, Video, CheckCircle2, Circle, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  // Mock data for previews
  const tasks = [
    { id: 1, title: "Design homepage mockup", status: "completed", assignee: "Alex" },
    { id: 2, title: "Implement user authentication", status: "in-progress", assignee: "Sarah" },
    { id: 3, title: "Write API documentation", status: "pending", assignee: "Mike" }
  ];

  const timelineEvents = [
    { id: 1, title: "Project kickoff", date: "2023-06-01", completed: true },
    { id: 2, title: "Design phase", date: "2023-06-15", completed: true },
    { id: 3, title: "Development phase", date: "2023-07-01", completed: false },
    { id: 4, title: "Testing phase", date: "2023-07-15", completed: false },
    { id: 5, title: "Project launch", date: "2023-08-01", completed: false }
  ];

  const finances = [
    { id: 1, title: "Design tools subscription", amount: 120, date: "2023-06-05" },
    { id: 2, title: "Cloud hosting", amount: 250, date: "2023-06-10" },
    { id: 3, title: "Team training", amount: 500, date: "2023-06-15" }
  ];

  const upcomingMeetings = [
    { id: 1, title: "Weekly standup", date: "2023-06-20", time: "10:00 AM" },
    { id: 2, title: "Design review", date: "2023-06-22", time: "2:00 PM" },
    { id: 3, title: "Client presentation", date: "2023-06-25", time: "11:00 AM" }
  ];

  const teamMembers = [
    { id: 1, name: "Alex Johnson", role: "Project Manager", avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Sarah Williams", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Mike Brown", role: "Backend Developer", avatar: "https://i.pravatar.cc/150?img=3" }
  ];

  return (
    <div className="h-full p-6 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <ListTodo className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Project tasks and progress</CardDescription>
              </div>
            </div>
            <Link href={`/projects/${projectId}/tasks`}>
              <Button variant="ghost" size="sm" className="text-blue-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">60%</span>
              </div>
              <Progress value={60} className="h-2" />

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      {task.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : task.status === "in-progress" ? (
                        <Circle className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-gray-300" />
                      )}
                      <span className="text-sm">{task.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{task.assignee}</span>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>Timeline</CardTitle>
                <CardDescription>Project milestones and deadlines</CardDescription>
              </div>
            </div>
            <Link href={`/projects/${projectId}/timeline`}>
              <Button variant="ghost" size="sm" className="text-purple-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-2.5 top-0 h-full w-px bg-gray-200"></div>
                <div className="space-y-4">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="relative pl-8">
                      <div
                        className={`absolute left-0 top-1 h-5 w-5 rounded-full border-2 ${
                          event.completed ? "bg-purple-600 border-purple-600" : "bg-white border-gray-300"
                        }`}
                      ></div>
                      <div className="text-sm">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Milestone
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Finance Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle>Finance</CardTitle>
                <CardDescription>Project expenses and budget</CardDescription>
              </div>
            </div>
            <Link href={`/projects/${projectId}/finance`}>
              <Button variant="ghost" size="sm" className="text-green-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Total Budget</div>
                  <div className="text-2xl font-bold">$10,000</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium">Spent</div>
                  <div className="text-2xl font-bold">$870</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Recent Expenses</div>
                {finances.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div>
                      <div className="text-sm">{expense.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm font-medium">${expense.amount}</div>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Expense
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-50">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Project events and deadlines</CardDescription>
              </div>
            </div>
            <Link href={`/projects/${projectId}/calendar`}>
              <Button variant="ghost" size="sm" className="text-orange-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                  <div key={i} className="p-1">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => {
                  const isToday = i === 15;
                  const hasEvent = i === 15 || i === 18 || i === 22;

                  return (
                    <div
                      key={i}
                      className={`aspect-square flex items-center justify-center text-xs rounded-md ${
                        isToday ? "bg-orange-100 text-orange-600 font-medium" : ""
                      } ${hasEvent ? "relative" : ""}`}
                    >
                      {i + 1}
                      {hasEvent && <div className="absolute bottom-1 w-1 h-1 rounded-full bg-orange-500"></div>}
                    </div>
                  );
                })}
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Event
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Meetings Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-50">
                <Video className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <CardTitle>Meetings</CardTitle>
                <CardDescription>Upcoming and past meetings</CardDescription>
              </div>
            </div>
            <Link href={`/projects/${projectId}/meetings`}>
              <Button variant="ghost" size="sm" className="text-red-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm font-medium">Upcoming Meetings</div>

              <div className="space-y-2">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div>
                      <div className="text-sm">{meeting.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Join
                    </Button>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Preview */}
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <CardTitle>Team</CardTitle>
                <CardDescription>Project members and roles</CardDescription>
              </div>
            </div>
            <Link href={`/projects/${projectId}/members`}>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Members</span>
                <span className="text-sm text-muted-foreground">{teamMembers.length} members</span>
              </div>

              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Invite Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
