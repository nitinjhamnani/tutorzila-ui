
"use client";

import type { Testimonial } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon, QuoteIcon, CalendarDays } from "lucide-react"; 
import { format } from 'date-fns'; 
import { useState, useEffect } from "react";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Component has mounted on the client
    // Ensure date formatting happens only on the client side after hydration
    const testimonialDate = new Date(testimonial.date);
    setFormattedDate(format(testimonialDate, "MMM d, yyyy"));
  }, [testimonial.date]);

  return (
    <Card className="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full min-h-[18rem] p-1 transform hover:-translate-y-1">
      <CardHeader className="pt-6 pb-4 px-6">
        <div className="flex items-center gap-4">
          <div>
            <CardTitle className="text-md font-semibold text-foreground">{testimonial.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {testimonial.role} &bull; {hasMounted && formattedDate ? formattedDate : "Loading date..."}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex-grow relative">
        <QuoteIcon className="absolute top-0 left-2 w-10 h-10 text-primary/20 transform -translate-y-2 -translate-x-2 -scale-x-100 opacity-70 group-hover:opacity-100 transition-opacity" />
        <p className="text-[15px] text-foreground/80 leading-relaxed line-clamp-5 relative z-10 pt-2">
          {testimonial.text}
        </p>
      </CardContent>
    </Card>
  );
}
