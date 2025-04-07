"use client";

import { ReactNode } from "react";

interface DiscoverSectionProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
}

export function DiscoverSection({ title, description, icon, children }: DiscoverSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">{children}</div>
    </div>
  );
}
