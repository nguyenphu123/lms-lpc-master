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
import { auth } from "@clerk/nextjs";

type CourseWithProgressWithCategory = Course & {
  programs: Program | null;
  Module: { id: string }[];
  progress: string;
  BookMark: { length: number; id: string };
};

interface BookmarkProps {
  items: any[];
}

export const Bookmark = ({ items }: BookmarkProps) => {
  const { userId }: any = auth();
  
  return items.length === 0 ? (
    <>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <BookmarkPlus className="mr-2" />
        Bookmark
      </h2>
      <p className="mb-4 italic">No bookmark</p>
    </>
  ) : (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <BookmarkPlus className="mr-2" />
        Bookmark
      </h2>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {items.map((item) => {
            const modules = item?.Module || [];  // Default to an empty array if Module is undefined
            return (
              <CarouselItem key={item.id} className="md:basis-1/3 lg:basis-1/4">
                <CourseCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  imageUrl={
                    item.ClassSessionRecord.map(
                      (record: { userId: any }) => record.userId
                    ).indexOf(userId) === -1
                      ? "/istockphoto-936681148-612x612.jpg"
                      : item.imageUrl!
                  }
                  isLocked={
                    item.ClassSessionRecord.map(
                      (record: { userId: any }) => record.userId
                    ).indexOf(userId) === -1
                  }
                  chaptersLength={modules.length}  // Safely access length
                  chapters={modules}
                  bookmark={item?.BookMark}
                  progress={item?.progress}
                  description={item?.description}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
