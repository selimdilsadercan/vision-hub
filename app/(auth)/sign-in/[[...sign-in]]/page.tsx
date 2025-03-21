"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
          card: "shadow-none",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
          socialButtonsBlockButton: "text-sm normal-case",
          formFieldInput:
            "h-10 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border border-input bg-background rounded-md",
          footer: "hidden"
        }
      }}
      redirectUrl="/dashboard"
    />
  );
}
