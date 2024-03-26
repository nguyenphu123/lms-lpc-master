import { Program, Course } from "@prisma/client";
import { BookOpenText } from "lucide-react";
import { CourseCard } from "@/components/course-card";

type CourseWithProgressWithCategory = Course & {
  programs: Program | null;
  Module: { id: string }[];
  progress: string | null;
  BookMark: { length: number; id: string };
};

interface CoursesListProps {
  items: CourseWithProgressWithCategory[];
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div>
      <h2 className="font-semibold text-2xl text-blue-700 mb-4 flex items-center">
        <BookOpenText className="mr-2" />
        All courses
      </h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <CourseCard
            key={item.id}
            id={item.id}
            title={item.title}
            imageUrl={item.imageUrl!}
            chapters={item?.Module}
            chaptersLength={item.Module.length}
            bookmark={item.BookMark}
            // price={item.price!}
            progress={item.progress}
            // category={item?.category?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
};
