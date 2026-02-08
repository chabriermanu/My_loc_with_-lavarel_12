// resources/js/components/Reviews/StarRating.tsx
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    showLabel?: boolean;
    className?: string;
}

export default function StarRating({
    rating,
    maxRating = 5,
    size = 'md',
    interactive = false,
    onRatingChange,
    showLabel = false,
    className,
}: StarRatingProps) {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    // ⭐ Validation du rating
    const validRating =
        typeof rating === 'number' && !isNaN(rating) ? rating : 0;

    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const handleClick = (index: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    const displayRating =
        interactive && hoveredRating !== null ? hoveredRating : validRating; // ⭐ Utilise validRating

    return (
        <div className={cn('flex items-center gap-1', className)}>
            <div
                className="flex gap-0.5"
                onMouseLeave={() => interactive && setHoveredRating(null)}
            >
                {Array.from({ length: maxRating }).map((_, index) => {
                    const isFilled = index < Math.floor(displayRating);
                    const isHalfFilled =
                        index < displayRating &&
                        index >= Math.floor(displayRating);

                    return (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleClick(index)}
                            onMouseEnter={() =>
                                interactive && setHoveredRating(index + 1)
                            }
                            disabled={!interactive}
                            className={cn(
                                'relative transition-all',
                                interactive && 'cursor-pointer hover:scale-110',
                                !interactive && 'cursor-default',
                            )}
                        >
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    interactive
                                        ? 'text-gray-300 hover:text-yellow-300'
                                        : 'text-gray-300',
                                )}
                            />

                            {(isFilled || isHalfFilled) && (
                                <Star
                                    className={cn(
                                        sizeClasses[size],
                                        'absolute top-0 left-0 fill-yellow-400 text-yellow-400',
                                    )}
                                    style={
                                        isHalfFilled
                                            ? {
                                                  clipPath: `polygon(0 0, ${
                                                      (displayRating % 1) * 100
                                                  }% 0, ${
                                                      (displayRating % 1) * 100
                                                  }% 100%, 0 100%)`,
                                              }
                                            : undefined
                                    }
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {showLabel && (
                <span className="ml-1 text-sm font-medium text-gray-700">
                    {validRating.toFixed(1)}/{maxRating}{' '}
                    {/* ⭐ Utilise validRating */}
                </span>
            )}
        </div>
    );
}
