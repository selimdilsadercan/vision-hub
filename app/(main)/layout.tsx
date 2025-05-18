"use client";

import { Sidebar } from "@/components/Sidebar";
import { MobileNavbar } from "@/components/MobileNavbar";

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-50">
        <Sidebar />
      </div>
      <main className="md:pl-[260px] h-full">{children}</main>
      <MobileNavbar />
    </div>
  );
}
