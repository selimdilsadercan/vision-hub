import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="h-screen sticky top-0">
        <AdminSidebar />
      </div>
      <main className="flex-1 overflow-x-auto min-h-screen">{children}</main>
    </div>
  );
}
