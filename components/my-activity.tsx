import { Program, Course } from "@prisma/client";
import { CourseCard } from "@/components/course-card";
import { Clock3 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from "next/link";
type CourseWithProgressWithCategory = Course & {
  programs: Program | null;
  Module: { id: string }[];
  progress: string | null;
  course: any;
  BookMark: { length: number; id: string };
};

interface MyActivityProps {
  items: CourseWithProgressWithCategory[];
}

export const MyActivity = ({ items }: MyActivityProps) => {
  return items.length == 0 ? (
    <>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <Clock3 className="mr-2" />
        My Activity
      </h2>
      <p className="mb-4">
        Start studying now:
        <Link href="/search" className="text-blue-700 hover:underline">
          Browse courses
        </Link>
      </p>
    </>
  ) : (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <Clock3 className="mr-2" />
        My Activity
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
