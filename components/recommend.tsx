import { Program, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { Focus } from "lucide-react";

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
  progress: string | null;
  BookMark: { length: number; id: string };
};

interface RecommendProps {
  items: any[];
}

export const Recommend = ({ items }: RecommendProps) => {
  const { userId }: any = auth();

  return items.length == 0 ? (
    <>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <Focus className="mr-2" />
        Recommend Course
      </h2>
      <p className="mb-4 italic">No recommend course</p>
    </>
  ) : (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <Focus className="mr-2" />
        Recommend Course
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item.course.id}
              className="md:basis-1/3 lg:basis-1/4"
            >
              <CourseCard
                key={item.course.id}
                id={item.course.id}
                title={item.course.title}
                imageUrl={
                  item.course.ClassSessionRecord.map(
                    (item: { userId: any }) => item.userId
                  ).indexOf(userId) == -1
                    ? "/istockphoto-936681148-612x612.jpg"
                    : item.course.imageUrl!
                }
                isLocked={
                  item?.course.ClassSessionRecord.map(
                    (item: { userId: any }) => item.userId
                  ).indexOf(userId) == -1
                    ? true
                    : false
                }
                chaptersLength={item.course.Module.length}
                chapters={item?.course.Module}
                bookmark={item.course.BookMark}
                progress={item?.progress}
                description={item?.course.description}
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
