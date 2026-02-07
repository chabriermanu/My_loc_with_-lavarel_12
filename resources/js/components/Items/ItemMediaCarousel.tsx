import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from '@/components/ui/carousel';
import { useEffect, useState } from 'react';

export interface Media {
    type: 'image' | 'video';
    src: string;
}

export default function ItemMediaCarousel({ medias }: { medias: Media[] }) {
    const [api, setApi] = useState<CarouselApi>();
    const [index, setIndex] = useState(0);

    // 🔥 Quand l'API Embla est prête, on écoute les changements de slide
    useEffect(() => {
        if (!api) return;

        const updateIndex = () => {
            setIndex(api.selectedScrollSnap());
        };

        updateIndex(); // init
        api.on('select', updateIndex);

        return () => {
            api.off('select', updateIndex);
        };
    }, [api]);

    return (
        <div className="relative w-full">
            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {medias.map((media, i) => (
                        <CarouselItem key={i}>
                            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                {media.type === 'image' ? (
                                    <img
                                        src={media.src}
                                        alt={`Media ${i + 1}`}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <video
                                        src={media.src}
                                        controls
                                        className="h-full w-full object-contain"
                                    />
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {medias.length > 1 && (
                    <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                    </>
                )}
            </Carousel>

            {/* Dots */}
            {medias.length > 1 && (
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
                    {medias.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                i === index ? 'w-4 bg-blue-600' : 'bg-gray-400'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
