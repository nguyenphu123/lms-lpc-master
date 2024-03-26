import { Program, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { BookmarkPlus } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CourseWithProgressWithCategory = Course & {
  programs: Program | null;
  Module: { id: string }[];
  progress: string;
  BookMark: { length: number; id: string };
};

interface BookmarkProps {
  items: CourseWithProgressWithCategory[];
}

export const Bookmark = ({ items }: BookmarkProps) => {
  return items.length == 0 ? (
    <>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <BookmarkPlus className="mr-2" />
        Bookmark
      </h2>
      <p className="mb-4">No bookmark</p>
    </>
  ) : (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <BookmarkPlus className="mr-2" />
        Bookmark
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/4">
              <CourseCard
                key={item.id}
                id={item.id}
                title={item.title}
                imageUrl={item.imageUrl!}
                chaptersLength={item?.Module.length}
                chapters={item?.Module}
                bookmark={item?.BookMark}
                progress={item?.progress}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
