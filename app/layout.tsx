import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SupabaseProvider } from "@/providers/SupabaseProvider";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/Sidebar";
import { MobileNavbar } from "@/components/MobileNavbar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vision Hub",
  description: "Project Management App"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={cn(inter.className)} suppressHydrationWarning>
        <SupabaseProvider>
          <Toaster />
          <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-50">
              <Sidebar />
            </div>
            <main className="md:pl-72">{children}</main>
            <MobileNavbar />
          </div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
