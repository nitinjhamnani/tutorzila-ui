import { Star, StarHalf, StarOff } from 'lucide-react';

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
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  if (rating < 0 || rating > totalStars) {
    return (
      <div className={`flex items-center ${className}`}>
        <StarOff size={size} className="text-muted-foreground" />
        <span className="ml-1 text-xs text-muted-foreground">No rating</span>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} fill="currentColor" size={size} className="text-yellow-400" />
      ))}
      {hasHalfStar && <StarHalf key="half" fill="currentColor" size={size} className="text-yellow-400" />}
      {[...Array(emptyStars < 0 ? 0 : emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-yellow-400 opacity-50" />
      ))}
    </div>
  );
}
