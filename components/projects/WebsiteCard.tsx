"use client";

import Image from "next/image";
import Link from "next/link";

interface WebsiteCardProps {
  website: {
    id: string;
    url: string;
    title: string;
    favicon_url: string;
    description: string;
  };
}

export function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Link href={`/websites/${website.id}`} className="block p-4 bg-white border rounded-lg hover:bg-gray-50 transition">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 relative">
          {website.favicon_url && <Image src={website.favicon_url} alt={website.title} fill className="object-contain" />}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm mb-1 line-clamp-1">{website.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{website.description}</p>
        </div>
      </div>
    </Link>
  );
}
