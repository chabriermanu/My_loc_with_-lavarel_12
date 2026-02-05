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

    // 🔥 Quand l’API Embla est prête, on écoute les changements de slide
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
        <div className="relative">
            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {medias.map((media, i) => (
                        <CarouselItem key={i}>
                            <div className="relative aspect-square w-full overflow-hidden rounded-md bg-black">
                                {media.type === 'image' ? (
                                    <img
                                        src={media.src}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <video
                                        src={media.src}
                                        controls
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {medias.length > 1 && (
                    <>
                        <CarouselPrevious />
                        <CarouselNext />
                    </>
                )}
            </Carousel>

            {/* Dots */}
            {medias.length > 1 && (
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-2">
                    {medias.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition ${
                                i === index ? 'bg-blue-700' : 'bg-red-600'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
