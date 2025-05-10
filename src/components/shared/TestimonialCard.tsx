
import type { Testimonial } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, QuoteIcon } from "lucide-react";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="group shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-card h-full rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 min-h-[18rem]">
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
      <CardFooter className="px-6 pb-6 pt-3 border-t bg-muted/20">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${index < testimonial.rating ? 'fill-primary text-primary' : 'fill-muted text-muted-foreground'}`}
            />
          ))}
          <span className="ml-1.5 text-xs text-muted-foreground">({testimonial.rating}.0)</span>
        </div>
      </CardFooter>
    </Card>
  );
}
