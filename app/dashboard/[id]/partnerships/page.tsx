"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Building2, Mail, Phone } from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Partnership {
  id: string;
  companyName: string;
  description: string;
  status: "planned" | "in_progress" | "active" | "completed" | "cancelled";
  contactPerson: string;
  email: string;
  phone: string;
  startDate: string;
}

const statusColors = {
  planned: "bg-slate-500",
  in_progress: "bg-blue-500",
  active: "bg-green-500",
  completed: "bg-purple-500",
  cancelled: "bg-red-500"
};

const statusLabels = {
  planned: "Planned",
  in_progress: "In Progress",
  active: "Active",
  completed: "Completed",
  cancelled: "Cancelled"
};

export default function PartnershipsPage() {
  const params = useParams();

  const [partnerships, setPartnerships] = useState<Partnership[]>([
    {
      id: "1",
      companyName: "TechCorp Solutions",
      description: "Strategic partnership for AI integration",
      status: "planned",
      contactPerson: "John Smith",
      email: "john@techcorp.com",
      phone: "+1 234 567 8900",
      startDate: "2024-04-01"
    },
    {
      id: "2",
      companyName: "DataViz Inc",
      description: "Data visualization tools integration",
      status: "active",
      contactPerson: "Sarah Johnson",
      email: "sarah@dataviz.com",
      phone: "+1 234 567 8901",
      startDate: "2024-03-01"
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
  const [formData, setFormData] = useState<Partial<Partnership>>({
    companyName: "",
    description: "",
    status: "planned",
    contactPerson: "",
    email: "",
    phone: "",
    startDate: ""
  });

  const handleEdit = (partnership: Partnership) => {
    setSelectedPartnership(partnership);
    setFormData(partnership);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (partnershipId: string) => {
    setPartnerships(partnerships.filter((p) => p.id !== partnershipId));
    toast.success("Partnership deleted successfully");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partnerships</h1>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Partnership
        </Button>
      </div>

      <div className="grid gap-4">
        {partnerships.map((partnership) => (
          <Card key={partnership.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {partnership.companyName}
                  </CardTitle>
                  <CardDescription>{partnership.description}</CardDescription>
                </div>
                <Badge className={cn("ml-2", statusColors[partnership.status])}>{statusLabels[partnership.status]}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{partnership.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{partnership.phone}</span>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(partnership)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Partnership</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete the partnership with {partnership.companyName}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(partnership.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedPartnership ? "Edit Partnership" : "Add New Partnership"}</DialogTitle>
            <DialogDescription>
              {selectedPartnership ? "Update the partnership details below" : "Add a new partnership by filling out the information below"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter company name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter partnership description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: Partnership["status"]) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                placeholder="Enter contact person name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter contact email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter contact phone"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setSelectedPartnership(null);
                setFormData({
                  companyName: "",
                  description: "",
                  status: "planned",
                  contactPerson: "",
                  email: "",
                  phone: "",
                  startDate: ""
                });
              }}
            >
              Cancel
            </Button>
            <Button>{selectedPartnership ? "Update Partnership" : "Add Partnership"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
