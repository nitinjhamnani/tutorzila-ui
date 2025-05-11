
import type { Testimonial } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, QuoteIcon, CalendarDays } from "lucide-react"; 
import { format } from 'date-fns'; 

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const testimonialDate = new Date(testimonial.date);
  return (
    <Card className="group bg-card border border-border/50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full min-h-[18rem] p-1 transform hover:-translate-y-1">
      <CardHeader className="pt-6 pb-4 px-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 border-2 border-primary/40 group-hover:border-primary transition-all duration-300 shadow-sm">
            <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/128`} alt={testimonial.name} />
            <AvatarFallback className="text-lg bg-primary/20 text-primary font-semibold">
              {testimonial.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-md font-semibold text-foreground">{testimonial.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">{testimonial.role} &bull; {format(testimonialDate, "MMM d, yyyy")}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 flex-grow relative">
        <QuoteIcon className="absolute top-0 left-2 w-10 h-10 text-primary/20 transform -translate-y-2 -translate-x-2 -scale-x-100 opacity-70 group-hover:opacity-100 transition-opacity" />
        <p className="text-[15px] text-foreground/80 leading-relaxed line-clamp-5 relative z-10 pt-2">
          {testimonial.text}
        </p>
      </CardContent>
      {/* Footer removed as per user request, date moved to header */}
    </Card>
  );
}
