
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface BreadcrumbHeaderProps {
  segments: BreadcrumbSegment[];
  className?: string;
}

export function BreadcrumbHeader({ segments, className }: BreadcrumbHeaderProps) {
  return (
    <nav aria-label="breadcrumb" className={cn("mb-6", className)}>
      <ol className="flex items-center space-x-1.5">
        {segments.map((segment, index) => {
          const isLastSegment = index === segments.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-1.5 text-muted-foreground/70 shrink-0" />
              )}
              {segment.href && !isLastSegment ? (
                <Link
                  href={segment.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {segment.label}
                </Link>
              ) : isLastSegment ? (
                <span className="text-xl font-semibold text-foreground">{segment.label}</span>
              ) : (
                // For intermediate segments that are not links (though less common for breadcrumbs)
                <span className="text-sm text-muted-foreground">{segment.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
