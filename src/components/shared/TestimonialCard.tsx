
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
    <Card className="group bg-card border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[18rem]">
      <CardHeader className="pt-6 pb-3 px-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 border-2 border-primary/40 group-hover:border-primary transition-all duration-300">
            <AvatarImage src={`https://picsum.photos/seed/${testimonial.avatarSeed}/128`} alt={testimonial.name} />
            <AvatarFallback className="text-lg bg-primary/20 text-primary">
              {testimonial.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-md font-semibold">{testimonial.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-4 flex-grow">
        <QuoteIcon className="w-8 h-8 text-primary/30 mb-2 transform -scale-x-100" />
        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
          {testimonial.text}
        </p>
      </CardContent>
      {/* Footer removed as per user request */}
    </Card>
  );
}


    