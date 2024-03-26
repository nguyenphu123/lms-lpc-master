import { Program, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { CheckCircle, Focus } from "lucide-react";
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
  progress: string | null;
  course: any;
  BookMark: { length: number; id: string };
};

interface CompletedCourseProps {
  items: CourseWithProgressWithCategory[];
}

export const CompletedCourse = ({ items }: CompletedCourseProps) => {
  return items.length == 0 ? (
    <>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <Focus className="mr-2" />
        Completed Course
      </h2>
      <p className="text-center text-2xl ">No history</p>
    </>
  ) : (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <CheckCircle className="mr-2" />
        Completed Course
      </h2>
      <Carousel
        opts={{
          align: "start",
        }}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item?.course.id}
              className="md:basis-1/3 lg:basis-1/4"
            >
              <CourseCard
                key={item?.course.id}
                id={item?.course.id}
                title={item?.course.title}
                imageUrl={item?.course.imageUrl!}
                chaptersLength={item?.course.Module?.length}
                chapters={item?.course.Module}
                bookmark={item?.course.BookMark}
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
