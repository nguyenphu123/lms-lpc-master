"use client";
import * as React from "react";
import { Slide } from "@/components/slide";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

// type CourseWithProgressWithCategory = Course & {
//   programs: Program | null;
//   Module: { id: string }[];
//   progress: string | null;
//   BookMark: { length: number; id: string };
// };

interface SlideProgramProps {
  items: any[];
}

export const SlideProgram = ({ items }: SlideProgramProps) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);
  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.program ? item.program.id : null}>
              <Slide
                key={item.id}
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl!}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        {current}/{count}
      </div>
    </div>
  );
};
