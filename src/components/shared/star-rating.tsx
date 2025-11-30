
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
}

export default function StarRating({
  rating,
  totalStars = 5,
  size = 16,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              'transition-colors',
              starValue <= rating ? 'text-yellow-400' : 'text-gray-300'
            )}
            fill={starValue <= rating ? 'currentColor' : 'none'}
          />
        );
      })}
    </div>
  );
}
