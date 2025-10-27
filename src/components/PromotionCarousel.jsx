
import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import PromotionCard from './PromotionCard.jsx';

const PromotionsCarousel = ({ promotions }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="mb-6">
      <div className="overflow-hidden p-4" ref={emblaRef}>
        <div className="flex -ml-4">
          {promotions.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} />
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === selectedIndex ? 'bg-secondary' : 'bg-secondary/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionsCarousel;