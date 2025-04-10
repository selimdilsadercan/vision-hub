"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [projectName, setProjectName] = useState("Vision Hub");
  const [projectDescription, setProjectDescription] = useState("A collaborative project management platform");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weekly: false
  });

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated");
  };

  const handleDeleteProject = () => {
    // TODO: Implement actual project deletion
    toast.success("Project deleted successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Project Settings</h1>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Basic information about your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Enter project name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectDescription">Project Description</Label>
            <Textarea
              id="projectDescription"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description"
              rows={4}
            />
          </div>
          <Button onClick={handleSaveGeneral}>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch checked={notifications.email} onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <Switch checked={notifications.push} onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Summary</Label>
                <p className="text-sm text-muted-foreground">Get a weekly summary of project activities</p>
              </div>
              <Switch checked={notifications.weekly} onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })} />
            </div>
          </div>
          <Button onClick={handleSaveNotifications}>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your project and remove all project data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Project
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
