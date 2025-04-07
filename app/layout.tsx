import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/providers/ToastProvider";
import ConvexProvider from "@/providers/ConvexProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { UserSync } from "@/components/UserSync";

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
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexProvider>
            <ToastProvider />
            <UserSync />
            {children}
          </ConvexProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
