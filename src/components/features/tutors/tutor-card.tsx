
import Image from 'next/image';
import Link from 'next/link';
import type { TutorProfile } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/shared/star-rating';
import { DollarSign, ArrowRight } from 'lucide-react';

interface TutorCardProps {
  tutor: TutorProfile;
}

export default function TutorCard({ tutor }: TutorCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={tutor.avatar || "https://placehold.co/300x200.png"}
            alt={tutor.name}
            data-ai-hint="person portrait"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-grow">
        <CardTitle className="text-xl mb-1">{tutor.name}</CardTitle>
        <div className="flex items-center mb-2">
          <StarRating rating={tutor.rating || 0} size={18} />
          <span className="ml-2 text-sm text-muted-foreground">({(tutor.rating || 0).toFixed(1)})</span>
        </div>
        <CardDescription className="text-sm text-muted-foreground mb-3 h-10 overflow-hidden">
          {tutor.bio?.substring(0, 70)}...
        </CardDescription>
        <div className="mb-3">
          {tutor.subjects.slice(0, 2).map((expert) => (
            <Badge key={expert} variant="secondary" className="mr-1 mb-1">{expert}</Badge>
          ))}
          {tutor.subjects.length > 2 && <Badge variant="outline">+{tutor.subjects.length - 2} more</Badge>}
        </div>
        
      </CardContent>
      <CardFooter className="p-6 border-t flex justify-between items-center">
        {tutor.hourlyRate && (
          <div className="flex items-center text-lg font-semibold text-primary">
            <DollarSign className="h-5 w-5 mr-1" />
            {tutor.hourlyRate}
            <span className="text-sm text-muted-foreground ml-1">/hr</span>
          </div>
        )}
        <Link href={`/tutors/${tutor.id}`} passHref>
          <Button variant="outline" size="sm">
            View Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
